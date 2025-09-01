const viewContainerId = 'view';
let current = {
    module: null,
    rootEl: null,
    path: null,
};

const routes = [
    {
        name: 'home',
        match: (path) => path === '/' || path === '/index.html',
        viewUrl: '/views/home.html',
        moduleLoader: () => import('./pages/home.js'),
    },
    {
        name: 'projects',
        match: (path) => path === '/projects' || path === '/projects.html',
        viewUrl: '/views/projects.html',
        moduleLoader: () => import('./pages/projects.js'),
    },
    {
        name: 'project-detail',
        match: (path) => path === '/project-detail' || path === '/project-detail.html',
        viewUrl: '/views/project-detail.html',
        moduleLoader: () => import('./pages/project-detail.js'),
    },
];

function sameOrigin(href) {
    try {
        const url = new URL(href, window.location.origin);
        return url.origin === window.location.origin;
    } catch {
        return false;
    }
}

function isAssetPath(pathname) {
    return /\.(png|jpe?g|gif|svg|webp|mp4|webm|mp3|wav|css|js|json|txt)$/i.test(pathname);
}

async function fetchView(url) {
    const res = await fetch(url, { headers: { 'X-Requested-With': 'spa' } });
    if (!res.ok) throw new Error(`Failed to fetch view: ${url}`);
    return res.text();
}

function findRoute(pathname) {
    return routes.find(r => r.match(pathname)) || routes[0];
}

function scrollToHash(hash) {
    if (!hash) return;
    const id = hash.startsWith('#') ? hash.slice(1) : hash;
    const el = document.getElementById(id);
    if (el) {
        try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { }
    }
}

function navigateSamePageHash(hash, { replace = false } = {}) {
    const h = hash.startsWith('#') ? hash : `#${hash}`;
    const url = new URL(window.location.href);
    url.hash = h;
    try {
        if (replace) {
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        } else {
            window.history.pushState({}, '', url.pathname + url.search + url.hash);
        }
    } catch (_) { window.location.hash = h; }
    scrollToHash(h);
}

async function mount(route, ctx, replace = false) {
    const container = document.getElementById(viewContainerId);
    if (!container) return;

    // Prepare new view element
    const html = await fetchView(route.viewUrl);
    const wrapper = document.createElement('div');
    wrapper.className = 'view-wrapper';
    wrapper.innerHTML = html;


    // Unmount existing module
    if (current.module && typeof current.module.destroy === 'function') {
        try { await current.module.destroy(); } catch { /* no-op */ }
    }

    // Swap content
    container.innerHTML = '';
    container.appendChild(wrapper);

    // Ensure we start at the top on every navigation
    try { window.scrollTo(0, 0); } catch (_) { }

    // Load module and init
    const pageModule = await route.moduleLoader();
    const ctxObj = { path: window.location.pathname, search: window.location.search, params: new URLSearchParams(window.location.search) };
    if (pageModule && typeof pageModule.init === 'function') {
        await pageModule.init(wrapper, ctxObj);
    }

    // Save current
    current = { module: pageModule, rootEl: wrapper, path: window.location.pathname };

    // If there is a hash in the current URL, ensure we scroll to it after mount
    if (window.location.hash) scrollToHash(window.location.hash);
}

export async function navigate(href, { replace = false } = {}) {
    const url = new URL(href, window.location.origin);
    const route = findRoute(url.pathname);
    if (!route) return;

    if (replace) {
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } else {
        window.history.pushState({}, '', url.pathname + url.search + url.hash);
    }

    await mount(route, { path: url.pathname, search: url.search });
    if (url.hash) scrollToHash(url.hash);
}

function onLinkClick(e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return; // only left clicks
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const anchor = e.composedPath ? e.composedPath().find(el => el && el.tagName === 'A') : e.target.closest('a');
    if (!anchor) return;
    if (anchor.target && anchor.target.toLowerCase() === '_blank') return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    // Handle same-page hash links with smooth scroll and without SPA navigation
    if (href.startsWith('#')) {
        e.preventDefault();
        navigateSamePageHash(href);
        return;
    }
    if (href.startsWith('/#')) {
        e.preventDefault();
        navigateSamePageHash(href.slice(1));
        return;
    }

    if (!sameOrigin(href)) return;
    const url = new URL(href, window.location.origin);
    if (isAssetPath(url.pathname)) return;

    const route = findRoute(url.pathname);
    if (!route) return;

    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
}

function onPopState() {
    const route = findRoute(window.location.pathname);
    mount(route, { path: window.location.pathname, search: window.location.search }, true);
}

export async function start() {
    // Global link interception
    document.addEventListener('click', onLinkClick);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', () => scrollToHash(window.location.hash));

    // Always manage scroll position manually across navigations
    try { if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; } catch (_) { }
    // Expose navigate helper so page modules can navigate programmatically
    window.__spaNavigate = (href) => navigate(href);

    // Initial navigation
    await navigate(window.location.pathname + window.location.search + window.location.hash, { replace: true });
}


