<?php
// create-gig.php - Seller creates a new gig
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;
$category_id = $data['category_id'] ?? null;
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$price = $data['price'] ?? 0;

if (!$user_id || !$category_id || !$title || !$description || !$price) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO gigs (user_id, category_id, title, description, price) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$user_id, $category_id, $title, $description, $price]);
    echo json_encode(['success' => true, 'gig_id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
} 