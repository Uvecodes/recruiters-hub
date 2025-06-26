// Utility functions for the application

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast`;
    notification.innerHTML = `
        ${message}
        <span class="close-btn" onclick="this.parentElement.remove()">&times;</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 400);
        }
    }, 3000);
}

// Set loading state for buttons
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
    }
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Debounce function
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

// Throttle function
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

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// Export utility functions
window.utils = {
    showNotification,
    setLoadingState,
    validateEmail,
    validatePassword,
    formatDate,
    formatCurrency,
    debounce,
    throttle,
    generateId,
    copyToClipboard
}; 