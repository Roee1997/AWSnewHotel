document.addEventListener('DOMContentLoaded', () => {
    // נתונים פיקטיביים לבדיקה
    const mockBookings = [
        {
            bookingId: 'B001',
            username: 'user1',
            room: 'Deluxe Room',
            checkIn: '2025-01-20',
            checkOut: '2025-01-25',
            guests: 2,
            status: 'Pending',
        },
        {
            bookingId: 'B002',
            username: 'user2',
            room: 'Suite Room',
            checkIn: '2025-01-22',
            checkOut: '2025-01-26',
            guests: 3,
            status: 'Approved',
        },
        {
            bookingId: 'B003',
            username: 'user3',
            room: 'Standard Room',
            checkIn: '2025-01-23',
            checkOut: '2025-01-27',
            guests: 1,
            status: 'Denied',
        },
    ];

    // פונקציה לעדכון הטבלה
    populateTable(mockBookings);
});

// פונקציה שמעדכנת את הטבלה עם נתונים
function populateTable(bookings) {
    const tableBody = document.querySelector('#bookingsTable');

    if (!tableBody) {
        console.error('Error: Table body element not found!');
        return;
    }

    // מחיקת שורות קיימות
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No bookings found.</td></tr>';
        return;
    }

    bookings.forEach((booking) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.bookingId}</td>
            <td>${booking.username}</td>
            <td>${booking.room}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>${booking.guests}</td>
            <td>${booking.status}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveBooking('${booking.bookingId}')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="denyBooking('${booking.bookingId}')">Deny</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// פונקציות לאישור וביטול הזמנה
function approveBooking(bookingId) {
    alert(`Booking ${bookingId} approved!`);
}

function denyBooking(bookingId) {
    alert(`Booking ${bookingId} denied!`);
}
