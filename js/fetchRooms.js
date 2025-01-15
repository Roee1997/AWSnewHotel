// כתובת ה-API
const apiURL = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev";

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
        filteredRooms.forEach(room => {
            const amenitiesList = room.Amenities.map(amenity => `<li>${amenity}</li>`).join(""); // יצירת רשימת מתקנים

            const roomCard = `
                <div class="col-lg-4 col-md-6">
                    <div class="room-item shadow rounded overflow-hidden">
                        <div class="position-relative">
                            <img class="img-fluid" src="img/room-placeholder.jpg" alt="${room.RoomType}">
                            <small class="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">$${room.PricePerNight}/Night</small>
                        </div>
                        <div class="p-4 mt-2">
                            <div class="d-flex justify-content-between mb-3">
                                <h5 class="mb-0">${room.RoomType}</h5>
                                <div class="ps-2">
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                    <small class="fa fa-star text-primary"></small>
                                </div>
                            </div>
                            <div class="d-flex mb-3">
                                <small class="border-end me-3 pe-3"><i class="fa fa-bed text-primary me-2"></i>${room.MaxGuests} Guests</small>
                                <small class="border-end me-3 pe-3"><i class="fa fa-wifi text-primary me-2"></i>Wifi</small>
                                <small><i class="fa fa-bath text-primary me-2"></i>${room.Amenities.length} Amenities</small>
                            </div>
                            <p class="text-body mb-3">${room.Description}</p>
                            <div class="mb-3">
                                <h6 class="text-primary">Amenities:</h6>
                                <ul>${amenitiesList}</ul>
                            </div>
                            <div class="d-flex justify-content-between">
                                <a class="btn btn-sm btn-primary rounded py-2 px-4" href="">View Detail</a>
                                <a class="btn btn-sm btn-dark rounded py-2 px-4" href="">Book Now</a>
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
