export function initSecurity() {
    // Disable Right Click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Disable Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (View Source)
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            return false;
        }

        // Ctrl+P (Print), Ctrl+S (Save)
        if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 's')) {
            e.preventDefault();
            alert("This action is disabled.");
            return false;
        }

        // Print Screen (PrntScrn) - Attempt to clear clipboard or blur
        if (e.key === 'PrintScreen') {
            copyToClipboard("No Screenshots Allowed");
            alert("Taking screenshots is prohibited. Your account may be banned.");
            // In a real app, we would log this violation to the server
            document.body.style.display = 'none';
            setTimeout(() => {
                document.body.style.display = 'block';
            }, 1000);
        }
    });

    // Detect Focus Loss (often happens when opening snipping tool)
    /* 
    window.addEventListener('blur', () => {
        document.getElementById('security-overlay').style.display = 'flex';
    });
    
    window.addEventListener('focus', () => {
        document.getElementById('security-overlay').style.display = 'none';
    });
    */
    // Commented out simply because it's annoying during development, 
    // but this is how we'd start implementing anti-recording "obstruction".
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
}
