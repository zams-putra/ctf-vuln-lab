<?php
setcookie("auth", "", time()-3600, "/");
header("Location: index.php");
exit;
?>
