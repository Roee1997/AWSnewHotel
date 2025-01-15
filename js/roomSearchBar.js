document.addEventListener('DOMContentLoaded', () => {
    // Initialize flatpickr for Check-In Date
    flatpickr('#checkInDate', {
        minDate: 'today', // Disable past dates
        dateFormat: 'Y-m-d', // Standard format
        onChange: (selectedDates) => {
            const checkOutPicker = document.querySelector('#checkOutDate')._flatpickr;
            if (checkOutPicker) {
                checkOutPicker.set('minDate', selectedDates[0]); // Set Check-Out min date
            }
        },
    });

    // Initialize flatpickr for Check-Out Date
    flatpickr('#checkOutDate', {
        minDate: 'today', // Ensure Check-Out date is today or later
        dateFormat: 'Y-m-d',
    });

    // Populate the "Number of Guests" dropdown dynamically
    const guestsDropdown = document.getElementById('numberOfGuests');
    for (let i = 1; i <= 25; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Guests`;
        guestsDropdown.appendChild(option);
    }

    // Pre-fill fields from localStorage
    const savedCheckInDate = localStorage.getItem('checkInDate');
    const savedCheckOutDate = localStorage.getItem('checkOutDate');
    const savedGuests = localStorage.getItem('numberOfGuests');

    if (savedCheckInDate) document.getElementById('checkInDate').value = savedCheckInDate;
    if (savedCheckOutDate) document.getElementById('checkOutDate').value = savedCheckOutDate;
    if (savedGuests) guestsDropdown.value = savedGuests;

    // Add event listener to the submit button
    const submitButton = document.getElementById('submitBooking');
    submitButton.addEventListener('click', () => {
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const numberOfGuests = guestsDropdown.value;

        if (!checkInDate || !checkOutDate || !numberOfGuests) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            alert('Check-out date must be after the check-in date.');
            return;
        }

        // Save selections to localStorage
        localStorage.setItem('checkInDate', checkInDate);
        localStorage.setItem('checkOutDate', checkOutDate);
        localStorage.setItem('numberOfGuests', numberOfGuests);

        // Redirect to rooms page
        window.location.href = 'room.html';
    });
});
