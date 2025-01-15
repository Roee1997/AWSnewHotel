// Load Header
fetch('header.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(headerHTML => {
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.innerHTML = headerHTML;
            console.log('Header loaded successfully.');

            // Highlight the active page
            const currentPath = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            console.error('Header element not found.');
        }
    })
    .catch(error => console.error('Error loading header:', error));

// Load Footer
fetch('footer.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(footerHTML => {
        const footerElement = document.querySelector('footer');
        if (footerElement) {
            footerElement.innerHTML = footerHTML;
            console.log('Footer loaded successfully.');
        } else {
            console.error('Footer element not found.');
        }
    })
    .catch(error => console.error('Error loading footer:', error));
