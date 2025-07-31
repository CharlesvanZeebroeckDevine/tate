// Load and display projects
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

// Create project card HTML
function createProjectCard(project) {
    return `
        <div class="project-card" data-category="${project.category.toLowerCase()}" data-project-id="${project.id}">
            <div class="project-video">
                <video playsinline muted loop>
                    <source src="${project.videoUrl}" type="video/mp4">
                    Your browser doesn't support HTML5 video.
                </video>
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p class="project-year">${project.year}</p>
                    </div>
                </div>
            </div>
            <div class="project-details">
                <h4>${project.title}</h4>
                <p class="project-client">${project.client}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-skills">
                    ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                ${project.collaborators.length > 0 ? `
                    <div class="project-collaborators">
                        <p><strong>Collaborators:</strong> ${project.collaborators.join(', ')}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Filter projects by category
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter projects
    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category.toLowerCase()) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize projects page
async function initProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = await loadProjects();

    // Display all projects
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');

    // Add event listeners for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterProjects(category);
        });
    });

    // Add click event listeners to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on video controls
            if (e.target.closest('.plyr__controls')) {
                return;
            }

            const projectId = card.dataset.projectId;
            if (projectId) {
                window.location.href = `./project-detail.html?id=${projectId}`;
            }
        });
    });

    // Initialize video players
    initializeVideoPlayers();
}

// Initialize video players with Plyr
function initializeVideoPlayers() {
    const videos = document.querySelectorAll('.project-card video');
    videos.forEach(video => {
        const player = new Plyr(video, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            autoplay: false,
            muted: true,
            loop: true
        });

        // Pause video when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Video is visible
                } else {
                    player.pause();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(video);
    });
}

// Load projects when DOM is ready
document.addEventListener('DOMContentLoaded', initProjects); 