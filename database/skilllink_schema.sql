-- SkillLink Database Schema
-- 1. Roles Table
CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(20) NOT NULL UNIQUE
);

-- 2. Users Table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 3. Categories Table
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Gigs Table
CREATE TABLE gigs (
  gig_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 5. Orders Table
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  gig_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gig_id) REFERENCES gigs(gig_id),
  FOREIGN KEY (buyer_id) REFERENCES users(user_id),
  FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

-- 6. Messages Table
CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- Sample Data
INSERT INTO roles (role_name) VALUES ('buyer'), ('seller'), ('admin');
INSERT INTO categories (category_name) VALUES ('Design'), ('Development'), ('Writing');
INSERT INTO users (username, email, password, role_id) VALUES
('alice', 'alice@example.com', 'hashed_pw1', 2),
('bob', 'bob@example.com', 'hashed_pw2', 1);
INSERT INTO gigs (user_id, category_id, title, description, price) VALUES
(1, 1, 'Logo Design', 'Professional logo design', 50.00);
INSERT INTO orders (gig_id, buyer_id, seller_id, status) VALUES
(1, 2, 1, 'active');
INSERT INTO messages (order_id, sender_id, message) VALUES
(1, 2, 'Hi, I would like a modern logo.');

-- View: Active Orders with Gig and User Info
CREATE VIEW active_orders_view AS
SELECT o.order_id, o.status, g.title, u.username AS seller, b.username AS buyer
FROM orders o
INNER JOIN gigs g ON o.gig_id = g.gig_id
INNER JOIN users u ON o.seller_id = u.user_id
INNER JOIN users b ON o.buyer_id = b.user_id
WHERE o.status = 'active';

-- User Access Control
CREATE USER 'skilllink_user'@'localhost' IDENTIFIED BY 'password123';
GRANT SELECT, INSERT, UPDATE, DELETE ON skilllink_db.* TO 'skilllink_user'@'localhost';
GRANT SELECT ON skilllink_db.active_orders_view TO 'skilllink_user'@'localhost' WITH GRANT OPTION; 