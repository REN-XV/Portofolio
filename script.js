// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Inisialisasi EmailJS
// GANTI dengan User ID Anda dari EmailJS
emailjs.init("ZqbyRI9fO2sZu5NqT");

// Form Submission dengan EmailJS
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const consent = document.getElementById('consent').checked;
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showFormMessage('Harap isi semua field yang wajib diisi!', 'error');
        return;
    }
    
    if (!consent) {
        showFormMessage('Anda harus menyetujui penggunaan data untuk komunikasi', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Format email tidak valid!', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Prepare template parameters
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: document.getElementById('my-email').textContent,
        date: new Date().toLocaleString('id-ID')
    };
    
    // GANTI dengan Service ID dan Template ID Anda dari EmailJS
    const serviceID = 'service_njma58k';
    const templateID = 'template_edmezqa';
    
    // Send email using EmailJS
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showFormMessage('Pesan berhasil dikirim! Saya akan membalas email Anda segera.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Log to console for debugging
            console.log('Email details:', {
                from: email,
                subject: subject,  
                message: message.substring(0, 50) + '...'
            });
        }, function(error) {
            console.log('FAILED...', error);
            
            // Fallback to alternative method if EmailJS fails
            if (error.status === 0 || error.status >= 500) {
                showFormMessage('Gagal mengirim pesan. Silakan coba lagi nanti atau hubungi langsung via email.', 'error');
                // Show email address for direct contact
                const myEmail = document.getElementById('my-email').textContent;
                console.log(`Silakan hubungi langsung ke: ${myEmail}`);
            } else {
                showFormMessage('Terjadi kesalahan saat mengirim pesan. ' + error.text, 'error');
            }
        })
        .finally(() => {
            // Reset button state
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        });
});

// Form message display
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Scroll to form message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '2000';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.3s ease-in-out';
    
    // Set color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#00ff9d';
        notification.style.color = '#000';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#3498db';
        notification.style.color = '#fff';
    } else {
        notification.style.backgroundColor = '#ff4757';
        notification.style.color = '#fff';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

//========================================================
// 3D Network Background with Three.js
//========================================================
let scene, camera, renderer, particles, linesRoot;
const particleCount = 180;
const maxConnectionDistance = 35;
const container = document.getElementById('canvas-container');

function initThreeJS() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if(container) container.appendChild(renderer.domElement);
    
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    // Sphere distribution
    for (let i = 0; i < particleCount * 3; i += 3) {
        const r = 55 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i] = r * Math.sin(phi) * Math.cos(theta); // x
        particlePositions[i+1] = r * Math.sin(phi) * Math.sin(theta); // y
        particlePositions[i+2] = r * Math.cos(phi); // z
        
        particleSpeeds.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00FF9D, // Neon Green (matches logo/accent)
        size: 0.9,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    linesRoot = new THREE.Group();
    scene.add(linesRoot);
    
    // Parallax Interaction
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.001;
        targetY = (e.clientY - window.innerHeight / 2) * 0.001;
    });
    
    // Animate
    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);
        
        scene.rotation.x += (targetY - scene.rotation.x) * 0.05;
        scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
        
        // Auto slow rotation
        scene.rotation.z += 0.0005;
        scene.rotation.y += 0.001;

        // Move particles slightly
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += particleSpeeds[i].x;
            positions[i3+1] += particleSpeeds[i].y;
            positions[i3+2] += particleSpeeds[i].z;
            
            // Constrain inside a radius sphere
            const r2 = positions[i3]*positions[i3] + positions[i3+1]*positions[i3+1] + positions[i3+2]*positions[i3+2];
            if(r2 > 3600) { // 60^2
                particleSpeeds[i].x *= -1;
                particleSpeeds[i].y *= -1;
                particleSpeeds[i].z *= -1;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Update connections
        while(linesRoot.children.length > 0){ 
            linesRoot.remove(linesRoot.children[0]); 
        }
        
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            for (let j = i + 1; j < particleCount; j++) {
                const j3 = j * 3;
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3+1] - positions[j3+1];
                const dz = positions[i3+2] - positions[j3+2];
                const distSq = dx*dx + dy*dy + dz*dz;
                
                if (distSq < maxConnectionDistance * maxConnectionDistance) {
                    linePositions.push(positions[i3], positions[i3+1], positions[i3+2]);
                    linePositions.push(positions[j3], positions[j3+1], positions[j3+2]);
                }
            }
        }
        
        if(linePositions.length > 0) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
                color: 0x00CCFF, // Cyan lines connecting the green nodes
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            }));
            linesRoot.add(lines);
        }
        
        renderer.render(scene, camera);
    }
    
    // Connect GSAP scroll to rotate 3D element smoothly
    if (typeof gsap !== 'undefined') {
        gsap.to(scene.rotation, {
            y: "+=" + Math.PI,
            x: "+=" + Math.PI/4,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });
    }
    
    animateThreeJS();
}

function resizeThreeJS() {
    if(camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start ThreeJS
window.addEventListener('load', () => {
    try {
        if (typeof THREE !== 'undefined') {
            initThreeJS();
        }
    } catch(e) {
        console.warn("Failed to init WebGL", e);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    resizeThreeJS();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to nav links on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Add typing effect to hero title
const heroTitle = document.querySelector('.hero-content h1');
const originalText = heroTitle.textContent;
let charIndex = 0;

function typeEffect() {
    if (charIndex < originalText.length) {
        heroTitle.textContent = originalText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeEffect, 100);
    }
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 500);
    
    // Initialize EmailJS with fallback message
    console.log('EmailJS initialized. Form kontak siap digunakan.');
    console.log('Untuk setup EmailJS:');
    console.log('1. Daftar di https://www.emailjs.com');
    console.log('2. Ganti ZqbyRI9fO2sZu5NqT dengan User ID Anda');
    console.log('3. Ganti service_njma58k dengan Service ID Anda');
    console.log('4. Ganti template_edmezqa dengan Template ID Anda');
});

// Image fallback for profile photo
const profileImage = document.getElementById('profileImage');
profileImage.addEventListener('error', function() {
    // If local image fails to load, use a placeholder
    this.src = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
    this.alt = 'Placeholder Network Engineer Image';
});

// Copy email to clipboard on click
document.getElementById('my-email').addEventListener('click', function() {
    const email = this.textContent;
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email berhasil disalin ke clipboard!', 'success');
    }).catch(err => {
        console.error('Gagal menyalin email: ', err);
        showNotification('Gagal menyalin email', 'error');
    });
});

// Certificate Modal Logic
const certModal = document.getElementById('certDetailModal');
const certCloseBtn = document.querySelector('.cert-close-btn');
const certCards = document.querySelectorAll('.cert-modal-trigger');

const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalDescription = document.getElementById('certModalDescription');
const certModalPdfBtn = document.getElementById('certModalPdfBtn');

// Open Modal
certCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const pdfUrl = card.getAttribute('data-pdf');
        const imgUrl = card.getAttribute('data-img');

        // Populate modal data
        certModalTitle.textContent = title;
        certModalDescription.textContent = desc;
        certModalPdfBtn.href = pdfUrl;
        certModalImage.src = imgUrl;

        // Show modal
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close Modal functionality
const closeCertModal = () => {
    certModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
};

if (certCloseBtn) {
    certCloseBtn.addEventListener('click', closeCertModal);
}

// Close when clicking outside modal content
window.addEventListener('click', (e) => {
    if (e.target === certModal) {
        closeCertModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

//========================================================
// Advanced Interactions and Animations (GSAP, Vanilla Tilt)
//========================================================

// Ensure libraries are loaded
window.addEventListener('load', () => {
    // 1. Initialize 3D Hover Tilt Effects for Cards & Buttons
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card, .cert-card, .image-container, .contact-form, .contact-icon, .stat"), {
            max: 12,
            speed: 500,
            glare: true,
            "max-glare": 0.15,
            perspective: 1200,
            scale: 1.02
        });
    }

    // 2. Initialize Premium Scroll Animations with GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Define smooth reveal elements
        const scrollElements = [
            { s: '.section-title', y: 40, opt: 0 },
            { s: '.about-text p, .about-text h3', y: 30, stg: 0.15 },
            { s: '.skill-tag', sck: 0.8, y: 20, stg: 0.05 },
            { s: '.project-card', y: 60, stg: 0.2 },
            { s: '.cert-card', y: 60, stg: 0.2 },
            { s: '.contact-info > *', x: -40, stg: 0.1 },
            { s: '.contact-form', x: 40 }
        ];

        scrollElements.forEach(item => {
            if(document.querySelector(item.s)) {
                gsap.from(item.s, {
                    scrollTrigger: {
                        trigger: document.querySelector(item.s).parentElement, // Use parent to avoid sudden layout pop
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: item.y || 0,
                    x: item.x || 0,
                    scale: item.sck || 1,
                    opacity: 0,
                    duration: 1.2,
                    stagger: item.stg || 0,
                    ease: "power3.out"
                });
            }
        });

        // Hero Parallax Elements on page load
        gsap.from(".hero-content > *", {
            y: 30, 
            opacity: 0, 
            duration: 1, 
            stagger: 0.1, 
            delay: 0.3, 
            ease: "power3.out"
        });
        
        gsap.from(".hero-image", {
            scale: 0.9,
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "back.out(1.4)"
        });
    }
});