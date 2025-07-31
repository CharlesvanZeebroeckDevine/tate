// Get project ID from URL parameter
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

// Find project by ID
function findProjectById(projects, id) {
    return projects.find(project => project.id === parseInt(id));
}

// Update page content with project data
function updateProjectDetail(project) {
    // Update page title
    document.title = `${project.title} - Tate Edits`;

    // Update video source
    const video = document.getElementById('projectVideo');
    const source = video.querySelector('source');
    source.src = project.videoUrl;
    video.load(); // Reload video with new source

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
        collaboratorsContainer.innerHTML = '<p class="no-collaborators">Solo project</p>';
    }
}

// Initialize Plyr video player
function initializeVideoPlayer() {
    const video = document.getElementById('projectVideo');
    const player = new Plyr(video, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        autoplay: false,
        muted: true
    });
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
    const project = findProjectById(projects, projectId);

    if (!project) {
        handleProjectNotFound();
        return;
    }

    updateProjectDetail(project);
    initializeVideoPlayer();
}

// Load project detail when DOM is ready
document.addEventListener('DOMContentLoaded', initProjectDetail); 