<?php
/**
 * Services Showcase Page (PHP Version)
 */
include 'header.php';

$services = [
    [
        "id" => "virtual-assistant",
        "title" => "AI Virtual Assistant",
        "icon" => "bi-chat-text-fill",
        "features" => [
            "Natural Language Processing scenarios",
            "24/7 Customer support automation",
            "Internal employee assistance & HR ticketing",
            "Smart recommendations engine",
            "Seamless human agent escalation"
        ]
    ],
    [
        "id" => "software",
        "title" => "AI Software Development",
        "icon" => "bi-code-slash",
        "features" => [
            "Custom Enterprise software solutions",
            "Legacy system AI integration",
            "Workflow automation and RPA",
            "Data pipeline construction",
            "Predictive analytics engines"
        ]
    ],
    [
        "id" => "prototyping",
        "title" => "AI Prototyping",
        "icon" => "bi-rocket-takeoff-fill",
        "features" => [
            "Minimum Viable Product (MVP) creation",
            "Rapid experimentation and testing",
            "Proof of Concept development",
            "Technical feasibility studies",
            "Iterative deployment cycles"
        ]
    ],
    [
        "id" => "consulting",
        "title" => "AI Consulting",
        "icon" => "bi-graph-up-arrow",
        "features" => [
            "Comprehensive AI strategy formation",
            "Implementation roadmap planning",
            "Business transformation guidance",
            "Security and compliance audits",
            "ROI projection analysis"
        ]
    ]
];
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-5">
            <h1 class="display-4 font-display fw-bold text-dark mb-3">Our AI Solutions</h1>
            <p class="text-muted fs-5">
                Comprehensive AI services designed to enhance digital employee experience and accelerate business growth.
            </p>
        </div>

        <!-- Services Grid -->
        <div class="row g-4 mt-2">
            <?php foreach ($services as $service): ?>
                <div class="col-md-6">
                    <div class="card h-100 p-4 border-1 border-slate-200 shadow-sm hover-shadow transition d-flex flex-column" style="border-radius: 1.5rem; background: white;">
                        <div class="d-flex align-items-center mb-4">
                            <div class="bg-warning bg-opacity-10 text-secondary p-3 rounded-4 me-3 d-inline-flex" style="width: 60px; height: 60px; align-items: center; justify-content: center;">
                                <i class="bi <?php echo $service['icon']; ?> fs-3"></i>
                            </div>
                            <h2 class="h4 font-display fw-bold text-dark mb-0"><?php echo htmlspecialchars($service['title']); ?></h2>
                        </div>
                        
                        <ul class="list-unstyled flex-grow-1 mb-4">
                            <?php foreach ($service['features'] as $feature): ?>
                                <li class="d-flex align-items-start mb-2 text-secondary-emphasis">
                                    <i class="bi bi-chevron-right text-secondary me-2 mt-1"></i>
                                    <span><?php echo htmlspecialchars($feature); ?></span>
                                </li>
                            <?php end99; // Using standard dynamic layout foreach ?>
                            <?php endforeach; ?>
                        </ul>
                        
                        <a href="schedule_demo.php?service=<?php echo urlencode($service['id']); ?>" class="btn btn-light border w-full py-2.5 fw-semibold hover-btn-orange" style="border-radius: 10px;">
                            Request Demo
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<style>
    .hover-shadow:hover {
        transform: translateY(-4px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.08) !important;
        transition: all 0.3s ease;
    }
    .hover-btn-orange:hover {
        background-color: var(--secondary) !important;
        color: white !important;
        border-color: var(--secondary) !important;
        transition: all 0.2s ease;
    }
</style>

<?php
include 'footer.php';
?>
