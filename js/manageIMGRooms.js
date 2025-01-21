async function fetchAndDisplayRooms() {
    const apiURL = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev";
    const roomsTableBody = document.querySelector("#roomsTable tbody");

    try {
        console.log("Fetching rooms from API...");
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body);  // Parsing JSON string

        roomsTableBody.innerHTML = "";

        rooms.forEach(room => {
            console.log(`Processing room ID: ${room.room_id}`);

            // Use room's image URL if available, otherwise show a default image
            const roomImage = room.ImageURL ? room.ImageURL : "img/room-1.jpg";

            const row = `
                <tr>
                    <td>${room.room_id}</td>
                    <td>${room.RoomType}</td>
                    <td>${room.Description}</td>
                    <td>$${room.PricePerNight}</td>
                    <td>${room.MaxGuests}</td>
                    <td>${room.Available ? "Yes" : "No"}</td>
                    <td><img src="${roomImage}" alt="Room Image" style="width: 100px; height: 75px; object-fit: cover; border-radius: 5px;"></td>
                    <td>
                        <button class="btn btn-warning btn-sm">EDIT</button>
                        <button class="btn btn-danger btn-sm">DELETE</button>
                        <button class="btn btn-success btn-sm upload-image-btn" data-room-id="${room.room_id}">UPLOAD IMAGE</button>
                    </td>
                </tr>
            `;
            roomsTableBody.innerHTML += row;
        });

        // Handle upload image button click
        document.querySelectorAll(".upload-image-btn").forEach(button => {
            button.addEventListener("click", function () {
                const roomId = this.getAttribute("data-room-id");
                uploadRoomImage(roomId);
            });
        });

    } catch (error) {
        console.error("Error fetching rooms:", error);
        roomsTableBody.innerHTML = "<tr><td colspan='8' class='text-danger'>Failed to load rooms. Please try again later.</td></tr>";
    }
}

// Function to handle image upload for a specific room
function uploadRoomImage(roomId) {
    alert(`Upload image functionality for room ID: ${roomId}`);
}

// Call the function to load rooms when page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayRooms);
