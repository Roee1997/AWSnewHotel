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
                <button 
                    class="btn btn-success btn-sm" 
                    onclick="updateBookingStatus('${booking.user_email}', '${booking.booking_id}', 'Approved', '${booking.room_id}')">
                    Approve
                </button>
                <button 
                    class="btn btn-danger btn-sm" 
                    onclick="updateBookingStatus('${booking.user_email}', '${booking.booking_id}', 'Deny', '${booking.room_id}')">
                    Deny
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


function updateBookingStatus(userEmail, bookingId, newStatus, roomId) {
    const updateStatusUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/updating-status";
    const updateAvailabilityUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/update-room-availability";

    // Prepare the payload for status update
    const statusPayload = {
        body: JSON.stringify({
            user_email: userEmail,
            booking_id: bookingId,
            status: newStatus
        })
    };

    // Send POST request to update booking status
    fetch(updateStatusUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusPayload)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(`Booking status updated: ${JSON.stringify(data)}`);
            alert(`Booking status updated to "${newStatus}" for Booking ID: ${bookingId}`);

            // Update the table row without reloading
            const tableBody = document.querySelector('#bookingsTable');
            if (tableBody) {
                const rows = tableBody.querySelectorAll('tr');
                rows.forEach((row) => {
                    const bookingIdCell = row.querySelector('td:nth-child(2)'); // Column with Booking ID
                    if (bookingIdCell && bookingIdCell.textContent === bookingId) {
                        const statusCell = row.querySelector('td:nth-child(11)'); // Column with status
                        if (statusCell) {
                            statusCell.textContent = newStatus; // Update the status text
                        }
                    }
                });
            }

            // Prepare payload for room availability update
            const availabilityPayload = {
                body: JSON.stringify({
                    room_id: roomId,
                    available: newStatus === 'Deny' // Available = true if Deny, false otherwise
                })
            };

            // Send POST request to update room availability
            return fetch(updateAvailabilityUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(availabilityPayload)
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(`Room availability updated: ${JSON.stringify(data)}`);
            alert(`Room availability updated for Room ID: ${roomId}`);
        })
        .catch((error) => {
            console.error("Error updating booking status or room availability:", error);
            alert("Error updating booking status or room availability. Please try again.");
        });
}


