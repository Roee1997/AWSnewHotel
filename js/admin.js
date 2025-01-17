// from here on this part of script works on table bookings:
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
                    class="btn btn-success btn-sm" style="background-color:green" 
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




async function fetchAndDisplayRooms(apiUrl2) {
    const roomsTableBody = document.querySelector("#roomsTable tbody");

    if (!roomsTableBody) {
        console.error("Error: Table body element not found!");
        return;
    }

    try {
        // Fetch the room data from the API
        const response = await fetch(apiUrl2);
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.status}`);
        }

        const data = await response.json();

        // Parse the response body
        const rooms = JSON.parse(data.body) || [];

        // Clear existing rows
        roomsTableBody.innerHTML = "";

        if (rooms.length === 0) {
            roomsTableBody.innerHTML = "<tr><td colspan='7'>No rooms available.</td></tr>";
            return;
        }

        // Populate the table with room data
        rooms.forEach((room) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${room.room_id || "N/A"}</td>
                <td>${room.RoomType || "N/A"}</td>
                <td>${room.Description || "N/A"}</td>
                <td>${room.PricePerNight || "N/A"}</td>
                <td>${room.MaxGuests || "N/A"}</td>
                <td>${room.Available ? "Yes" : "No"}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editRoom(${room.room_id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.room_id})">Delete</button>
                </td>
            `;
            roomsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching or displaying rooms:", error);
        roomsTableBody.innerHTML = "<tr><td colspan='7'>Failed to load rooms.</td></tr>";
    }
}

function editRoom(roomId) {
    console.log(`Edit room with ID: ${roomId}`);
    // Add your logic to edit room details
}







////////////////////////////////   from here on this part of script works on table rooms:    ////////////////////////////////  



document.addEventListener("DOMContentLoaded", () => {
    const roomsApiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";

    // Fetch and display existing rooms
    fetchAndDisplayRooms(roomsApiUrl);

    // Add event listener to the Save button in the modal
    document.getElementById("saveRoomButton").addEventListener("click", handleRoomAdd);
    console.log("Initialized: Save button bound to handleRoomAdd by default");
});

// Fetch and display existing rooms in the table
async function fetchAndDisplayRooms(apiUrl) {
    const roomsTableBody = document.querySelector("#roomsTable tbody");

    try {
        console.log("Fetching rooms...");
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.status}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body) || [];
        console.log("Rooms fetched successfully:", rooms);

        roomsTableBody.innerHTML = rooms.length
            ? rooms.map(roomToTableRow).join("")
            : "<tr><td colspan='7'>No rooms available.</td></tr>";
    } catch (error) {
        console.error("Error fetching or displaying rooms:", error);
        roomsTableBody.innerHTML = "<tr><td colspan='7'>Failed to load rooms.</td></tr>";
    }
}

// Convert room data to a table row
function roomToTableRow(room) {
    return `
        <tr>
            <td>${room.room_id || "N/A"}</td>
            <td>${room.RoomType || "N/A"}</td>
            <td>${room.Description || "N/A"}</td>
            <td>${room.PricePerNight || "N/A"}</td>
            <td>${room.MaxGuests || "N/A"}</td>
            <td>${room.Available ? "Yes" : "No"}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openRoomModal('edit', ${room.room_id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="handleRoomDelete(${room.room_id})">Delete</button>
            </td>
        </tr>
    `;
}

// Open the modal for adding or editing a room
function openRoomModal(action, roomId = null) {
    console.log(`Opening modal for action: ${action}, roomId: ${roomId}`);
    const modal = new bootstrap.Modal(document.getElementById("roomModal"));
    const form = document.getElementById("roomForm");

    form.reset();
    if (action === "add") {
        document.getElementById("roomModalLabel").textContent = "Add Room";
        document.getElementById("saveRoomButton").onclick = handleRoomAdd; // Set Save to Add
        console.log("Save button bound to handleRoomAdd");
    } else if (action === "edit") {
        document.getElementById("roomModalLabel").textContent = "Edit Room";
        fetchRoomDetails(roomId); // Populate the form with existing room data
        document.getElementById("saveRoomButton").onclick = () => handleRoomEdit(roomId); // Set Save to Edit
        console.log("Save button bound to handleRoomEdit");
    }

    modal.show();
}

// Handle room addition
async function handleRoomAdd() {
    console.log("Handling room addition...");
    const apiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";
    const form = document.getElementById("roomForm");

    const roomData = {
        room_id: parseInt(form.room_id.value),
        RoomType: form.RoomType.value.trim(),
        Description: form.Description.value.trim(),
        PricePerNight: parseFloat(form.PricePerNight.value),
        MaxGuests: parseInt(form.MaxGuests.value),
        Available: form.Available.value === "true",
        Amenities: form.Amenities.value.split(",").map((item) => item.trim()),
    };

    console.log("Room data to add:", roomData);

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error(`Error adding room: ${response.status}`);
        }

        const result = await response.json();
        console.log("Room added successfully:", result);
        alert("Room added successfully!");

        fetchAndDisplayRooms(apiUrl);

        const modal = bootstrap.Modal.getInstance(document.getElementById("roomModal"));
        modal.hide();
    } catch (error) {
        console.error("Error adding room:", error);
        alert("Failed to add room. Please try again.");
    }
}

// Fetch room details for editing
async function fetchRoomDetails(roomId) {
    const apiUrl = `https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table`;

    try {
        console.log("Fetching room details for roomId:", roomId);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching room details: ${response.status}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body) || [];
        const room = rooms.find((r) => r.room_id === roomId);

        if (!room) {
            throw new Error(`Room with ID ${roomId} not found.`);
        }

        const form = document.getElementById("roomForm");
        form.room_id.value = room.room_id;
        form.RoomType.value = room.RoomType;
        form.Description.value = room.Description;
        form.PricePerNight.value = room.PricePerNight;
        form.MaxGuests.value = room.MaxGuests;
        form.Available.value = room.Available ? "true" : "false";
        form.Amenities.value = room.Amenities.join(", ");
        console.log("Room details populated in form:", room);
    } catch (error) {
        console.error("Error fetching room details:", error);
        alert("Failed to fetch room details. Please try again.");
    }
}

// Handle room editing
async function handleRoomEdit(roomId) {
    console.log("Handling room edit for roomId:", roomId);
    const apiUrl = `https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table/${roomId}`;
    const form = document.getElementById("roomForm");

    const roomData = {
        room_id: 101, // מספר ID לחדר
        RoomType: "Executive Suite", // סוג החדר
        Description: "A luxurious suite with city view and modern amenities", // תיאור
        PricePerNight: 2500.0, // מחיר ללילה
        MaxGuests: 4, // כמות אורחים מקסימלית
        Available: true, // זמינות
        Amenities: ["Wi-Fi", "TV", "Mini Bar", "Jacuzzi"], // רשימת תכונות
    };


    console.log("Room data to update:", roomData);

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(roomData),
        });

        if (!response.ok) {
            throw new Error(`Error updating room: ${response.status}`);
        }

        const result = await response.json();
        console.log("Room updated successfully:", result);
        alert("Room updated successfully!");

        fetchAndDisplayRooms("https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table");

        const modal = bootstrap.Modal.getInstance(document.getElementById("roomModal"));
        modal.hide();
    } catch (error) {
        console.log(apiUrl);
        console.error("Error updating room:", error);
        alert("Failed to update room. Please try again.");
    }
}
