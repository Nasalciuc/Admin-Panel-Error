// ========================================
// SIDEBAR NAVIGATION & ACTIVE STATES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
});

function initSidebar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPage) {
            // Set active state
            link.classList.add('bg-gray-800', 'text-white', 'rounded-lg');
            link.classList.remove('hover:text-white');
        } else {
            // Ensure non-active state
            link.classList.remove('bg-gray-800', 'rounded-lg');
            if (!link.classList.contains('text-white')) {
                link.classList.add('hover:text-white');
            }
        }
    });
}
