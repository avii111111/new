<?php
/**
 * Interactive Events Listing & Event Registration Page
 */
include 'db_connect.php';
include 'header.php';

$success_msg = "";
$error_msg = "";

// 1. Handle Event Registration Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register_event'])) {
    $event_id = filter_input(INPUT_POST, 'event_id', FILTER_VALIDATE_INT);
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $country = trim($_POST['country'] ?? '');

    if (!$event_id || empty($name) || empty($email) || empty($country)) {
        $error_msg = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error_msg = "Please provide a valid email address.";
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO event_registrations (event_id, name, email, company, country) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$event_id, $name, $email, $company, $country]);
            $success_msg = "Registration successful! We have sent a confirmation details packet to " . htmlspecialchars($email);
        } catch (\PDOException $e) {
            $error_msg = "Failed to register for the event. Please try again.";
        }
    }
}

// 2. Load Events from MySQL
$events = [];
try {
    $stmt = $pdo->query("SELECT * FROM events ORDER BY date ASC");
    $events = $stmt->fetchAll();
} catch (\PDOException $e) {
    // If table doesn't exist, use static array to avoid blank screen
    $events = [
        ['id' => 1, 'title' => 'AI Transforming the Workplace 2026', 'description' => 'Discover how top companies harness agentic AI systems to transform daily work and scale operations.', 'location' => 'London, UK & Virtual', 'date' => '2026-09-15'],
        ['id' => 2, 'title' => 'Prototyping with AI Masterclass', 'description' => 'A comprehensive hands-on workshop focused on leveraging LLMs to build rapid MVPs and software tools.', 'location' => 'Online', 'date' => '2026-10-02'],
        ['id' => 3, 'title' => 'Enterprise AI Summit 2026', 'description' => 'Our flagship annual summit focusing on agentic workflows, custom automation, and local digital evolution.', 'location' => 'Sunderland, UK', 'date' => '2026-03-10'],
        ['id' => 4, 'title' => 'Custom LLM Fine-Tuning Workshop', 'description' => 'A technical deep-dive into self-hosting, fine-tuning, and setting up vector databases securely in high-privacy sectors.', 'location' => 'Newcastle, UK', 'date' => '2025-11-14']
    ];
}

// Separate upcoming vs past events
$today = date('Y-m-d');
$upcoming_events = [];
$past_events = [];

foreach ($events as $event) {
    if ($event['date'] >= $today) {
        $upcoming_events[] = $event;
    } else {
        $past_events[] = $event;
    }
}
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-5">
            <h1 class="display-4 font-display fw-bold text-dark mb-3">Enterprise Tech Events</h1>
            <p class="text-muted fs-5">
                Join our expert workshops, technical roundtables, and global AI leadership summits in Sunderland and beyond.
            </p>
        </div>

        <?php if (!empty($success_msg)): ?>
            <div class="alert alert-success alert-dismissible fade show rounded-4 shadow-sm max-w-2xl mx-auto mb-4" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i> <?php echo $success_msg; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if (!empty($error_msg)): ?>
            <div class="alert alert-danger alert-dismissible fade show rounded-4 shadow-sm max-w-2xl mx-auto mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> <?php echo $error_msg; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="row g-5">
            <!-- Event Listings Column -->
            <div class="col-lg-7">
                <!-- Tab Headers -->
                <ul class="nav nav-pills mb-4 gap-2" id="eventTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active px-4 py-2 fw-semibold" id="upcoming-tab" data-bs-toggle="pill" data-bs-target="#upcoming" type="button" role="tab" aria-controls="upcoming" aria-selected="true" style="border-radius: 50px;">
                            Upcoming Events (<?php echo count($upcoming_events); ?>)
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link px-4 py-2 fw-semibold" id="past-tab" data-bs-toggle="pill" data-bs-target="#past" type="button" role="tab" aria-controls="past" aria-selected="false" style="border-radius: 50px;">
                            Past Events (<?php echo count($past_events); ?>)
                        </button>
                    </li>
                </ul>

                <div class="tab-content" id="eventTabsContent">
                    <!-- Upcoming Tab -->
                    <div class="tab-pane fade show active" id="upcoming" role="tabpanel" aria-labelledby="upcoming-tab">
                        <?php if (empty($upcoming_events)): ?>
                            <div class="text-center p-5 rounded-4 bg-white border border-slate-200">
                                <p class="text-muted italic mb-0">No upcoming events scheduled. Check back soon!</p>
                            </div>
                        <?php else: ?>
                            <div class="d-flex flex-column gap-4">
                                <?php foreach ($upcoming_events as $ev): ?>
                                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition">
                                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                            <h3 class="h5 fw-bold text-dark mb-0 font-display"><?php echo htmlspecialchars($ev['title']); ?></h3>
                                            <span class="badge bg-orange-subtle text-orange-emphasis border border-orange-200 px-2.5 py-1.5 rounded-pill text-xs fw-semibold">
                                                <i class="bi bi-calendar-event me-1"></i> <?php echo date('M d, Y', strtotime($ev['date'])); ?>
                                            </span>
                                        </div>
                                        <p class="text-muted small mb-3 leading-relaxed"><?php echo htmlspecialchars($ev['description']); ?></p>
                                        <div class="d-flex align-items-center justify-content-between text-muted small mt-2">
                                            <span><i class="bi bi-geo-alt-fill text-secondary me-1"></i> <?php echo htmlspecialchars($ev['location']); ?></span>
                                            <button onclick="selectEvent(<?php echo $ev['id']; ?>, '<?php echo addslashes($ev['title']); ?>')" class="btn btn-sm btn-orange px-3 font-semibold rounded-pill">
                                                Register Now <i class="bi bi-arrow-right-short"></i>
                                            </button>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Past Tab -->
                    <div class="tab-pane fade" id="past" role="tabpanel" aria-labelledby="past-tab">
                        <?php if (empty($past_events)): ?>
                            <div class="text-center p-5 rounded-4 bg-white border border-slate-200">
                                <p class="text-muted italic mb-0">No past events found.</p>
                            </div>
                        <?php else: ?>
                            <div class="d-flex flex-column gap-3">
                                <?php foreach ($past_events as $ev): ?>
                                    <div class="card p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white opacity-75">
                                        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                            <h4 class="h6 fw-bold text-dark mb-0 font-display"><?php echo htmlspecialchars($ev['title']); ?></h4>
                                            <span class="badge bg-secondary-subtle text-secondary-emphasis border px-2.5 py-1.5 rounded-pill text-xs">
                                                Ended <?php echo date('M d, Y', strtotime($ev['date'])); ?>
                                            </span>
                                        </div>
                                        <p class="small text-muted mb-2"><?php echo htmlspecialchars($ev['description']); ?></p>
                                        <span class="small text-muted"><i class="bi bi-geo-alt-fill me-1"></i> <?php echo htmlspecialchars($ev['location']); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Registration Form Column -->
            <div class="col-lg-5">
                <div class="card p-4 border-1 border-slate-200 shadow rounded-4 bg-white sticky-lg-top" style="top: 100px; z-index: 5;">
                    <h3 class="h4 font-display fw-bold text-dark mb-3">Secure Workshop Seat</h3>
                    <p class="small text-muted mb-4">Register for any scheduled enterprise event to obtain secure credentials and location badges.</p>
                    
                    <form action="events.php" method="POST" class="space-y-3">
                        <input type="hidden" name="register_event" value="1">
                        
                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Select Target Event *</label>
                            <select name="event_id" id="eventSelector" class="form-select border rounded-3 p-2.5 text-sm" required>
                                <option value="">-- Choose Event --</option>
                                <?php foreach ($upcoming_events as $ev): ?>
                                    <option value="<?php echo $ev['id']; ?>"><?php echo htmlspecialchars($ev['title']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Full Name *</label>
                            <input type="text" name="name" class="form-control border rounded-3 p-2.5 text-sm" placeholder="e.g. John Doe" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Professional Email *</label>
                            <input type="email" name="email" class="form-control border rounded-3 p-2.5 text-sm" placeholder="e.g. name@company.com" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Company / Organization</label>
                            <input type="text" name="name_company" class="form-control border rounded-3 p-2.5 text-sm" placeholder="e.g. Innovate Ltd">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-muted">Country *</label>
                            <input type="text" name="country" class="form-control border rounded-3 p-2.5 text-sm" placeholder="e.g. United Kingdom" required>
                        </div>

                        <button type="submit" class="btn btn-orange w-100 py-2.5 fw-bold mt-2 shadow-sm">
                            Submit Registration
                        </button>
                    </form>
                </div>
            </div>
        </div>

    </div>
</section>

<script>
function selectEvent(eventId, eventTitle) {
    const selector = document.getElementById('eventSelector');
    if (selector) {
        selector.value = eventId;
        selector.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight effect
        selector.classList.add('is-valid');
        setTimeout(() => selector.classList.remove('is-valid'), 2000);
    }
}
</script>

<style>
    .bg-orange-subtle {
        background-color: rgba(234, 88, 12, 0.1) !important;
    }
    .text-orange-emphasis {
        color: var(--secondary) !important;
    }
    .nav-pills .nav-link.active, .nav-pills .show > .nav-link {
        background-color: var(--secondary) !important;
        color: white !important;
    }
    .nav-pills .nav-link {
        color: #475569;
        background-color: #f1f5f9;
    }
    .nav-pills .nav-link:hover {
        background-color: #e2e8f0;
    }
    .hover-shadow:hover {
        transform: translateY(-3px);
        box-shadow: 0 1rem 2rem rgba(0,0,0,.06) !important;
        transition: all 0.3s ease;
    }
</style>

<?php
include 'footer.php';
?>
