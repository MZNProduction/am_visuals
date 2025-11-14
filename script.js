const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particles
let particles = [];
const particleCount = 150;
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        baseSize: Math.random() * 2 + 1,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.5 - 0.75
    });
}

// Mouse tracking
let mouse = { x: null, y: null };
window.addEventListener("mousemove", function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Particle animation
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        let drawLine = false;
        if (mouse.x && mouse.y) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) { 
                drawLine = true;
                let angle = Math.atan2(dy, dx);
                let force = (150 - dist) / 150 * 1.5;
                p.x += Math.cos(angle) * force;
                p.y += Math.sin(angle) * force;
            }
        }

        p.size = p.baseSize + Math.sin(Date.now()/500 + p.x) * 0.5;

        ctx.fillStyle = "#ffbd59";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();

        if (drawLine) {
            for (let j = 0; j < particles.length; j++) {
                if (particles[j] === p) continue;
                let dx = p.x - particles[j].x;
                let dy = p.y - particles[j].y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) { 
                    ctx.strokeStyle = "rgba(255,189,89,0.25)";
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    });

    requestAnimationFrame(animate);
}
animate();

// Warp hover effect
const h1Container = document.querySelector(".center-content");
const btn = document.querySelector(".btn");

btn.addEventListener("mouseenter", () => {
    h1Container.style.transform = "translateY(-5px)";
    particles.forEach(p => {
        p.speedX *= 1.5;
        p.speedY *= 1.5;
    });
});

btn.addEventListener("mouseleave", () => {
    h1Container.style.transform = "translateY(0)";
    particles.forEach(p => {
        p.speedX /= 1.5;
        p.speedY /= 1.5;
    });
});

// Modal elements
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

// Content sections
const infoContact = document.getElementById("infoContact");
const videoGallery = document.getElementById("videoGallery");
const photoGallery = document.getElementById("photoGallery");

// Mode buttons
const infoModeBtn = document.getElementById("infoModeBtn");
const videoModeBtn = document.getElementById("videoModeBtn");
const photoModeBtn = document.getElementById("photoModeBtn");

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption-text');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// Current active mode
let currentMode = 'info';
let currentPhotoIndex = 0;
let photos = [];

// Άνοιγμα modal
openModal.addEventListener("click", () => {
    h1Container.style.opacity = "0";
    btn.style.opacity = "0";

    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
        setActiveMode('info');
        // Initialize photos array
        photos = Array.from(document.querySelectorAll('.photo-item img'));
    }, 50);
});

// Κλείσιμο modal
function closeModalFunction() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        h1Container.style.opacity = "1";
        btn.style.opacity = "1";
    }, 500);
}

closeModal.addEventListener("click", closeModalFunction);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFunction();
    }
});

// Set active mode function
function setActiveMode(mode) {
    // Remove active class from all sections and buttons
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to current mode
    switch(mode) {
        case 'info':
            infoContact.classList.add('active');
            infoModeBtn.classList.add('active');
            break;
        case 'video':
            videoGallery.classList.add('active');
            videoModeBtn.classList.add('active');
            break;
        case 'photo':
            photoGallery.classList.add('active');
            photoModeBtn.classList.add('active');
            break;
    }
    
    currentMode = mode;
}

// Mode button event listeners
infoModeBtn.addEventListener('click', () => {
    if (currentMode !== 'info') {
        setActiveMode('info');
    }
});

videoModeBtn.addEventListener('click', () => {
    if (currentMode !== 'video') {
        setActiveMode('video');
    }
});

photoModeBtn.addEventListener('click', () => {
    if (currentMode !== 'photo') {
        setActiveMode('photo');
    }
});

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize photos array
    photos = Array.from(document.querySelectorAll('.photo-item img'));
    
    // Add click event to all photos
    photos.forEach((photo, index) => {
        photo.addEventListener('click', function() {
            currentPhotoIndex = index;
            openLightbox(this.src, this.alt);
        });
    });
});

// Open lightbox function
function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxCaption.textContent = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox function
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Lightbox navigation
lightboxPrev.addEventListener('click', showPrevPhoto);
lightboxNext.addEventListener('click', showNextPhoto);

function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    openLightbox(photos[currentPhotoIndex].src, photos[currentPhotoIndex].alt);
}

function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    openLightbox(photos[currentPhotoIndex].src, photos[currentPhotoIndex].alt);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextPhoto();
        } else if (e.key === 'ArrowLeft') {
            showPrevPhoto();
        }
    }
});

// Responsive canvas
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});