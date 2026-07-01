<?php
/**
 * About Us Page (PHP Version)
 */
include 'header.php';

$team = [
    ["role" => "CEO & Founder", "name" => "Elena Rostova", "image" => "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400"],
    ["role" => "Head of AI Engineering", "name" => "Marcus Chen", "image" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400"],
    ["role" => "Lead Software Developer", "name" => "Sarah Williams", "image" => "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"],
    ["role" => "Principal Consultant", "name" => "David Alaba", "image" => "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400"]
];
?>

<section class="py-5 bg-transparent">
    <div class="container py-4">
        
        <!-- Story -->
        <div class="text-center max-w-3xl mx-auto mb-5 py-3">
            <h1 class="display-4 font-display fw-bold text-dark mb-4">Our Story</h1>
            <p class="text-muted leading-relaxed fs-5">
                Founded in Sunderland, United Kingdom, AI-Solutions emerged from a simple observation: the digital employee experience was broken. We set out to fix it by bringing enterprise-grade artificial intelligence to organizations of all sizes.
            </p>
        </div>

        <!-- Mission / Vision -->
        <div class="row g-4 mb-5">
            <div class="col-md-6">
                <div class="card h-100 p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition">
                    <h2 class="h3 font-display fw-bold text-dark mb-3"><i class="bi bi-eye text-secondary me-2"></i>Our Mission</h2>
                    <p class="text-muted fs-5 italic leading-relaxed">
                        "To innovate, promote, and deliver the future of digital employee experience by supporting people at work through Artificial Intelligence."
                    </p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card h-100 p-4 border-1 border-slate-200 shadow-sm rounded-4 bg-white hover-shadow transition">
                    <h2 class="h3 font-display fw-bold text-dark mb-3"><i class="bi bi-compass text-secondary me-2"></i>Our Vision</h2>
                    <p class="text-muted fs-5 italic leading-relaxed">
                        "To become a global AI solutions provider that transforms the way businesses operate, bringing automation and intelligence to every sector."
                    </p>
                </div>
            </div>
        </div>

        <!-- Core Values -->
        <div class="my-5 py-4">
            <h2 class="text-center font-display fw-bold text-dark mb-5 h1">Core Values</h2>
            <div class="row g-4">
                <?php
                $values = [
                    ["title" => "Innovation", "icon" => "bi-lightbulb-fill", "desc" => "Constantly pushing the boundaries of what is possible with AI."],
                    ["title" => "Security", "icon" => "bi-shield-lock-fill", "desc" => "Enterprise-grade protection for all organizational data."],
                    ["title" => "Customer Success", "icon" => "bi-graph-up-arrow", "desc" => "We only succeed when our clients achieve their business goals."],
                    ["title" => "Technology Excellence", "icon" => "bi-globe", "desc" => "Maintaining the highest standards in software development."]
                ];
                foreach ($values as $v):
                ?>
                    <div class="col-lg-3 col-md-6">
                        <div class="card h-100 p-4 bg-white rounded-4 shadow-sm border border-slate-200 text-center hover-shadow transition">
                            <div class="mx-auto bg-warning bg-opacity-10 text-secondary p-3 rounded-circle mb-3 d-inline-flex align-items-center justify-content-center" style="width: 55px; height: 55px;">
                                <i class="bi <?php echo $v['icon']; ?> fs-4"></i>
                            </div>
                            <h3 class="h5 font-display fw-bold text-dark mb-2"><?php echo htmlspecialchars($v['title']); ?></h3>
                            <p class="small text-muted mb-0"><?php echo htmlspecialchars($v['desc']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Leadership Team -->
        <div class="my-5 py-4">
            <h2 class="text-center font-display fw-bold text-dark mb-5 h1">Leadership Team</h2>
            <div class="row g-4">
                <?php foreach ($team as $member): ?>
                    <div class="col-lg-3 col-md-6">
                        <div class="card h-100 border-0 bg-transparent text-center group">
                            <div class="overflow-hidden rounded-4 mb-3 position-relative" style="aspect-ratio: 1/1;">
                                <img src="<?php echo htmlspecialchars($member['image']); ?>" alt="<?php echo htmlspecialchars($member['name']); ?>" class="w-100 h-100 object-fit-cover team-img">
                            </div>
                            <h3 class="h5 fw-bold text-dark mb-1"><?php echo htmlspecialchars($member['name']); ?></h3>
                            <p class="small text-secondary fw-semibold uppercase tracking-wider mb-0"><?php echo htmlspecialchars($member['role']); ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

    </div>
</section>

<style>
    .hover-shadow:hover {
        transform: translateY(-4px);
        box-shadow: 0 1rem 3rem rgba(0,0,0,.08) !important;
        transition: all 0.3s ease;
    }
    .team-img {
        transition: transform 0.5s ease;
    }
    .team-img:hover {
        transform: scale(1.05);
    }
</style>

<?php
include 'footer.php';
?>
