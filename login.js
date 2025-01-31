// Cek apakah user sudah login
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// Fungsi untuk login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Contoh autentikasi sederhana
    if (username === 'Vembi' && password === '181107') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'lamp.html'; // Redirect ke halaman utama
    } else {
        alert('Username atau password salah!');
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}
