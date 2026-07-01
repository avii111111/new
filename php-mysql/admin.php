<?php
/**
 * Admin Dashboard Hub (PHP & MySQL Version)
 * Provides KPI analytics, booking schedules, inquiry management, and testimonial deletions.
 */
include 'db_connect.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Password Protection Handling
$authenticated = isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;
$auth_error = "";
$default_pass = "admin123"; // Easy local access password

if (isset($_POST['login_admin'])) {
    $entered_pass = $_POST['admin_password'] ?? '';
    if ($entered_pass === $default_pass) {
        $_SESSION['admin_authenticated'] = true;
        $authenticated = true;
    } else {
        $auth_error = "Invalid administrator password. Try using 'admin123'.";
    }
}

if (isset($_GET['logout'])) {
    unset($_SESSION['admin_authenticated']);
    session_destroy();
    header("Location: admin.php");
    exit;
}

// 2. Handle Booking Status Update Actions
if ($authenticated && isset($_GET['action']) && isset($_GET['booking_id'])) {
    $booking_id = filter_input(INPUT_GET, 'booking_id', FILTER_VALIDATE_INT);
    $action = $_GET['action']; // e.g. "approve" or "complete"
    
    if ($booking_id) {
        $status_map = ['approve' => 'approved', 'cancel' => 'cancelled', 'complete' => 'completed'];
        if (array_key_exists($action, $status_map)) {
            try {
                $stmt = $pdo->prepare("UPDATE demo_requests SET status = ? WHERE id = ?");
                $stmt->execute([$status_map[$action], $booking_id]);
                header("Location: admin.php?status_updated=1");
                exit;
            } catch (\PDOException $e) {
                // Silently skip
            }
        }
    }
}

// 3. Handle Website Review / Testimonial Deletion
if ($authenticated && isset($_GET['delete_review_id'])) {
    $review_id = filter_input(INPUT_GET, 'delete_review_id', FILTER_VALIDATE_INT);
    if ($review_id) {
        try {
            $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
            $stmt->execute([$review_id]);
            header("Location: admin.php?review_deleted=1");
            exit;
        } catch (\PDOException $e) {
            // Skip
        }
    }
}

// 4. Export Bookings to CSV Action
if ($authenticated && isset($_GET['export_csv'])) {
    try {
        $stmt = $pdo->query("SELECT name, email, phone, company, country, service, date, status, created_at FROM demo_requests ORDER BY created_at DESC");
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Output headers to trigger clean download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=demo_bookings_export_' . date('Ymd_His') . '.csv');
        
        $output = fopen('php://output', 'w');
        // Column headers
        fputcsv($output, array('Full Name', 'Email', 'Phone', 'Company', 'Country', 'Service', 'Date', 'Status', 'Logged At'));
        
        foreach ($bookings as $row) {
            fputcsv($output, $row);
        }
        fclose($output);
        exit;
    } catch (\PDOException $e) {
        // Fallback or output error
        echo "Error creating CSV export: " . $e->getMessage();
        exit;
    }
}

// Proceed to load page statistics if authenticated
if ($authenticated) {
    try {
        // Fetch KPI counts from MySQL
        $inquiries_count = $pdo->query("SELECT COUNT(*) FROM inquiries")->fetchColumn();
        $demos_count = $pdo->query("SELECT COUNT(*) FROM demo_requests")->fetchColumn();
        $events_reg_count = $pdo->query("SELECT COUNT(*) FROM event_registrations")->fetchColumn();
        
        $avg_rating_raw = $pdo->query("SELECT AVG(rating) FROM testimonials")->fetchColumn();
        $avg_rating = $avg_rating_raw ? number_format($avg_rating_raw, 1) : "0.0";
        $total_reviews_count = $pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();

        // Fetch inquiries, demos, and reviews lists
        $recent_inquiries = $pdo->query("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5")->fetchAll();
        $all_demos = $pdo->query("SELECT * FROM demo_requests ORDER BY created_at DESC")->fetchAll();
        $all_reviews = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll();
    } catch (\PDOException $e) {
        // Setup empty arrays if tables do not exist yet
        $inquiries_count = 0; $demos_count = 0; $events_reg_count = 0; $avg_rating = "0.0"; $total_reviews_count = 0;
        $recent_inquiries = []; $all_demos = []; $all_reviews = [];
    }
}

include 'header.php';
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        
        <!-- Case 1: Unauthorized Admin Gateway Gatekeeper -->
        <?php if (!$authenticated): ?>
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card p-4 border-1 border-slate-200 shadow-lg rounded-4 bg-white mt-5">
                        <div class="text-center mb-4">
                            <div class="bg-warning bg-opacity-10 text-secondary p-3 rounded-circle mb-3 d-inline-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                                <i class="bi bi-shield-lock-fill fs-3"></i>
                            </div>
                            <h2 class="h3 font-display fw-bold text-dark">Admin Access Portal</h2>
                            <p class="small text-muted mb-0">Verify credentials to manage enterprise inquiries and reviews.</p>
                        </div>

                        <?php if (!empty($auth_error)): ?>
                            <div class="alert alert-danger rounded-3 small mb-3"><i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $auth_error; ?></div>
                        <?php endif; ?>

                        <form action="admin.php" method="POST">
                            <input type="hidden" name="login_admin" value="1">
                            <div class="mb-4">
                                <label class="form-label small fw-semibold text-muted">Administrator Password</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
                                    <input type="password" name="admin_password" class="form-control" placeholder="Enter password (default: admin123)" required>
                                </div>
                                <div class="form-text small text-muted text-center mt-2">Hint: Local demo password is <strong>admin123</strong></div>
                            </div>
                            
                            <button type="submit" class="btn btn-orange w-100 py-2.5 fw-bold shadow-sm">
                                Unlock Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        <!-- Case 2: Authorized Admin Dashboard -->
        <?php else: ?>
            <!-- Dashboard Header -->
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 border-bottom pb-4 mb-5">
                <div>
                    <h1 class="h2 font-display fw-bold text-dark mb-1"><i class="bi bi-speedometer2 text-secondary me-2"></i>Admin Dashboard Hub</h1>
                    <p class="small text-muted mb-0">Monitor general business inquiries, customer ratings, scheduled consultations, and event registrations.</p>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <a href="admin.php?export_csv=1" class="btn btn-outline-custom text-sm d-inline-flex align-items-center gap-1.5 py-2 px-3 bg-white">
                        <i class="bi bi-download"></i> Export Bookings
                    </a>
                    <a href="admin.php?logout=1" class="btn btn-danger text-sm d-inline-flex align-items-center gap-1.5 py-2 px-3 font-semibold rounded-3 shadow-sm">
                        <i class="bi bi-power"></i> Log Out
                    </a>
                </div>
            </div>

            <!-- Status Alerts -->
            <?php if (isset($_GET['status_updated'])): ?>
                <div class="alert alert-success alert-dismissible fade show rounded-3 small mb-4" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i> Demo request status updated successfully.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>
            <?php if (isset($_GET['review_deleted'])): ?>
                <div class="alert alert-success alert-dismissible fade show rounded-3 small mb-4" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i> Website review deleted from database successfully.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            <?php endif; ?>

            <!-- KPI Metric Cards Grid -->
            <div class="row g-4 mb-5">
                <div class="col-md-3 col-sm-6">
                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition flex-row align-items-center gap-3">
                        <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-envelope-paper-fill fs-4"></i>
                        </div>
                        <div>
                            <span class="text-muted small uppercase tracking-wider d-block fw-semibold" style="font-size: 0.75rem;">Inquiries</span>
                            <h3 class="fw-bold mb-0 text-dark"><?php echo $inquiries_count; ?></h3>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3 col-sm-6">
                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition flex-row align-items-center gap-3">
                        <div class="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-calendar-check-fill fs-4"></i>
                        </div>
                        <div>
                            <span class="text-muted small uppercase tracking-wider d-block fw-semibold" style="font-size: 0.75rem;">Consultations</span>
                            <h3 class="fw-bold mb-0 text-dark"><?php echo $demos_count; ?></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 col-sm-6">
                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition flex-row align-items-center gap-3">
                        <div class="bg-warning bg-opacity-10 text-warning p-3 rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-stars fs-4"></i>
                        </div>
                        <div>
                            <span class="text-muted small uppercase tracking-wider d-block fw-semibold" style="font-size: 0.75rem;">Avg Rating</span>
                            <h3 class="fw-bold mb-0 text-dark"><?php echo $avg_rating; ?> ★</h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 col-sm-6">
                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition flex-row align-items-center gap-3">
                        <div class="bg-info bg-opacity-10 text-info p-3 rounded-3 d-inline-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
                            <i class="bi bi-people-fill fs-4"></i>
                        </div>
                        <div>
                            <span class="text-muted small uppercase tracking-wider d-block fw-semibold" style="font-size: 0.75rem;">Workshop Seats</span>
                            <h3 class="fw-bold mb-0 text-dark"><?php echo $events_reg_count; ?></h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Interactive Lists -->
            <div class="row g-5">
                <!-- Consultations Schedule -->
                <div class="col-12">
                    <div class="card border-1 border-slate-200 shadow-sm rounded-4 bg-white overflow-hidden">
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-transparent">
                            <h3 class="h5 font-display fw-bold text-dark mb-0"><i class="bi bi-clock-history me-1"></i> Live Consultations Queue</h3>
                            <span class="badge bg-secondary"><?php echo count($all_demos); ?> Bookings</span>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table align-middle table-hover mb-0 text-sm">
                                <thead class="table-light text-muted">
                                    <tr>
                                        <th class="px-4 py-3">Client</th>
                                        <th class="py-3">Enterprise / Role</th>
                                        <th class="py-3">Service Topic</th>
                                        <th class="py-3">Date Requested</th>
                                        <th class="py-3">Status</th>
                                        <th class="px-4 py-3 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($all_demos)): ?>
                                        <tr>
                                            <td colspan="6" class="text-center p-5 text-muted italic">No consultations scheduled in queue.</td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($all_demos as $dm): ?>
                                            <tr>
                                                <td class="px-4 py-3">
                                                    <span class="fw-bold text-dark d-block"><?php echo htmlspecialchars($dm['name']); ?></span>
                                                    <span class="text-xs text-muted d-block"><?php echo htmlspecialchars($dm['email']); ?></span>
                                                </td>
                                                <td>
                                                    <span class="d-block text-slate-700"><?php echo htmlspecialchars($dm['company'] ?: 'Personal'); ?></span>
                                                    <span class="text-xs text-muted"><?php echo htmlspecialchars($dm['country'] ?: '-'); ?></span>
                                                </td>
                                                <td><span class="badge bg-light border text-dark px-2.5 py-1.5 rounded-3"><?php echo htmlspecialchars($dm['service']); ?></span></td>
                                                <td><span class="small fw-semibold"><?php echo date('Y-m-d', strtotime($dm['date'])); ?></span></td>
                                                <td>
                                                    <?php if ($dm['status'] === 'approved'): ?>
                                                        <span class="badge bg-success-subtle text-success border border-success px-2 py-1 rounded-pill small">Approved</span>
                                                    <?php elseif ($dm['status'] === 'cancelled'): ?>
                                                        <span class="badge bg-danger-subtle text-danger border border-danger px-2 py-1 rounded-pill small">Cancelled</span>
                                                    <?php else: ?>
                                                        <span class="badge bg-warning-subtle text-warning border border-warning px-2 py-1 rounded-pill small">Pending</span>
                                                    <?php endif; ?>
                                                </td>
                                                <td class="px-4 py-3 text-end">
                                                    <div class="dropdown">
                                                        <button class="btn btn-light border btn-sm" type="button" data-bs-toggle="dropdown">
                                                            Manage <i class="bi bi-chevron-down ms-1 text-xs"></i>
                                                        </button>
                                                        <ul class="dropdown-menu dropdown-menu-end">
                                                            <li><a class="dropdown-item text-success text-xs font-semibold" href="admin.php?action=approve&booking_id=<?php echo $dm['id']; ?>"><i class="bi bi-check-circle me-2"></i> Approve Demo</a></li>
                                                            <li><a class="dropdown-item text-danger text-xs font-semibold" href="admin.php?action=cancel&booking_id=<?php echo $dm['id']; ?>"><i class="bi bi-x-circle me-2"></i> Cancel Demo</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Recent Contact Inquiries -->
                <div class="col-lg-6">
                    <div class="card border-1 border-slate-200 shadow-sm rounded-4 bg-white overflow-hidden h-100">
                        <div class="px-4 py-3 border-bottom bg-transparent">
                            <h3 class="h5 font-display fw-bold text-dark mb-0"><i class="bi bi-inbox-fill me-1"></i> Recent Contact Inquiries</h3>
                        </div>
                        <div class="p-4 d-flex flex-column gap-3 max-h-[500px] overflow-y-auto">
                            <?php if (empty($recent_inquiries)): ?>
                                <p class="text-center text-muted italic my-4">No contact form inquiries submitted yet.</p>
                            <?php else: ?>
                                <?php foreach ($recent_inquiries as $inq): ?>
                                    <div class="p-3 bg-light rounded-3 border">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <span class="fw-bold text-dark text-sm"><?php echo htmlspecialchars($inq['name']); ?></span>
                                            <span class="text-muted text-xs"><?php echo date('M d, Y', strtotime($inq['created_at'])); ?></span>
                                        </div>
                                        <span class="text-xs text-secondary-emphasis fw-semibold d-block mb-2"><?php echo htmlspecialchars($inq['company']); ?> (<?php echo htmlspecialchars($inq['type']); ?>)</span>
                                        <p class="small text-muted mb-0 bg-white p-2.5 rounded border border-slate-100 italic">"<?php echo htmlspecialchars($inq['message']); ?>"</p>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Testimonials/Review Manager -->
                <div class="col-lg-6">
                    <div class="card border-1 border-slate-200 shadow-sm rounded-4 bg-white overflow-hidden h-100">
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-transparent">
                            <h3 class="h5 font-display fw-bold text-dark mb-0"><i class="bi bi-stars text-amber-500 me-1"></i> Manage Website Reviews</h3>
                            <span class="badge bg-secondary"><?php echo $total_reviews_count; ?> Total</span>
                        </div>
                        <div class="table-responsive max-h-[500px] overflow-y-auto">
                            <table class="table align-middle table-hover mb-0 text-sm">
                                <thead class="table-light text-muted">
                                    <tr>
                                        <th class="px-4 py-3">Customer</th>
                                        <th class="py-3 text-center">Stars</th>
                                        <th class="py-3">Comment</th>
                                        <th class="px-4 py-3 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($all_reviews)): ?>
                                        <tr>
                                            <td colspan="4" class="text-center p-4 text-muted italic">No feedback submissions found in database.</td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($all_reviews as $rev): ?>
                                            <tr>
                                                <td class="px-4 py-3">
                                                    <span class="fw-bold text-dark d-block"><?php echo htmlspecialchars($rev['name']); ?></span>
                                                    <span class="text-xs text-muted d-block"><?php echo htmlspecialchars($rev['company']); ?></span>
                                                </td>
                                                <td class="text-center text-warning font-semibold">
                                                    <?php echo $rev['rating']; ?> <i class="bi bi-star-fill text-warning ms-0.5"></i>
                                                </td>
                                                <td class="text-muted text-xs max-w-xs truncate" title="<?php echo htmlspecialchars($rev['comment']); ?>">
                                                    <?php echo htmlspecialchars($rev['comment']); ?>
                                                </td>
                                                <td class="px-4 py-3 text-end">
                                                    <a href="admin.php?delete_review_id=<?php echo $rev['id']; ?>" class="text-danger hover-text-danger p-1.5 rounded hover-bg-danger" onclick="return confirm('Are you sure you want to delete this customer review permanently?');">
                                                        <i class="bi bi-trash3 fs-6"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>

    </div>
</section>

<style>
    .hover-shadow:hover {
        transform: translateY(-4px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.08) !important;
        transition: all 0.3s ease;
    }
    .text-warning {
        color: #f59e0b !important;
    }
    .bg-success-subtle {
        background-color: rgba(22, 163, 74, 0.1) !important;
    }
    .bg-danger-subtle {
        background-color: rgba(220, 38, 38, 0.1) !important;
    }
    .bg-warning-subtle {
        background-color: rgba(202, 138, 4, 0.1) !important;
    }
    .hover-bg-danger:hover {
        background-color: rgba(220, 38, 38, 0.08) !important;
    }
</style>

<?php
include 'footer.php';
?>
