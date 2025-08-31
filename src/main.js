import './cursor.js';
import { start } from './router.js';

// Register service worker once for the whole app
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
}

start();


