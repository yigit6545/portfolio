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

// Check authentication for all requests
checkAuth();

// Database connection (in real app, use proper database)
$messagesFile = 'data/messages.json';

// Ensure data directory exists
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Initialize messages file if it doesn't exist
if (!file_exists($messagesFile)) {
    $initialMessages = [
        [
            'id' => 1,
            'name' => 'Ahmet Yılmaz',
            'email' => 'ahmet@example.com',
            'phone' => '+90 555 123 45 67',
            'company' => 'ABC Teknoloji',
            'subject' => 'Web Sitesi Projesi',
            'message' => 'Merhaba, şirketimiz için modern bir web sitesi geliştirmek istiyoruz. React kullanarak responsive bir site yapabilir misiniz?',
            'budget' => '10,000 - 25,000 TL',
            'timeline' => '2-3 ay',
            'status' => 'unread',
            'newsletter' => true,
            'ip_address' => '192.168.1.100',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'created_at' => '2024-01-22 14:30:00',
            'updated_at' => '2024-01-22 14:30:00',
            'read_at' => null,
            'replied_at' => null
        ],
        [
            'id' => 2,
            'name' => 'Mehmet Kaya',
            'email' => 'mehmet@example.com',
            'phone' => '+90 555 987 65 43',
            'company' => 'XYZ E-ticaret',
            'subject' => 'E-ticaret Sitesi',
            'message' => 'E-ticaret platformumuz için Vue.js kullanarak modern bir alışveriş sitesi geliştirmek istiyoruz. Ödeme entegrasyonu da dahil olmak üzere.',
            'budget' => '25,000 - 50,000 TL',
            'timeline' => '3-4 ay',
            'status' => 'read',
            'newsletter' => false,
            'ip_address' => '192.168.1.101',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'created_at' => '2024-01-21 09:15:00',
            'updated_at' => '2024-01-21 09:15:00',
            'read_at' => '2024-01-21 10:30:00',
            'replied_at' => null
        ],
        [
            'id' => 3,
            'name' => 'Ayşe Demir',
            'email' => 'ayse@example.com',
            'phone' => '+90 555 456 78 90',
            'company' => 'DEF Ajans',
            'subject' => 'Portfolio Website',
            'message' => 'Ajansımız için portfolyo web sitesi geliştirmek istiyoruz. Modern tasarım ve animasyonlar ile dikkat çekici bir site.',
            'budget' => '5,000 - 10,000 TL',
            'timeline' => '1-2 ay',
            'status' => 'replied',
            'newsletter' => true,
            'ip_address' => '192.168.1.102',
            'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            'created_at' => '2024-01-20 16:45:00',
            'updated_at' => '2024-01-20 16:45:00',
            'read_at' => '2024-01-20 17:00:00',
            'replied_at' => '2024-01-20 18:30:00'
        ]
    ];
    file_put_contents($messagesFile, json_encode($initialMessages, JSON_PRETTY_PRINT));
}

// Get messages
function getMessages() {
    global $messagesFile;
    $messages = json_decode(file_get_contents($messagesFile), true);
    return $messages ?: [];
}

// Save messages
function saveMessages($messages) {
    global $messagesFile;
    return file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));
}

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $messages = getMessages();
        
        // Sort by created_at descending (newest first)
        usort($messages, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });
        
        echo json_encode(['success' => true, 'data' => $messages]);
        break;
        
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $action = $input['action'] ?? null;
        
        if (!$id || !$action) {
            http_response_code(400);
            echo json_encode(['error' => 'Message ID and action are required']);
            exit();
        }
        
        $messages = getMessages();
        $messageIndex = array_search($id, array_column($messages, 'id'));
        
        if ($messageIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Message not found']);
            exit();
        }
        
        // Update message based on action
        switch ($action) {
            case 'mark_read':
                $messages[$messageIndex]['status'] = 'read';
                $messages[$messageIndex]['read_at'] = date('Y-m-d H:i:s');
                $messages[$messageIndex]['updated_at'] = date('Y-m-d H:i:s');
                break;
                
            case 'mark_replied':
                $messages[$messageIndex]['status'] = 'replied';
                $messages[$messageIndex]['replied_at'] = date('Y-m-d H:i:s');
                $messages[$messageIndex]['updated_at'] = date('Y-m-d H:i:s');
                break;
                
            case 'mark_unread':
                $messages[$messageIndex]['status'] = 'unread';
                $messages[$messageIndex]['read_at'] = null;
                $messages[$messageIndex]['updated_at'] = date('Y-m-d H:i:s');
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                exit();
        }
        
        if (saveMessages($messages)) {
            echo json_encode(['success' => true, 'data' => $messages[$messageIndex]]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update message']);
        }
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Message ID is required']);
            exit();
        }
        
        $messages = getMessages();
        $messageIndex = array_search($id, array_column($messages, 'id'));
        
        if ($messageIndex === false) {
            http_response_code(404);
            echo json_encode(['error' => 'Message not found']);
            exit();
        }
        
        // Remove message
        array_splice($messages, $messageIndex, 1);
        
        if (saveMessages($messages)) {
            echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete message']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>

