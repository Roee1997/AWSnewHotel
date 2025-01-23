// customAlert.js
class CustomAlert {
    constructor() {
        this.init();
    }

    init() {
        // Create alert container if not exists
        if (!document.getElementById('customAlertContainer')) {
            const container = document.createElement('div');
            container.id = 'customAlertContainer';
            document.body.appendChild(container);

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #customAlertContainer {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                }
                
                .custom-alert {
                    padding: 15px 25px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .custom-alert.success {
                    background-color: #4CAF50;
                    color: white;
                    border-left: 5px solid #2E7D32;
                }
                
                .custom-alert.error {
                    background-color: #f44336;
                    color: white;
                    border-left: 5px solid #c62828;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    margin-left: 15px;
                    opacity: 0.8;
                }
                
                .close-btn:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('customAlertContainer');
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => container.removeChild(alert);
        
        alert.appendChild(messageSpan);
        alert.appendChild(closeButton);
        container.appendChild(alert);
        
        // Auto remove after duration
        setTimeout(() => {
            if (alert.parentNode === container) {
                container.removeChild(alert);
            }
        }, duration);
    }
}

// Create global instance
window.customAlert = new CustomAlert();

// Override default alert
window.originalAlert = window.alert;
window.alert = function(message, type = 'success') {
    if (window.customAlert) {
        window.customAlert.show(message, type);
    } else {
        window.originalAlert(message);
    }
};