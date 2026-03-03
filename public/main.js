/* ===============================
   LOCALSTORAGE FUNCTIONS
   =============================== */

// Get all uploaded files from localStorage
function getUploadedFiles() {
    const files = localStorage.getItem('glp_uploaded_files');
    return files ? JSON.parse(files) : [];
}

// Save files to localStorage
function saveUploadedFiles(files) {
    localStorage.setItem('glp_uploaded_files', JSON.stringify(files));
}

// Add a new file to storage
function addFileToStorage(fileData) {
    const files = getUploadedFiles();
    files.unshift(fileData); // Add to beginning of array
    saveUploadedFiles(files);
}

// Get file by ID
function getFileById(fileId) {
    const files = getUploadedFiles();
    return files.find(file => file.file_id === fileId);
}

// Calculate file status based on expiry date
function calculateFileStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
        return 'Expired';
    } else if (daysUntilExpiry <= 30) {
        return 'Expiring Soon';
    } else {
        return 'Active';
    }
}

/* ===============================
   UTILITY FUNCTIONS
   =============================== */

// Show toast notification
function showToast(message, type = 'success', description = '') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <div class="toast-content">
            <p class="toast-title">${message}</p>
            ${description ? `<p class="toast-message">${description}</p>` : ''}
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Generate unique File ID
function generateFileId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `GLP-${year}-${random}`;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format date for display (short format)
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Mock database for demo files
const mockDatabase = {
    'GLP-2025-123456': {
        file_id: 'GLP-2025-123456',
        file_name: 'Annual_Report_2024.pdf',
        file_size: 2457600,
        status: 'Active',
        expiry_date: '2030-12-31',
        location: 'B1 - R3',
        building: 'B1',
        room: 'R3',
        upload_date: '2025-01-15',
        retention_years: 5
    },
    'GLP-2024-789012': {
        file_id: 'GLP-2024-789012',
        file_name: 'Financial_Records_Q2.xlsx',
        file_size: 1048576,
        status: 'Expired',
        expiry_date: '2024-06-30',
        location: 'B2 - R5',
        building: 'B2',
        room: 'R5',
        upload_date: '2019-07-01',
        retention_years: 5
    },
    'GLP-2025-345678': {
        file_id: 'GLP-2025-345678',
        file_name: 'Research_Data_2025.docx',
        file_size: 5242880,
        status: 'Active',
        expiry_date: '2032-03-15',
        location: 'B3 - R1',
        building: 'B3',
        room: 'R1',
        upload_date: '2025-03-15',
        retention_years: 7
    }
};

/* ===============================
   UPLOAD PAGE LOGIC
   =============================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Upload Form Handler
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        const fileInput = document.getElementById('fileInput');
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const successMessage = document.getElementById('successMessage');
        const generatedFileId = document.getElementById('generatedFileId');

        // File input change handler
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                filePreview.style.display = 'flex';
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                
                // Clear error
                document.getElementById('fileError').textContent = '';
            } else {
                filePreview.style.display = 'none';
            }
        });

        // Form submission
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear all errors
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            
            // Validation
            let isValid = true;
            
            const file = fileInput.files[0];
            if (!file) {
                document.getElementById('fileError').textContent = 'Please select a file to upload';
                isValid = false;
            }
            
            const retention = document.getElementById('retentionInput').value;
            if (!retention || retention <= 0) {
                document.getElementById('retentionError').textContent = 'Please enter a valid retention period';
                isValid = false;
            }
            
            const building = document.getElementById('buildingInput').value.trim();
            if (!building) {
                document.getElementById('buildingError').textContent = 'Building is required';
                isValid = false;
            }
            
            const room = document.getElementById('roomInput').value.trim();
            if (!room) {
                document.getElementById('roomError').textContent = 'Room is required';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Generate File ID
            const fileId = generateFileId();
            const uploadDate = new Date().toISOString().split('T')[0];
            
            // Calculate expiry date
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + parseInt(retention));
            const expiryDateStr = expiryDate.toISOString().split('T')[0];
            
            // Create file data object
            const fileData = {
                file_id: fileId,
                file_name: file.name,
                file_size: file.size,
                building: building,
                room: room,
                location: `${building} - ${room}`,
                retention_years: parseInt(retention),
                upload_date: uploadDate,
                expiry_date: expiryDateStr,
                status: 'Active'
            };
            
            // Save to localStorage
            addFileToStorage(fileData);
            
            generatedFileId.textContent = fileId;
            
            // Hide form, show success message
            uploadForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Show toast
            showToast('File uploaded successfully!', 'success', `Your File ID is: ${fileId}`);
            
            // Don't auto-hide success message - let user keep it visible
            // Add buttons to the success message
            const successBox = document.getElementById('successMessage');
            if (!document.getElementById('successActions')) {
                const actionsDiv = document.createElement('div');
                actionsDiv.id = 'successActions';
                actionsDiv.style.marginTop = '2rem';
                actionsDiv.style.display = 'flex';
                actionsDiv.style.gap = '1rem';
                actionsDiv.style.justifyContent = 'center';
                actionsDiv.innerHTML = `
                    <a href="myfiles.html" class="btn btn-primary">
                        <i class="fa-solid fa-folder"></i> View My Files
                    </a>
                    <button id="uploadAnotherBtn" class="btn btn-outline">
                        <i class="fa-solid fa-upload"></i> Upload Another File
                    </button>
                `;
                successBox.appendChild(actionsDiv);
                
                // Upload another button handler
                document.getElementById('uploadAnotherBtn').addEventListener('click', function() {
                    uploadForm.reset();
                    filePreview.style.display = 'none';
                    uploadForm.style.display = 'block';
                    successMessage.style.display = 'none';
                    actionsDiv.remove();
                });
            }
        });
    }

    /* ===============================
       SEARCH PAGE LOGIC
       =============================== */

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        const searchInput = document.getElementById('searchInput');
        const searchError = document.getElementById('searchError');
        const errorMessage = document.getElementById('errorMessage');
        const searchResults = document.getElementById('searchResults');

        // Sample ID buttons
        const sampleIdBtns = document.querySelectorAll('.sample-id-btn');
        sampleIdBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                searchInput.value = this.getAttribute('data-id');
                searchError.style.display = 'none';
            });
        });

        // Search button click
        searchBtn.addEventListener('click', performSearch);

        // Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Copy button
        document.getElementById('copyBtn')?.addEventListener('click', function() {
            const fileId = document.getElementById('resultFileId').textContent;
            navigator.clipboard.writeText(fileId);
            showToast('Copied to clipboard!', 'success');
        });

        // Search another button
        document.getElementById('searchAnotherBtn')?.addEventListener('click', function() {
            searchResults.style.display = 'none';
            searchInput.value = '';
            searchInput.focus();
        });

        // Copy all details button
        document.getElementById('copyAllBtn')?.addEventListener('click', function() {
            const fileId = document.getElementById('resultFileId').textContent;
            const result = getFileById(fileId) || mockDatabase[fileId];
            if (result) {
                const details = JSON.stringify(result, null, 2);
                navigator.clipboard.writeText(details);
                showToast('All details copied!', 'success');
            }
        });

        function performSearch() {
            const query = searchInput.value.trim();
            
            // Hide previous results and errors
            searchError.style.display = 'none';
            searchResults.style.display = 'none';
            
            if (!query) {
                errorMessage.textContent = 'Please enter a File ID';
                searchError.style.display = 'flex';
                return;
            }
            
            // Simulate loading delay
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Searching...</span>';
            
            setTimeout(() => {
                // Search in uploaded files first, then in mock database
                let result = getFileById(query);
                if (!result) {
                    result = mockDatabase[query];
                }
                
                if (result) {
                    // Update status dynamically
                    result.status = calculateFileStatus(result.expiry_date);
                    
                    // Display results
                    displaySearchResults(result);
                    showToast('File found!', 'success', `Status: ${result.status}`);
                } else {
                    errorMessage.textContent = 'File ID not found in the archive';
                    searchError.style.display = 'flex';
                    showToast('File not found', 'error', 'Please check the File ID and try again');
                }
                
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> <span>Search</span>';
            }, 800);
        }

        function displaySearchResults(result) {
            // Set File ID
            document.getElementById('resultFileId').textContent = result.file_id;
            
            // Set Status Badge
            const statusBadge = document.getElementById('statusBadge');
            if (result.status === 'Active') {
                statusBadge.className = 'badge badge-success';
                statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Active';
                
                const statusIcon = document.getElementById('resultStatusIcon');
                statusIcon.className = 'fa-solid fa-check-circle';
                statusIcon.style.color = '#2e7d32';
                
                document.getElementById('resultStatus').textContent = result.status;
                document.getElementById('resultStatus').style.color = '#2e7d32';
                document.getElementById('resultStatusText').textContent = 'Available for retrieval';
            } else if (result.status === 'Expiring Soon') {
                statusBadge.className = 'badge badge-warning';
                statusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Expiring Soon';
                
                const statusIcon = document.getElementById('resultStatusIcon');
                statusIcon.className = 'fa-solid fa-triangle-exclamation';
                statusIcon.style.color = '#f57c00';
                
                document.getElementById('resultStatus').textContent = result.status;
                document.getElementById('resultStatus').style.color = '#f57c00';
                document.getElementById('resultStatusText').textContent = 'Expires within 30 days';
            } else {
                statusBadge.className = 'badge badge-danger';
                statusBadge.innerHTML = '<i class="fa-solid fa-times-circle"></i> Expired';
                
                const statusIcon = document.getElementById('resultStatusIcon');
                statusIcon.className = 'fa-solid fa-times-circle';
                statusIcon.style.color = '#c62828';
                
                document.getElementById('resultStatus').textContent = result.status;
                document.getElementById('resultStatus').style.color = '#c62828';
                document.getElementById('resultStatusText').textContent = 'Retention period has ended';
            }
            
            // Set Location
            document.getElementById('resultLocation').textContent = result.location;
            document.getElementById('resultLocationDetails').textContent = 
                `Building: ${result.building} • Room: ${result.room}`;
            
            // Set Expiry Date
            document.getElementById('resultExpiry').textContent = formatDate(result.expiry_date);
            document.getElementById('resultRetention').textContent = 
                `Retention: ${result.retention_years} years`;
            
            // Set Upload Date
            document.getElementById('resultUpload').textContent = formatDate(result.upload_date);
            
            // Show results
            searchResults.style.display = 'block';
        }
    }

    /* ===============================
       MY FILES PAGE LOGIC
       =============================== */

    const filesTableBody = document.getElementById('filesTableBody');
    if (filesTableBody) {
        let currentFiles = [];
        let currentFileForModal = null;

        // Load and display files
        function loadFiles() {
            currentFiles = getUploadedFiles();
            
            // Update counts
            document.getElementById('totalCount').textContent = currentFiles.length;
            const activeCount = currentFiles.filter(f => calculateFileStatus(f.expiry_date) === 'Active').length;
            document.getElementById('activeCount').textContent = activeCount;
            
            if (currentFiles.length === 0) {
                document.getElementById('emptyState').style.display = 'block';
                document.getElementById('filesContainer').style.display = 'none';
            } else {
                document.getElementById('emptyState').style.display = 'none';
                document.getElementById('filesContainer').style.display = 'block';
                renderFiles(currentFiles);
            }
        }

        // Render files to table
        function renderFiles(files) {
            filesTableBody.innerHTML = '';
            
            files.forEach(file => {
                const status = calculateFileStatus(file.expiry_date);
                const statusClass = status === 'Active' ? 'success' : status === 'Expiring Soon' ? 'warning' : 'danger';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><span class="file-id-text">${file.file_id}</span></td>
                    <td><span class="file-name-text">${file.file_name}</span></td>
                    <td>
                        <span class="location-text">
                            <i class="fa-solid fa-map-pin"></i>
                            ${file.location}
                        </span>
                    </td>
                    <td><span class="date-text">${formatDateShort(file.upload_date)}</span></td>
                    <td><span class="date-text">${formatDateShort(file.expiry_date)}</span></td>
                    <td><span class="badge badge-${statusClass}">${status}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn btn-outline btn-sm view-btn" data-id="${file.file_id}">
                                <i class="fa-solid fa-eye"></i>
                                View
                            </button>
                        </div>
                    </td>
                `;
                filesTableBody.appendChild(row);
            });

            // Add click handlers to view buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const fileId = this.getAttribute('data-id');
                    const file = currentFiles.find(f => f.file_id === fileId);
                    if (file) {
                        currentFileForModal = file;
                        showFileModal(file);
                    }
                });
            });
        }

        // Filter files
        function filterFiles() {
            const statusFilter = document.getElementById('statusFilter').value;
            const sortFilter = document.getElementById('sortFilter').value;
            
            let filtered = [...currentFiles];
            
            // Apply status filter
            if (statusFilter !== 'all') {
                filtered = filtered.filter(f => calculateFileStatus(f.expiry_date) === statusFilter);
            }
            
            // Apply sorting
            if (sortFilter === 'newest') {
                filtered.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
            } else if (sortFilter === 'oldest') {
                filtered.sort((a, b) => new Date(a.upload_date) - new Date(b.upload_date));
            } else if (sortFilter === 'expiry') {
                filtered.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
            }
            
            renderFiles(filtered);
        }

        // Event listeners for filters
        document.getElementById('statusFilter')?.addEventListener('change', filterFiles);
        document.getElementById('sortFilter')?.addEventListener('change', filterFiles);

        // Clear all button
        document.getElementById('clearAllBtn')?.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all upload history? This cannot be undone.')) {
                localStorage.removeItem('glp_uploaded_files');
                loadFiles();
                showToast('All upload history cleared', 'success');
            }
        });

        // Initial load
        loadFiles();
    }

    // Modal functions (global scope for onclick handlers)
    window.showFileModal = function(file) {
        const status = calculateFileStatus(file.expiry_date);
        
        document.getElementById('modalFileId').textContent = file.file_id;
        document.getElementById('modalFileName').textContent = file.file_name;
        document.getElementById('modalFileSize').textContent = formatFileSize(file.file_size);
        document.getElementById('modalBuilding').textContent = file.building;
        document.getElementById('modalRoom').textContent = file.room;
        document.getElementById('modalUploadDate').textContent = formatDate(file.upload_date);
        document.getElementById('modalRetention').textContent = `${file.retention_years} years`;
        document.getElementById('modalExpiryDate').textContent = formatDate(file.expiry_date);
        document.getElementById('modalStatus').textContent = status;
        
        const statusEl = document.getElementById('modalStatus');
        if (status === 'Active') {
            statusEl.style.color = '#2e7d32';
        } else if (status === 'Expiring Soon') {
            statusEl.style.color = '#f57c00';
        } else {
            statusEl.style.color = '#c62828';
        }
        
        document.getElementById('fileModal').style.display = 'flex';
    };

    window.closeModal = function() {
        document.getElementById('fileModal').style.display = 'none';
    };

    window.copyFileId = function() {
        const fileId = document.getElementById('modalFileId').textContent;
        navigator.clipboard.writeText(fileId);
        showToast('File ID copied!', 'success');
    };

    window.copyAllDetails = function() {
        if (document.getElementById('filesTableBody')) {
            const currentFileForModal = getFileById(document.getElementById('modalFileId').textContent);
            if (currentFileForModal) {
                const details = JSON.stringify(currentFileForModal, null, 2);
                navigator.clipboard.writeText(details);
                showToast('All details copied!', 'success');
            }
        }
    };

    // Close modal on overlay click
    document.querySelector('.modal-overlay')?.addEventListener('click', function() {
        closeModal();
    });

    /* ===============================
       DASHBOARD CHARTS
       =============================== */

    // Check if we're on the dashboard page
    const uploadChart = document.getElementById('uploadChart');
    const statusChart = document.getElementById('statusChart');
    
    if (uploadChart && typeof Chart !== 'undefined') {
        // Monthly Upload Trend Chart
        new Chart(uploadChart, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Uploads',
                    data: [65, 78, 90, 81, 95, 102],
                    backgroundColor: 'rgba(10, 31, 68, 0.8)',
                    borderColor: '#0a1f44',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    if (statusChart && typeof Chart !== 'undefined') {
        // Status Distribution Pie Chart
        new Chart(statusChart, {
            type: 'pie',
            data: {
                labels: ['Active', 'Expiring Soon', 'Expired'],
                datasets: [{
                    data: [1089, 43, 158],
                    backgroundColor: [
                        '#2e7d32',
                        '#f97316',
                        '#c62828'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }

    /* ===============================
       SMOOTH SCROLL ANIMATIONS
       =============================== */

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and feature elements
    document.querySelectorAll('.card, .feature-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
