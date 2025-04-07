document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const gif = document.querySelector('.nav-gif');
    const gifImg = gif.querySelector('img');
    const nav = document.querySelector('.main_menu nav');
    
    // Get menu dimensions
    const menuRect = nav.getBoundingClientRect();
    
    // Movement settings
    const settings = {
        fleeDistance: 100,
        wanderRadius: 50,
        fleeThreshold: 150,
        flipPoint: 0.7, // 70% of width
        unflipPoint: 0.3 // 30% of width
    };
    
    // State tracking
    let state = {
        posX: menuRect.width * 0.1,
        posY: menuRect.height / 2,
        isFlipped: false,
        currentAngle: Math.random() * Math.PI * 2
    };
    
    // Update GIF position
    function updatePosition() {
        // Constrain to menu boundaries
        state.posX = Math.max(0, Math.min(
            menuRect.width - gif.offsetWidth, 
            state.posX
        ));
        state.posY = Math.max(0, Math.min(
            menuRect.height - gif.offsetHeight, 
            state.posY
        ));
        
        // Handle flipping
        if (state.posX > menuRect.width * settings.flipPoint && !state.isFlipped) {
            state.isFlipped = true;
            gifImg.style.transform = 'scaleX(-1)';
        } else if (state.posX < menuRect.width * settings.unflipPoint && state.isFlipped) {
            state.isFlipped = false;
            gifImg.style.transform = 'scaleX(1)';
        }
        
        // Apply movement
        gif.style.transform = `translate(${state.posX}px, ${state.posY}px)`;
    }
    
    // Mouse movement handler
    nav.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX - menuRect.left;
        const mouseY = e.clientY - menuRect.top;
        const gifCenterX = state.posX + gif.offsetWidth/2;
        const gifCenterY = state.posY + gif.offsetHeight/2;
        const distance = Math.sqrt(
            Math.pow(gifCenterX - mouseX, 2) + 
            Math.pow(gifCenterY - mouseY, 2)
        );
        
        if (distance < settings.fleeThreshold) {
            state.currentAngle = Math.atan2(
                gifCenterY - mouseY, 
                gifCenterX - mouseX
            );
            state.posX += Math.cos(state.currentAngle) * settings.fleeDistance;
            state.posY += Math.sin(state.currentAngle) * settings.fleeDistance;
            updatePosition();
        }
    });
    
    // Idle wandering
    setInterval(() => {
        if (Math.random() > 0.7) {
            state.currentAngle = Math.random() * Math.PI * 2;
            state.posX = menuRect.width * 0.1 + 
                Math.cos(state.currentAngle) * settings.wanderRadius;
            state.posY = menuRect.height / 2 + 
                Math.sin(state.currentAngle) * settings.wanderRadius;
            updatePosition();
        }
    }, 1000);
    
    // Initialize
    updatePosition();
});