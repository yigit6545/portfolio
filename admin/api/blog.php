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

// Simple authentication check
function checkAuth() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
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
$blogFile = 'data/blog.json';

// Ensure data directory exists
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Initialize blog file if it doesn't exist
if (!file_exists($blogFile)) {
    $initialPosts = [
        [
            'id' => 1,
            'title' => 'React 18\'de Yeni Özellikler',
            'slug' => 'react-18-yeni-ozellikler',
            'excerpt' => 'React 18 ile gelen yeni özellikler ve geliştirmeler hakkında detaylı bilgi.',
            'content' => 'React 18, React ekosisteminde önemli bir güncelleme...',
            'category' => 'React',
            'tags' => ['React', 'JavaScript', 'Frontend'],
            'image' => '/images/blog/react-18.jpg',
            'status' => 'published',
            'featured' => true,
            'author' => 'Frontend Developer',
            'created_at' => '2024-01-20',
            'updated_at' => '2024-01-20',
            'published_at' => '2024-01-20',
            'views' => 156,
            'likes' => 23
        ],
        [
            'id' => 2,
            'title' => 'Vue 3 Composition API',
            'slug' => 'vue-3-composition-api',
            'excerpt' => 'Vue 3\'ün Composition API\'si ile daha esnek ve yeniden kullanılabilir kod yazma.',
            'content' => 'Vue 3 ile gelen Composition API, Vue.js geliştirme deneyimini...',
            'category' => 'Vue.js',
            'tags' => ['Vue.js', 'JavaScript', 'Frontend'],
            'image' => '/images/blog/vue-3.jpg',
            'status' => 'draft',
            'featured' => false,
            'author' => 'Frontend Developer',
            'created_at' => '2024-01-18',
            'updated_at' => '2024-01-18',
            'published_at' => null,
            'views' => 0,
            'likes' => 0
        ],
        [
            'id' => 3,
            'title' => 'ES2024\'te Gelen Yeni Özellikler',
            'slug' => 'es2024-yeni-ozellikler',
            'excerpt' => 'JavaScript\'in yeni versiyonu ES2024 ile gelen özellikler ve kullanım alanları.',
            'content' => 'ES2024, JavaScript diline yeni özellikler ve iyileştirmeler getiriyor...',
            'category' => 'JavaScript',
            'tags' => ['JavaScript', 'ES2024', 'Web Development'],
            'image' => '/images/blog/es2024.jpg',
            'status' => 'published',
            'featured' => false,
            'author' => 'Frontend Developer',
            'created_at' => '2024-01-15',
            'updated_at' => '2024-01-15',
            'published_at' => '2024-01-15',
            'views' => 89,
            'likes' => 12
        ]
    ];
    file_put_contents($blogFile, json_encode($initialPosts, JSON_PRETTY_PRINT));
}

// Get blog posts
function getBlogPosts() {
    global $blogFile;
    $posts = json_decode(file_get_contents($blogFile), true);
    return $posts ?: [];
}

// Save blog posts
function saveBlogPosts($posts) {
    global $blogFile;
    return file_put_contents($blogFile, json_encode($posts, JSON_PRETTY_PRINT));
}

// Generate slug from title
function generateSlug($title) {
    $slug = strtolower($title);
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');
    return $slug;
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $posts = getBlogPosts();
        echo json_encode(['success' => true, 'data' => $posts]);
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['title', 'content', 'category'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field '$field' is required"]);
                exit();
            }
        }
        
        $posts = getBlogPosts();
        $slug = $input['slug'] ?? generateSlug($input['title']);
        
        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (in_array($slug, array_column($posts, 'slug'))) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        $newPost = [
            'id' => max(array_column($posts, 'id')) + 1,
            'title' => htmlspecialchars($input['title']),
            'slug' => $slug,
            'excerpt' => htmlspecialchars($input['excerpt'] ?? ''),
            'content' => $input['content'], // Allow HTML for rich content
            'category' => htmlspecialchars($input['category']),
            'tags' => $input['tags'] ?? [],
            'image' => $input['image'] ?? '',
            'status' => $input['status'] ?? 'draft',
            'featured' => $input['featured'] ?? false,
            'author' => $input['author'] ?? 'Frontend Developer',
            'created_at' => date('Y-m-d'),
            'updated_at' => date('Y-m-d'),
            'published_at' => $input['status'] === 'published' ? date('Y-m-d') : null,
            'views' => 0,
            'likes' => 0
        ];
        
        $posts[] = $newPost;
        
        if (saveBlogPosts($posts)) {
            echo json_encode(['success' => true, 'data' => $newPost]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save blog post']);
        }
        break;
        
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
            exit();
        }
        
        $posts = getBlogPosts();
        $postIndex = array_search($id, array_column($posts, 'id'));
        
        if ($postIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            exit();
        }
        
        // Update post
        $updatedPost = $posts[$postIndex];
        $updatedPost['title'] = htmlspecialchars($input['title'] ?? $updatedPost['title']);
        $updatedPost['excerpt'] = htmlspecialchars($input['excerpt'] ?? $updatedPost['excerpt']);
        $updatedPost['content'] = $input['content'] ?? $updatedPost['content'];
        $updatedPost['category'] = htmlspecialchars($input['category'] ?? $updatedPost['category']);
        $updatedPost['tags'] = $input['tags'] ?? $updatedPost['tags'];
        $updatedPost['image'] = $input['image'] ?? $updatedPost['image'];
        $updatedPost['status'] = $input['status'] ?? $updatedPost['status'];
        $updatedPost['featured'] = $input['featured'] ?? $updatedPost['featured'];
        $updatedPost['updated_at'] = date('Y-m-d');
        
        // Update published_at if status changed to published
        if ($input['status'] === 'published' && $updatedPost['published_at'] === null) {
            $updatedPost['published_at'] = date('Y-m-d');
        }
        
        $posts[$postIndex] = $updatedPost;
        
        if (saveBlogPosts($posts)) {
            echo json_encode(['success' => true, 'data' => $updatedPost]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update blog post']);
        }
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
            exit();
        }
        
        $posts = getBlogPosts();
        $postIndex = array_search($id, array_column($posts, 'id'));
        
        if ($postIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            exit();
        }
        
        // Remove post
        array_splice($posts, $postIndex, 1);
        
        if (saveBlogPosts($posts)) {
            echo json_encode(['success' => true, 'message' => 'Blog post deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete blog post']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>

