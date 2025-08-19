const SKILL_FILTERS = [
    { key: 'Prise de vue', label: 'Prise de vue' },
    { key: 'Montage', label: 'Montage' },
    { key: 'Motion', label: 'Motion' },
    { key: 'Sound-Design', label: 'Sound-Design' }
];

// Get filter from URL parameters
function getFilterFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('filter');
}

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
        <div class="project-card" data-skills="${project.skills.join(',')}" data-project-id="${project.id}">
            <div class="project-thumbnail">
                <img src="${project.thumbnail}" alt="${project.title}">
                ${project.videos.length > 1 ? `<div class="video-count-badge">${project.videos.length} videos</div>` : ''}
                <span class="category-tag">${project.category}</span>
            </div>
            <div class="project-details">
            <div class="details-left">
                <p class="project-client">${project.client}</p>
                <p class="project-category">${project.category}</p>
                </div>
                <p class="project-year">${project.year}</p>
            </div>
        </div>
    `;
}

// Render filter buttons
function renderFilterButtons() {
    const filterButtonsContainer = document.querySelector('.filter_buttons');
    filterButtonsContainer.innerHTML = `
        <button class="filter-btn active" data-skill="all">All</button>
        ${SKILL_FILTERS.map(skill => `<button class="filter-btn" data-skill="${skill.key}">${skill.label}</button>`).join('')}
    `;
}

// Filter projects by skill
function filterProjects(skill) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(filterButtons).find(btn => btn.dataset.skill === skill);
    if (activeBtn) activeBtn.classList.add('active');

    // Filter projects
    projectCards.forEach(card => {
        if (skill === 'all') {
            card.style.display = 'block';
        } else {
            const projectSkills = card.dataset.skills.split(',');
            if (projectSkills.includes(skill)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Initialize projects page
async function initProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = await loadProjects();

    // Display all projects
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');

    // Render and add event listeners for filter buttons
    renderFilterButtons();
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const skill = e.target.dataset.skill;
            filterProjects(skill);
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

    // Check for filter parameter in URL and apply it
    const urlFilter = getFilterFromUrl();
    if (urlFilter) {
        filterProjects(urlFilter);
    }
}

document.addEventListener('DOMContentLoaded', initProjects); 