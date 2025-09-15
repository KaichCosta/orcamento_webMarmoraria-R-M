// --- LÓGICA DO MENU HAMBÚRGUER ---
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Verifica se os elementos realmente existem antes de adicionar o evento
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            // Alterna a visibilidade do menu mobile
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        });
    }
});