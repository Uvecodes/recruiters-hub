// Profile-2.js - View-only user settings page for recruiters
console.log('📄 profile-2.js loaded');

// Global variables
// let db = null;
let currentUserId = null;

// Initialize the profile page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing profile page...');
    
    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentUserId = urlParams.get('uid');
    
    if (!currentUserId) {
        console.error('❌ No UID provided in URL');
        showError('No user ID provided. Please return to the search page.');
        return;
    }
    
    console.log(`👤 Loading profile for user: ${currentUserId}`);
    
    // Initialize Firebase and load profile
    initializeFirebase();
});

// Initialize Firebase
async function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');
        
        // Check if Firebase is already initialized
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK not loaded');
        }
        
        // Initialize Firestore
        const db = firebase.firestore();
        console.log('✅ Firebase initialized successfully');
        
        // Load profile data
        await loadProfileData();
        
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        showError('Failed to initialize the application. Please refresh the page.');
    }
}

// Load profile data from Firestore
async function loadProfileData() {
    try {
        console.log(`📊 Fetching profile data for user: ${currentUserId}`);
        
        // Show loading state
        showLoading();
        
        // Fetch user document from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(currentUserId).get();
        
        if (!userDoc.exists) {
            console.error('❌ User document not found');
            showError('User profile not found. The developer may have removed their profile.');
            return;
        }
        
        const userData = userDoc.data();
        console.log('✅ Profile data fetched successfully:', userData);
        
        // Render profile data
        renderProfile(userData);
        
    } catch (error) {
        console.error('❌ Error loading profile data:', error);
        showError('Failed to load profile data. Please try again later.');
    }
}

// Render profile data
function renderProfile(userData) {
    try {
        console.log('🎨 Rendering profile data...');
        
        // Hide loading state
        hideLoading();
        
        // Render basic info
        renderBasicInfo(userData);
        
        // Render about section
        renderAboutSection(userData);
        
        // Render skills section
        renderSkillsSection(userData);
        
        // Render education section
        renderEducationSection(userData);
        
        // Render projects section
        renderProjectsSection(userData);
        
        // Render social links
        renderSocialLinks(userData);
        
        // Show profile content
        document.getElementById('profileContent').style.display = 'block';
        
        console.log('✅ Profile rendered successfully');
        
    } catch (error) {
        console.error('❌ Error rendering profile:', error);
        showError('Failed to render profile. Please refresh the page.');
    }
}

// Render basic profile information
function renderBasicInfo(userData) {
    // Avatar
    const avatar = document.getElementById('profileAvatar');
    avatar.src = userData.avatarURL || userData.profilePictureURL || 'assets/img/default-avatar.png';
    avatar.alt = userData.fullName || userData.name || 'Developer';
    
    // Name
    const name = document.getElementById('profileName');
    name.textContent = userData.fullName || userData.name || 'Unknown Developer';
    
    // Role
    const role = document.getElementById('profileRole');
    role.textContent = userData.role || userData.title || 'Developer';
    
    // Availability
    const availabilityBadge = document.getElementById('availabilityBadge');
    if (userData.available === true) {
        availabilityBadge.textContent = 'Available';
        availabilityBadge.style.color = '#137333';
    } else if (userData.available === false) {
        availabilityBadge.textContent = 'Not Available';
        availabilityBadge.style.color = '#c5221f';
    } else {
        availabilityBadge.textContent = 'N/A';
        availabilityBadge.style.color = '#868e96';
    }
    
    // Pay Rate
    const payRate = document.getElementById('payRate');
    if (userData.payRate) {
        payRate.textContent = `$${userData.payRate}/hour`;
    } else {
        payRate.textContent = 'Not specified';
    }
    
    // Resume button
    const resumeBtn = document.getElementById('resumeBtn');
    if (userData.resumeURL) {
        resumeBtn.href = userData.resumeURL;
        resumeBtn.style.display = 'inline-flex';
        resumeBtn.addEventListener('click', function(e) {
            if (!userData.resumeURL) {
                e.preventDefault();
                alert('Resume link not available');
            }
        });
    } else {
        resumeBtn.style.display = 'none';
    }
}

// Render about section
function renderAboutSection(userData) {
    const aboutText = document.getElementById('aboutText');
    const about = userData.about || userData.description || userData.bio;
    
    if (about && about.trim()) {
        aboutText.textContent = about;
    } else {
        aboutText.textContent = 'No description available.';
        aboutText.style.color = '#868e96';
        aboutText.style.fontStyle = 'italic';
    }
}

// Render skills section
function renderSkillsSection(userData) {
    const skillsGrid = document.getElementById('skillsGrid');
    const skills = userData.skills || [];
    
    if (skills.length > 0) {
        // Limit to 10 skills for display
        const displaySkills = skills.slice(0, 10);
        const skillsHTML = displaySkills.map(skill => 
            `<span class="skill-badge">${skill}</span>`
        ).join('');
        
        let fullHTML = skillsHTML;
        
        // Add "more skills" indicator if there are more than 10
        if (skills.length > 10) {
            fullHTML += `<span style="color: #868e96; font-size: 0.85rem; margin-left: 0.5rem;">+${skills.length - 10} more</span>`;
        }
        
        skillsGrid.innerHTML = fullHTML;
    } else {
        skillsGrid.innerHTML = '<p class="empty-state">No skills listed</p>';
    }
}

// Render education section
function renderEducationSection(userData) {
    const educationList = document.getElementById('educationList');
    const education = userData.education || [];
    
    if (education.length > 0) {
        const educationHTML = education.map(edu => `
            <div class="education-item">
                <div class="education-school">${edu.school || 'School not specified'}</div>
                <div class="education-degree">${edu.degree || 'Degree not specified'}</div>
                <div class="education-period">${edu.period || edu.years || 'Period not specified'}</div>
            </div>
        `).join('');
        
        educationList.innerHTML = educationHTML;
    } else {
        educationList.innerHTML = '<p class="empty-state">No education information available</p>';
    }
}

// Render projects section
function renderProjectsSection(userData) {
    const projectsList = document.getElementById('projectsList');
    const projects = userData.projects || [];
    
    if (projects.length > 0) {
        const projectsHTML = projects.map(project => `
            <div class="project-item">
                <div class="project-name">${project.name || 'Project name not specified'}</div>
                <div class="project-description">${project.description || 'No description available'}</div>
                ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project →</a>` : ''}
            </div>
        `).join('');
        
        projectsList.innerHTML = projectsHTML;
    } else {
        projectsList.innerHTML = '<p class="empty-state">No projects listed</p>';
    }
}

// Render social links
function renderSocialLinks(userData) {
    const socialLinks = document.getElementById('socialLinks');
    const socialData = {
        linkedin: userData.linkedin,
        github: userData.github,
        twitter: userData.twitter,
        portfolio: userData.portfolio,
        website: userData.website
    };
    
    const availableLinks = Object.entries(socialData).filter(([key, value]) => value && value.trim());
    
    if (availableLinks.length > 0) {
        const socialHTML = availableLinks.map(([platform, url]) => {
            const platformInfo = getPlatformInfo(platform);
            return `
                <a href="${url}" class="social-link" target="_blank">
                    <div class="social-icon">${platformInfo.icon}</div>
                    <span>${platformInfo.name}</span>
                </a>
            `;
        }).join('');
        
        socialLinks.innerHTML = socialHTML;
    } else {
        socialLinks.innerHTML = '<p class="empty-state">No social links available</p>';
    }
}

// Get platform information for social links
function getPlatformInfo(platform) {
    const platforms = {
        linkedin: { name: 'LinkedIn', icon: '💼' },
        github: { name: 'GitHub', icon: '🐙' },
        twitter: { name: 'Twitter', icon: '🐦' },
        portfolio: { name: 'Portfolio', icon: '🎨' },
        website: { name: 'Website', icon: '🌐' }
    };
    
    return platforms[platform] || { name: platform.charAt(0).toUpperCase() + platform.slice(1), icon: '🔗' };
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('profileContent').style.display = 'none';
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

// Show error state
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('profileContent').style.display = 'none';
    
    const errorState = document.getElementById('errorState');
    const errorMessage = errorState.querySelector('p');
    errorMessage.textContent = message;
    errorState.style.display = 'block';
}

// Export functions globally for debugging
window.profile2 = {
    initializeFirebase,
    loadProfileData,
    renderProfile,
    showError
};

console.log('✅ profile-2.js initialization complete'); 