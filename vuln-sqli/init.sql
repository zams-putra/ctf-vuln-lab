CREATE DATABASE IF NOT EXISTS dbngawur;
USE dbngawur;

CREATE TABLE IF NOT EXISTS users_ssh (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

INSERT INTO users_ssh (username, password) 
SELECT * FROM (SELECT 'ninja', 'ninjagogo33') AS tmp 
WHERE NOT EXISTS (
  SELECT 1 FROM users_ssh WHERE username = 'ninja'
);

CREATE USER IF NOT EXISTS 'owner_db'@'localhost' IDENTIFIED BY 'myown_myrule';
GRANT ALL PRIVILEGES ON dbngawur.* TO 'owner_db'@'localhost';
FLUSH PRIVILEGES;
