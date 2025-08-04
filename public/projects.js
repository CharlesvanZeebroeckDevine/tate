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
            <div class="project-thumbnail">
                <img src="${project.thumbnail}" alt="${project.title}">
                ${project.videos.length > 1 ? `<div class="video-count-badge">${project.videos.length} videos</div>` : ''}
            </div>
            <div class="project-details">
                <p class="project-client">${project.client}</p>
                <p class="project-year">${project.year}</p>
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
            const projectId = card.dataset.projectId;
            if (projectId) {
                window.location.href = `./project-detail.html?id=${projectId}`;
            }
        });
    });
}

// Load projects when DOM is ready
document.addEventListener('DOMContentLoaded', initProjects); 