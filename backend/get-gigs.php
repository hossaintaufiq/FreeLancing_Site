<?php
// get-gigs.php - Fetch all gigs (with optional search/filter)
header('Content-Type: application/json');
require_once 'db.php';

$search = $_GET['search'] ?? '';
$category_id = $_GET['category_id'] ?? '';

$sql = 'SELECT g.gig_id, g.title, g.description, g.price, g.created_at, u.username AS seller, c.category_name
        FROM gigs g
        INNER JOIN users u ON g.user_id = u.user_id
        INNER JOIN categories c ON g.category_id = c.category_id
        WHERE 1';
$params = [];

if ($search) {
    $sql .= ' AND (g.title LIKE ? OR g.description LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
}
if ($category_id) {
    $sql .= ' AND g.category_id = ?';
    $params[] = $category_id;
}
$sql .= ' ORDER BY g.created_at DESC LIMIT 50';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$gigs = $stmt->fetchAll();

echo json_encode($gigs); 