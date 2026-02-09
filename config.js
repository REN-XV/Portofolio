// config.js - File konfigurasi untuk EmailJS
// GANTI nilai-nilai ini dengan informasi dari dashboard EmailJS Anda

const EMAILJS_CONFIG = {
    USER_ID: "ZqbyRI9fO2sZu5NqT",           // User ID dari Integration
    SERVICE_ID: "service_njma58k",     // Service ID dari Email Services
    TEMPLATE_ID: "template_edmezqa",   // Template ID dari Email Templates
    MY_EMAIL: "galang.colab12@gmail.com" // Email Anda yang akan menerima pesan
};

// Jika Anda ingin menggunakan file terpisah untuk konfigurasi,
// tambahkan di index.html: <script src="config.js"></script>
// dan di script.js ganti dengan: emailjs.init(EMAILJS_CONFIG.USER_ID);