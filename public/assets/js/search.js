// Search functionality for finding developers

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initializeSearch();
});

// Initialize search functionality
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const filtersForm = document.getElementById('filtersForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    if (searchInput) {
        // Add debounced search for real-time results
        const debouncedSearch = utils.debounce(handleSearch, 500);
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    if (filtersForm) {
        filtersForm.addEventListener('change', handleSearch);
    }
    
    // Load initial results
    loadSearchResults();
}

// Handle search
async function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    // Show loading state
    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    
    try {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        const filters = getSearchFilters();
        
        const results = await searchDevelopers(searchTerm, filters);
        displaySearchResults(results);
        
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="error">Error loading search results</div>';
    }
}

// Get search filters
function getSearchFilters() {
    const filtersForm = document.getElementById('filtersForm');
    if (!filtersForm) return {};
    
    const formData = new FormData(filtersForm);
    return {
        role: formData.get('role'),
        location: formData.get('location'),
        experience: formData.get('experience'),
        availability: formData.get('availability'),
        hourlyRate: formData.get('hourlyRate')
    };
}

// Search developers in Firestore
async function searchDevelopers(searchTerm, filters) {
    try {
        // Get all users with completed profiles
        const usersRef = window.firebaseFunctions.doc(window.firebase.db, 'users');
        const q = window.firebaseFunctions.query(
            usersRef,
            window.firebaseFunctions.where('profileCompleted', '==', true)
        );
        
        const querySnapshot = await window.firebaseFunctions.getDocs(q);
        const users = [];
        
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (matchesSearchCriteria(userData, searchTerm, filters)) {
                users.push({
                    id: doc.id,
                    ...userData
                });
            }
        });
        
        return users;
        
    } catch (error) {
        console.error('Error searching developers:', error);
        throw error;
    }
}

// Check if user matches search criteria
function matchesSearchCriteria(userData, searchTerm, filters) {
    // Search term matching
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchableFields = [
            userData.fullName,
            userData.title,
            userData.about,
            userData.skills?.join(' '),
            userData.location
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchLower)) {
            return false;
        }
    }
    
    // Filter matching
    if (filters.role && userData.role !== filters.role) {
        return false;
    }
    
    if (filters.location && userData.location !== filters.location) {
        return false;
    }
    
    if (filters.experience && userData.experience !== filters.experience) {
        return false;
    }
    
    if (filters.availability && userData.availability !== filters.availability) {
        return false;
    }
    
    if (filters.hourlyRate && userData.hourlyRate > filters.hourlyRate) {
        return false;
    }
    
    return true;
}

// Display search results
function displaySearchResults(developers) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (developers.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No developers found matching your criteria</div>';
        return;
    }
    
    const resultsHTML = developers.map(developer => `
        <div class="developer-card" onclick="viewDeveloperProfile('${developer.id}')">
            <div class="developer-header">
                <img src="${developer.avatarUrl || 'assets/img/default-avatar.png'}" alt="${developer.fullName}" class="developer-avatar">
                <div class="developer-info">
                    <h3>${developer.fullName}</h3>
                    <p class="developer-title">${developer.title || 'Developer'}</p>
                    <p class="developer-location">${developer.location || 'Location not specified'}</p>
                </div>
                <div class="developer-rate">
                    <span class="rate">$${developer.hourlyRate || 'N/A'}/hr</span>
                </div>
            </div>
            <div class="developer-body">
                <p class="developer-about">${developer.about || 'No description available'}</p>
                <div class="developer-skills">
                    ${(developer.skills || []).slice(0, 5).map(skill => 
                        `<span class="skill-tag">${skill}</span>`
                    ).join('')}
                    ${developer.skills && developer.skills.length > 5 ? 
                        `<span class="skill-tag">+${developer.skills.length - 5} more</span>` : ''
                    }
                </div>
            </div>
            <div class="developer-footer">
                <span class="availability ${developer.availability || 'unknown'}">${developer.availability || 'Unknown'}</span>
                <button class="btn-primary" onclick="event.stopPropagation(); contactDeveloper('${developer.id}')">Contact</button>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Load initial search results
async function loadSearchResults() {
    await handleSearch();
}

// View developer profile
function viewDeveloperProfile(developerId) {
    // Navigate to developer profile page
    window.location.href = `user-setting.html?id=${developerId}`;
}

// Contact developer
async function contactDeveloper(developerId) {
    // Open contact modal or navigate to contact page
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'block';
        // Set the developer ID for the contact form
        const developerIdInput = document.getElementById('developerId');
        if (developerIdInput) {
            developerIdInput.value = developerId;
        }
    } else {
        // Navigate to contact page
        window.location.href = `contact.html?developer=${developerId}`;
    }
}

// Export search functions
window.search = {
    handleSearch,
    viewDeveloperProfile,
    contactDeveloper
}; 