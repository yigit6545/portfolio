<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Configuration
$config = [
    'email' => [
        'to' => 'developer@example.com',
        'from' => 'noreply@devportfolio.com',
        'subject_prefix' => '[Portfolio Contact]'
    ],
    'upload' => [
        'max_size' => 10 * 1024 * 1024, // 10MB
        'allowed_types' => ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'zip'],
        'upload_dir' => 'uploads/'
    ],
    'rate_limit' => [
        'max_requests' => 5,
        'time_window' => 3600 // 1 hour
    ]
];

// Rate limiting
function checkRateLimit($ip) {
    global $config;
    $file = 'rate_limit.json';
    
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    
    $data = json_decode(file_get_contents($file), true);
    $now = time();
    
    // Clean old entries
    $data = array_filter($data, function($timestamp) use ($now) {
        return ($now - $timestamp) < $config['rate_limit']['time_window'];
    });
    
    // Check if IP has exceeded limit
    $ip_requests = array_filter($data, function($timestamp, $key) use ($ip) {
        return $key === $ip;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ip_requests) >= $config['rate_limit']['max_requests']) {
        return false;
    }
    
    // Add current request
    $data[$ip] = $now;
    file_put_contents($file, json_encode($data));
    
    return true;
}

// Input validation
function validateInput($data) {
    $errors = [];
    
    // Required fields
    $required = ['name', 'email', 'project_type', 'message'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            $errors[] = ucfirst($field) . ' is required';
        }
    }
    
    // Email validation
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    // Phone validation (if provided)
    if (!empty($data['phone']) && !preg_match('/^[\+]?[0-9\s\-\(\)]{10,}$/', $data['phone'])) {
        $errors[] = 'Invalid phone number format';
    }
    
    // Message length
    if (!empty($data['message']) && strlen($data['message']) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    // Project type validation
    $valid_types = ['website', 'ecommerce', 'webapp', 'mobile', 'dashboard', 'other'];
    if (!empty($data['project_type']) && !in_array($data['project_type'], $valid_types)) {
        $errors[] = 'Invalid project type';
    }
    
    return $errors;
}

// File upload handling
function handleFileUploads($files) {
    global $config;
    
    $uploaded_files = [];
    $errors = [];
    
    if (!is_dir($config['upload']['upload_dir'])) {
        mkdir($config['upload']['upload_dir'], 0755, true);
    }
    
    foreach ($files['files']['name'] as $key => $filename) {
        if ($files['files']['error'][$key] === UPLOAD_ERR_OK) {
            $file_size = $files['files']['size'][$key];
            $file_type = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            
            // Check file size
            if ($file_size > $config['upload']['max_size']) {
                $errors[] = "File {$filename} is too large (max 10MB)";
                continue;
            }
            
            // Check file type
            if (!in_array($file_type, $config['upload']['allowed_types'])) {
                $errors[] = "File {$filename} has invalid type";
                continue;
            }
            
            // Generate unique filename
            $new_filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
            $upload_path = $config['upload']['upload_dir'] . $new_filename;
            
            if (move_uploaded_file($files['files']['tmp_name'][$key], $upload_path)) {
                $uploaded_files[] = [
                    'original_name' => $filename,
                    'saved_name' => $new_filename,
                    'path' => $upload_path,
                    'size' => $file_size,
                    'type' => $file_type
                ];
            } else {
                $errors[] = "Failed to upload {$filename}";
            }
        }
    }
    
    return ['files' => $uploaded_files, 'errors' => $errors];
}

// Generate email content
function generateEmailContent($data, $uploaded_files) {
    $content = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2563eb; }
            .value { margin-left: 10px; }
            .files { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>Yeni Proje Teklifi</h2>
            <p>Portfolio Contact Form</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <span class='label'>Ad Soyad:</span>
                <span class='value'>{$data['name']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>{$data['email']}</span>
            </div>
            
            <div class='field'>
                <span class='label'>Telefon:</span>
                <span class='value'>" . ($data['phone'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Şirket:</span>
                <span class='value'>" . ($data['company'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Proje Türü:</span>
                <span class='value'>" . ucfirst($data['project_type']) . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Bütçe:</span>
                <span class='value'>" . ($data['budget'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Zaman Çizelgesi:</span>
                <span class='value'>" . ($data['timeline'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Teknolojiler:</span>
                <span class='value'>" . ($data['technologies'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>İletişim Tercihi:</span>
                <span class='value'>" . ($data['preferred_contact'] ?? 'Email') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>En İyi Saat:</span>
                <span class='value'>" . ($data['best_time'] ?? 'Belirtilmemiş') . "</span>
            </div>
            
            <div class='field'>
                <span class='label'>Proje Detayları:</span>
                <div class='value' style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;'>
                    " . nl2br(htmlspecialchars($data['message'])) . "
                </div>
            </div>
            
            <div class='field'>
                <span class='label'>Bülten Aboneliği:</span>
                <span class='value'>" . (isset($data['newsletter']) && $data['newsletter'] ? 'Evet' : 'Hayır') . "</span>
            </div>
            
            " . (!empty($uploaded_files) ? "
            <div class='files'>
                <h3>Yüklenen Dosyalar:</h3>
                <ul>
                    " . implode('', array_map(function($file) {
                        return "<li>{$file['original_name']} ({$file['type']}, " . number_format($file['size'] / 1024, 2) . " KB)</li>";
                    }, $uploaded_files)) . "
                </ul>
            </div>
            " : "") . "
        </div>
        
        <div class='footer'>
            <p>Bu mesaj portfolio contact form'undan gönderilmiştir.</p>
            <p>Gönderim Zamanı: " . date('Y-m-d H:i:s') . "</p>
            <p>IP Adresi: " . $_SERVER['REMOTE_ADDR'] . "</p>
        </div>
    </body>
    </html>
    ";
    
    return $content;
}

// Send email
function sendEmail($to, $subject, $content, $uploaded_files = []) {
    global $config;
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $config['email']['from'],
        'Reply-To: ' . $config['email']['from'],
        'X-Mailer: PHP/' . phpversion()
    ];
    
    // Add attachments if any
    if (!empty($uploaded_files)) {
        $boundary = md5(uniqid(time()));
        $headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";
        
        $body = "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $content . "\r\n\r\n";
        
        foreach ($uploaded_files as $file) {
            if (file_exists($file['path'])) {
                $file_content = file_get_contents($file['path']);
                $file_content = chunk_split(base64_encode($file_content));
                
                $body .= "--{$boundary}\r\n";
                $body .= "Content-Type: application/octet-stream; name=\"{$file['original_name']}\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"{$file['original_name']}\"\r\n\r\n";
                $body .= $file_content . "\r\n\r\n";
            }
        }
        
        $body .= "--{$boundary}--";
    } else {
        $body = $content;
    }
    
    return mail($to, $subject, $body, implode("\r\n", $headers));
}

// Log submission
function logSubmission($data, $success, $errors = []) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'success' => $success,
        'errors' => $errors,
        'data' => $data
    ];
    
    $log_file = 'contact_log.json';
    $logs = [];
    
    if (file_exists($log_file)) {
        $logs = json_decode(file_get_contents($log_file), true) ?: [];
    }
    
    $logs[] = $log_entry;
    
    // Keep only last 100 entries
    if (count($logs) > 100) {
        $logs = array_slice($logs, -100);
    }
    
    file_put_contents($log_file, json_encode($logs, JSON_PRETTY_PRINT));
}

// Main execution
try {
    // Check rate limit
    $client_ip = $_SERVER['REMOTE_ADDR'];
    if (!checkRateLimit($client_ip)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please try again later.']);
        exit();
    }
    
    // Get form data
    $form_data = $_POST;
    
    // Handle file uploads
    $upload_result = ['files' => [], 'errors' => []];
    if (!empty($_FILES['files'])) {
        $upload_result = handleFileUploads($_FILES);
    }
    
    // Validate input
    $validation_errors = validateInput($form_data);
    $all_errors = array_merge($validation_errors, $upload_result['errors']);
    
    if (!empty($all_errors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation failed', 'details' => $all_errors]);
        logSubmission($form_data, false, $all_errors);
        exit();
    }
    
    // Generate email content
    $email_content = generateEmailContent($form_data, $upload_result['files']);
    $email_subject = $config['email']['subject_prefix'] . ' ' . $form_data['project_type'] . ' - ' . $form_data['name'];
    
    // Send email
    $email_sent = sendEmail($config['email']['to'], $email_subject, $email_content, $upload_result['files']);
    
    if ($email_sent) {
        // Send auto-reply to client
        $auto_reply_content = "
        <html>
        <body>
            <h2>Mesajınız Alındı!</h2>
            <p>Merhaba {$form_data['name']},</p>
            <p>Proje teklifiniz başarıyla alındı. En kısa sürede size dönüş yapacağım.</p>
            <p>Proje detaylarınız:</p>
            <ul>
                <li><strong>Proje Türü:</strong> " . ucfirst($form_data['project_type']) . "</li>
                <li><strong>Bütçe:</strong> " . ($form_data['budget'] ?? 'Belirtilmemiş') . "</li>
                <li><strong>Zaman Çizelgesi:</strong> " . ($form_data['timeline'] ?? 'Belirtilmemiş') . "</li>
            </ul>
            <p>Teşekkürler!</p>
            <hr>
            <p><small>Bu otomatik bir yanıttır. Lütfen bu emaili yanıtlamayın.</small></p>
        </body>
        </html>
        ";
        
        $auto_reply_subject = 'Proje Teklifiniz Alındı - ' . $form_data['project_type'];
        sendEmail($form_data['email'], $auto_reply_subject, $auto_reply_content);
        
        // Log successful submission
        logSubmission($form_data, true);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'Mesajınız başarıyla gönderildi!',
            'submission_id' => uniqid()
        ]);
        
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
    logSubmission($_POST ?? [], false, [$e->getMessage()]);
}
?>
