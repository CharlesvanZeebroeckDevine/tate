
let projectsCache = null;

export async function loadProjects() {
    if (projectsCache) {
        return projectsCache;
    }

    try {
        const response = await fetch('/projects.json');
        const data = await response.json();
        projectsCache = data.projects;
        return projectsCache;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}
