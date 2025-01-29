// Cognito configuration variables
const cognitoRegion = "us-east-1"; // AWS region where Cognito is deployed
const cognitoDomainPrefix = "u8diopodh"; // Cognito domain prefix (User Pool domain)
const clientId = "1hfg4usrg0a6lr0393nmnia1vq"; // Cognito App Client ID
const responseType = "token"; // Authentication flow type

// Construct the Cognito domain dynamically
const cognitoDomain = `https://${cognitoRegion}${cognitoDomainPrefix}.auth.${cognitoRegion}.amazoncognito.com`;

// Redirect URL (must match allowed callback URLs in Cognito settings)
const redirectUri = `https://mynewhotelonthelake.s3.${cognitoRegion}.amazonaws.com/index.html`;

// Construct Cognito Login URL dynamically
const cognitoLoginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}`;

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

    // Clear previous content in authContainer
    authContainer.innerHTML = '';

    if (userInfo) {
        // Add welcome message
        const welcomeMessage = document.createElement('span');
        welcomeMessage.textContent = `Welcome, ${userInfo.username}`;
        welcomeMessage.classList.add('nav-item', 'nav-link', 'text-white');
        authContainer.appendChild(welcomeMessage);

        // Add admin-specific UI if the user is an admin
        if (userInfo.isAdmin) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.textContent = 'Admin Dashboard';
            adminLink.classList.add('nav-item', 'nav-link', 'text-orange');

            // Highlight the Admin Dashboard link if on the admin page
            if (window.location.pathname.includes('admin.html')) {
                adminLink.style.color = 'orange'; // Change text color to orange
                adminLink.style.fontWeight = 'bold'; // Optional: Make it bold
            }

            authContainer.appendChild(adminLink);
        }

        // Add logout button
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add('btn', 'btn-primary', 'nav-item', 'nav-link', 'text-white');
        logoutButton.addEventListener('click', logoutUser);
        authContainer.appendChild(logoutButton);
    } else {
        // User is not logged in
        const loginButton = document.createElement('button');
        loginButton.id = 'loginButton';
        loginButton.textContent = 'Login';
        loginButton.classList.add('btn', 'btn-primary', 'nav-item', 'nav-link', 'text-white');
        loginButton.addEventListener('click', redirectToCognitoLogin);
        authContainer.appendChild(loginButton);
    }
};

// Run `updateUI` on page load
window.onload = () => {
    parseTokensFromUrl();
    updateUI();
};



