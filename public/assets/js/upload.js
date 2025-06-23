// Resume upload handling JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize upload functionality
    initializeUpload();
});

// Initialize upload functionality
function initializeUpload() {
    const uploadInput = document.getElementById('resumeUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (uploadInput) {
        uploadInput.addEventListener('change', handleFileSelect);
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleUpload);
    }
    
    // Initialize drag and drop
    initializeDragAndDrop();
}

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    
    if (!dropZone) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
}

// Prevent default drag behaviors
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone
function highlight(e) {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

// Unhighlight drop zone
function unhighlight(e) {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

// Handle dropped files
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleFiles(files);
    }
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
}

// Handle files
function handleFiles(files) {
    const file = files[0];
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
        utils.showNotification(validation.message, 'error');
        return;
    }
    
    // Display file info
    displayFileInfo(file);
    
    // Enable upload button
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.disabled = false;
    }
}

// Validate file
function validateFile(file) {
    // Check file type
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: 'Please select a valid file type (PDF, DOC, DOCX, or TXT)'
        };
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: 'File size must be less than 5MB'
        };
    }
    
    return {
        isValid: true,
        message: 'File is valid'
    };
}

// Display file info
function displayFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (fileInfo) {
        fileInfo.innerHTML = `
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <span class="file-type">${file.type}</span>
            </div>
        `;
    }
    
    if (uploadStatus) {
        uploadStatus.textContent = 'File selected. Click upload to proceed.';
        uploadStatus.className = 'upload-status ready';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle upload
async function handleUpload() {
    const uploadInput = document.getElementById('resumeUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (!uploadInput || !uploadInput.files[0]) {
        utils.showNotification('Please select a file first', 'error');
        return;
    }
    
    const file = uploadInput.files[0];
    
    // Set loading state
    utils.setLoadingState(uploadBtn, true);
    
    if (uploadStatus) {
        uploadStatus.textContent = 'Uploading...';
        uploadStatus.className = 'upload-status uploading';
    }
    
    try {
        // Check if user is authenticated
        if (!firebaseHelpers.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        const user = firebaseHelpers.getCurrentUser();
        
        // Create a unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `resumes/${user.uid}/${timestamp}.${fileExtension}`;
        
        // Upload to Firebase Storage
        const storageRef = firebase.storage.ref();
        const fileRef = storageRef.child(fileName);
        
        // Upload with progress tracking
        const uploadTask = fileRef.put(file);
        
        uploadTask.on('state_changed',
            // Progress function
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                if (uploadProgress) {
                    uploadProgress.style.width = progress + '%';
                    uploadProgress.textContent = Math.round(progress) + '%';
                }
            },
            // Error function
            (error) => {
                console.error('Upload error:', error);
                throw error;
            },
            // Complete function
            async () => {
                // Get download URL
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // Save file info to Firestore
                await saveResumeInfo({
                    fileName: file.name,
                    fileUrl: downloadURL,
                    fileSize: file.size,
                    fileType: file.type,
                    uploadedAt: new Date()
                });
                
                // Update UI
                if (uploadStatus) {
                    uploadStatus.textContent = 'Upload completed successfully!';
                    uploadStatus.className = 'upload-status success';
                }
                
                utils.showNotification('Resume uploaded successfully!', 'success');
                
                // Reset form
                resetUploadForm();
                
                // Update resume link in profile
                updateResumeLink(downloadURL);
                
            }
        );
        
    } catch (error) {
        console.error('Upload error:', error);
        
        if (uploadStatus) {
            uploadStatus.textContent = 'Upload failed. Please try again.';
            uploadStatus.className = 'upload-status error';
        }
        
        utils.showNotification('Upload failed. Please try again.', 'error');
    } finally {
        utils.setLoadingState(uploadBtn, false);
    }
}

// Save resume info to Firestore
async function saveResumeInfo(resumeInfo) {
    try {
        const user = firebaseHelpers.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        
        await firebase.db.collection('users').doc(user.uid).update({
            resume: resumeInfo
        });
        
    } catch (error) {
        console.error('Error saving resume info:', error);
        throw error;
    }
}

// Update resume link in profile
function updateResumeLink(downloadURL) {
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink) {
        resumeLink.href = downloadURL;
        resumeLink.textContent = 'Download Resume';
    }
}

// Reset upload form
function resetUploadForm() {
    const uploadInput = document.getElementById('resumeUpload');
    const fileInfo = document.getElementById('fileInfo');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (uploadInput) uploadInput.value = '';
    if (fileInfo) fileInfo.innerHTML = '';
    if (uploadProgress) {
        uploadProgress.style.width = '0%';
        uploadProgress.textContent = '';
    }
    if (uploadBtn) uploadBtn.disabled = true;
}

// Delete resume
async function deleteResume() {
    if (!confirm('Are you sure you want to delete your resume?')) {
        return;
    }
    
    try {
        const user = firebaseHelpers.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        
        // Get current resume info
        const userDoc = await firebase.db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        if (userData && userData.resume) {
            // Delete from Storage
            const storageRef = firebase.storage.ref();
            const fileRef = storageRef.child(userData.resume.fileUrl);
            await fileRef.delete();
            
            // Remove from Firestore
            await firebase.db.collection('users').doc(user.uid).update({
                resume: firebase.firestore.FieldValue.delete()
            });
            
            utils.showNotification('Resume deleted successfully', 'success');
            
            // Update UI
            const resumeLink = document.getElementById('resumeLink');
            if (resumeLink) {
                resumeLink.href = '#';
                resumeLink.textContent = 'No resume uploaded';
            }
            
            resetUploadForm();
        }
        
    } catch (error) {
        console.error('Error deleting resume:', error);
        utils.showNotification('Error deleting resume', 'error');
    }
}

// Download resume
function downloadResume() {
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink && resumeLink.href !== '#') {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = resumeLink.href;
        link.download = 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        utils.showNotification('No resume available for download', 'error');
    }
}

// Preview resume
function previewResume() {
    const resumeLink = document.getElementById('resumeLink');
    if (resumeLink && resumeLink.href !== '#') {
        window.open(resumeLink.href, '_blank');
    } else {
        utils.showNotification('No resume available for preview', 'error');
    }
}

// Get resume info
async function getResumeInfo() {
    try {
        const user = firebaseHelpers.getCurrentUser();
        if (!user) return null;
        
        const userDoc = await firebase.db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        return userData?.resume || null;
        
    } catch (error) {
        console.error('Error getting resume info:', error);
        return null;
    }
}

// Load existing resume
async function loadExistingResume() {
    const resumeInfo = await getResumeInfo();
    
    if (resumeInfo) {
        // Update resume link
        const resumeLink = document.getElementById('resumeLink');
        if (resumeLink) {
            resumeLink.href = resumeInfo.fileUrl;
            resumeLink.textContent = 'Download Resume';
        }
        
        // Display file info
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) {
            fileInfo.innerHTML = `
                <div class="file-info">
                    <span class="file-name">${resumeInfo.fileName}</span>
                    <span class="file-size">${formatFileSize(resumeInfo.fileSize)}</span>
                    <span class="file-type">${resumeInfo.fileType}</span>
                    <span class="upload-date">Uploaded: ${utils.formatDate(resumeInfo.uploadedAt)}</span>
                </div>
            `;
        }
        
        // Update status
        const uploadStatus = document.getElementById('uploadStatus');
        if (uploadStatus) {
            uploadStatus.textContent = 'Resume already uploaded';
            uploadStatus.className = 'upload-status success';
        }
    }
}

// Export upload functions
window.upload = {
    handleUpload,
    deleteResume,
    downloadResume,
    previewResume,
    getResumeInfo,
    loadExistingResume,
    validateFile,
    formatFileSize
}; 