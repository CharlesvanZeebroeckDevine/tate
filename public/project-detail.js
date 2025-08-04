// Get project ID from URL parameters
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load projects data
async function loadProjects() {
    try {
        const response = await fetch('/projects.json');
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Global variables for current project and video state
let currentProject = null;
let currentVideoIndex = 0;
let currentPlayer = null;

// Update project detail with current video
function updateProjectDetail(project, videoIndex = 0) {
    if (!project || !project.videos || project.videos.length === 0) {
        handleProjectNotFound();
        return;
    }

    const video = project.videos[videoIndex];
    if (!video) {
        handleProjectNotFound();
        return;
    }

    // Update page title
    document.title = `${video.title} - ${project.title} - Tate Edits`;

    // Apply format-based CSS class to the entire container
    const projectContainer = document.querySelector('.project-detail-container');
    projectContainer.className = `project-detail-container format-${project.format}`;

    // Create video player
    const videoContainer = document.querySelector('.project-video-container');
    videoContainer.innerHTML = `
        <video id="projectVideo" playsinline controls>
            <source src="${video.videoUrl}" type="video/mp4">
            Your browser doesn't support HTML5 video.
        </video>
    `;

    // Update project information
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectYear').textContent = project.year;
    document.getElementById('projectClient').textContent = project.client;
    document.getElementById('projectDescription').textContent = project.description;

    // Update skills
    const skillsContainer = document.getElementById('projectSkills');
    skillsContainer.innerHTML = project.skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    // Update collaborators
    const collaboratorsContainer = document.getElementById('projectCollaborators');
    if (project.collaborators && project.collaborators.length > 0) {
        collaboratorsContainer.innerHTML = project.collaborators.map(collaborator =>
            `<span class="collaborator-tag">${collaborator}</span>`
        ).join('');
    } else {
        collaboratorsContainer.innerHTML = '<p class="no-collaborators">No collaborators</p>';
    }

    // Update video navigation
    updateVideoNavigation(project, videoIndex);
}

// Update video navigation controls
function updateVideoNavigation(project, videoIndex) {
    const prevBtn = document.getElementById('prevVideo');
    const nextBtn = document.getElementById('nextVideo');
    const currentIndexSpan = document.getElementById('currentVideoIndex');
    const totalVideosSpan = document.getElementById('totalVideos');

    const totalVideos = project.videos.length;

    // Update counter
    currentIndexSpan.textContent = videoIndex + 1;
    totalVideosSpan.textContent = totalVideos;

    // Update button states
    prevBtn.disabled = videoIndex === 0;
    nextBtn.disabled = videoIndex === totalVideos - 1;

    // Show/hide navigation if only one video
    const navigation = document.querySelector('.video-navigation');
    if (totalVideos <= 1) {
        navigation.style.display = 'none';
    } else {
        navigation.style.display = 'flex';
    }
}

// Navigate to previous video
function navigateToPreviousVideo() {
    if (currentProject && currentVideoIndex > 0) {
        currentVideoIndex--;
        updateProjectDetail(currentProject, currentVideoIndex);
        initializeVideoPlayer();
    }
}

// Navigate to next video
function navigateToNextVideo() {
    if (currentProject && currentVideoIndex < currentProject.videos.length - 1) {
        currentVideoIndex++;
        updateProjectDetail(currentProject, currentVideoIndex);
        initializeVideoPlayer();
    }
}

// Initialize Plyr video player
function initializeVideoPlayer() {
    const video = document.getElementById('projectVideo');
    if (video && video.tagName === 'VIDEO') {
        // Destroy existing player if it exists
        if (currentPlayer) {
            currentPlayer.destroy();
        }

        currentPlayer = new Plyr(video, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            autoplay: false,
            muted: true
        });
    }
}

// Handle project not found
function handleProjectNotFound() {
    const container = document.querySelector('.project-detail-container');
    container.innerHTML = `
        <div class="error-container">
            <h2>Project Not Found</h2>
            <p>The project you're looking for doesn't exist.</p>
            <a href="./projects.html" class="back-link">← Back to Projects</a>
        </div>
    `;
}

// Initialize project detail page
async function initProjectDetail() {
    const projectId = getProjectIdFromUrl();

    if (!projectId) {
        handleProjectNotFound();
        return;
    }

    const projects = await loadProjects();
    currentProject = projects.find(project => project.id == projectId);

    if (!currentProject) {
        handleProjectNotFound();
        return;
    }

    // Initialize with first video
    currentVideoIndex = 0;
    updateProjectDetail(currentProject, currentVideoIndex);

    // Add navigation event listeners
    document.getElementById('prevVideo').addEventListener('click', navigateToPreviousVideo);
    document.getElementById('nextVideo').addEventListener('click', navigateToNextVideo);

    // Initialize video player
    initializeVideoPlayer();
}

initProjectDetail();