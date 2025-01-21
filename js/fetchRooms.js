// כתובת ה-API
const apiURL = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev";
const uploadImageAPI = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/postAdminUploadRoomImage";

// אלמנט שמכיל את כרטיסי החדרים
const roomsContainer = document.querySelector(".container-xxl.py-5 .row.g-4");

// פונקציה לשליפת והצגת החדרים
async function fetchAndDisplayRooms() {
    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { body } = await response.json();
        const rooms = body;

        const numberOfGuests = parseInt(localStorage.getItem("numberOfGuests"), 10);
        const filteredRooms = rooms.filter(room => room.MaxGuests >= numberOfGuests);

        roomsContainer.innerHTML = "";

        filteredRooms.forEach((room) => {
            const amenitiesList = room.Amenities.map(
                (amenity) => `<li>${amenity}</li>`
            ).join("");

            const roomCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="room-item shadow rounded overflow-hidden">
                        <div class="position-relative">
                            <img class="img-fluid" src="img/room-1.jpg" alt="${room.RoomType}" id="room-img-${room.room_id}">
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

        if (filteredRooms.length === 0) {
            roomsContainer.innerHTML = "<p class='text-warning'>No rooms available for the selected number of guests.</p>";
        }



    } catch (error) {
        console.error("Error fetching rooms:", error);
        roomsContainer.innerHTML = "<p class='text-danger'>Failed to load rooms. Please try again later.</p>";
    }
}


// קריאה לפונקציה
fetchAndDisplayRooms();
