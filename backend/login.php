<?php
// login.php - User login
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

$stmt = $pdo->prepare('SELECT user_id, username, password, role_id FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => true,
        'user_id' => $user['user_id'],
        'username' => $user['username'],
        'role_id' => $user['role_id']
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password.']);
} 