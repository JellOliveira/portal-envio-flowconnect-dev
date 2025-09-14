/* Conteúdo para public/js/components.js */
// Components JavaScript - FlowConnect Dev Portal

// Funções para Modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Evita rolagem do body quando modal aberto
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaura rolagem do body
    }
}

// Funções para Dropdown de Perfil
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Fechar dropdown ao clicar fora
document.addEventListener('click', (event) => {
    const profileMenu = document.querySelector('.profile-menu');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileMenu && profileDropdown && !profileMenu.contains(event.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Exportar funções para que possam ser acessadas globalmente no EJS
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleProfileDropdown = toggleProfileDropdown;