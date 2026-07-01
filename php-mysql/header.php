<?php
/**
 * Global Header Navigation Component
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Solutions | Next-Gen Enterprise Intelligent Systems</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts: Inter & Space Grotesk -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --primary: #0f172a;
            --secondary: #ea580c;
            --accent: #f97316;
            --body-bg: #fbfbfa;
            --font-sans: 'Inter', sans-serif;
            --font-display: 'Space Grotesk', sans-serif;
        }

        body {
            font-family: var(--font-sans);
            background-color: var(--body-bg);
            color: #334155;
            display: flex;
            flex-direction: column;
            min-h: 100vh;
        }

        .font-display {
            font-family: var(--font-display);
        }

        .navbar {
            background-color: rgba(251, 251, 250, 0.9) !important;
            backdrop-filter: blur(8px);
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 0;
        }

        .navbar-brand {
            font-family: var(--font-display);
            font-weight: 700;
            color: var(--primary) !important;
            letter-spacing: -0.025em;
        }

        .navbar-brand span {
            color: var(--secondary);
        }

        .nav-link {
            font-weight: 500;
            color: #475569 !important;
            padding: 0.5rem 1rem !important;
            transition: color 0.2s ease;
        }

        .nav-link:hover, .nav-link.active {
            color: var(--secondary) !important;
        }

        .btn-orange {
            background-color: var(--secondary);
            border-color: var(--secondary);
            color: white !important;
            font-weight: 600;
            border-radius: 50px;
            padding: 0.6rem 1.5rem;
            transition: all 0.2s ease;
        }

        .btn-orange:hover {
            background-color: #d97706;
            border-color: #d97706;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
        }

        .btn-outline-custom {
            border: 1px solid #cbd5e1;
            color: #334155;
            font-weight: 500;
            border-radius: 50px;
            padding: 0.6rem 1.5rem;
            transition: all 0.2s ease;
        }

        .btn-outline-custom:hover {
            background-color: #f8fafc;
            border-color: #94a3b8;
        }

        /* Marquee style matching our react app */
        .marquee-container {
            width: 100%;
            background-color: rgba(234, 88, 12, 0.03);
            border-top: 1px solid rgba(226, 232, 240, 0.8);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            padding: 1rem 0;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }

        .marquee-content {
            display: inline-block;
            animation: marquee 25s linear infinite;
            font-family: var(--font-display);
            font-weight: 700;
            letter-spacing: 0.1em;
            color: rgba(234, 88, 12, 0.8);
            text-transform: uppercase;
        }

        @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
        }

        footer {
            background-color: #0f172a;
            color: #94a3b8;
            border-top: 1px solid #1e293b;
        }
    </style>
</head>
<body>

    <!-- Header Navbar -->
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand fs-4" href="index.php">
                <i class="bi bi-cpu text-secondary me-2"></i>AI-<span>Solutions</span>
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page == 'index.php') ? 'active' : ''; ?>" href="index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page == 'services.php') ? 'active' : ''; ?>" href="services.php">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page == 'about.php') ? 'active' : ''; ?>" href="about.php">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page == 'events.php') ? 'active' : ''; ?>" href="events.php">Events</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php echo ($current_page == 'contact.php') ? 'active' : ''; ?>" href="contact.php">Contact</a>
                    </li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <a href="admin.php" class="nav-link fs-6 <?php echo ($current_page == 'admin.php') ? 'active' : ''; ?>" title="Admin Portal">
                        <i class="bi bi-shield-lock me-1"></i>Admin
                    </a>
                    <a href="schedule_demo.php" class="btn btn-orange">Schedule Demo</a>
                </div>
            </div>
        </div>
    </nav>
