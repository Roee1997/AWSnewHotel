// API URLs
const apiURL = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev";
const uploadImageAPI = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/postAdminUploadRoomImage";

// Element that contains the room cards
const roomsContainer = document.querySelector(".container-xxl.py-5 .row.g-4");

// Function to fetch and display rooms
async function fetchAndDisplayRooms() {
    try {
        console.log("Fetching rooms from API...");
        const response = await fetch(apiURL);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorBody}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body);  // Parsing the JSON string returned in the body

        console.log("Rooms data received:", rooms);

        // Get number of guests from localStorage (default to 1 if not found)
        const numberOfGuests = parseInt(localStorage.getItem("numberOfGuests"), 10) || 1;
        const filteredRooms = rooms.filter(room => room.MaxGuests >= numberOfGuests);

        roomsContainer.innerHTML = "";

        if (filteredRooms.length === 0) {
            roomsContainer.innerHTML = "<p class='text-warning'>No rooms available for the selected number of guests.</p>";
            return;
        }

        filteredRooms.forEach((room) => {
            console.log(`Processing room ID: ${room.room_id}`);

            // Use room's image if available, otherwise use the default image
            const imageUrl = room.ImageURL ? room.ImageURL : "img/room-1.jpg";

            const amenitiesList = room.Amenities.map(
                (amenity) => `<li>${amenity}</li>`
            ).join("");

            const roomCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="room-item shadow rounded overflow-hidden">
                        <div class="position-relative">
                            <img class="img-fluid" src="${imageUrl}" alt="${room.RoomType}" id="room-img-${room.room_id}">
                            <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">$${room.PricePerNight}/Night</small>
                        </div>
                        <div class="p-4 mt-2">
                            <h5 class="mb-0">${room.RoomType}</h5>
                            <p class="text-body mb-3">${room.Description}</p>
                            <ul>${amenitiesList}</ul>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-primary rounded py-2 px-4 book-now" 
                                    data-room-id="${room.room_id}" 
                                    data-room-type="${room.RoomType}" 
                                    data-price="${room.PricePerNight}" 
                                    data-max-guests="${room.MaxGuests}">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            roomsContainer.innerHTML += roomCard;
        });

    } catch (error) {
        console.error("Error fetching rooms:", error);
        roomsContainer.innerHTML = "<p class='text-danger'>Failed to load rooms. Please try again later.</p>";
    }
}

// Call the function to fetch and display rooms
fetchAndDisplayRooms();
