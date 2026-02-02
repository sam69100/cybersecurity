// ========================================
// BOUTON RETOUR EN HAUT
// ========================================

const scrollTopBtn = document.getElementById('scrollTop');

// Afficher/masquer le bouton selon la position de scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// Remonter en haut au clic
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// NAVIGATION SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ANIMATIONS AU SCROLL
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes de services, stats, etc.
document.querySelectorAll('.service-card, .stat-card, .process-step, .why-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ========================================
// VALIDATION ET GESTION DU FORMULAIRE
// ========================================

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validation simple
        if (!data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        // Simulation d'envoi (à remplacer par un vrai appel API)
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ========================================
// FONCTION NOTIFICATION
// ========================================

function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter les styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Retirer la notification après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Ajouter les animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// HEADER STICKY AVEC EFFET
// ========================================

let lastScroll = 0;
const header = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scroll vers le bas - masquer le header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scroll vers le haut - afficher le header
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Ajouter la transition au header
header.style.transition = 'transform 0.3s ease';

// ========================================
// ANIMATION DES CHIFFRES (COMPTEUR)
// ========================================

function animateNumber(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Observer pour les statistiques
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const number = entry.target.querySelector('.stat-number');
            const text = number.textContent;
            
            // Extraire le nombre et le suffixe
            let targetValue;
            let suffix = '';
            
            if (text.includes('+')) {
                targetValue = parseInt(text.replace('+', ''));
                suffix = '+';
            } else if (text.includes('%')) {
                targetValue = parseFloat(text.replace('%', ''));
                suffix = '%';
            } else if (text.includes('/')) {
                // Pour 24/7, pas d'animation
                return;
            } else {
                targetValue = parseInt(text);
            }
            
            number.dataset.suffix = suffix;
            number.textContent = '0' + suffix;
            animateNumber(number, targetValue);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ========================================
// DÉTECTION DU NAVIGATEUR ET COMPATIBILITÉ
// ========================================

// Vérifier si le navigateur supporte IntersectionObserver
if (!('IntersectionObserver' in window)) {
    // Fallback pour les anciens navigateurs
    document.querySelectorAll('.service-card, .stat-card, .process-step').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}

// ========================================
// CONSOLE MESSAGE (SÉCURITÉ)
// ========================================

console.log('%c🛡️ Cybersecurity', 'font-size: 24px; font-weight: bold; color: #2563eb;');
console.log('%cAttention : N\'exécutez pas de code inconnu dans cette console. Cela pourrait compromettre votre sécurité.', 'font-size: 14px; color: #ef4444;');
console.log('%cSi quelqu\'un vous demande de copier/coller du code ici, il s\'agit probablement d\'une arnaque.', 'font-size: 12px; color: #f59e0b;');

// ========================================
// PERFORMANCE MONITORING
// ========================================

// Log du temps de chargement
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page chargée en ${Math.round(loadTime)}ms`);
});