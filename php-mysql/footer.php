<?php
/**
 * Global Footer Component
 */
?>
    <!-- Reusable Footer Section -->
    <footer class="py-5 mt-auto">
        <div class="container">
            <div class="row gy-4">
                <div class="col-lg-4 col-md-6">
                    <a class="navbar-brand text-white fs-4 d-inline-block mb-3" href="index.php">
                        <i class="bi bi-cpu text-secondary me-2"></i>AI-<span style="color: var(--secondary);">Solutions</span>
                    </a>
                    <p class="small text-slate-400 mb-4" style="max-width: 320px;">
                        Providing next-generation intelligent agents, smart automation pipelines, and robust data integrity consulting to modern digital organizations.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-5"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-5"><i class="bi bi-linkedin"></i></a>
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-5"><i class="bi bi-github"></i></a>
                    </div>
                </div>
                
                <div class="col-lg-2 col-md-6 col-6">
                    <h6 class="text-white text-uppercase font-display fw-bold mb-3 small" style="letter-spacing: 0.05em;">Solutions</h6>
                    <ul class="list-unstyled mb-0">
                        <li class="mb-2"><a href="services.php" class="text-decoration-none text-muted small hover-link">Chatbots</a></li>
                        <li class="mb-2"><a href="services.php" class="text-decoration-none text-muted small hover-link">Automations</a></li>
                        <li class="mb-2"><a href="services.php" class="text-decoration-none text-muted small hover-link">Analytics</a></li>
                        <li class="mb-2"><a href="services.php" class="text-decoration-none text-muted small hover-link">Custom AI</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-md-6 col-6">
                    <h6 class="text-white text-uppercase font-display fw-bold mb-3 small" style="letter-spacing: 0.05em;">Company</h6>
                    <ul class="list-unstyled mb-0">
                        <li class="mb-2"><a href="about.php" class="text-decoration-none text-muted small hover-link">About Us</a></li>
                        <li class="mb-2"><a href="events.php" class="text-decoration-none text-muted small hover-link">Workshops</a></li>
                        <li class="mb-2"><a href="contact.php" class="text-decoration-none text-muted small hover-link">Careers</a></li>
                        <li class="mb-2"><a href="contact.php" class="text-decoration-none text-muted small hover-link">Contact</a></li>
                    </ul>
                </div>

                <div class="col-lg-4 col-md-6">
                    <h6 class="text-white text-uppercase font-display fw-bold mb-3 small" style="letter-spacing: 0.05em;">Newsletter</h6>
                    <p class="small text-muted mb-3">Subscribe to get latest business tech insights.</p>
                    <form action="contact.php" method="POST" class="input-group">
                        <input type="email" name="subscribe_email" class="form-control bg-transparent border-secondary text-white text-sm" placeholder="Your work email" required>
                        <button class="btn btn-orange px-3 py-2 text-xs" type="submit">Join</button>
                    </form>
                </div>
            </div>
            
            <hr class="border-secondary my-4 opacity-25">
            
            <div class="row align-items-center justify-content-between gy-2">
                <div class="col-md-6 text-center text-md-start">
                    <span class="small text-muted">&copy; 2026 AI-Solutions Ltd. All rights reserved. Registered in Sunderland, UK.</span>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <a href="#" class="text-muted text-decoration-none small me-3 hover-link">Privacy Policy</a>
                    <a href="#" class="text-muted text-decoration-none small hover-link">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 Bundle JS with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <style>
        .text-muted {
            color: #94a3b8 !important;
        }
        .hover-link:hover {
            color: var(--secondary) !important;
        }
    </style>
</body>
</html>
