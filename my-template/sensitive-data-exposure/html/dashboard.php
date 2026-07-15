<?php

if (!isset($_COOKIE['auth']) || $_COOKIE['auth'] !== "1") {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[your company] - Sensitive data exposure</title>
  <style>
    body { background:#121212; color:#e0e0e0; font-family:sans-serif; margin:0; }
    header { background:#1e1e1e; padding:1rem; text-align:center; }
    header h1 { color:#ffca28; }
    section { max-width:800px; margin:2rem auto; padding:2rem; background:#1a1a1a; border-radius:10px; }
    a { color:#ffca28; }
  </style>
</head>
<body>
  <header>
    <h1>Dashboard</h1>
  </header>
  <section>
    <p>Welcome King 🎉</p>
    <p>Lagi lupa sama password ssh nya ya hayoo</p>
    <p>Nih username nya: your_ssh_username</p>
    <p>Nih passnya: </p>
    <ul>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>wordlist</li>
      <li>your_ssh_password</li>
    </ul>
    <p><a href="logout.php">Logout</a></p>
  </section>
</body>
</html>
