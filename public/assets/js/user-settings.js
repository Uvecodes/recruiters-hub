// User Settings Page JavaScript

// Global Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Clear any existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user settings page
    initializeUserSettings();
});

// Global variable to store current skills, experiences, education, and projects
let currentSkills = [];
let currentExperiences = [];
let currentEducation = [];
let currentProjects = [];
let currentContact = { email: '', phone: '', location: '' };
let currentAvailability = { status: 'Available', hourlyRate: '', workPreference: 'Remote' };
let currentResumeURL = '';
let currentSocialLinks = { linkedin: '', github: '', portfolio: '' };
let editingExperienceIndex = -1; // -1 means not editing, >= 0 means editing that index
let editingEducationIndex = -1; // -1 means not editing, >= 0 means editing that index
let editingProjectIndex = -1; // -1 means not editing, >= 0 means editing that index
let currentAvatarURL = '';

// Initialize user settings page
function initializeUserSettings() {
    // Check authentication state
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in, load their profile data
            console.log('User is authenticated:', user.email);
            loadUserProfile(user.uid);
            setupSaveButton(user.uid);
            setupSkillsInterface();
            setupExperienceInterface();
            setupEducationInterface();
            setupProjectInterface();
            setupContactInterface();
            setupAvailabilityInterface();
            setupResumeInterface();
            setupSocialLinksInterface();
            setupAvatarUpload();
            setupContactModal();
        } else {
            // User is not logged in, redirect to index.html
            console.log('User is not authenticated, redirecting to index.html');
            window.location.href = 'index.html';
        }
    });
}

// Setup project interface
function setupProjectInterface() {
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', openProjectModal);
    }
    
    // Setup modal close functionality
    const closeModal = document.querySelector('.project-modal .close');
    if (closeModal) {
        closeModal.addEventListener('click', closeProjectModal);
    }
    
    // Setup modal form submission
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProjectFromModal();
        });
    }
}

// Open project modal for adding/editing
function openProjectModal(projectIndex = -1) {
    editingProjectIndex = projectIndex;
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');
    
    if (modal && modalTitle && form) {
        if (projectIndex >= 0 && currentProjects[projectIndex]) {
            // Editing existing project
            const project = currentProjects[projectIndex];
            modalTitle.textContent = 'Edit Project';
            
            // Populate form with existing data
            document.getElementById('projectTitle').value = project.title || '';
            document.getElementById('projectDescription').value = project.description || '';
            document.getElementById('projectLink').value = project.link || '';
        } else {
            // Adding new project
            modalTitle.textContent = 'Add New Project';
            
            // Clear form
            form.reset();
        }
        
        modal.style.display = 'block';
    }
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        editingProjectIndex = -1;
    }
}

// Save project from modal
function saveProjectFromModal() {
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const link = document.getElementById('projectLink').value.trim();
    
    if (!title || !description) {
        alert('Please fill in all required fields (Title, Description)');
        return;
    }
    
    const project = {
        title,
        description,
        link
    };
    
    if (editingProjectIndex >= 0) {
        // Update existing project
        currentProjects[editingProjectIndex] = project;
    } else {
        // Add new project
        currentProjects.push(project);
    }
    
    // Update display
    renderProjectList();
    
    // Close modal
    closeProjectModal();
    
    console.log('Project saved:', project);
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        currentProjects.splice(index, 1);
        renderProjectList();
        console.log('Project deleted at index:', index);
    }
}

// Render project list
function renderProjectList() {
    const projectList = document.getElementById('projectsList');
    if (!projectList) return;
    
    projectList.innerHTML = '';
    
    if (currentProjects.length === 0) {
        projectList.innerHTML = '<p>No projects added yet</p>';
        return;
    }
    
    currentProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-header">
                <h4>${project.title}</h4>
                <div class="project-actions">
                    <button type="button" class="btn-edit" onclick="openProjectModal(${index})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteProject(${index})">Delete</button>
                </div>
            </div>
            <p class="project-description">${project.description}</p>
            ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : ''}
        `;
        projectList.appendChild(projectCard);
    });
}

// Setup education interface
function setupEducationInterface() {
    const addEducationBtn = document.getElementById('addEducationBtn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', openEducationModal);
    }
    
    // Setup modal close functionality
    const closeModal = document.querySelector('.education-modal .close');
    if (closeModal) {
        closeModal.addEventListener('click', closeEducationModal);
    }
    
    // Setup modal form submission
    const educationForm = document.getElementById('educationForm');
    if (educationForm) {
        educationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEducationFromModal();
        });
    }
}

// Open education modal for adding/editing
function openEducationModal(educationIndex = -1) {
    editingEducationIndex = educationIndex;
    const modal = document.getElementById('educationModal');
    const modalTitle = document.getElementById('educationModalTitle');
    const form = document.getElementById('educationForm');
    
    if (modal && modalTitle && form) {
        if (educationIndex >= 0 && currentEducation[educationIndex]) {
            // Editing existing education
            const education = currentEducation[educationIndex];
            modalTitle.textContent = 'Edit Education';
            
            // Populate form with existing data
            document.getElementById('educationInstitution').value = education.institution || '';
            document.getElementById('educationDegree').value = education.degree || '';
            document.getElementById('educationYears').value = education.years || '';
            document.getElementById('educationDescription').value = education.description || '';
        } else {
            // Adding new education
            modalTitle.textContent = 'Add New Education';
            
            // Clear form
            form.reset();
        }
        
        modal.style.display = 'block';
    }
}

// Close education modal
function closeEducationModal() {
    const modal = document.getElementById('educationModal');
    if (modal) {
        modal.style.display = 'none';
        editingEducationIndex = -1;
    }
}

// Save education from modal
function saveEducationFromModal() {
    const institution = document.getElementById('educationInstitution').value.trim();
    const degree = document.getElementById('educationDegree').value.trim();
    const years = document.getElementById('educationYears').value.trim();
    const description = document.getElementById('educationDescription').value.trim();
    
    if (!institution || !degree || !years) {
        alert('Please fill in all required fields (Institution, Degree, Years)');
        return;
    }
    
    const education = {
        institution,
        degree,
        years,
        description
    };
    
    if (editingEducationIndex >= 0) {
        // Update existing education
        currentEducation[editingEducationIndex] = education;
    } else {
        // Add new education
        currentEducation.push(education);
    }
    
    // Update display
    renderEducationList();
    
    // Close modal
    closeEducationModal();
    
    console.log('Education saved:', education);
}

// Delete education
function deleteEducation(index) {
    if (confirm('Are you sure you want to delete this education entry?')) {
        currentEducation.splice(index, 1);
        renderEducationList();
        console.log('Education deleted at index:', index);
    }
}

// Render education list
function renderEducationList() {
    const educationList = document.getElementById('educationList');
    if (!educationList) return;
    
    educationList.innerHTML = '';
    
    if (currentEducation.length === 0) {
        educationList.innerHTML = '<p>No education added yet</p>';
        return;
    }
    
    currentEducation.forEach((education, index) => {
        const educationBlock = document.createElement('div');
        educationBlock.className = 'education-block';
        educationBlock.innerHTML = `
            <div class="education-header">
                <h4>${education.institution}</h4>
                <div class="education-actions">
                    <button type="button" class="btn-edit" onclick="openEducationModal(${index})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteEducation(${index})">Delete</button>
                </div>
            </div>
            <p class="education-degree">${education.degree}</p>
            <p class="education-years">${education.years}</p>
            <p class="education-description">${education.description || 'No description provided'}</p>
        `;
        educationList.appendChild(educationBlock);
    });
}

// Setup experience interface
function setupExperienceInterface() {
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', openExperienceModal);
    }
    
    // Setup modal close functionality
    const closeModal = document.querySelector('.experience-modal .close');
    if (closeModal) {
        closeModal.addEventListener('click', closeExperienceModal);
    }
    
    // Setup modal form submission
    const experienceForm = document.getElementById('experienceForm');
    if (experienceForm) {
        experienceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveExperienceFromModal();
        });
    }
}

// Open experience modal for adding/editing
function openExperienceModal(experienceIndex = -1) {
    editingExperienceIndex = experienceIndex;
    const modal = document.getElementById('experienceModal');
    const modalTitle = document.getElementById('experienceModalTitle');
    const form = document.getElementById('experienceForm');
    
    if (modal && modalTitle && form) {
        if (experienceIndex >= 0 && currentExperiences[experienceIndex]) {
            // Editing existing experience
            const experience = currentExperiences[experienceIndex];
            modalTitle.textContent = 'Edit Experience';
            
            // Populate form with existing data
            document.getElementById('experienceTitle').value = experience.title || '';
            document.getElementById('experienceCompany').value = experience.company || '';
            document.getElementById('experienceDuration').value = experience.duration || '';
            document.getElementById('experienceDescription').value = experience.description || '';
        } else {
            // Adding new experience
            modalTitle.textContent = 'Add New Experience';
            
            // Clear form
            form.reset();
        }
        
        modal.style.display = 'block';
    }
}

// Close experience modal
function closeExperienceModal() {
    const modal = document.getElementById('experienceModal');
    if (modal) {
        modal.style.display = 'none';
        editingExperienceIndex = -1;
    }
}

// Save experience from modal
function saveExperienceFromModal() {
    const title = document.getElementById('experienceTitle').value.trim();
    const company = document.getElementById('experienceCompany').value.trim();
    const duration = document.getElementById('experienceDuration').value.trim();
    const description = document.getElementById('experienceDescription').value.trim();
    
    if (!title || !company || !duration) {
        alert('Please fill in all required fields (Title, Company, Duration)');
        return;
    }
    
    const experience = {
        title,
        company,
        duration,
        description
    };
    
    if (editingExperienceIndex >= 0) {
        // Update existing experience
        currentExperiences[editingExperienceIndex] = experience;
    } else {
        // Add new experience
        currentExperiences.push(experience);
    }
    
    // Update display
    renderExperienceList();
    
    // Close modal
    closeExperienceModal();
    
    console.log('Experience saved:', experience);
}

// Delete experience
function deleteExperience(index) {
    if (confirm('Are you sure you want to delete this experience?')) {
        currentExperiences.splice(index, 1);
        renderExperienceList();
        console.log('Experience deleted at index:', index);
    }
}

// Render experience list
function renderExperienceList() {
    const experienceList = document.getElementById('experienceList');
    if (!experienceList) return;
    
    experienceList.innerHTML = '';
    
    if (currentExperiences.length === 0) {
        experienceList.innerHTML = '<p>No experience added yet</p>';
        return;
    }
    
    currentExperiences.forEach((experience, index) => {
        const experienceBlock = document.createElement('div');
        experienceBlock.className = 'experience-block';
        experienceBlock.innerHTML = `
            <div class="experience-header">
                <h4>${experience.title}</h4>
                <div class="experience-actions">
                    <button type="button" class="btn-edit" onclick="openExperienceModal(${index})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteExperience(${index})">Delete</button>
                </div>
            </div>
            <p class="experience-company">${experience.company}</p>
            <p class="experience-duration">${experience.duration}</p>
            <p class="experience-description">${experience.description || 'No description provided'}</p>
        `;
        experienceList.appendChild(experienceBlock);
    });
}

// Setup skills interface
function setupSkillsInterface() {
    const addSkillBtn = document.getElementById('addSkillBtn');
    const newSkillInput = document.getElementById('newSkillInput');
    
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', addNewSkill);
    }
    
    if (newSkillInput) {
        newSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addNewSkill();
            }
        });
    }
}

// Add new skill to the list
function addNewSkill() {
    const newSkillInput = document.getElementById('newSkillInput');
    if (!newSkillInput) return;
    
    const newSkill = newSkillInput.value.trim();
    
    if (!newSkill) {
        alert('Please enter a skill name');
        return;
    }
    
    // Check for duplicates (case-insensitive)
    if (currentSkills.some(skill => skill.toLowerCase() === newSkill.toLowerCase())) {
        alert('This skill already exists');
        return;
    }
    
    // Add to current skills array
    currentSkills.push(newSkill);
    
    // Update the display
    renderSkillsList();
    
    // Clear input
    newSkillInput.value = '';
    
    console.log('Skill added:', newSkill);
}

// Remove skill from the list
function removeSkill(skillToRemove) {
    currentSkills = currentSkills.filter(skill => skill !== skillToRemove);
    renderSkillsList();
    console.log('Skill removed:', skillToRemove);
}

// Render skills list
function renderSkillsList() {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) return;
    
    skillsList.innerHTML = '';
    
    if (currentSkills.length === 0) {
        skillsList.innerHTML = '<p>No skills added yet</p>';
        return;
    }
    
    currentSkills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" class="skill-remove-btn" onclick="removeSkill('${skill}')">&times;</button>
        `;
        skillsList.appendChild(skillTag);
    });
}

// Setup save button functionality
function setupSaveButton(userId) {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            // Disable button and show saving state
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            
            try {
                await saveAboutSection(userId);
                await saveSkillsSection(userId);
                await saveExperienceSection(userId);
                await saveEducationSection(userId);
                await saveProjectSection(userId);
                await saveContactSection(userId);
                await saveAvailabilitySection(userId);
                await saveSocialLinksSection(userId);
                
                // Update profile completion after saving
                updateProfileCompletion();
                
                // Show success state briefly
                saveBtn.textContent = 'Saved ✅';
                saveBtn.classList.add('saving');
                
                // Reset button after 1.5 seconds
                setTimeout(() => {
                    saveBtn.textContent = 'Save Profile';
                    saveBtn.disabled = false;
                    saveBtn.classList.remove('saving');
                }, 1500);
                
                showToast("Social links updated!", "success");
                
            } catch (error) {
                console.error('Error saving profile:', error);
                
                // Reset button on error
                saveBtn.textContent = 'Save Profile';
                saveBtn.disabled = false;
                saveBtn.classList.remove('saving');
                
                showToast('Error saving profile. Please try again.', 'error');
            }
        });
    }
}

// Save about section to Firestore
async function saveAboutSection(userId) {
    try {
        const aboutTextarea = document.getElementById('profileAbout');
        if (!aboutTextarea) {
            console.error('About textarea not found');
            return;
        }

        const aboutValue = aboutTextarea.value.trim();
        
        // Update the about field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            about: aboutValue
        });
        
        console.log('About section saved successfully');
        
    } catch (error) {
        console.error('Error saving about section:', error);
        showToast('Error saving about section. Please try again.', 'error');
    }
}

// Save skills section to Firestore
async function saveSkillsSection(userId) {
    try {
        // Update the skills field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            skills: currentSkills
        });
        
        console.log('Skills section saved successfully');
        
    } catch (error) {
        console.error('Error saving skills section:', error);
        showToast('Error saving skills section. Please try again.', 'error');
    }
}

// Save experience section to Firestore
async function saveExperienceSection(userId) {
    try {
        // Update the experience field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            experience: currentExperiences
        });
        
        console.log('Experience section saved successfully');
        
    } catch (error) {
        console.error('Error saving experience section:', error);
        showToast('Error saving experience section. Please try again.', 'error');
    }
}

// Save education section to Firestore
async function saveEducationSection(userId) {
    try {
        // Update the education field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            education: currentEducation
        });
        
        console.log('Education section saved successfully');
        
    } catch (error) {
        console.error('Error saving education section:', error);
        showToast('Error saving education section. Please try again.', 'error');
    }
}

// Save project section to Firestore
async function saveProjectSection(userId) {
    try {
        // Update the projects field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            projects: currentProjects
        });
        
        showToast("Projects section updated!", "success");
        console.log('Project section saved successfully');
        
    } catch (error) {
        console.error('Error saving project section:', error);
        showToast('Error saving project section. Please try again.', 'error');
    }
}

// Save contact section to Firestore
async function saveContactSection(userId) {
    try {
        // Collect values from contact form fields
        const email = document.getElementById('contactEmail')?.value?.trim() || '';
        const phone = document.getElementById('contactPhone')?.value?.trim() || '';
        const location = document.getElementById('contactLocation')?.value?.trim() || '';
        
        // Update current contact data
        currentContact = { email, phone, location };
        
        // Update the contact field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            contact: currentContact
        });
        
        console.log('Contact section saved successfully');
        
    } catch (error) {
        console.error('Error saving contact section:', error);
        showToast('Error saving contact section. Please try again.', 'error');
    }
}

// Save availability section to Firestore
async function saveAvailabilitySection(userId) {
    try {
        // Collect values from availability form fields
        const status = document.getElementById('availabilityStatus')?.value || 'Available';
        const hourlyRate = document.getElementById('availabilityHourlyRate')?.value?.trim() || '';
        const workPreference = document.getElementById('availabilityWorkPreference')?.value || 'Remote';
        
        // Update current availability data
        currentAvailability = { status, hourlyRate, workPreference };
        
        // Update the availability field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            availability: currentAvailability
        });
        
        console.log('Availability section saved successfully');
        
    } catch (error) {
        console.error('Error saving availability section:', error);
        showToast('Error saving availability section. Please try again.', 'error');
    }
}

// Save social links section to Firestore
async function saveSocialLinksSection(userId) {
    try {
        // Collect values from social links form fields
        const linkedin = document.getElementById('socialLinkedin')?.value?.trim() || '';
        const github = document.getElementById('socialGithub')?.value?.trim() || '';
        const portfolio = document.getElementById('socialPortfolio')?.value?.trim() || '';
        
        // Update current social links data
        currentSocialLinks = { linkedin, github, portfolio };
        
        // Update the socialLinks field in Firestore
        await firebase.firestore().collection('users').doc(userId).update({
            socialLinks: currentSocialLinks
        });
        
        console.log('Social links section saved successfully');
        
    } catch (error) {
        console.error('Error saving social links section:', error);
        showToast('Error saving social links section. Please try again.', 'error');
    }
}

// Setup resume interface
function setupResumeInterface() {
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink) {
        resumeLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if resume exists - if yes, view it; if no, upload
            if (currentResumeURL) {
                viewResume();
            } else {
                openResumeFilePicker();
            }
        });
    }
    console.log('Resume interface setup complete');
}

// Function to view resume in new tab
async function viewResume() {
    try {
        // Check authentication
        const user = firebase.auth().currentUser;
        if (!user) {
            showToast('User not authenticated', 'error');
            return;
        }
        
        // Check if resume URL exists
        if (!currentResumeURL) {
            showToast('No resume found', 'error');
            return;
        }
        
        // Fetch the resume download URL from Firebase Storage
        const storageRef = firebase.storage().ref();
        const resumeRef = storageRef.child(`resumes/${user.uid}/latest-resume.pdf`);
        
        // Get the download URL
        const downloadURL = await resumeRef.getDownloadURL();
        
        // Open resume in new tab
        window.open(downloadURL, '_blank');
        
    } catch (error) {
        console.error('Error accessing resume:', error);
        showToast('Error accessing resume. Please try again.', 'error');
        
        // Revert button to "Upload Resume" on error
        const resumeLink = document.getElementById('resumeLink');
        if (resumeLink) {
            resumeLink.textContent = 'Upload Resume';
            currentResumeURL = '';
            renderResumeSection();
        }
    }
}

// Open file picker for resume upload
function openResumeFilePicker() {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.style.display = 'none';
    
    // Add event listener for file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadResume(file);
        }
        // Clean up the file input
        document.body.removeChild(fileInput);
    });
    
    // Trigger file picker
    document.body.appendChild(fileInput);
    fileInput.click();
}

// Upload resume to Firebase Storage
async function uploadResume(file) {
    try {
        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            showToast('User not authenticated', 'error');
            return;
        }
        
        // Show loading state
        const resumeLink = document.getElementById('resumeLink');
        if (resumeLink) {
            resumeLink.textContent = 'Uploading...';
            resumeLink.style.pointerEvents = 'none';
        }
        
        // Create storage reference
        const storageRef = firebase.storage().ref();
        const resumeRef = storageRef.child(`resumes/${user.uid}/latest-resume.pdf`);
        
        // Upload file
        const uploadTask = await resumeRef.put(file);
        
        // Get download URL
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Save URL to Firestore
        await firebase.firestore().collection('users').doc(user.uid).update({
            resumeURL: downloadURL
        });
        
        // Update current resume URL
        currentResumeURL = downloadURL;
        
        // Update the link and re-render section to change button behavior
        if (resumeLink) {
            resumeLink.href = downloadURL;
            resumeLink.textContent = 'View Resume';
            resumeLink.style.pointerEvents = 'auto';
        }
        
        // Re-render the section to update button behavior
        renderResumeSection();
        
        showToast("Resume uploaded successfully!", "success");
        console.log('Resume uploaded successfully:', downloadURL);
        
    } catch (error) {
        console.error('Error uploading resume:', error);
        showToast('Error uploading resume. Please try again.', 'error');
        
        // Reset link state on error
        const resumeLink = document.getElementById('resumeLink');
        if (resumeLink) {
            resumeLink.textContent = currentResumeURL ? 'View Resume' : 'Upload Resume';
            resumeLink.style.pointerEvents = 'auto';
        }
    }
}

// Render resume section
function renderResumeSection() {
    const resumeLink = document.getElementById('resumeLink');
    let deleteBtn = document.getElementById('deleteResumeBtn');
    if (!resumeLink) return;
    // Create delete button if not present
    if (!deleteBtn) {
        deleteBtn = document.createElement('button');
        deleteBtn.id = 'deleteResumeBtn';
        deleteBtn.textContent = 'Delete Resume';
        deleteBtn.style.marginLeft = '12px';
        // Custom styling for a destructive action
        deleteBtn.style.background = '#e53e3e'; // red
        deleteBtn.style.color = '#fff';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '6px';
        deleteBtn.style.padding = '6px 16px';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.transition = 'background 0.2s';
        deleteBtn.onmouseover = function() { deleteBtn.style.background = '#c53030'; };
        deleteBtn.onmouseout = function() { deleteBtn.style.background = '#e53e3e'; };
        resumeLink.parentNode.insertBefore(deleteBtn, resumeLink.nextSibling);
    }
    if (currentResumeURL) {
        // Resume exists - show "View Resume" link and enable delete
        resumeLink.href = currentResumeURL;
        resumeLink.textContent = 'View Resume';
        resumeLink.target = '_blank';
        resumeLink.style.display = '';
        deleteBtn.style.display = '';
        deleteBtn.disabled = false;
        resumeLink.disabled = false;
    } else {
        // No resume - show "Upload Resume" link and hide delete
        resumeLink.href = '#';
        resumeLink.textContent = 'Upload Resume';
        resumeLink.target = '';
        deleteBtn.style.display = 'none';
    }
    
    // Attach delete handler
    deleteBtn.onclick = async function() {
        // Confirmation popup before deletion
        const confirmDelete = window.confirm('Are you sure you want to delete your resume? This action cannot be undone.');
        if (!confirmDelete) {
            deleteBtn.disabled = false;
            resumeLink.disabled = false;
            return;
        }
        // Disable both buttons
        deleteBtn.disabled = true;
        resumeLink.disabled = true;
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('User not authenticated');
            // Delete from storage
            const storageRef = firebase.storage().ref();
            const resumeRef = storageRef.child(`resumes/${user.uid}/latest-resume.pdf`);
            await resumeRef.delete();
            // Remove from Firestore
            await firebase.firestore().collection('users').doc(user.uid).update({ resumeURL: '' });
            currentResumeURL = '';
            renderResumeSection();
            showToast('Resume deleted successfully.', 'success');
        } catch (err) {
            showToast('Error deleting resume: ' + (err.message || err), 'error');
            deleteBtn.disabled = false;
            resumeLink.disabled = false;
        }
    };
}

// Load user profile data from Firestore
async function loadUserProfile(userId) {
    try {
        console.log('Loading profile data for user:', userId);
        
        // Get user document from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('User data loaded:', userData);
            
            // Populate profile elements with Firestore data
            populateProfileData(userData);
        } else {
            console.log('No user document found');
            // Handle case where user document doesn't exist
            showDefaultProfile();
        }
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Handle error gracefully
        showErrorState();
    }
}

// Populate profile elements with user data
function populateProfileData(userData) {
    // Calculate and display profile completion
    const completionPercentage = calculateProfileCompletion(userData);
    const profileCompletionElement = document.getElementById('profileCompletion');
    if (profileCompletionElement) {
        profileCompletionElement.innerText = completionPercentage;
    }
    
    // Profile name
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = userData.name || 'No name provided';
    }
    
    // Profile title/role
    const profileTitle = document.getElementById('profileTitle');

    // adding role map as suggested by gpt to make role user friendly and not what the machine reads
     const roleMap = {
        frontend: "Frontend Developer",
        backend: "Backend Developer",
        fullstack: "Full Stack Developer",
        mobile: "Mobile Developer",
        devops: "DevOps Engineer",
        data: "Data Scientist",
        other: "Other"
       };
       const rawRole = userData.role || 'fullstack';
    if (profileTitle) {
        profileTitle.textContent = roleMap[rawRole] || 'fullstack Developer';
    }
    
    // Profile location
    const profileLocation = document.getElementById('profileLocation');
    if (profileLocation) {
        profileLocation.textContent = userData.location || 'Location not specified';
    }
    
    // Profile about - convert to textarea and set value
    const profileAbout = document.getElementById('profileAbout');
    if (profileAbout) {
        // Convert the paragraph to a textarea
        convertToTextarea(profileAbout, userData.about || 'Tell us about yourself...');
    }
    
    // Profile avatar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        if (userData.avatarURL) {
            profileAvatar.src = userData.avatarURL;
            currentAvatarURL = userData.avatarURL;
        } else {
            // Use default avatar if no profile picture
            profileAvatar.src = 'assets/img/default-avatar.png';
            currentAvatarURL = '';
        }
    }
    
    // Skills list - load and render skills
    if (userData.skills && Array.isArray(userData.skills)) {
        currentSkills = [...userData.skills]; // Copy the array
    } else {
        currentSkills = [];
    }
    renderSkillsList();
    
    // Experience list - load and render experiences
    if (userData.experience && Array.isArray(userData.experience)) {
        currentExperiences = [...userData.experience]; // Copy the array
    } else {
        currentExperiences = [];
    }
    renderExperienceList();
    
    // Education list - load and render education
    if (userData.education && Array.isArray(userData.education)) {
        currentEducation = [...userData.education]; // Copy the array
    } else {
        currentEducation = [];
    }
    renderEducationList();
    
    // Projects list - load and render projects
    if (userData.projects && Array.isArray(userData.projects)) {
        currentProjects = [...userData.projects]; // Copy the array
    } else {
        currentProjects = [];
    }
    renderProjectList();
    
    // Contact information - load and render contact
    if (userData.contact && typeof userData.contact === 'object') {
        currentContact = { ...userData.contact }; // Copy the object
    } else {
        currentContact = { email: '', phone: '', location: '' };
    }
    renderContactSection();
    
    // Availability information - load and render availability
    if (userData.availability && typeof userData.availability === 'object') {
        currentAvailability = { ...userData.availability }; // Copy the object
    } else {
        currentAvailability = { status: 'Available', hourlyRate: '', workPreference: 'Remote' };
    }
    renderAvailabilitySection();
    
    // Resume information - load and render resume
    currentResumeURL = userData.resumeURL || '';
    renderResumeSection();
    
    // Social links information - load and render social links
    if (userData.socialLinks && typeof userData.socialLinks === 'object') {
        currentSocialLinks = { ...userData.socialLinks }; // Copy the object
    } else {
        currentSocialLinks = { linkedin: '', github: '', portfolio: '' };
    }
    renderSocialLinksSection();
}

// Convert paragraph element to textarea
function convertToTextarea(element, value) {
    // Create a new textarea element
    const textarea = document.createElement('textarea');
    textarea.id = 'profileAbout';
    textarea.value = value;
    textarea.placeholder = 'Tell us about yourself...';
    textarea.rows = 4;
    textarea.style.width = '100%';
    textarea.style.padding = '10px';
    textarea.style.border = '1px solid #e2e8f0';
    textarea.style.borderRadius = '8px';
    textarea.style.fontFamily = 'inherit';
    textarea.style.fontSize = 'inherit';
    textarea.style.resize = 'vertical';
    
    // Replace the paragraph with the textarea
    element.parentNode.replaceChild(textarea, element);
}

// Show default profile when no data exists
function showDefaultProfile() {
    // Calculate profile completion for empty profile
    const emptyProfileData = {
        name: '',
        role: '',
        location: '',
        about: '',
        skills: [],
        experience: [],
        education: [],
        projects: [],
        contact: { email: '', phone: '', location: '' },
        availability: { status: '', hourlyRate: '', workPreference: '' },
        resumeURL: '',
        socialLinks: { linkedin: '', github: '', portfolio: '' }
    };
    
    const completionPercentage = calculateProfileCompletion(emptyProfileData);
    const profileCompletionElement = document.getElementById('profileCompletion');
    if (profileCompletionElement) {
        profileCompletionElement.innerText = completionPercentage;
    }
    
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileLocation = document.getElementById('profileLocation');
    const profileAbout = document.getElementById('profileAbout');
    
    if (profileName) profileName.textContent = 'Complete your profile';
    if (profileTitle) profileTitle.textContent = 'Developer';
    if (profileLocation) profileLocation.textContent = 'Add your location';
    if (profileAbout) {
        convertToTextarea(profileAbout, 'Tell us about yourself...');
    }
    
    // Initialize empty skills, experiences, education, and projects
    currentSkills = [];
    currentExperiences = [];
    currentEducation = [];
    currentProjects = [];
    currentContact = { email: '', phone: '', location: '' };
    currentAvailability = { status: 'Available', hourlyRate: '', workPreference: 'Remote' };
    currentResumeURL = '';
    currentSocialLinks = { linkedin: '', github: '', portfolio: '' };
    currentAvatarURL = '';
    
    renderSkillsList();
    renderExperienceList();
    renderEducationList();
    renderProjectList();
    renderContactSection();
    renderAvailabilitySection();
    renderResumeSection();
    renderSocialLinksSection();
}

// Show error state
function showErrorState() {
    // Calculate profile completion for error state (empty profile)
    const emptyProfileData = {
        name: '',
        role: '',
        location: '',
        about: '',
        skills: [],
        experience: [],
        education: [],
        projects: [],
        contact: { email: '', phone: '', location: '' },
        availability: { status: '', hourlyRate: '', workPreference: '' },
        resumeURL: '',
        socialLinks: { linkedin: '', github: '', portfolio: '' }
    };
    
    const completionPercentage = calculateProfileCompletion(emptyProfileData);
    const profileCompletionElement = document.getElementById('profileCompletion');
    if (profileCompletionElement) {
        profileCompletionElement.innerText = completionPercentage;
    }
    
    const profileName = document.getElementById('profileName');
    const profileTitle = document.getElementById('profileTitle');
    const profileLocation = document.getElementById('profileLocation');
    const profileAbout = document.getElementById('profileAbout');
    
    if (profileName) profileName.textContent = 'Error loading profile';
    if (profileTitle) profileTitle.textContent = 'Please try again';
    if (profileLocation) profileLocation.textContent = '';
    if (profileAbout) {
        convertToTextarea(profileAbout, 'Unable to load profile data. Please refresh the page.');
    }
    
    // Show error for skills, experiences, education, and projects
    currentSkills = [];
    currentExperiences = [];
    currentEducation = [];
    currentProjects = [];
    currentContact = { email: '', phone: '', location: '' };
    currentAvailability = { status: 'Available', hourlyRate: '', workPreference: 'Remote' };
    currentResumeURL = '';
    currentSocialLinks = { linkedin: '', github: '', portfolio: '' };
    currentAvatarURL = '';
    
    renderSkillsList();
    renderExperienceList();
    renderEducationList();
    renderProjectList();
    renderContactSection();
    renderAvailabilitySection();
    renderResumeSection();
    renderSocialLinksSection();
}

// Setup contact interface
function setupContactInterface() {
    // Contact interface will be populated when data is loaded
    console.log('Contact interface setup complete');
}

// Setup availability interface
function setupAvailabilityInterface() {
    // Availability interface will be populated when data is loaded
    console.log('Availability interface setup complete');
}

// Render contact information section
function renderContactSection() {
    const contactInfo = document.getElementById('contactInfo');
    if (!contactInfo) return;
    
    contactInfo.innerHTML = `
        <div class="contact-field">
            <label for="contactEmail">Email</label>
            <input type="email" id="contactEmail" value="${currentContact.email || ''}" placeholder="your.email@example.com">
        </div>
        <div class="contact-field">
            <label for="contactPhone">Phone</label>
            <input type="tel" id="contactPhone" value="${currentContact.phone || ''}" placeholder="+1 (555) 123-4567">
        </div>
        <div class="contact-field">
            <label for="contactLocation">Location</label>
            <input type="text" id="contactLocation" value="${currentContact.location || ''}" placeholder="City, Country">
        </div>
    `;
}

// Render availability section
function renderAvailabilitySection() {
    const availabilityInfo = document.getElementById('availabilityInfo');
    if (!availabilityInfo) return;
    
    const statusOptions = ['Available', 'Busy', 'Away', 'Not Available'];
    const workPreferenceOptions = ['Remote', 'On-site', 'Hybrid'];
    
    const statusOptionsHTML = statusOptions.map(option => 
        `<option value="${option}" ${currentAvailability.status === option ? 'selected' : ''}>${option}</option>`
    ).join('');
    
    const workPreferenceOptionsHTML = workPreferenceOptions.map(option => 
        `<option value="${option}" ${currentAvailability.workPreference === option ? 'selected' : ''}>${option}</option>`
    ).join('');
    
    availabilityInfo.innerHTML = `
        <div class="availability-field">
            <label for="availabilityStatus">Status</label>
            <select id="availabilityStatus">
                ${statusOptionsHTML}
            </select>
        </div>
        <div class="availability-field">
            <label for="availabilityHourlyRate">Hourly Rate ($)</label>
            <input type="number" id="availabilityHourlyRate" value="${currentAvailability.hourlyRate || ''}" placeholder="50" min="0" step="0.01">
        </div>
        <div class="availability-field">
            <label for="availabilityWorkPreference">Work Preference</label>
            <select id="availabilityWorkPreference">
                ${workPreferenceOptionsHTML}
            </select>
        </div>
    `;
}

// Setup social links interface
function setupSocialLinksInterface() {
    // Social links interface will be populated when data is loaded
    console.log('Social links interface setup complete');
}

// Setup avatar upload interface
function setupAvatarUpload() {
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (avatarUploadBtn && avatarUpload) {
        avatarUploadBtn.addEventListener('click', function() {
            avatarUpload.click();
        });
        avatarUpload.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    const croppedBlob = await showCropperModal(file);
                    await handleAvatarUpload(croppedBlob);
                } catch (err) {
                    if (err !== 'cancelled') showToast('Failed to crop image', 'error');
                }
            }
        });
    }
    
    // Add click handler for profile avatar modal
    if (profileAvatar) {
        profileAvatar.style.cursor = 'pointer';
        profileAvatar.addEventListener('click', function() {
            openAvatarModal(this.src);
        });
    }
    
    console.log('Avatar upload interface setup complete');
}

// Show CropperJS modal and return a Promise that resolves with the cropped Blob
function showCropperModal(file) {
    return new Promise((resolve, reject) => {
        ensureCropperModal();
        const modal = document.getElementById('cropperModal');
        const img = document.getElementById('cropperImage');
        const cancelBtn = document.getElementById('cropperCancelBtn');
        const confirmBtn = document.getElementById('cropperConfirmBtn');
        modal.style.display = 'block';
        // Load image
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            // Wait for CropperJS to be loaded
            if (window.Cropper) {
                if (img.cropperInstance) img.cropperInstance.destroy();
                img.cropperInstance = new Cropper(img, {
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 1,
                    movable: true,
                    zoomable: true,
                    scalable: true,
                    rotatable: false
                });
            } else {
                // Wait for script to load
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js';
                script.onload = () => {
                    if (img.cropperInstance) img.cropperInstance.destroy();
                    img.cropperInstance = new Cropper(img, {
                        aspectRatio: 1,
                        viewMode: 1,
                        autoCropArea: 1,
                        movable: true,
                        zoomable: true,
                        scalable: true,
                        rotatable: false
                    });
                };
                document.body.appendChild(script);
            }
        };
        reader.readAsDataURL(file);
        // Cancel
        cancelBtn.onclick = () => {
            if (img.cropperInstance) img.cropperInstance.destroy();
            modal.style.display = 'none';
            reject('cancelled');
        };
        // Confirm
        confirmBtn.onclick = () => {
            if (!img.cropperInstance) return;
            img.cropperInstance.getCroppedCanvas({width:400,height:400}).toBlob(blob => {
                img.cropperInstance.destroy();
                modal.style.display = 'none';
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
    });
}

// Add CropperJS modal HTML to the page (once)
function ensureCropperModal() {
    if (document.getElementById('cropperModal')) return;
    const modal = document.createElement('div');
    modal.id = 'cropperModal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div id="cropperModalBackdrop" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9998;"></div>
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:24px;border-radius:12px;z-index:9999;min-width:320px;max-width:90vw;">
        <h3 style="margin-top:0;">Crop your profile picture</h3>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css'/>
        <img id="cropperImage" style="max-width:100%;max-height:50vh;display:block;margin:0 auto 16px;"/>
        <div class="crop-modal-buttons">
          <button class="cancel-btn" id="cropperCancelBtn">Cancel</button>
          <button class="upload-btn" id="cropperConfirmBtn">Crop & Upload</button>
        </div>
      </div>
      <script src='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js'></script>
    `;
    document.body.appendChild(modal);
}

// Handle avatar upload
async function handleAvatarUpload(file) {
    try {
        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            showToast('User not authenticated', 'error');
            return;
        }
        
        // Show instant preview
        const profileAvatar = document.getElementById('profileAvatar');
        const avatarUploadBtn = document.getElementById('avatarUploadBtn');
        
        if (profileAvatar) {
            const previewURL = URL.createObjectURL(file);
            profileAvatar.src = previewURL;
        }
        
        // Show uploading state
        if (avatarUploadBtn) {
            avatarUploadBtn.textContent = 'Uploading...';
            avatarUploadBtn.disabled = true;
        }
        
        // Create storage reference
        const storageRef = firebase.storage().ref();
        const avatarRef = storageRef.child(`avatars/${user.uid}.jpg`);
        
        // Upload file
        const uploadTask = await avatarRef.put(file);
        
        // Get download URL
        const downloadURL = await uploadTask.ref.getDownloadURL();
        
        // Save URL to Firestore
        await firebase.firestore().collection('users').doc(user.uid).update({
            avatarURL: downloadURL
        });
        
        // Update current avatar URL
        currentAvatarURL = downloadURL;
        
        // Reset button state
        if (avatarUploadBtn) {
            avatarUploadBtn.textContent = 'Change Photo';
            avatarUploadBtn.disabled = false;
        }
        
        showToast("Avatar updated!", "success");
        console.log('Avatar uploaded successfully:', downloadURL);
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showToast('Error uploading avatar. Please try again.', 'error');
        
        // Reset button state on error
        const avatarUploadBtn = document.getElementById('avatarUploadBtn');
        if (avatarUploadBtn) {
            avatarUploadBtn.textContent = 'Change Photo';
            avatarUploadBtn.disabled = false;
        }
        
        // Reset avatar to previous state
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar && currentAvatarURL) {
            profileAvatar.src = currentAvatarURL;
        } else if (profileAvatar) {
            profileAvatar.src = 'assets/img/default-avatar.png';
        }
    }
}

// Render social links section
function renderSocialLinksSection() {
    const socialLinks = document.getElementById('socialLinks');
    if (!socialLinks) return;
    
    socialLinks.innerHTML = `
        <div class="social-field">
            <label for="socialLinkedin">LinkedIn</label>
            <input type="url" id="socialLinkedin" value="${currentSocialLinks.linkedin || ''}" placeholder="https://linkedin.com/in/yourprofile">
        </div>
        <div class="social-field">
            <label for="socialGithub">GitHub</label>
            <input type="url" id="socialGithub" value="${currentSocialLinks.github || ''}" placeholder="https://github.com/yourusername">
        </div>
        <div class="social-field">
            <label for="socialPortfolio">Portfolio</label>
            <input type="url" id="socialPortfolio" value="${currentSocialLinks.portfolio || ''}" placeholder="https://yourportfolio.com or https://behance.net/yourprofile">
        </div>
    `;
}

// Calculate profile completion percentage
function calculateProfileCompletion(data) {
    let completedSections = 0;
    const totalSections = 11;
    
    // Check basic profile info (name, role, location)
    if (data.name && data.role && data.location) {
        completedSections++;
    }
    
    // Check about section
    if (data.about && data.about.trim() !== '') {
        completedSections++;
    }
    
    // Check skills (at least 1 skill)
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        completedSections++;
    }
    
    // Check experience (at least 1 entry)
    if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
        completedSections++;
    }
    
    // Check education (at least 1 entry)
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
        completedSections++;
    }
    
    // Check projects (at least 1 entry)
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
        completedSections++;
    }
    
    // Check contact info (email, phone, location)
    if (data.contact && data.contact.email && data.contact.phone && data.contact.location) {
        completedSections++;
    }
    
    // Check availability (status, hourlyRate, workPreference)
    if (data.availability && data.availability.status && data.availability.hourlyRate && data.availability.workPreference) {
        completedSections++;
    }
    
    // Check resume URL
    if (data.resumeURL && data.resumeURL.trim() !== '') {
        completedSections++;
    }
    
    // Check social links (linkedin, github)
    if (data.socialLinks && data.socialLinks.linkedin && data.socialLinks.github) {
        completedSections++;
    }
    
    // Calculate percentage
    const percentage = Math.round((completedSections / totalSections) * 100);
    return `${percentage}%`;
}

// Update profile completion display
function updateProfileCompletion() {
    // Get current user data from the page
    const currentUserData = {
        name: document.getElementById('profileName')?.textContent || '',
        role: document.getElementById('profileTitle')?.textContent || '',
        location: document.getElementById('profileLocation')?.textContent || '',
        about: document.getElementById('profileAbout')?.value || '',
        skills: currentSkills,
        experience: currentExperiences,
        education: currentEducation,
        projects: currentProjects,
        contact: currentContact,
        availability: currentAvailability,
        resumeURL: currentResumeURL,
        socialLinks: currentSocialLinks
    };
    
    const completionPercentage = calculateProfileCompletion(currentUserData);
    const profileCompletionElement = document.getElementById('profileCompletion');
    if (profileCompletionElement) {
        profileCompletionElement.innerText = completionPercentage;
    }
}

// Setup contact modal interface
function setupContactModal() {
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeBtn = contactModal?.querySelector('.close');
    const contactForm = document.getElementById('contactForm');
    
    // Open modal when contact button is clicked
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            openContactModal();
        });
    }
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeContactModal();
        });
    }
    
    // Close modal when clicking outside the modal
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
    
    console.log('Contact modal interface setup complete');
}

// Open contact modal
function openContactModal() {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'block';
        // Reset form when opening
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
    }
}

// Close contact modal
function closeContactModal() {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'none';
        // Reset form when closing
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
    }
}

// Handle contact form submission
async function handleContactFormSubmission() {
    try {
        // Get form values
        const contactName = document.getElementById('contactName')?.value?.trim();
        const contactEmail = document.getElementById('contactEmail')?.value?.trim();
        const contactSubject = document.getElementById('contactSubject')?.value?.trim();
        const contactMessage = document.getElementById('contactMessage')?.value?.trim();
        
        // Validate all fields are filled
        if (!contactName || !contactEmail || !contactSubject || !contactMessage) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        
        // Get current user (the profile owner)
        const user = firebase.auth().currentUser;
        if (!user) {
            showToast('User not authenticated', 'error');
            return;
        }
        
        // Create message object
        const messageData = {
            toUserId: user.uid,
            fromName: contactName,
            fromEmail: contactEmail,
            subject: contactSubject,
            message: contactMessage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Save message to Firestore
        await firebase.firestore().collection('contacts').add(messageData);
        
        // Show success message
        showToast('Message sent successfully!', 'success');
        
        // Close modal and reset form
        closeContactModal();
        
        console.log('Contact message saved successfully:', messageData);
        
    } catch (error) {
        console.error('Error sending contact message:', error);
        showToast('Error sending message. Please try again.', 'error');
    }
}

// Open avatar modal with full-size image
function openAvatarModal(imageSrc) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('avatarModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'avatarModal';
        modal.innerHTML = `
            <div class="avatar-modal-overlay">
                <div class="avatar-modal-content">
                    <button class="avatar-modal-close">&times;</button>
                    <img class="avatar-modal-image" src="" alt="Profile Picture">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.avatar-modal-close');
        const overlay = modal.querySelector('.avatar-modal-overlay');
        
        closeBtn.addEventListener('click', closeAvatarModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeAvatarModal();
            }
        });
        
        // Add CSS styles
        if (!document.getElementById('avatarModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'avatarModalStyles';
            styles.textContent = `
                #avatarModal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                #avatarModal.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .avatar-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .avatar-modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                
                .avatar-modal-image {
                    width: 100%;
                    height: auto;
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .avatar-modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    padding: 0;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.5);
                    transition: background 0.2s ease;
                }
                
                .avatar-modal-close:hover {
                    background: rgba(0, 0, 0, 0.8);
                }
                
                @media (max-width: 768px) {
                    .avatar-modal-overlay {
                        padding: 10px;
                    }
                    
                    .avatar-modal-close {
                        top: -35px;
                        right: 0;
                        font-size: 24px;
                        width: 35px;
                        height: 35px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // Set image source and show modal
    const modalImage = modal.querySelector('.avatar-modal-image');
    modalImage.src = imageSrc;
    modal.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close avatar modal
function closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.classList.remove('show');
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
}



