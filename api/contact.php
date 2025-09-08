<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// CORS preflight request handling
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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'subject', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $errors[] = "Field '$field' is required";
    }
}

// Validate email
if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => 'Validation failed', 'details' => $errors]);
    exit();
}

// Sanitize input data
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($input['phone']) ? htmlspecialchars(trim($input['phone'])) : '';
$company = isset($input['company']) ? htmlspecialchars(trim($input['company'])) : '';
$subject = htmlspecialchars(trim($input['subject']));
$budget = isset($input['budget']) ? htmlspecialchars(trim($input['budget'])) : '';
$timeline = isset($input['timeline']) ? htmlspecialchars(trim($input['timeline'])) : '';
$message = htmlspecialchars(trim($input['message']));
$privacy = isset($input['privacy']) ? (bool)$input['privacy'] : false;
$newsletter = isset($input['newsletter']) ? (bool)$input['newsletter'] : false;

// Check privacy agreement
if (!$privacy) {
    http_response_code(400);
    echo json_encode(['error' => 'Privacy policy agreement is required']);
    exit();
}

// Prepare email content
$to = 'developer@example.com'; // Replace with your email
$email_subject = "Portfolio Contact Form: $subject";
$email_body = "
New contact form submission from portfolio website:

Name: $name
Email: $email
Phone: $phone
Company: $company
Subject: $subject
Budget: $budget
Timeline: $timeline
Newsletter Subscription: " . ($newsletter ? 'Yes' : 'No') . "

Message:
$message

---
Sent from: " . $_SERVER['HTTP_HOST'] . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "
Timestamp: " . date('Y-m-d H:i:s') . "
";

$headers = [
    'From: noreply@' . $_SERVER['HTTP_HOST'],
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
$mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));

// Log the submission (optional)
$log_entry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT']
];

// Save to log file (create logs directory first)
$log_file = 'logs/contact_submissions.log';
if (!file_exists('logs')) {
    mkdir('logs', 0755, true);
}
file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);

// Send auto-reply to user (optional)
if ($mail_sent) {
    $auto_reply_subject = "Thank you for contacting Frontend Developer";
    $auto_reply_body = "Dear $name,\n\nThank you for reaching out! I have received your message and will get back to you within 24 hours.\n\nBest regards,\nFrontend Developer";
    
    $auto_reply_headers = [
        'From: noreply@' . $_SERVER['HTTP_HOST'],
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
}

// Return response
if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully!',
        'data' => [
            'name' => $name,
            'email' => $email,
            'subject' => $subject
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send message',
        'message' => 'There was an error sending your message. Please try again later.'
    ]);
}
?>

