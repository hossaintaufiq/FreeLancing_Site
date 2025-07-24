<?php
// place-order.php - Buyer places an order
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$gig_id = $data['gig_id'] ?? null;
$buyer_id = $data['buyer_id'] ?? null;

if (!$gig_id || !$buyer_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
}

// Get seller_id from gig
$stmt = $pdo->prepare('SELECT user_id FROM gigs WHERE gig_id = ?');
$stmt->execute([$gig_id]);
$seller = $stmt->fetch();
if (!$seller) {
    http_response_code(404);
    echo json_encode(['error' => 'Gig not found.']);
    exit;
}
$seller_id = $seller['user_id'];

try {
    $stmt = $pdo->prepare('INSERT INTO orders (gig_id, buyer_id, seller_id) VALUES (?, ?, ?)');
    $stmt->execute([$gig_id, $buyer_id, $seller_id]);
    echo json_encode(['success' => true, 'order_id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
} 