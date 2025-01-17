document.addEventListener('DOMContentLoaded', () => {
    const userEmail = getUserEmailFromStorage(); // Retrieve user email from localStorage or sessionStorage
    if (!userEmail) {
        alert("User email not found. Please log in.");
        return;
    }

    fetchAndDisplayBookings(userEmail);
});

// Retrieve user email from localStorage or sessionStorage
function getUserEmailFromStorage() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.email) {
        console.log(`Retrieved user email: ${userInfo.email}`);
        return userInfo.email;
    }
    console.error("User email not found in localStorage.");
    return null;
}

// Fetch and display bookings
async function fetchAndDisplayBookings(userEmail) {
    const bookingsApi = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/myBookings";
    const bookingCardsContainer = document.getElementById('bookingCardsContainer');

    try {
        // Fetch bookings from API
        const response = await fetch(`${bookingsApi}?user_email=${userEmail}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch bookings. Status: ${response.status}`);
        }

        const data = await response.json();
        const bookings = data.bookings || [];
        const rooms = data.rooms || [];

        // Check if there are any bookings
        if (bookings.length === 0) {
            bookingCardsContainer.innerHTML = `<p class="text-warning">No bookings found for your email.</p>`;
            return;
        }

        // Clear existing content
        bookingCardsContainer.innerHTML = "";

        // Display bookings
        bookings.forEach(booking => {
            const room = rooms.find(r => r.room_id === parseInt(booking.room_id));
            const bookingCard = createBookingCard(booking, room);
            bookingCardsContainer.appendChild(bookingCard);
        });
    } catch (error) {
        console.error("Error fetching bookings or rooms:", error);
        bookingCardsContainer.innerHTML = `<p class="text-danger">Failed to load bookings. Please try again later.</p>`;
    }
}

// Create a card element for each booking
function createBookingCard(booking, room) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-lg-4 col-md-6";

    const roomImage = room ? `img/room-placeholder.jpg` : `img/no-image.jpg`;
    const roomPrice = room ? `$${room.PricePerNight}/Night` : "Price unavailable";
    const roomDescription = room ? room.Description : "Room description unavailable";

    cardDiv.innerHTML = `
        <div class="room-item shadow rounded overflow-hidden">
            <div class="position-relative">
                <img class="img-fluid" src="${roomImage}" alt="${room?.RoomType || "No room info"}">
                <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">${roomPrice}</small>
            </div>
            <div class="p-4 mt-2">
                <h5 class="mb-0">${room?.RoomType || "Unknown Room"}</h5>
                <p class="text-body mb-3">${roomDescription}</p>
                <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
                <p><strong>Guest:</strong> ${booking.user_name} (${booking.user_email})</p>
                <p><strong>Check-In:</strong> ${booking.check_in}</p>
                <p><strong>Check-Out:</strong> ${booking.check_out}</p>
                <p><strong>Guests:</strong> ${booking.guest_count}</p>
                <p><strong>Requests:</strong> ${booking.additional_requests || "None"}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
            </div>
        </div>
    `;
    return cardDiv;
}
