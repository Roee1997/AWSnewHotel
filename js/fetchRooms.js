// כתובת ה-API
const apiURL = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/rooms";

// אלמנט שמכיל את כרטיסי החדרים
const roomsContainer = document.querySelector(".container-xxl.py-5 .row.g-4");

// פונקציה לשליפת והצגת החדרים
async function fetchAndDisplayRooms() {
    try {
        // שליפת נתונים מה-API
        const response = await fetch(apiURL);

        // בדיקת סטטוס התגובה
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // פענוח התגובה כ-JSON
        const { body } = await response.json();
        const rooms = body;

        // קבלת מספר האנשים מה-localStorage
        const numberOfGuests = parseInt(localStorage.getItem("numberOfGuests"), 10);

        // סינון החדרים לפי מספר האנשים
        const filteredRooms = rooms.filter(room => room.MaxGuests >= numberOfGuests);

        // ניקוי התוכן הקיים
        roomsContainer.innerHTML = "";

        // הוספת כרטיס עבור כל חדר מתאים
        filteredRooms.forEach((room) => {
            const amenitiesList = room.Amenities.map(
                (amenity) => `<li>${amenity}</li>`
            ).join("");
        
            const roomCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="room-item shadow rounded overflow-hidden">
                        <div class="position-relative">
                            <img class="img-fluid" src="img/room-placeholder.jpg" alt="${room.RoomType}">
                            <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">$${room.PricePerNight}/Night</small>
                        </div>
                        <div class="p-4 mt-2">
                            <h5 class="mb-0">${room.RoomType}</h5>
                            <p class="text-body mb-3">${room.Description}</p>
                            <ul>${amenitiesList}</ul>
                            <div class="d-flex justify-content-between">
                                <button 
                                    class="btn btn-sm btn-primary rounded py-2 px-4 book-now" 
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
        

        // במידה ואין חדרים מתאימים
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
