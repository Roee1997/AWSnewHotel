// Hide the body initially
document.body.style.display = "none"; 
document.body.style.opacity = "0"; 
document.body.style.transition = "opacity 0.5s ease-in-out"; // Smooth transition for opacity

// Verify if the user has admin access
const verifyAdminAccess = () => {
    const userInfoString = localStorage.getItem("userInfo");

    // Redirect unauthorized users
    if (!userInfoString) {
        alert("Unauthorized access! Redirecting to home...");
        window.location.href = "index.html"; // Redirect to home
        return;
    }

    const userInfo = JSON.parse(userInfoString);

    if (!userInfo.isAdmin) {
        alert("You do not have permission to access the admin page.");
        window.location.href = "index.html"; // Redirect to home
        return;
    }

    // If authorized, show the content with a smooth transition
    document.body.style.display = "block";
    setTimeout(() => {
        document.body.style.opacity = "1"; // Smoothly transition to visible
    }, 0);

    // Call updateUI to refresh the header
    updateUI();
};

// Run the verification function
window.onload = verifyAdminAccess;
