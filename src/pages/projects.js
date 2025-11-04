import { buildProjectsIntroTimeline, animateProjectCards, createProjectsScrollTriggers } from './projects.gsap.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animation variables
let introTl = null;
let scrollTriggers = [];

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
    const firstVideo = project.videos[0];
    // Use previewUrl if available, otherwise fallback to videoUrl
    const previewUrl = firstVideo?.previewUrl || firstVideo?.videoUrl || '';
    return `
        <div class="project-card" data-skills="${project.skills.join(',')}" data-project-id="${project.id}">
            <div class="project-thumbnail">
                <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" decoding="async">
                <video class="project-preview-video" 
                       muted 
                       loop 
                       playsinline 
                       preload="none"
                       data-src="${previewUrl}">
                </video>
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
export async function init(rootEl, { search } = {}) {
    const projectsGrid = rootEl.querySelector('#projectsGrid');
    const projects = await loadProjects();

    // Render and add event listeners for filter buttons
    renderFilterButtons();

    // Build and start intro timeline
    introTl = buildProjectsIntroTimeline();

    // Display all projects
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');

    // Animate project cards after they're loaded
    animateProjectCards();

    // Create scroll triggers for project cards
    scrollTriggers = createProjectsScrollTriggers();

    const filterButtons = rootEl.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const skill = e.target.dataset.skill;
            filterProjects(skill);
        });
    });

    // Add click event listeners to project cards
    const projectCards = rootEl.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.dataset.projectId;
            if (projectId) {
                // SPA navigation to project detail while preserving query param
                const href = `/project-detail?id=${projectId}`;
                if (window.__spaNavigate) {
                    window.__spaNavigate(href);
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    // Add hover preview for desktop only with concurrent load limits
    const mediaQuery = window.matchMedia('(min-width: 768px) and (hover: hover)');
    console.log('Video preview media query:', {
        matches: mediaQuery.matches,
        minWidth: window.innerWidth >= 768,
        hasHover: window.matchMedia('(hover: hover)').matches,
        projectCardsCount: projectCards.length
    });

    if (mediaQuery.matches) {
        let activeLoads = 0;
        const MAX_CONCURRENT_LOADS = 1; // Only load one video at a time
        const HOVER_DELAY = 500; // Increased delay to 500ms

        projectCards.forEach((card, index) => {
            let hoverTimeout;
            const video = card.querySelector('.project-preview-video');
            let isLoading = false;
            let isHovering = false;

            // Debug: Log if video element is missing or has no data-src
            if (!video) {
                console.warn(`Project card ${index} missing video element`);
                return;
            }
            if (!video.dataset.src) {
                console.warn(`Project card ${index} video missing data-src attribute:`, video);
                return;
            }

            card.addEventListener('mouseenter', () => {
                isHovering = true;
                console.log(`Mouseenter on card ${index}, video data-src:`, video.dataset.src);
                // Delay to avoid loading on quick hover-overs
                hoverTimeout = setTimeout(() => {
                    // Check if we're still hovering after the delay
                    if (!isHovering || !video || !video.dataset.src) {
                        console.log(`Skipping load for card ${index}:`, { isHovering, hasVideo: !!video, hasDataSrc: !!video?.dataset.src });
                        return;
                    }

                    // If video is already loaded and ready, just play it
                    if (video.src && video.readyState >= 2) {
                        console.log(`Playing already-loaded video for card ${index}`);
                        card.classList.add('video-ready', 'video-playing');
                        video.currentTime = 0;
                        video.play().catch(err => {
                            // Ignore AbortError (expected when pause interrupts play)
                            if (err.name !== 'AbortError') {
                                console.log('Preview play failed:', err);
                            }
                        });
                        return;
                    }

                    // Only load new videos if under the limit
                    if (!isLoading && activeLoads < MAX_CONCURRENT_LOADS) {
                        console.log(`Loading video for card ${index}:`, video.dataset.src);
                        isLoading = true;
                        activeLoads++;

                        // Load video source - ensure path is correct (handle both ./ and /)
                        let videoSrc = video.dataset.src;
                        // Normalize path: if it starts with ./, convert to absolute path
                        if (videoSrc.startsWith('./')) {
                            videoSrc = videoSrc.substring(1); // Remove leading ./
                        }
                        video.src = videoSrc;
                        video.currentTime = 0;
                        video.load(); // Explicitly load the video after setting src

                        // Add error handler for video loading
                        const handleError = () => {
                            console.error(`Video failed to load for card ${index}:`, videoSrc, video.error);
                            isLoading = false;
                            activeLoads--;
                            if (video.error) {
                                console.error('Video error details:', {
                                    code: video.error.code,
                                    message: video.error.message
                                });
                            }
                        };
                        video.addEventListener('error', handleError, { once: true });

                        // Add loaded handler for debugging and to hide thumbnail
                        const handleLoaded = () => {
                            console.log(`Video loaded for card ${index}, readyState:`, video.readyState);
                            // Hide thumbnail when video is ready
                            const thumbnailImg = card.querySelector('.project-thumbnail img');
                            if (thumbnailImg) {
                                card.classList.add('video-ready');
                            }
                        };
                        video.addEventListener('loadeddata', handleLoaded, { once: true });

                        // Try to play the preview
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    console.log(`Video playing for card ${index}`);
                                    // Video started playing successfully
                                    // Hide thumbnail when video is playing
                                    card.classList.add('video-playing');
                                    // Only keep playing if we're still hovering
                                    if (!isHovering) {
                                        video.pause();
                                        video.currentTime = 0;
                                        card.classList.remove('video-playing');
                                    }
                                    // Reset loading state once playing
                                    isLoading = false;
                                    activeLoads--;
                                })
                                .catch(err => {
                                    // AbortError is expected when pause() interrupts play() - don't treat as error                                             
                                    if (err.name === 'AbortError') {
                                        console.log(`Video play aborted for card ${index} (expected)`);
                                        // User moved mouse away, which is fine - just cleanup                                                                  
                                        isLoading = false;
                                        activeLoads--;
                                    } else {
                                        // Real error - log and cleanup
                                        console.error(`Preview play failed for card ${index}:`, err);
                                        isLoading = false;
                                        activeLoads--;
                                        // Only unload on real errors, not AbortError                                                                           
                                        if (isHovering) {
                                            // Still hovering but play failed - unload to prevent retry loops                                                   
                                            video.src = '';
                                            video.load();
                                        }
                                    }
                                });
                        } else {
                            // Play() returned undefined (synchronous play)
                            console.log(`Video play() returned undefined for card ${index}`);
                            isLoading = false;
                            activeLoads--;
                        }
                    }
                }, HOVER_DELAY);
            });

            card.addEventListener('mouseleave', () => {
                isHovering = false;
                clearTimeout(hoverTimeout);
                // Remove classes to show thumbnail again
                card.classList.remove('video-playing', 'video-ready');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                    // If video was still loading, cancel it and free resources
                    if (isLoading) {
                        console.log(`Cancelling video load for card ${index} on mouseleave`);
                        video.src = '';
                        video.load(); // Reset video element
                        isLoading = false;
                        activeLoads = Math.max(0, activeLoads - 1); // Ensure non-negative
                    } else {
                        console.log(`Paused video for card ${index} on mouseleave`);
                    }
                }
            });
        });
    }

    // Check for filter parameter in URL and apply it
    const urlFilter = new URLSearchParams(search || window.location.search).get('filter');
    if (urlFilter) {
        filterProjects(urlFilter);
    }
}

export async function destroy() {
    // Clean up GSAP animations
    if (introTl) {
        introTl.kill();
        introTl = null;
    }

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
    });

    scrollTriggers = [];

    // Events are attached to elements that will be removed on unmount; no global cleanup required
}