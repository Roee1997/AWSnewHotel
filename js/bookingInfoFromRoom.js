document.addEventListener('DOMContentLoaded', () => {
    // Retrieve booking details from localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));

    // If no booking details are found, redirect back to the rooms page
    if (!bookingDetails) {
        alert('No booking details found. Please select a room first.');
        window.location.href = 'room.html';
        return;
    }

    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));


    // Fill form fields with user and booking details
    if (userInfo) {
        document.querySelector('#name').value = userInfo.name || '';
        document.querySelector('#email').value = userInfo.email || '';
    } else {
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
    }
    document.querySelector('#checkin').value = bookingDetails.checkInDate;
    document.querySelector('#checkout').value = bookingDetails.checkOutDate;

    // Populate Number of Guests dropdown
    const guestsDropdown = document.querySelector('#numberOfGuestsBooking');
    for (let i = 1; i <= 25; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Guests`;
        if (i === parseInt(bookingDetails.numberOfGuests, 10)) {
            option.selected = true;
        }
        guestsDropdown.appendChild(option);
    }

    // Pre-select the booked room in the "Select A Room" dropdown
    const roomSelect = document.querySelector('#select3');
    const bookedRoomOption = document.createElement('option');
    bookedRoomOption.value = bookingDetails.roomId;
    bookedRoomOption.textContent = bookingDetails.roomType;
    bookedRoomOption.selected = true;
    roomSelect.appendChild(bookedRoomOption);

    // Disable room selection to prevent changes
    roomSelect.disabled = true;

    // Optional: Add a special request handler (if needed)
    const messageBox = document.querySelector('#message');
    messageBox.value = localStorage.getItem('userMessage') || '';

    // Save changes on form submission
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const userMessage = messageBox.value;
        localStorage.setItem('userMessage', userMessage);

        alert('Booking confirmed!');
    });
});
