<?php
/**
 * Database Connection Configurator using PHP Data Objects (PDO)
 * Standard production-grade MySQL configuration
 */

$host = 'localhost';
$db   = 'enterprise_ai';
$user = 'root';
$pass = ''; // Leave blank for default XAMPP/local setups, change for production
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Elegant warning screen for local developer environments if MySQL isn't running yet
    echo "<div style='font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 3rem auto; border: 1px solid #fee2e2; background-color: #fef2f2; border-radius: 12px; color: #991b1b;'>";
    echo "<h2 style='margin-top: 0; color: #dc2626;'>MySQL Connection Failure</h2>";
    echo "<p>Please ensure your MySQL server (such as XAMPP, WAMP, or local service) is active, and that you have imported the schema from <strong>database.sql</strong>.</p>";
    echo "<hr style='border: 0; border-top: 1px solid #fca5a5; margin: 1.5rem 0;'>";
    echo "<p style='font-size: 0.85rem; color: #7f1d1d;'><strong>Error details:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
    exit;
}
?>
