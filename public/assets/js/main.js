// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize main application
    initializeApp();
    
    // Avatar update for dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardUserInfo();
    }
});

// Initialize main application
function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize authentication state
    initializeAuthState();
    
    // Initialize UI components
    initializeUIComponents();
    
    // Load featured developers
    loadFeaturedDevelopers();
}

// Initialize navigation
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Mobile menu toggle
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Initialize authentication state
function initializeAuthState() {
    // Check if user is authenticated
    const user = firebaseHelpers.getCurrentUser();
    
    if (user) {
        // User is authenticated
        updateUIForAuthenticatedUser(user);
    } else {
        // User is not authenticated
        updateUIForUnauthenticatedUser();
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (authButtons) {
        authButtons.style.display = 'none';
    }
    
    if (userMenu) {
        userMenu.style.display = 'flex';
        const userName = userMenu.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.displayName || user.email;
        }
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (authButtons) {
        authButtons.style.display = 'flex';
    }
    
    if (userMenu) {
        userMenu.style.display = 'none';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
}

// Initialize UI components
function initializeUIComponents() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize modals
    initializeModals();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize typewriter effect
    initializeTypewriter();
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    event.target.tooltip = tooltip;
}

// Hide tooltip
function hideTooltip(event) {
    if (event.target.tooltip) {
        event.target.tooltip.remove();
        event.target.tooltip = null;
    }
}

// Initialize modals
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize typewriter effect
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    
    if (!typewriterElement) {
        console.log('Typewriter element not found');
        return;
    }
    
    const originalText = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '2px solid #4a5568';
    
    let currentIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (!isDeleting) {
            // Typing phase
            if (currentIndex < originalText.length) {
                typewriterElement.textContent += originalText.charAt(currentIndex);
                currentIndex++;
                setTimeout(typeWriter, 100);
            } else {
                // Finished typing, wait then start deleting
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
            }
        } else {
            // Deleting phase
            if (currentIndex > 0) {
                typewriterElement.textContent = originalText.substring(0, currentIndex - 1);
                currentIndex--;
                setTimeout(typeWriter, 50);
            } else {
                // Finished deleting, wait then start typing again
                isDeleting = false;
                setTimeout(typeWriter, 1000);
            }
        }
    }
    
    // Start the typewriter effect
    setTimeout(typeWriter, 1000);
}

// Load featured developers
async function loadFeaturedDevelopers() {
    const featuredContainer = document.getElementById('featuredDevelopers');
    if (!featuredContainer) return;
    
    try {
        // Get featured developers from Firestore
        const usersRef = window.firebaseFunctions.doc(window.firebase.db, 'users');
        const q = window.firebaseFunctions.query(
            usersRef,
            window.firebaseFunctions.where('profileCompleted', '==', true),
            window.firebaseFunctions.where('featured', '==', true),
            window.firebaseFunctions.limit(6)
        );
        
        const querySnapshot = await window.firebaseFunctions.getDocs(q);
        const developers = [];
        
        querySnapshot.forEach((doc) => {
            developers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayFeaturedDevelopers(developers);
        
    } catch (error) {
        console.error('Error loading featured developers:', error);
        featuredContainer.innerHTML = '<p>Error loading featured developers</p>';
    }
}

// Display featured developers
function displayFeaturedDevelopers(developers) {
    const featuredContainer = document.getElementById('featuredDevelopers');
    if (!featuredContainer) return;
    
    if (developers.length === 0) {
        featuredContainer.innerHTML = '<p>No featured developers available</p>';
        return;
    }
    
    const developersHTML = developers.map(developer => `
        <div class="featured-developer" onclick="viewDeveloperProfile('${developer.id}')">
            <img src="${developer.avatarUrl || 'assets/img/default-avatar.png'}" alt="${developer.fullName}" class="developer-avatar">
            <h3>${developer.fullName}</h3>
            <p class="developer-title">${developer.title || 'Developer'}</p>
            <p class="developer-location">${developer.location || 'Location not specified'}</p>
            <div class="developer-skills">
                ${(developer.skills || []).slice(0, 3).map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
            </div>
        </div>
    `).join('');
    
    featuredContainer.innerHTML = developersHTML;
}

// View developer profile
function viewDeveloperProfile(developerId) {
    // Navigate to developer profile page
    window.location.href = `user-setting.html?id=${developerId}`;
}

// Export main functions
window.main = {
    viewDeveloperProfile
};

// Update dashboard user info from Firestore
async function updateDashboardUserInfo() {
    try {
        // Ensure Firebase is initialized
        if (!firebase.apps.length) return;
        
        const user = firebase.auth().currentUser;
        if (!user) return;
        
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Update user name
            const userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = userData.name || userData.fullName || 'User';
            }
            
            // Update user role
            const userRole = document.getElementById('userRole');
            if (userRole) {
                userRole.textContent = userData.role || 'Developer';
            }
            
            // Update user avatar
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                const avatarURL = userData.avatarURL || userData.profilePictureURL || 'assets/img/default-avatar.png';
                userAvatar.src = avatarURL;
            }
        } else {
            // Set default values if user document doesn't exist
            const userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = 'User';
            }
            
            const userRole = document.getElementById('userRole');
            if (userRole) {
                userRole.textContent = 'Developer';
            }
            
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                userAvatar.src = 'assets/img/default-avatar.png';
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        
        // Set fallback values on error
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = 'User';
        }
        
        const userRole = document.getElementById('userRole');
        if (userRole) {
            userRole.textContent = 'Developer';
        }
        
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.src = 'assets/img/default-avatar.png';
        }
        
        if (typeof showToast === 'function') {
            showToast('Could not load user data', 'error');
        }
    }
} 