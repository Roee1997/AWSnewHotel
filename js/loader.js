// פונקציה לטעינת סקריפט בצורה אסינכרונית
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;

    script.onload = () => {
        console.log(`${src} loaded successfully.`);
        if (callback) callback();
    };

    script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
    };

    document.head.appendChild(script);
}

// טען common.js תחילה
loadScript('js/common.js', () => {
    console.log('common.js loaded.');

    // בדוק אם ה-Header וה-Footer נטענו
    const checkHeaderFooterLoaded = () => {
        const headerElement = document.querySelector('header');
        const footerElement = document.querySelector('footer');
        const authContainer = document.querySelector('#authContainer'); // בדוק גם את authContainer

        if (
            headerElement &&
            footerElement &&
            headerElement.innerHTML &&
            footerElement.innerHTML &&
            authContainer
        ) {
            console.log('Header, Footer, and authContainer are fully loaded.');
            // לאחר שה-Header וה-Footer נטענו, טען את login.js
            loadScript('js/login.js', () => {
                console.log('login.js loaded. All scripts are loaded in the correct order.');
            });
        } else {
            console.log('Header, Footer, or authContainer not fully loaded yet. Retrying...');
            setTimeout(checkHeaderFooterLoaded, 100); // בדוק שוב אחרי 100ms
        }
    };

    checkHeaderFooterLoaded();
});
