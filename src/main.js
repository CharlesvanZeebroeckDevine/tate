import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const player = new Plyr('#player', {
    autoplay: true,
    muted: true,
    loop: { active: true }, // Enable looping
    controls: [], // Empty array hides all controls
    hideControls: true, // Hide controls when not hovering
    youtube: {
        noCookie: true, // Use YouTube's privacy-enhanced mode
        rel: 0, // Don't show related videos
        showinfo: 0, // Hide video info
        iv_load_policy: 3, // Hide video annotations
        modestbranding: 1, // Hide YouTube logo
        controls: 0, // Hide YouTube's native controls
    }
});

player.on('pause', () => {
    player.play();
});

window.player = player;

