<?php

session_start();

$valid_user = "your_login_username";
$valid_pass = "your_login_pass";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $u = $_POST['username'] ?? "";
    $p = $_POST['password'] ?? "";

    if ($u === $valid_user && $p === $valid_pass) {
        setcookie("auth", "1", time()+3600, "/");
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[your company] - Sensitive data exposure</title>
  <style>
    body { background:#121212; color:#e0e0e0; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
    .login-box { background:#1e1e1e; padding:2rem; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.6); width:300px; }
    h2 { color:#ffca28; text-align:center; }
    input { width:100%; padding:0.5rem; margin:0.5rem 0; border:none; border-radius:4px; }
    button { width:100%; padding:0.7rem; background:#ffca28; border:none; border-radius:4px; cursor:pointer; font-weight:bold; }
    button:hover { background:#e6b800; }
    .error { color:#f44336; text-align:center; }
  </style>
</head>
<body>
  <div class="login-box">
    <h2>Login</h2>
    <?php if (!empty($error)) echo "<p class='error'>$error</p>"; ?>
    <form method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>
