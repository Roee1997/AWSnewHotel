// Cognito Login URL
const cognitoLoginUrl =
    'https://us-east-1u8diopodh.auth.us-east-1.amazoncognito.com/login?client_id=1hfg4usrg0a6lr0393nmnia1vq&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5501%2Findex.html';

/**
 * Redirect user to Cognito login page
 */
const redirectToCognitoLogin = () => {
    window.location.href = cognitoLoginUrl;
};

/**
 * Logout user
 * Clears all user-related data from localStorage and reloads the page
 */
const logoutUser = () => {
    // Clear all user-related keys
    localStorage.removeItem('userInfo'); // Remove the userInfo object
    localStorage.clear(); // Optionally clear all storage if it's only for this app

    // Log for debugging
    console.log('All user-related data removed from localStorage.');

    // Show confirmation and reload page
    alert('You have been logged out.');
    location.reload(); // Reload the page to update UI
};

/**
 * Decode a JWT token (extract payload)
 */
const decodeJwtPayload = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.error('Invalid token format');
        return null;
    }

    try {
        return JSON.parse(atob(parts[1]));
    } catch (e) {
        console.error('Error decoding token payload:', e);
        return null;
    }
};

/**
 * Parse tokens from URL and save user info
 */
const parseTokensFromUrl = () => {
    const hash = window.location.hash.substring(1); // Get the part after `#`
    if (!hash) return;

    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');

    if (accessToken && idToken) {
        // Decode ID Token payload
        const idTokenPayload = decodeJwtPayload(idToken);

        if (idTokenPayload) {
            // Check if user is an admin
            const isAdmin = idTokenPayload["cognito:groups"] && idTokenPayload["cognito:groups"].includes("Admin");

            // Save user info in localStorage
            const userInfo = {
                name: idTokenPayload.name,
                email: idTokenPayload.email,
                username: idTokenPayload["cognito:username"],
                isAdmin: isAdmin || false, // Add isAdmin flag
                rawIdTokenPayload: idTokenPayload, // Optional: Full decoded ID token payload
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Log user info to the console
            console.log('User Info:', userInfo);
            alert('Login successful!');
            
            // Clear the hash to prevent reprocessing on reload
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            console.warn('Failed to decode ID Token payload.');
        }
    }
};

/**
 * Update UI based on user authentication status
 */
const updateUI = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authContainer = document.getElementById('authContainer');

    if (userInfo) {
        // User is logged in
        authContainer.innerHTML = `
            <div class="navbar-nav ms-auto">
                <span class="nav-item nav-link text-white">Welcome, ${userInfo.username}</span>
                <button id="logoutButton" class="btn btn-primary nav-item nav-link text-white">Logout</button>
            </div>
        `;

        // Attach logout event after rendering
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', logoutUser);
        }

        // Add admin-specific UI if the user is an admin
        if (userInfo.isAdmin) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.textContent = 'Admin Dashboard';
            adminLink.classList.add('nav-item', 'nav-link', 'text-white');
            authContainer.appendChild(adminLink);
        }
    } else {
        // User is not logged in
        authContainer.innerHTML = `
            <div class="navbar-nav ms-auto">
                <button id="loginButton" class="btn btn-primary nav-item nav-link text-white">Login</button>
            </div>
        `;

        // Attach login event after rendering
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', redirectToCognitoLogin);
        }
    }
};

// Parse tokens on page load
window.onload = () => {
    parseTokensFromUrl();
    updateUI();
};
