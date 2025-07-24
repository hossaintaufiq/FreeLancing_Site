<?php
// register.php - Register a new user
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role_id = $data['role_id'] ?? 1; // Default to buyer

if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Hash the password
$hashed_pw = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)');
    $stmt->execute([$username, $email, $hashed_pw, $role_id]);
    echo json_encode(['success' => true, 'user_id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Integrity constraint violation
        echo json_encode(['error' => 'Username or email already exists.']);
    } else {
        echo json_encode(['error' => $e->getMessage()]);
    }
} 