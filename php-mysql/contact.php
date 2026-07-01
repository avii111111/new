<?php
/**
 * Contact Us & Customer Reviews Rating Page
 */
include 'db_connect.php';
include 'header.php';

$inquiry_success = "";
$inquiry_error = "";
$feedback_success = "";
$feedback_error = "";

// 1. Handle General Inquiry Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_inquiry'])) {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $country = trim($_POST['country'] ?? '');
    $job_title = trim($_POST['job_title'] ?? '');
    $type = trim($_POST['type'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($company) || empty($country) || empty($job_title) || empty($type) || empty($message)) {
        $inquiry_error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $inquiry_error = "Please provide a valid email address.";
    } elseif (strlen($message) < 10) {
        $inquiry_error = "Message must be at least 10 characters.";
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, phone, company, country, job_title, type, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $company, $country, $job_title, $type, $message]);
            $inquiry_success = "Inquiry sent successfully! Our solution architects will reach out shortly.";
        } catch (\PDOException $e) {
            $inquiry_error = "Failed to submit inquiry. Please try again.";
        }
    }
}

// 2. Handle Testimonial / Feedback Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_feedback'])) {
    $rev_name = trim($_POST['rev_name'] ?? '');
    $rev_company = trim($_POST['rev_company'] ?? '');
    $rev_rating = filter_input(INPUT_POST, 'rev_rating', FILTER_VALIDATE_INT);
    $rev_comment = trim($_POST['rev_comment'] ?? '');

    if (empty($rev_name) || empty($rev_comment) || !$rev_rating || $rev_rating < 1 || $rev_rating > 5) {
        $feedback_error = "Please provide name, valid rating, and comment.";
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO testimonials (name, company, rating, comment) VALUES (?, ?, ?, ?)");
            $stmt->execute([$rev_name, $rev_company, $rev_rating, $rev_comment]);
            $feedback_success = "Thank you! Your website review and rating have been logged successfully.";
        } catch (\PDOException $e) {
            $feedback_error = "Failed to save feedback: " . $e->getMessage();
        }
    }
}

// 3. Fetch Testimonials to Display
$reviews = [];
try {
    $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC");
    $reviews = $stmt->fetchAll();
} catch (\PDOException $e) {
    // Failover static mock if DB table missing
    $reviews = [
        ['name' => 'Sarah Jenkins', 'company' => 'CTO, TechNorth Dynamics', 'rating' => 5, 'comment' => 'The enterprise automation solutions designed by AI-Solutions have boosted our operational throughput by over 40% in just three months!'],
        ['name' => 'Marcus Finch', 'company' => 'VP of Operations, Sunderland Digital', 'rating' => 5, 'comment' => 'Absolute game-changer! Their 24/7 digital virtual companions have streamlined employee queries and reduced standard waiting times to zero.'],
        ['name' => 'Aisha Patel', 'company' => 'Lead Architect, GreenScale Enterprise', 'rating' => 4, 'comment' => 'Very reliable custom LLM integration. The private self-hosting model kept our corporate legal contracts fully secure. Fantastic job!']
    ];
}
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-5">
            <h1 class="display-4 font-display fw-bold text-dark mb-3">Contact Our Experts</h1>
            <p class="text-muted fs-5">
                Have questions about our AI solutions? Our team is ready to help you formulate the perfect AI integration strategy.
            </p>
        </div>

        <!-- Contact Cards Row -->
        <div class="row g-4 mb-5 text-center">
            <div class="col-md-4">
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white h-100 hover-shadow transition">
                    <div class="mx-auto bg-warning bg-opacity-10 text-secondary p-3 rounded-circle mb-3 d-inline-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
                        <i class="bi bi-geo-alt-fill fs-4"></i>
                    </div>
                    <h3 class="h5 fw-bold text-dark mb-2">Our Headquarters</h3>
                    <p class="small text-muted mb-0">Innovation Hub, Tech Park<br>Sunderland, United Kingdom</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white h-100 hover-shadow transition">
                    <div class="mx-auto bg-warning bg-opacity-10 text-secondary p-3 rounded-circle mb-3 d-inline-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
                        <i class="bi bi-envelope-fill fs-4"></i>
                    </div>
                    <h3 class="h5 fw-bold text-dark mb-2">Email Channels</h3>
                    <p class="small text-muted mb-0">hello@ai-solutions.co.uk<br>support@ai-solutions.co.uk</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white h-100 hover-shadow transition">
                    <div class="mx-auto bg-warning bg-opacity-10 text-secondary p-3 rounded-circle mb-3 d-inline-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
                        <i class="bi bi-telephone-outbound-fill fs-4"></i>
                    </div>
                    <h3 class="h5 fw-bold text-dark mb-2">Call Direct</h3>
                    <p class="small text-muted mb-0">+44 191 555 0199<br>Mon-Fri, 9am - 5pm GMT</p>
                </div>
            </div>
        </div>

        <div class="row g-5">
            <!-- General Inquiry Form -->
            <div class="col-lg-7">
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white">
                    <h2 class="h4 font-display fw-bold text-dark mb-3">General Inquiry Form</h2>
                    <p class="small text-muted mb-4">Submit operational concerns or integration specs to get a bespoke consultation roadmap.</p>

                    <?php if (!empty($inquiry_success)): ?>
                        <div class="alert alert-success rounded-3 small mb-4"><i class="bi bi-check-circle-fill me-2"></i> <?php echo $inquiry_success; ?></div>
                    <?php endif; ?>

                    <?php if (!empty($inquiry_error)): ?>
                        <div class="alert alert-danger rounded-3 small mb-4"><i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $inquiry_error; ?></div>
                    <?php endif; ?>

                    <form action="contact.php" method="POST" class="row g-3">
                        <input type="hidden" name="submit_inquiry" value="1">

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Full Name *</label>
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
                            <label class="form-label small fw-semibold text-muted">Company Name *</label>
                            <input type="text" name="company" class="form-control text-sm" placeholder="Innovate Ltd" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Country *</label>
                            <input type="text" name="country" class="form-control text-sm" placeholder="United Kingdom" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label small fw-semibold text-muted">Job Title *</label>
                            <input type="text" name="job_title" class="form-control text-sm" placeholder="CTO / Director" required>
                        </div>

                        <div class="col-12">
                            <label class="form-label small fw-semibold text-muted">Inquiry Category *</label>
                            <select name="type" class="form-select text-sm" required>
                                <option value="">-- Choose Category --</option>
                                <option value="General Enquiry">General Business Consulting</option>
                                <option value="Technical Support">Technical Integrations & API</option>
                                <option value="SaaS Partnership">Partnerships & Sales</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="form-label small fw-semibold text-muted">Project Specs / Details *</label>
                            <textarea name="message" class="form-control text-sm" rows="5" placeholder="Share bottlenecks, timeline, and current software stack details..." required></textarea>
                        </div>

                        <div class="col-12 mt-3">
                            <button type="submit" class="btn btn-orange w-100 py-2.5 fw-bold shadow-sm">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Website Feedback & Ratings Column -->
            <div class="col-lg-5">
                <!-- Testimonials/Review logging -->
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white mb-4">
                    <h3 class="h4 font-display fw-bold text-dark mb-2">Leave Website Review</h3>
                    <p class="small text-muted mb-4">We highly value customer feedback. Share your rating and experience with Sunderland digital products.</p>

                    <?php if (!empty($feedback_success)): ?>
                        <div class="alert alert-success rounded-3 small mb-3"><i class="bi bi-patch-check-fill me-2"></i> <?php echo $feedback_success; ?></div>
                    <?php endif; ?>

                    <?php if (!empty($feedback_error)): ?>
                        <div class="alert alert-danger rounded-3 small mb-3"><i class="bi bi-x-circle-fill me-2"></i> <?php echo $feedback_error; ?></div>
                    <?php endif; ?>

                    <form action="contact.php" method="POST" class="space-y-3">
                        <input type="hidden" name="submit_feedback" value="1">
                        
                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Your Name *</label>
                            <input type="text" name="rev_name" class="form-control text-sm" placeholder="e.g. Sarah Jenkins" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Company / Role</label>
                            <input type="text" name="rev_company" class="form-control text-sm" placeholder="e.g. CTO, Innovate Ltd (Optional)">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted mb-1 d-block">Star Rating *</label>
                            <div class="d-flex align-items-center gap-1">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <input type="radio" name="rev_rating" id="star_<?php echo $i; ?>" value="<?php echo $i; ?>" class="btn-check" <?php echo ($i === 5) ? 'checked' : ''; ?>>
                                    <label for="star_<?php echo $i; ?>" class="btn btn-outline-warning p-1 border-0" style="font-size: 1.4rem;" onclick="updateStarRating(<?php echo $i; ?>)">
                                        <i class="bi bi-star-fill text-muted star-icon" id="star_icon_<?php echo $i; ?>"></i>
                                    </label>
                                <?php endfor; ?>
                                <span class="small fw-bold text-muted ms-2" id="ratingText">(5 out of 5)</span>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Comment / Review *</label>
                            <textarea name="rev_comment" class="form-control text-sm" rows="3" placeholder="Share your experience here..." required></textarea>
                        </div>

                        <button type="submit" class="btn btn-dark w-100 py-2.5 fw-bold">
                            Submit Review
                        </button>
                    </form>
                </div>

                <!-- Existing Reviews List -->
                <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white">
                    <h3 class="h5 font-display fw-bold text-dark mb-3"><i class="bi bi-stars text-amber-400 me-1"></i> Customer Testimonials</h3>
                    
                    <div class="d-flex flex-column gap-3 max-h-[400px] overflow-y-auto pr-1">
                        <?php foreach ($reviews as $rev): ?>
                            <div class="p-3 bg-light rounded-3 border">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h5 class="h6 fw-bold text-dark mb-0"><?php echo htmlspecialchars($rev['name']); ?></h5>
                                    <div class="d-flex gap-0.5 text-warning small">
                                        <?php for ($s = 1; $s <= 5; $s++): ?>
                                            <i class="bi bi-star-fill <?php echo ($s <= $rev['rating']) ? 'text-warning' : 'text-muted opacity-25'; ?>"></i>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                                <?php if (!empty($rev['company'])): ?>
                                    <p class="text-xs text-secondary-emphasis fw-semibold mb-2"><?php echo htmlspecialchars($rev['company']); ?></p>
                                <?php endif; ?>
                                <p class="small text-muted mb-0 leading-relaxed italic">"<?php echo htmlspecialchars($rev['comment']); ?>"</p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<script>
function updateStarRating(rating) {
    document.getElementById('ratingText').innerText = "(" + rating + " out of 5)";
    for (let i = 1; i <= 5; i++) {
        const icon = document.getElementById('star_icon_' + i);
        if (i <= rating) {
            icon.classList.remove('text-muted');
            icon.classList.add('text-warning');
        } else {
            icon.classList.remove('text-warning');
            icon.classList.add('text-muted');
        }
    }
}

// Set default star ratings fill on render
document.addEventListener("DOMContentLoaded", function() {
    updateStarRating(5);
});
</script>

<style>
    .hover-shadow:hover {
        transform: translateY(-4px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.08) !important;
        transition: all 0.3s ease;
    }
    .text-warning {
        color: #f59e0b !important;
    }
    .btn-check:checked + label i {
        color: #f59e0b !important;
    }
</style>

<?php
include 'footer.php';
?>
