import './cursor.js';
import { start } from './router.js';

// Register service worker once for the whole app (HTTPS required)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
}

start();


