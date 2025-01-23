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
        }
    })
    .catch(error => console.error('Error loading footer:', error));
