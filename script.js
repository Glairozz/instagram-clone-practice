// DOM Elements
const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.querySelector('.close-modal');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.querySelector('.select-btn');
const darkModeToggle = document.getElementById('darkModeToggle');
const storiesModal = document.getElementById('storiesModal');
const closeStories = document.querySelector('.close-stories');
const searchInput = document.getElementById('searchInput');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeLikes();
    initializeComments();
    initializeUpload();
    initializeStories();
    initializeSearch();
    initializeFollowButtons();
    initializeSaveButtons();
    initializeNotifications();
});

// Dark Mode
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme);
    
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
        
        // Add animation
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Like Functionality
function initializeLikes() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            const isLiked = icon.classList.contains('fas');
            const likesCount = button.closest('.post').querySelector('.likes-count');
            let count = parseInt(likesCount.textContent.replace(/,/g, ''));
            
            if (isLiked) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.classList.remove('liked');
                count--;
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.classList.add('liked');
                count++;
                
                // Create floating heart animation
                createFloatingHeart(button);
            }
            
            likesCount.textContent = count.toLocaleString();
        });
        
        // Double tap to like on image
        const postImage = button.closest('.post').querySelector('.post-image img');
        if (postImage) {
            postImage.addEventListener('dblclick', () => {
                if (!button.classList.contains('liked')) {
                    button.click();
                    showHeartAnimation(postImage);
                }
            });
        }
    });
}

function createFloatingHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-size: 20px;
        animation: floatUp 1s ease-out forwards;
        z-index: 1000;
    `;
    
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 1000);
}

function showHeartAnimation(image) {
    const heart = document.createElement('div');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 80px;
        color: white;
        pointer-events: none;
        animation: heartBeat 0.8s ease-out forwards;
        z-index: 10;
    `;
    
    const imageContainer = image.parentElement;
    imageContainer.appendChild(heart);
    
    setTimeout(() => heart.remove(), 800);
}

// Comment Functionality
function initializeComments() {
    const commentInputs = document.querySelectorAll('.add-comment input');
    const postButtons = document.querySelectorAll('.post-btn');
    
    commentInputs.forEach((input, index) => {
        const postBtn = postButtons[index];
        
        input.addEventListener('input', () => {
            postBtn.disabled = input.value.trim() === '';
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                addComment(input, postBtn);
            }
        });
        
        postBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                addComment(input, postBtn);
            }
        });
    });
}

function addComment(input, button) {
    const commentText = input.value.trim();
    const commentsSection = button.closest('.post').querySelector('.post-comments');
    
    const newComment = document.createElement('div');
    newComment.className = 'comment fade-in';
    newComment.innerHTML = `
        <span class="username">your_username</span>
        <span class="comment-text">${commentText}</span>
    `;
    
    commentsSection.appendChild(newComment);
    input.value = '';
    button.disabled = true;
    
    // Scroll to new comment
    newComment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Upload Functionality
function initializeUpload() {
    uploadBtn.addEventListener('click', () => {
        uploadModal.classList.add('active');
    });
    
    closeModal.addEventListener('click', () => {
        uploadModal.classList.remove('active');
    });
    
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.classList.remove('active');
        }
    });
    
    selectBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
    });
    
    // Drag and drop
    const uploadArea = document.querySelector('.upload-area');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0095f6';
        uploadArea.style.backgroundColor = 'rgba(0, 149, 246, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
    });
}

function handleFileUpload(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        // Simulate upload process
        uploadModal.querySelector('.upload-area').innerHTML = '<div class="loading"></div><p>Uploading...</p>';
        
        setTimeout(() => {
            uploadModal.classList.remove('active');
            uploadModal.querySelector('.upload-area').innerHTML = `
                <i class="fas fa-image"></i>
                <p>Drag photos and videos here</p>
                <button class="select-btn">Select from computer</button>
            `;
            
            // Show success notification
            showNotification('Post uploaded successfully! 🎉');
        }, 2000);
    }
}

// Stories Functionality
function initializeStories() {
    const stories = document.querySelectorAll('.story');
    
    stories.forEach(story => {
        story.addEventListener('click', () => {
            storiesModal.classList.add('active');
            startStoryProgress();
        });
    });
    
    closeStories.addEventListener('click', () => {
        storiesModal.classList.remove('active');
        stopStoryProgress();
    });
    
    storiesModal.addEventListener('click', (e) => {
        if (e.target === storiesModal) {
            storiesModal.classList.remove('active');
            stopStoryProgress();
        }
    });
}

let storyInterval;
function startStoryProgress() {
    const progressBar = document.querySelector('.progress-bar');
    let width = 0;
    
    storyInterval = setInterval(() => {
        width += 2;
        progressBar.style.width = width + '%';
        
        if (width >= 100) {
            stopStoryProgress();
            storiesModal.classList.remove('active');
        }
    }, 50);
}

function stopStoryProgress() {
    clearInterval(storyInterval);
    document.querySelector('.progress-bar').style.width = '0%';
}

// Search Functionality
function initializeSearch() {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        }
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            showSearchResults(searchInput.value.trim());
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !e.target.closest('.search-results')) {
            hideSearchResults();
        }
    });
}

function performSearch(query) {
    // Simulate search
    console.log('Searching for:', query);
    showSearchResults(query);
}

function showSearchResults(query) {
    // Remove existing results
    hideSearchResults();
    
    const results = document.createElement('div');
    results.className = 'search-results';
    results.innerHTML = `
        <div class="search-result-item">
            <img src="https://picsum.photos/seed/search1/32/32.jpg" alt="User">
            <div>
                <div class="search-username">user_${query}</div>
                <div class="search-fullname">User Name</div>
            </div>
        </div>
        <div class="search-result-item">
            <img src="https://picsum.photos/seed/search2/32/32.jpg" alt="User">
            <div>
                <div class="search-username">${query}_official</div>
                <div class="search-fullname">Official Account</div>
            </div>
        </div>
    `;
    
    // Position results below search bar
    const searchBar = searchInput.closest('.search-bar');
    searchBar.appendChild(results);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--secondary-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-top: 4px;
            box-shadow: var(--shadow-hover);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .search-result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .search-result-item:hover {
            background: var(--hover-color);
        }
        
        .search-result-item img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        
        .search-username {
            font-weight: 600;
            font-size: 14px;
        }
        
        .search-fullname {
            font-size: 12px;
            color: #8e8e8e;
        }
    `;
    
    if (!document.querySelector('#search-styles')) {
        style.id = 'search-styles';
        document.head.appendChild(style);
    }
}

function hideSearchResults() {
    const results = document.querySelector('.search-results');
    if (results) {
        results.remove();
    }
}

// Follow Buttons
function initializeFollowButtons() {
    const followButtons = document.querySelectorAll('.follow-btn');
    
    followButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('following')) {
                button.classList.remove('following');
                button.textContent = 'Follow';
            } else {
                button.classList.add('following');
                button.textContent = 'Following';
            }
        });
    });
}

// Save Buttons
function initializeSaveButtons() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Post saved to collection! 📌');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Post removed from collection');
            }
        });
    });
}

// Notifications
function initializeNotifications() {
    // Add notification badge to heart button
    const heartBtn = document.getElementById('heartBtn');
    if (heartBtn) {
        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        heartBtn.appendChild(badge);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--secondary-color);
        color: var(--text-color);
        padding: 12px 24px;
        border-radius: 24px;
        box-shadow: var(--shadow-hover);
        z-index: 3000;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        uploadModal.classList.remove('active');
        storiesModal.classList.remove('active');
        stopStoryProgress();
        hideSearchResults();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // N for new post
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey && 
        document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA') {
        uploadModal.classList.add('active');
    }
});

// Infinite Scroll (Mock)
let isLoading = false;
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        if (!isLoading) {
            loadMorePosts();
        }
    }
});

function loadMorePosts() {
    isLoading = true;
    
    // Show loading indicator
    const feed = document.querySelector('.feed');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="loading"></div><p>Loading more posts...</p>';
    loadingIndicator.style.cssText = `
        text-align: center;
        padding: 40px;
        color: var(--text-color);
    `;
    
    feed.appendChild(loadingIndicator);
    
    // Simulate loading delay
    setTimeout(() => {
        loadingIndicator.remove();
        
        // Add new posts (in a real app, this would fetch from an API)
        const newPost = document.querySelector('.post').cloneNode(true);
        const randomSeed = Math.random().toString(36).substring(7);
        newPost.querySelector('.user-avatar').src = `https://picsum.photos/seed/${randomSeed}/40/40.jpg`;
        newPost.querySelector('.post-image img').src = `https://picsum.photos/seed/${randomSeed}post/600/600.jpg`;
        newPost.querySelector('.username').textContent = `user_${randomSeed}`;
        
        feed.appendChild(newPost);
        
        // Reinitialize event listeners for new elements
        initializeLikes();
        initializeComments();
        initializeSaveButtons();
        
        isLoading = false;
    }, 1500);
}

// Performance: Lazy loading images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.loading = 'lazy';
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

console.log('🚀 InstaClone initialized successfully!');

// Add floating animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0.5);
            opacity: 0;
        }
    }
    
    .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }
    
    .notification {
        border: 1px solid var(--border-color);
    }
`;

document.head.appendChild(animationStyles);