document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/bookings"; // URL of the Lambda API

    // Fetch bookings from the API
    fetchBookings(apiUrl);
});

// Function to fetch bookings from API
function fetchBookings(apiUrl) {
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.Items && Array.isArray(data.Items)) {
                populateTable(data.Items); // Populate the table with data
            } else {
                console.error("Invalid data format received from API");
            }
        })
        .catch((error) => {
            console.error("Error fetching bookings:", error);
            const tableBody = document.querySelector("#bookingsTable");
            tableBody.innerHTML = `<tr><td colspan="12" class="text-center text-danger">Error loading bookings.</td></tr>`;
        });
}

function populateTable(bookings) {
    const tableBody = document.querySelector('#bookingsTable');

    if (!tableBody) {
        console.error('Error: Table body element not found!');
        return;
    }

    // Clear existing rows
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="12" class="text-center">No bookings found.</td></tr>';
        return;
    }

    bookings.forEach((booking) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.time}</td>
            <td>${booking.booking_id}</td>
            <td>${booking.user_name}</td>
            <td>(${booking.user_email})</td>
            <td>${booking.room_type}</td>
            <td>(${booking.room_id})</td>
            <td>${booking.guest_count}</td>
            <td>${booking.check_in}</td>
            <td>${booking.check_out}</td>
            <td>${booking.additional_requests || "None"}</td>
            <td>${booking.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveBooking('${booking.booking_id}')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="denyBooking('${booking.booking_id}')">Deny</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Functions to approve or deny a booking
function approveBooking(bookingId) {
    alert(`Booking ${bookingId} approved!`);
    // Add API call to update status here
}

function denyBooking(bookingId) {
    alert(`Booking ${bookingId} denied!`);
    // Add API call to update status here
}
