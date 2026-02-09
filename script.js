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

// Network Animation Canvas (tetap sama seperti sebelumnya)
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Nodes for network animation
const nodes = [];
const nodeCount = 40;

// Create nodes
for (let i = 0; i < nodeCount; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
        color: `rgba(0, 255, 157, ${Math.random() * 0.5 + 0.1})`
    });
}

// Draw network animation
function drawNetwork() {
    // Clear canvas with slight fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw nodes
    nodes.forEach(node => {
        // Update position
        node.x += node.speedX;
        node.y += node.speedY;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
        
        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Draw glow effect
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 157, 0.05)`;
        ctx.fill();
    });
    
    // Draw connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Draw line if nodes are close enough
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(0, 255, 157, ${0.2 * (1 - distance/150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    
    // Draw some random data packets
    if (Math.random() < 0.05) {
        drawDataPacket();
    }
    
    // Continue animation
    requestAnimationFrame(drawNetwork);
}

// Draw random data packets
function drawDataPacket() {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    const endX = Math.random() * canvas.width;
    const endY = Math.random() * canvas.height;
    
    // Animate packet
    let progress = 0;
    const packetRadius = 3;
    
    function animatePacket() {
        progress += 0.02;
        if (progress > 1) return;
        
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        
        // Draw packet
        ctx.beginPath();
        ctx.arc(x, y, packetRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 204, 255, 0.8)';
        ctx.fill();
        
        // Draw trail
        ctx.beginPath();
        ctx.arc(x, y, packetRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 204, 255, 0.2)';
        ctx.fill();
        
        requestAnimationFrame(animatePacket);
    }
    
    animatePacket();
}

// Start animation
drawNetwork();

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
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