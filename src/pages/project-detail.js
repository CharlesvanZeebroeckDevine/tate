import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
// Get project ID from URL parameters
function getProjectIdFromSearch(search) {
    const urlParams = new URLSearchParams(search || window.location.search);
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

// Ensure current video fully unloads to stop network activity
function teardownCurrentVideo() {
    try {
        if (currentPlayer) {
            try { currentPlayer.pause(); } catch (_) { }
            try { currentPlayer.destroy(); } catch (_) { }
            currentPlayer = null;
        }

        const existingVideo = document.getElementById('projectVideo');
        if (existingVideo) {
            try { existingVideo.pause(); } catch (_) { }
            // Remove sources to abort any ongoing download
            existingVideo.removeAttribute('src');
            const sources = existingVideo.querySelectorAll('source');
            sources.forEach(src => src.remove());
            // Calling load() after removing src ensures network is aborted
            try { existingVideo.load(); } catch (_) { }
        }

        // Clear any previously moved controls
        const customControlsContainer = document.querySelector('.custom-plyr-controls');
        if (customControlsContainer) {
            customControlsContainer.innerHTML = '';
        }
    } catch (_) {
        // no-op
    }
}

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
    let existingVideo = document.getElementById('projectVideo');

    if (existingVideo) {
        // Update existing video instead of replacing it
        existingVideo.pause();
        const source = existingVideo.querySelector('source');
        if (source) {
            source.src = video.videoUrl;
        } else {
            const newSource = document.createElement('source');
            newSource.src = video.videoUrl;
            newSource.type = 'video/mp4';
            existingVideo.appendChild(newSource);
        }
        existingVideo.load();
    } else {
        // No existing video, create new one
        videoContainer.innerHTML = `
            <video id="projectVideo" playsinline controls preload="metadata" muted>
                <source src="${video.videoUrl}" type="video/mp4">
                Your browser doesn't support HTML5 video.
            </video>
        `;
    }

    // Teardown only the player, not the video element
    if (currentPlayer) {
        try { currentPlayer.pause(); } catch (_) { }
        try { currentPlayer.destroy(); } catch (_) { }
        currentPlayer = null;
    }

    // Clear any previously moved controls
    const customControlsContainer = document.querySelector('.custom-plyr-controls');
    if (customControlsContainer) {
        customControlsContainer.innerHTML = '';
    }

    // Update project information
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectYear').textContent = project.year;
    document.getElementById('projectClient').textContent = project.client;
    document.getElementById('projectDescription').textContent = project.description;
    document.getElementById('projectCategory').textContent = project.category;


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
            try { currentPlayer.pause(); } catch (_) { }
            try { currentPlayer.destroy(); } catch (_) { }
        }

        // Clear the custom controls container before creating new player
        const customControlsContainer = document.querySelector('.custom-plyr-controls');
        if (customControlsContainer) {
            customControlsContainer.innerHTML = '';
        }

        currentPlayer = new Plyr(video, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            autoplay: true,
            muted: true,
            tooltips: { controls: true, seek: true },
            settings: [] // Remove settings menu
        });

        // Move controls to custom container after player is ready
        currentPlayer.on('ready', (event) => {
            const instance = event.detail.plyr;
            const controls = instance.elements.controls;

            // Only move controls if they exist and haven't been moved yet
            if (controls && controls.parentElement !== customControlsContainer) {
                customControlsContainer.appendChild(controls);
            }

            // Ensure video is muted and try to autoplay (Safari compatibility)
            const videoElement = instance.media;
            if (videoElement) {
                videoElement.muted = true;
                // Try to play after a short delay to ensure everything is ready
                setTimeout(() => {
                    const playPromise = videoElement.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('Autoplay prevented:', error);
                            // Show a play button or indicator that user needs to interact
                        });
                    }
                }, 100);
            }
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
            <a href="/projects" class="back-link">← Back to Projects</a>
        </div>
    `;
}

// Initialize project detail page
export async function init(_rootEl, { search } = {}) {
    // Hide the mask in case user navigated directly to this page
    const mask = document.querySelector('.mask');
    if (mask) {
        mask.style.display = 'none';
    }

    const projectId = getProjectIdFromSearch(search);

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

    // Add user interaction listener for Safari autoplay
    let hasUserInteracted = false;
    const handleUserInteraction = () => {
        if (!hasUserInteracted && currentPlayer) {
            hasUserInteracted = true;
            const videoElement = currentPlayer.media;
            if (videoElement && videoElement.paused) {
                videoElement.muted = true;
                videoElement.play().catch(error => {
                    console.log('Play failed after user interaction:', error);
                });
            }
        }
    };

    // Listen for various user interactions that Safari allows
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
}

export async function destroy() {
    try { teardownCurrentVideo(); } catch (_) { }
}