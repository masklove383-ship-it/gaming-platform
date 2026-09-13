// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        // Add active to clicked tab
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slides img');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
}

document.querySelector('.carousel-nav.next')?.addEventListener('click', () => {
    showSlide(++currentSlide);
});

document.querySelector('.carousel-nav.prev')?.addEventListener('click', () => {
    showSlide(--currentSlide);
});

// Set initial slide
if (slides.length > 0) {
    showSlide(0);
}

// Game card click to show details
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.game-card-info h3').textContent;
        alert('تم النقر على: ' + title);
    });
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
