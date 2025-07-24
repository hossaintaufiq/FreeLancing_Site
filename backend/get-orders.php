<?php
// get-orders.php - Fetch user's orders (buyer or seller)
header('Content-Type: application/json');
require_once 'db.php';

$user_id = $_GET['user'] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user ID.']);
    exit;
}

// Fetch orders where user is buyer or seller, with gig and user info
$sql = 'SELECT o.order_id, o.status, o.order_date, g.title, g.price, 
               s.username AS seller, b.username AS buyer
        FROM orders o
        INNER JOIN gigs g ON o.gig_id = g.gig_id
        INNER JOIN users s ON o.seller_id = s.user_id
        INNER JOIN users b ON o.buyer_id = b.user_id
        WHERE o.buyer_id = ? OR o.seller_id = ?
        ORDER BY o.order_date DESC';
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id, $user_id]);
$orders = $stmt->fetchAll();

echo json_encode($orders); 