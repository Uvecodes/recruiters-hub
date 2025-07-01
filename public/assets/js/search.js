// Search functionality for finding developers

// Wait for DOM and Firebase to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure firebase-config.js has loaded
    setTimeout(initializeFirebase, 100);
});

// Initialize Firebase and Firestore
function initializeFirebase() {
    try {
        // Check if Firebase is defined
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase is not defined. Make sure firebase-config.js is loaded before search.js');
            console.error('📁 Check that firebase-config.js exists and is properly referenced in HTML');
            return;
        }

        // Check if Firebase is initialized
        if (!firebase.apps || !firebase.apps.length) {
            console.error('❌ Firebase is not initialized. Make sure firebase-config.js initializes Firebase');
            console.error('🔧 Check firebase-config.js for proper Firebase.initializeApp() call');
            return;
        }

        // Initialize Firestore
        const db = firebase.firestore();
        
        // Export Firestore instance globally
        window.db = db;
        
        console.log('✅ Firebase and Firestore initialized successfully');
        console.log('📊 Firestore instance available as window.db');
        
        // Initialize search functionality after Firebase is ready
        initializeSearch();
        
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            stack: error.stack
        });
    }
}

// Initialize search functionality
function initializeSearch() {
    console.log('🔍 Initializing search functionality...');
    
    try {
    // Add event listeners for search keyword buttons
    const searchKeywordButtons = document.querySelectorAll('.search-keyword');
    console.log(`📝 Found ${searchKeywordButtons.length} search keyword buttons`);

    searchKeywordButtons.forEach(button => {
        button.addEventListener('click', async function () {
           const keyword = (this.getAttribute('data-keyword') || this.innerText.trim()).toLowerCase();
            const keywordLower = keyword.toLowerCase();

            console.log(`🔍 Search keyword clicked: "${keyword}"`);

            try {
                displaySearchResults([], 'Loading...');
                const results = await searchDevelopersByKeyword(keyword.toLowerCase());

                displaySearchResults(results, keyword);
            } catch (error) {
                console.log('❌ Error handling keyword button search:', error);
                displaySearchResults([], keyword, error.message);
            }
        });
    });

    // ✅ GPT solution integrated above
} catch (error) {
    console.error('❌ Error initializing search keyword buttons:', error);
}

    try{    
        // Add event listeners for keyword buttons (.keyword-btn)
        const keywordButtons = document.querySelectorAll('.keyword-btn');
        console.log(`🔘 Found ${keywordButtons.length} keyword buttons`);
        
        keywordButtons.forEach(button => {
            button.addEventListener('click', async function() {
                // Get keyword from data-keyword attribute or text content
                const keyword = this.getAttribute('data-keyword') || this.innerText.trim();
                console.log(`🔍 Keyword button clicked: "${keyword}"`);
                console.log(`[DEBUG] Raw keyword from button:`, JSON.stringify(keyword));

                
                try {
                    // Show loading state
                    displaySearchResults([], 'Loading...');
                    
                    // Call searchDevelopersByKeyword function
                    const results = await searchDevelopersByKeyword(keyword);
                    
                    // Display the results
                    displaySearchResults(results, keyword);
                    
                } catch (error) {
                    console.error('❌ Error handling keyword button click:', error);
                    displaySearchResults([], null, error.message);
                }
            });
        });
        
        // Initialize main search input functionality
        initializeMainSearch();
        
        console.log('✅ Search functionality initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing search functionality:', error);
    }
}

// Initialize main search input functionality
function initializeMainSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput) {
        console.warn('⚠️ Search input (#searchInput) not found');
        return;
    }
    
    if (!searchBtn) {
        console.warn('⚠️ Search button (#searchBtn) not found');
        return;
    }
    
    console.log('🔍 Initializing main search input functionality');
    
    // Add click event listener to search button
    searchBtn.addEventListener('click', function() {
        performMainSearch();
    });
    
    // Add Enter key event listener to search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if inside a form
            performMainSearch();
        }
    });
    
    // Add input event listener for real-time search (optional)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Set new timeout for debounced search (1 second delay)
        searchTimeout = setTimeout(() => {
            const keyword = this.value.trim();
            if (keyword.length >= 2) { // Only search if 2+ characters
                performMainSearch();
            }
        }, 1000);
    });
    
    console.log('✅ Main search input functionality initialized');
}

// Track last searched keyword to prevent redundant searches
let lastSearchedKeyword = '';

// Perform main search functionality
async function performMainSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.error('❌ Search input not found');
        return;
    }
    
    // Get and validate keyword
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        console.log('⚠️ Search input is empty');
        return;
    }
    
    // Check for redundant search
    if (keyword.toLowerCase() === lastSearchedKeyword.toLowerCase()) {
        console.log('⚠️ Same keyword searched, skipping redundant search');
        return;
    }
    
    console.log(`🔍 Performing main search for keyword: "${keyword}"`);
    
    try {
        // Update last searched keyword
        lastSearchedKeyword = keyword;
        
        // Show loading state
        renderSearchResults([]);
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <h3 style="margin-bottom: 1rem; color: #333;">🔍 Searching...</h3>
                    <p style="margin-bottom: 0.5rem;">Searching for developers with "${keyword}"</p>
                    <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 1rem auto;"></div>
                </div>
            `;
        }
        
        // Call searchDevelopersByKeyword function
       const results = await searchDevelopersByKeyword(keyword.toLowerCase());

        
        // Render results using renderSearchResults
        renderSearchResults(results);
        
        // Update search input placeholder to show last search
        searchInput.placeholder = `Last search: "${keyword}"`;
        
        console.log(`✅ Main search completed. Found ${results.length} results`);
        
    } catch (error) {
        console.error('❌ Error performing main search:', error);
        
        // Show error state
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #e53e3e;">
                    <h3 style="margin-bottom: 1rem; color: #e53e3e;">❌ Search Error</h3>
                    <p style="margin-bottom: 0.5rem;">Failed to search for "${keyword}"</p>
                    <p style="font-size: 0.9rem; color: #888;">Please try again or check your connection.</p>
                </div>
            `;
        }
        
        // Reset last searched keyword on error
        lastSearchedKeyword = '';
    }
}

// Filter profiles based on keyword
async function filterProfiles(keyword) {
    const searchResults = document.getElementById('developerResults');
    
    if (!searchResults) {
        console.error('❌ Search results container (#developerResults) not found');
        return;
    }
    
    console.log(`🔍 Filtering profiles for keyword: "${keyword}"`);
    
    // Show loading indicator
    searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Searching...</div>';
    
    try {
        // Check if Firestore is available
        if (!window.db) {
            throw new Error('Firestore is not initialized');
        }
        
        console.log('📊 Querying Firestore users collection...');
        
        // Query the users collection
        const usersRef = window.db.collection('users');
        const querySnapshot = await usersRef.get();
        
        console.log(`📊 Found ${querySnapshot.size} total users in database`);
        
        const matchingUsers = [];
        
        // Check each user for keyword matches
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userId = doc.id;
            
            // Check for case-insensitive partial matches in skills, role, and about
            const keywordLower = keyword.toLowerCase();
            const skillsMatch = (userData.skills || []).some(skill => 
                skill.toLowerCase().includes(keywordLower)
            );
            const roleMatch = (userData.role || '').toLowerCase().includes(keywordLower);
            const aboutMatch = (userData.about || '').toLowerCase().includes(keywordLower);
            
            if (skillsMatch || roleMatch || aboutMatch) {
                matchingUsers.push({
                    id: userId,
                    ...userData
                });
            }
        });
        
        console.log(`✅ Found ${matchingUsers.length} matching users`);
        
        // Handle no matches found
        if (matchingUsers.length === 0) {
            searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">No matching profiles found</div>';
            return;
        }
        
        // Generate HTML for matching users
        const resultsHTML = matchingUsers.map(user => {
            // Get top 3 skills
            const topSkills = (user.skills || []).slice(0, 3);
            
            // Truncate about section to 100 characters
            const aboutSnippet = (user.about || 'No description available').length > 100 
                ? (user.about || 'No description available').substring(0, 100) + '...'
                : (user.about || 'No description available');
            
            return `
                <div class="profile-card">
                    <div class="profile-header">
                        <img src="${user.avatarURL || 'assets/img/default-avatar.png'}" 
                             alt="${user.fullName || 'Developer'}" 
                             class="profile-avatar"
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                        <div class="profile-info">
                            <h3 class="profile-name">${user.fullName || 'Unknown Developer'}</h3>
                            <p class="profile-role">${user.role || 'Developer'}</p>
                        </div>
                    </div>
                    <div class="profile-body">
                        <p class="profile-about">${aboutSnippet}</p>
                        <div class="profile-skills">
                            ${topSkills.map(skill => 
                                `<span class="skill-tag" style="background: #667eea; color: white; padding: 0.5rem 0.75rem; border-radius: 20px; font-size: 0.85rem; margin: 0.25rem; display: inline-block;">${skill}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="profile-footer">
                        <a href="profile-2.html?uid=${user.id}" class="btn-primary" style="text-decoration: none; display: inline-block; text-align: center; background: #0a66c2; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.background='#004182'; this.style.boxShadow='0 2px 8px rgba(10, 102, 194, 0.3)'" onmouseout="this.style.background='#0a66c2'; this.style.boxShadow='none'">View Profile</a>
                    </div>
                </div>
            `;
        }).join('');
        
        // Inject results into searchResults container
        searchResults.innerHTML = resultsHTML;
        console.log('✅ Search results displayed successfully');
        
    } catch (error) {
        console.error('❌ Error filtering profiles:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            stack: error.stack
        });
        searchResults.innerHTML = '<div style="text-align: center; padding: 2rem; color: #e53e3e;">Error loading search results</div>';
    }
}

// Helper function to get Firestore instance
function getFirestore() {
    if (!window.db) {
        console.error('❌ Firestore is not initialized');
        return null;
    }
    return window.db;
}

// Search developers by keyword
async function searchDevelopersByKeyword(keyword) {
    console.log(`🔍 Searching for developers with keyword: "${keyword}"`);
    
    // Get search results container
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) {
        console.error('❌ Search results container (#searchResults) not found');
        throw new Error('Search results container not found');
    }
    
    // Reset and show loading state
    searchResults.innerHTML = `
        <div class="search-loading">
            <div class="loader"></div>
            <p>Searching for developers with "${keyword}"...</p>
        </div>
    `;
    
    try {
        // Check if Firestore is available
        if (!window.db) {
            throw new Error('Firestore is not initialized');
        }
        
        console.log('📊 Querying Firestore users collection...');
        
        // Query the users collection
        const usersRef = window.db.collection('users');
        const querySnapshot = await usersRef.get();
        
        console.log(`📋 Found ${querySnapshot.size} total users in collection`);
        
        // Filter users based on keyword
        const matchingUsers = [];
        
        querySnapshot.forEach(doc => {
            const userData = doc.data();
            const userId = doc.id;
            
            // Check if user data matches the keyword
            const keywordLower = keyword.toLowerCase();
            const role = (userData.role || '').toLowerCase();
            const skills = (userData.skills || []).map(skill => skill.toLowerCase()).join(' ');
            const about = (userData.about || '').toLowerCase();

            
            // Check if keyword matches role, skills, or about
            if (role.includes(keywordLower) || 
                skills.includes(keywordLower) || 
                about.includes(keywordLower)) {
                
                console.log(`✅ User ${userId} matches keyword "${keyword}"`);
                matchingUsers.push({
                    id: userId,
                    ...userData
                });
            }
        });
        
        console.log(`🎯 Found ${matchingUsers.length} users matching keyword "${keyword}"`);
        
        // Handle empty results
        if (matchingUsers.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No matching developers found</h3>
                    <p>No developers found with "${keyword}" in their role, skills, or description.</p>
                    <p>Try a different keyword or browse our developer categories below.</p>
                </div>
            `;
            return [];
        }
        
        return matchingUsers;
        
    } catch (error) {
        console.error('❌ Error searching developers:', error);
        
        // Show error message
        searchResults.innerHTML = `
            <div class="error-message">
                <h3>❌ Search Error</h3>
                <p>Something went wrong while searching for "${keyword}".</p>
                <p>Please try again later or check your connection.</p>
                <button onclick="window.search.searchDevelopersByKeyword('${keyword}')" class="retry-btn">
                    🔄 Try Again
                </button>
            </div>
        `;
        
        throw error;
    }
}

// Display search results in the searchResults container
function displaySearchResults(developers, keyword, errorMessage = null) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) {
        console.error('❌ Search results container (#searchResults) not found');
        return;
    }
    
    try {
        // Handle error state
        if (errorMessage) {
            searchResults.innerHTML = `
                <div class="error-message">
                    <h3>❌ Search Error</h3>
                    <p>${errorMessage}</p>
                    <p>Please try again later or check your connection.</p>
                </div>
            `;
            return;
        }
        
        // Handle loading state
        if (keyword === 'Loading...') {
            searchResults.innerHTML = `
                <div class="search-loading">
                    <div class="loader"></div>
                    <p>Please wait while we find matching developers...</p>
                </div>
            `;
            return;
        }
        
        // Handle no results
        if (!developers || developers.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No matching developers found</h3>
                    <p>No developers found with "${keyword}" in their role, skills, or description.</p>
                    <p>Try a different keyword or browse our developer categories below.</p>
                </div>
            `;
            return;
        }
        
        console.log(`📊 Displaying ${developers.length} search results for keyword: "${keyword}"`);
        
        // Generate HTML for matching developers
        const resultsHTML = developers.map(developer => {
            // Get top 3 skills
            const topSkills = (developer.skills || []).slice(0, 3);
            
            // Truncate about section to 120 characters
            const aboutSnippet = (developer.about || 'No description available').length > 120 
                ? (developer.about || 'No description available').substring(0, 120) + '...'
                : (developer.about || 'No description available');
            
            return `
                <div class="profile-card" style="background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e6e9ec;">
                    <div class="profile-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <img src="${developer.avatarURL || 'assets/img/default-avatar.png'}" 
                             alt="${developer.fullName || 'Developer'}" 
                             class="profile-avatar"
                             style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #dfe3e8;">
                        <div class="profile-info">
                            <h3 class="profile-name" style="margin: 0 0 0.25rem 0; color: #1a1a1a; font-size: 1.1rem; font-weight: 600;">${developer.fullName || 'Unknown Developer'}</h3>
                            <p class="profile-role" style="margin: 0; color: #5e6e7e; font-size: 0.9rem; font-weight: 500;">${developer.role || 'Developer'}</p>
                        </div>
                    </div>
                    <div class="profile-body" style="margin-bottom: 1rem;">
                        <p class="profile-about" style="color: #444; line-height: 1.5; margin-bottom: 1rem; font-size: 0.9rem;">${aboutSnippet}</p>
                        <div class="profile-skills" style="display: flex; flex-wrap: wrap; align-items: center;">
                            ${topSkills.map(skill => 
                                `<span class="skill-tag" style="background: #f3f6f9; color: #3a4f66; padding: 0.4rem 0.75rem; border-radius: 12px; font-size: 0.8rem; margin: 0.2rem; display: inline-block; font-weight: 500;">${skill}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="profile-footer" style="text-align: right;">
                        <a href="profile-2.html?uid=${developer.id}" class="btn-primary" style="text-decoration: none; display: inline-block; text-align: center; background: #0a66c2; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.background='#004182'; this.style.boxShadow='0 2px 8px rgba(10, 102, 194, 0.3)'" onmouseout="this.style.background='#0a66c2'; this.style.boxShadow='none'">View Profile</a>
                    </div>
                </div>
            `;
        }).join('');
        
        // Create the complete results HTML with header
        const completeResultsHTML = `
            <div style="margin-bottom: 2rem;">
                <h2 style="color: #333; margin-bottom: 0.5rem;">Search Results</h2>
                <p style="color: #666; margin: 0;">Found ${developers.length} developer${developers.length === 1 ? '' : 's'} for "${keyword}"</p>
            </div>
            <div class="developer-results-grid" style="display: grid; gap: 1.5rem;">
                ${resultsHTML}
            </div>
        `;
        
        // Inject results into searchResults container
        searchResults.innerHTML = completeResultsHTML;
        console.log('✅ Search results displayed successfully');
        
    } catch (error) {
        console.error('❌ Error displaying search results:', error);
        searchResults.innerHTML = `
            <div class="error-message">
                <h3>❌ Display Error</h3>
                <p>Failed to display search results. Please try again.</p>
                <button onclick="window.location.reload()" class="retry-btn">
                    🔄 Refresh Page
                </button>
            </div>
        `;
    }
}

// Render search results in the searchResults container
function renderSearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) {
        console.error('❌ Search results container (#searchResults) not found');
        return;
    }
    
    try {
        // Clear any previous content
        searchResults.innerHTML = '';
        
        // Handle no results
        if (!results || results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <h3>🔍 No Results Found</h3>
                    <p>No developers found for this keyword.</p>
                    <p>Try a different search term or browse our developer categories below.</p>
                </div>
            `;
            console.log('📝 Displayed no results message');
            return;
        }
        
        console.log(`📊 Rendering ${results.length} search results`);
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results-container';
        resultsContainer.style.cssText = 'display: grid; gap: 1.5rem; padding: 1rem 0;';
        
        // Render each developer card
        results.forEach(developer => {
            const developerCard = createDeveloperCard(developer);
            resultsContainer.appendChild(developerCard);
        });
        
        // Add results header
        const resultsHeader = document.createElement('div');
        resultsHeader.style.cssText = 'margin-bottom: 2rem; padding: 1rem 0; border-bottom: 1px solid #eee;';
        resultsHeader.innerHTML = `
            <h2 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.5rem;">Search Results</h2>
            <p style="margin: 0; color: #666;">Found ${results.length} developer${results.length === 1 ? '' : 's'}</p>
        `;
        
        // Append header and results to container
        searchResults.appendChild(resultsHeader);
        searchResults.appendChild(resultsContainer);
        
        console.log('✅ Search results rendered successfully');
        
    } catch (error) {
        console.error('❌ Error rendering search results:', error);
        searchResults.innerHTML = `
            <div class="error-message">
                <h3>❌ Render Error</h3>
                <p>Failed to render search results. Please try again.</p>
                <button onclick="window.location.reload()" class="retry-btn">
                    🔄 Refresh Page
                </button>
            </div>
        `;
    }
}

// Create individual developer card
function createDeveloperCard(developer) {
    const card = document.createElement('div');
    card.className = 'search-card';
    card.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        border: 1px solid #e6e9ec;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    });
    
    // Get developer data with fallbacks
    const name = developer.fullName || developer.name || 'Unknown Developer';
    const role = developer.role || developer.title || 'Developer';
    const avatar = developer.avatarURL || developer.profilePictureURL || 'assets/img/default-avatar.png';
    const skills = developer.skills || [];
    const about = developer.about || 'No description available';
    
    // Truncate about text to 120 characters
    const aboutSnippet = about.length > 120 ? about.substring(0, 120) + '...' : about;
    
    // Create skills badges (limit to 4 skills)
    const skillsHTML = skills.slice(0, 4).map(skill => 
        `<span class="skill-badge" style="
            background: #f3f6f9; 
            color: #3a4f66; 
            padding: 0.4rem 0.75rem; 
            border-radius: 12px; 
            font-size: 0.8rem; 
            margin: 0.2rem; 
            display: inline-block;
            font-weight: 500;
        ">${skill}</span>`
    ).join('');
    
    // Add "more skills" indicator if there are more than 4 skills
    const moreSkillsIndicator = skills.length > 4 ? 
        `<span style="color: #5e6e7e; font-size: 0.8rem; margin-left: 0.5rem;">+${skills.length - 4} more</span>` : '';
    
    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <img src="${avatar}" 
                 alt="${name}" 
                 style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #dfe3e8;">
            <div style="flex: 1;">
                <h3 style="margin: 0 0 0.25rem 0; color: #1a1a1a; font-size: 1.1rem; font-weight: 600;">${name}</h3>
                <p style="margin: 0; color: #5e6e7e; font-size: 0.9rem; font-weight: 500;">${role}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <p style="color: #444; line-height: 1.5; margin: 0 0 1rem 0; font-size: 0.9rem;">${aboutSnippet}</p>
            <div style="display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
                ${skillsHTML}
                ${moreSkillsIndicator}
            </div>
        </div>
        
        <div style="text-align: right;">
            <a href="profile-2.html?uid=${developer.id}" class="btn-primary" style="text-decoration: none; display: inline-block; text-align: center; background: #0a66c2; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; transition: background-color 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.background='#004182'; this.style.boxShadow='0 2px 8px rgba(10, 102, 194, 0.3)'" onmouseout="this.style.background='#0a66c2'; this.style.boxShadow='none'">View Profile</a>
        </div>
    `;
    
    return card;
}

// Export functions globally
window.search = {
    filterProfiles,
    getFirestore,
    initializeFirebase,
    searchDevelopersByKeyword,
    displaySearchResults,
    renderSearchResults,
    createDeveloperCard,
    performMainSearch,
    initializeMainSearch
};

// Add CSS animation for loading spinner and search styles
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Search Loading Styles */
    .search-loading {
        text-align: center;
        padding: 3rem 2rem;
        color: #666;
    }
    
    .search-loading .loader {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem auto;
    }
    
    .search-loading h3 {
        margin-bottom: 1rem;
        color: #333;
        font-size: 1.2rem;
    }
    
    .search-loading p {
        margin: 0;
        color: #666;
        font-size: 0.95rem;
    }
    
    /* No Results Styles */
    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        background: #f8f9fa;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        margin: 1rem 0;
    }
    
    .no-results h3 {
        margin-bottom: 1rem;
        color: #495057;
        font-size: 1.3rem;
        font-weight: 600;
    }
    
    .no-results p {
        margin-bottom: 0.5rem;
        color: #6c757d;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .no-results p:last-child {
        margin-bottom: 0;
        font-size: 0.9rem;
        color: #868e96;
    }
    
    /* Error Message Styles */
    .error-message {
        text-align: center;
        padding: 2rem;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 12px;
        color: #721c24;
        margin: 1rem 0;
    }
    
    .error-message h3 {
        margin-bottom: 1rem;
        color: #721c24;
        font-size: 1.2rem;
        font-weight: 600;
    }
    
    .error-message p {
        margin-bottom: 0.5rem;
        color: #721c24;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    
    .error-message p:last-of-type {
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: #856404;
    }
    
    /* Retry Button Styles */
    .retry-btn {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .retry-btn:hover {
        background: #c82333;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }
    
    .retry-btn:active {
        transform: translateY(0);
    }
    
    /* Search Results Grid */
    .search-results-container {
        display: grid;
        gap: 1.5rem;
        padding: 1rem 0;
    }
    
    /* Developer Card Hover Effects */
    .search-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    /* LinkedIn-style Profile Cards */
    .profile-card {
        background: white;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        border: 1px solid #e6e9ec;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .profile-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    /* LinkedIn-style Button */
    .btn-primary {
        background: #0a66c2 !important;
        color: white !important;
        border: none !important;
        padding: 0.5rem 1rem !important;
        border-radius: 6px !important;
        font-weight: 500 !important;
        font-size: 0.9rem !important;
        text-decoration: none !important;
        display: inline-block !important;
        transition: background-color 0.2s ease, box-shadow 0.2s ease !important;
    }
    
    .btn-primary:hover {
        background: #004182 !important;
        box-shadow: 0 2px 8px rgba(10, 102, 194, 0.3) !important;
        transform: none !important;
    }
    
    /* LinkedIn-style Skill Tags */
    .skill-tag, .skill-badge {
        background: #f3f6f9 !important;
        color: #3a4f66 !important;
        padding: 0.4rem 0.75rem !important;
        border-radius: 12px !important;
        font-size: 0.8rem !important;
        margin: 0.2rem !important;
        display: inline-block !important;
        font-weight: 500 !important;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .search-loading,
        .no-results,
        .error-message {
            padding: 2rem 1rem;
            margin: 0.5rem 0;
        }
        
        .search-loading .loader {
            width: 32px;
            height: 32px;
        }
        
        .no-results h3,
        .error-message h3 {
            font-size: 1.1rem;
        }
        
        .retry-btn {
            width: 100%;
            justify-content: center;
            padding: 1rem 1.5rem;
        }
    }
`;
document.head.appendChild(style);

console.log('📁 search.js loaded successfully'); 