// Configuration targeted for same-origin GitHub pages execution
const GAME_REPOSITORY_URL = "https://cyberwolfstudios.github.io/cookie/";
const EMBED_CONTAINER_ID = "cookieClickerContainer";

function injectSameOriginIframe() {
    const targetWrapper = document.getElementById(EMBED_CONTAINER_ID);
    if (!targetWrapper) return;

    // Create the iframe element dynamically
    const systemIframe = document.createElement('iframe');
    
    // Core parameters for dimensional rendering
    systemIframe.src = GAME_REPOSITORY_URL;
    systemIframe.style.width = "100%";
    systemIframe.style.height = "100%";
    systemIframe.style.border = "none";
    
    // Explicit settings to prevent page layout breakages on mobile screens
    systemIframe.setAttribute('scrolling', 'no');
    
    // Crucial permissions matching your shared GitHub domain architecture
    systemIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    systemIframe.setAttribute('allow', 'storage-access; gamepad');

    // Mount the configured frame directly into your HTML layout anchor
    targetWrapper.appendChild(systemIframe);
}

// Execute deployment cleanly the moment the core structural DOM finishes rendering
document.addEventListener("DOMContentLoaded", injectSameOriginIframe);
