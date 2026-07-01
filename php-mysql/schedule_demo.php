<?php
/**
 * Schedule Demo Booking Page
 */
include 'db_connect.php';
include 'header.php';

$success_msg = "";
$error_msg = "";

// Auto-select service preset from GET parameter
$preset_service = filter_input(INPUT_GET, 'service', FILTER_DEFAULT);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['schedule_demo'])) {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $country = trim($_POST['country'] ?? '');
    $service = trim($_POST['service'] ?? '');
    $requirements = trim($_POST['requirements'] ?? '');
    $date = trim($_POST['date'] ?? '');

    if (empty($name) || empty($email) || empty($service) || empty($date)) {
        $error_msg = "Please fill in all required fields marked with an asterisk (*).";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_msg = "Please provide a valid corporate email.";
    } elseif (strtotime($date) < strtotime(date('Y-m-d'))) {
        $error_msg = "Please select a future calendar date for your live consultation.";
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO demo_requests (name, email, phone, company, country, service, requirements, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
            $stmt->execute([$name, $email, $phone, $company, $country, $service, $requirements, $date]);
            $success_msg = "Demo consultation scheduled successfully! We have reserved your seat on " . htmlspecialchars(date('M d, Y', strtotime($date))) . ". An calendar invitation link will be sent shortly.";
        } catch (\PDOException $e) {
            $error_msg = "Failed to schedule demo: " . $e->getMessage();
        }
    }
}
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        
        <div class="row g-5 align-items-center">
            <!-- Information Panel -->
            <div class="col-lg-5">
                <div class="pe-lg-4">
                    <span class="text-secondary fw-bold text-uppercase tracking-wider small">Live Consulting</span>
                    <h1 class="display-5 font-display fw-bold text-dark mt-2 mb-4">Book Your Free Live Consultation</h1>
                    <p class="text-muted leading-relaxed mb-4">
                        Schedule a dedicated 1-on-1 walkthrough with our senior digital solutions architects. We will analyze your bottlenecks, demonstrate customized workflows, and deliver a clean implementation roadmap.
                    </p>

                    <div class="d-flex flex-column gap-3 mt-4">
                        <div class="d-flex align-items-start">
                            <div class="bg-warning bg-opacity-10 text-secondary p-2.5 rounded-3 me-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
                                <i class="bi bi-clock-history fs-5"></i>
                            </div>
                            <div>
                                <h4 class="h6 fw-bold text-dark mb-1">Tailored Walkthroughs</h4>
                                <p class="small text-muted mb-0">Customized sandbox solutions focused purely on your specific enterprise needs.</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start">
                            <div class="bg-warning bg-opacity-10 text-secondary p-2.5 rounded-3 me-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
                                <i class="bi bi-shield-check fs-5"></i>
                            </div>
                            <div>
                                <h4 class="h6 fw-bold text-dark mb-1">Secure & Private Data</h4>
                                <p class="small text-muted mb-0">Our solutions adhere strictly to ISO 27001 data compliance and corporate mandates.</p>
                            </div>
                        </div>

                        <div class="d-flex align-items-start">
                            <div class="bg-warning bg-opacity-10 text-secondary p-2.5 rounded-3 me-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px;">
                                <i class="bi bi-graph-up fs-5"></i>
                            </div>
                            <div>
                                <h4 class="h6 fw-bold text-dark mb-1">ROI Mapping Metrics</h4>
                                <p class="small text-muted mb-0">Obtain an immediate business impact and performance efficiency projection matrix.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Booking Form Panel -->
            <div class="col-lg-7">
                <div class="card p-4 border-1 border-slate-200 shadow rounded-4 bg-white">
                    <h3 class="h4 font-display fw-bold text-dark mb-3">Schedule Live Consultation</h3>
                    <p class="small text-muted mb-4">Provide corporate parameters to configure your dedicated digital demo environment.</p>

                    <?php if (!empty($success_msg)): ?>
                        <div class="alert alert-success rounded-3 small mb-4"><i class="bi bi-check-circle-fill me-2"></i> <?php echo $success_msg; ?></div>
                    <?php endif; ?>

                    <?php if (!empty($error_msg)): ?>
                        <div class="alert alert-danger rounded-3 small mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $error_msg; ?></div>
                    <?php endif; ?>

                    <form action="schedule_demo.php" method="POST" class="row g-3">
                        <input type="hidden" name="schedule_demo" value="1">

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Your Full Name *</label>
                            <input type="text" name="name" class="form-control text-sm" placeholder="Elena Rostova" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Corporate Email *</label>
                            <input type="email" name="email" class="form-control text-sm" placeholder="name@company.com" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Phone Number</label>
                            <input type="text" name="phone" class="form-control text-sm" placeholder="+44 7700 900077">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Company / Enterprise Name</label>
                            <input type="text" name="company" class="form-control text-sm" placeholder="Sunderland Tech Solutions">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Country Location</label>
                            <input type="text" name="country" class="form-control text-sm" placeholder="United Kingdom">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Consultation Date *</label>
                            <input type="date" name="date" class="form-control text-sm" min="<?php echo date('Y-m-d'); ?>" required>
                        </div>

                        <div class="col-12">
                            <label class="form-label small fw-semibold text-muted">Chosen Solution Category *</label>
                            <select name="service" class="form-select text-sm" required>
                                <option value="">-- Choose Solution --</option>
                                <option value="Intelligent Chatbots" <?php echo ($preset_service === 'virtual-assistant') ? 'selected' : ''; ?>>Intelligent Chatbots & NLP Agents</option>
                                <option value="Workflow Automation" <?php echo ($preset_service === 'software') ? 'selected' : ''; ?>>Workflow Automation & RPA Pipelines</option>
                                <option value="Rapid AI Prototyping" <?php echo ($preset_service === 'prototyping') ? 'selected' : ''; ?>>Rapid AI Prototyping (MVP Construction)</option>
                                <option value="Enterprise Auditing" <?php echo ($preset_service === 'consulting') ? 'selected' : ''; ?>>AI Corporate Strategy & Auditing</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="form-label small fw-semibold text-muted">Custom Bottlenecks / Tech Stack Requirements</label>
                            <textarea name="requirements" class="form-control text-sm" rows="3" placeholder="Share specific process blocks or tools (e.g., legacy databases, messaging rails) you wish to automate..."></textarea>
                        </div>

                        <div class="col-12 mt-3">
                            <button type="submit" class="btn btn-orange w-100 py-2.5 fw-bold shadow-sm">
                                Submit Consultation Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</section>

<?php
include 'footer.php';
?>
