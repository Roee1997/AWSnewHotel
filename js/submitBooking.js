document.addEventListener('DOMContentLoaded', () => {
    // Listen for form submission
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const bookingDetails = {
            user_email: document.querySelector('#email').value, // אימייל המשתמש
            user_name: document.querySelector('#name').value, // שם המשתמש
            booking_id: `BOOK_${Date.now()}`, // מזהה ייחודי להזמנה
            room_id: document.querySelector('#select3').value, // ID של החדר
            room_type: document.querySelector('#select3 option:checked').textContent, // סוג החדר
            check_in: document.querySelector('#checkin').value, // תאריך צ'ק-אין
            check_out: document.querySelector('#checkout').value, // תאריך צ'ק-אאוט
            guest_count: document.querySelector('#numberOfGuestsBooking').value, // מספר אורחים
            additional_requests: document.querySelector('#message').value, // בקשות מיוחדות
            status: 'Pending' // סטטוס ברירת מחדל להזמנה
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

            // Debugging response
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            const result = await response.text();
            console.log('Response Body:', result);

            // Check response status
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
