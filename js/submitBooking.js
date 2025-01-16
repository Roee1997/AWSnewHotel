document.addEventListener('DOMContentLoaded', () => {
    // Listen for form submission
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const bookingDetails = {
            user_email: document.querySelector('#email').value,
            booking_id: `BOOK_${Date.now()}`, // Unique booking ID
            room_id: document.querySelector('#select3').value,
            check_in: document.querySelector('#checkin').value,
            check_out: document.querySelector('#checkout').value,
            additional_requests: document.querySelector('#message').value,
            status: 'Pending' // Default status for new bookings
        };

        // Call the API to insert the booking into DynamoDB
        try {
            const response = await fetch('https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
                
            });
          
        
            // הדפסת הסטטוס והתגובה בקונסול
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            const result = await response.text(); // השתמשי ב-text כדי לראות את התגובה המקורית
            console.log('Response Body:', result);
        
            // בדיקת סטטוס
            if (response.ok) {
                alert(`Booking successful! Response: ${result}`);
            } else {
                alert(`Failed to create booking. Status: ${response.status}, Response: ${result}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to the booking system. Please try again.');
        }
    });
});
