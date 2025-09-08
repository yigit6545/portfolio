<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// CORS preflight request handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple authentication check (in real app, use proper JWT or session)
function checkAuth() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    // Simple token check (replace with proper authentication)
    if ($token !== 'Bearer admin-token-123') {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}

// Check authentication for non-GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    checkAuth();
}

// Database connection (in real app, use proper database)
$projectsFile = 'data/projects.json';

// Ensure data directory exists
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Initialize projects file if it doesn't exist
if (!file_exists($projectsFile)) {
    $initialProjects = [
        [
            'id' => 1,
            'title' => 'E-ticaret Platformu',
            'description' => 'Modern React ile geliştirilmiş e-ticaret platformu',
            'category' => 'React',
            'technologies' => ['React', 'Node.js', 'MongoDB'],
            'image' => '/images/project1.jpg',
            'demo_url' => 'https://demo.example.com',
            'github_url' => 'https://github.com/example/project1',
            'status' => 'active',
            'featured' => true,
            'created_at' => '2024-01-15',
            'updated_at' => '2024-01-15'
        ],
        [
            'id' => 2,
            'title' => 'Dashboard Uygulaması',
            'description' => 'Vue.js ile geliştirilmiş admin dashboard',
            'category' => 'Vue.js',
            'technologies' => ['Vue.js', 'Express', 'PostgreSQL'],
            'image' => '/images/project2.jpg',
            'demo_url' => 'https://dashboard.example.com',
            'github_url' => 'https://github.com/example/project2',
            'status' => 'development',
            'featured' => false,
            'created_at' => '2024-01-10',
            'updated_at' => '2024-01-10'
        ]
    ];
    file_put_contents($projectsFile, json_encode($initialProjects, JSON_PRETTY_PRINT));
}

// Get projects
function getProjects() {
    global $projectsFile;
    $projects = json_decode(file_get_contents($projectsFile), true);
    return $projects ?: [];
}

// Save projects
function saveProjects($projects) {
    global $projectsFile;
    return file_put_contents($projectsFile, json_encode($projects, JSON_PRETTY_PRINT));
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $projects = getProjects();
        echo json_encode(['success' => true, 'data' => $projects]);
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['title', 'description', 'category'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field '$field' is required"]);
                exit();
            }
        }
        
        $projects = getProjects();
        $newProject = [
            'id' => max(array_column($projects, 'id')) + 1,
            'title' => htmlspecialchars($input['title']),
            'description' => htmlspecialchars($input['description']),
            'category' => htmlspecialchars($input['category']),
            'technologies' => $input['technologies'] ?? [],
            'image' => $input['image'] ?? '',
            'demo_url' => $input['demo_url'] ?? '',
            'github_url' => $input['github_url'] ?? '',
            'status' => $input['status'] ?? 'development',
            'featured' => $input['featured'] ?? false,
            'created_at' => date('Y-m-d'),
            'updated_at' => date('Y-m-d')
        ];
        
        $projects[] = $newProject;
        
        if (saveProjects($projects)) {
            echo json_encode(['success' => true, 'data' => $newProject]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save project']);
        }
        break;
        
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit();
        }
        
        $projects = getProjects();
        $projectIndex = array_search($id, array_column($projects, 'id'));
        
        if ($projectIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
            exit();
        }
        
        // Update project
        $projects[$projectIndex] = array_merge($projects[$projectIndex], [
            'title' => htmlspecialchars($input['title'] ?? $projects[$projectIndex]['title']),
            'description' => htmlspecialchars($input['description'] ?? $projects[$projectIndex]['description']),
            'category' => htmlspecialchars($input['category'] ?? $projects[$projectIndex]['category']),
            'technologies' => $input['technologies'] ?? $projects[$projectIndex]['technologies'],
            'image' => $input['image'] ?? $projects[$projectIndex]['image'],
            'demo_url' => $input['demo_url'] ?? $projects[$projectIndex]['demo_url'],
            'github_url' => $input['github_url'] ?? $projects[$projectIndex]['github_url'],
            'status' => $input['status'] ?? $projects[$projectIndex]['status'],
            'featured' => $input['featured'] ?? $projects[$projectIndex]['featured'],
            'updated_at' => date('Y-m-d')
        ]);
        
        if (saveProjects($projects)) {
            echo json_encode(['success' => true, 'data' => $projects[$projectIndex]]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update project']);
        }
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit();
        }
        
        $projects = getProjects();
        $projectIndex = array_search($id, array_column($projects, 'id'));
        
        if ($projectIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
            exit();
        }
        
        // Remove project
        array_splice($projects, $projectIndex, 1);
        
        if (saveProjects($projects)) {
            echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete project']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>

