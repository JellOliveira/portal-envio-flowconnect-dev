/* Conteúdo para public/js/flowconnect.js */
// Main JavaScript - FlowConnect Dev Portal

// DOM Elements
const elements = {
    profileBtn: document.getElementById("profileBtn"),
    profileDropdown: document.getElementById("profileDropdown"),
    contactBtn: document.getElementById("contactBtn"),
    helpBtn: document.getElementById("helpBtn"),
    supportBtn: document.getElementById("supportBtn"),
    helpDropdownBtn: document.getElementById("helpDropdownBtn"),
    whatsappFloat: document.getElementById("whatsappFloat"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    toastContainer: document.getElementById("toastContainer")
};

// State Management
const state = {
    activeModal: null,
    dropdownOpen: false,
    mobileMenuOpen: false
};

// Initialize Application
document.addEventListener("DOMContentLoaded", function() {
    initializeEventListeners();
    initializeScrollAnimations();
    setMinDateTime();
    console.log("FlowConnect Portal initialized successfully");
});

// Event Listeners
function initializeEventListeners() {
    // Profile dropdown
    if (elements.profileBtn) {
        elements.profileBtn.addEventListener("click", toggleProfileDropdown);
    }

    // Navigation buttons
    if (elements.contactBtn) {
        elements.contactBtn.addEventListener("click", () => openModal("contacts-modal"));
    }
    
    if (elements.helpBtn) {
        elements.helpBtn.addEventListener("click", () => openModal("help-modal"));
    }

    if (elements.supportBtn) {
        elements.supportBtn.addEventListener("click", () => {
            closeDropdown();
            openModal("contacts-modal");
        });
    }

    if (elements.helpDropdownBtn) {
        elements.helpDropdownBtn.addEventListener("click", () => {
            closeDropdown();
            openModal("help-modal");
        });
    }

    // WhatsApp float button
    if (elements.whatsappFloat) {
        elements.whatsappFloat.addEventListener("click", () => {
            window.open("https://wa.me/5571938508252", "_blank");
        });
    }

    // Mobile menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener("click", toggleMobileMenu);
    }

    // Modal close buttons
    document.querySelectorAll(".modal-close, .close-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const modalId = e.target.closest(".modal").id;
            closeModal(modalId);
        });
    });

    // Close modals on backdrop click
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".profile-menu")) {
            closeDropdown();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation);

    // Logout functionality
    document.querySelectorAll(".logout").forEach(btn => {
        btn.addEventListener("click", handleLogout);
    });
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
    if (state.dropdownOpen) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

function openDropdown() {
    if (elements.profileDropdown) {
        elements.profileDropdown.classList.add("show");
        state.dropdownOpen = true;
    }
}

function closeDropdown() {
    if (elements.profileDropdown) {
        elements.profileDropdown.classList.remove("show");
        state.dropdownOpen = false;
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("show");
        state.activeModal = modalId;
        document.body.style.overflow = "hidden";
        
        const firstFocusable = modal.querySelector("button, input, textarea, select");
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("show");
        state.activeModal = null;
        document.body.style.overflow = "";
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (!mobileMenu) {
        createMobileMenu();
    }
    
    if (state.mobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function createMobileMenu() {
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
        <div class="mobile-menu-items">
            <button class="mobile-menu-item" onclick="openModal(\'contacts-modal\')">Contatos</button>
            <button class="mobile-menu-item" onclick="openModal(\'help-modal\')">Ajuda</button>
            <button class="mobile-menu-item logout">Sair</button>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    mobileMenu.querySelector(".logout").addEventListener("click", handleLogout);
}

function openMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
        mobileMenu.classList.add("show");
        state.mobileMenuOpen = true;
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
        mobileMenu.classList.remove("show");
        state.mobileMenuOpen = false;
    }
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    if (e.key === "Escape") {
        if (state.activeModal) {
            closeModal(state.activeModal);
        }
        if (state.dropdownOpen) {
            closeDropdown();
        }
        if (state.mobileMenuOpen) {
            closeMobileMenu();
        }
    }
    
    if (e.key === "Tab" && state.activeModal) {
        handleModalTabNavigation(e);
    }
}

function handleModalTabNavigation(e) {
    const modal = document.getElementById(state.activeModal);
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
        "button, input, textarea, select, a[href], [tabindex]:not([tabindex=\"-1\"])"
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
}

// Logout Function
function handleLogout() {
    showToast("Logout realizado com sucesso!", "success");
    
    setTimeout(() => {
        console.log("User logged out");
        window.location.href = "/logout.html";
    }, 1000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            }
        });
    }, observerOptions);
    
    document.querySelectorAll(".scroll-reveal").forEach(el => {
        observer.observe(el);
    });
}

// Set minimum date/time for datetime inputs
function setMinDateTime() {
   
}

// Toast Notification System
function showToast(message, type = "info", duration = 5000) {
    const toast = createToastElement(message, type);
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);
    
    const progressBar = toast.querySelector(".toast-progress");
    if (progressBar) {
        progressBar.style.animationDuration = `${duration}ms`;
    }
    
    setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    return toast;
}

function createToastElement(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ"
    };
    
    const titles = {
        success: "Sucesso",
        error: "Erro",
        warning: "Atenção",
        info: "Informação"
    };
    
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-title">${icons[type]} ${titles[type]}</div>
            <button class="toast-close" onclick="removeToast(this.closest(\".toast\"))">
                <i data-lucide="x"></i>
            </button>
        </div>
        <div class="toast-message">${message}</div>
        <div class="toast-progress"></div>
    `;
    
    setTimeout(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 0);
    
    return toast;
}

function removeToast(toast) {
    if (toast && toast.parentNode) {
        toast.classList.remove("show");
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Error Handling
window.addEventListener("error", (e) => {
    console.error("Global error:", e.error);
    showToast("Ocorreu um erro inesperado. Tente novamente.", "error");
});

window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
    showToast("Erro de conexão. Verifique sua internet.", "error");
});

// Export functions for global access
window.FlowConnect = {
    openModal,
    closeModal,
    showToast,
    removeToast
};