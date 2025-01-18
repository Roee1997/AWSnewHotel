//////////////////////////////// Script for managing rooms table in admin panel ////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const roomsApiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";

    // Fetch and display existing rooms
    fetchAndDisplayRooms(roomsApiUrl);

    // Add event listener to the Save button in the modal
    document.getElementById("saveRoomButton").addEventListener("click", handleRoomAdd);
});

// Fetch and display existing rooms in the table
async function fetchAndDisplayRooms(apiUrl) {
    const roomsTableBody = document.querySelector("#roomsTable tbody");

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.status}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body) || [];

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

// Show/hide loading state in the modal
function showLoading(show) {
    const saveButton = document.getElementById("saveRoomButton");
    if (show) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
    } else {
        saveButton.disabled = false;
        saveButton.innerHTML = 'Save Room';
    }
}

// Validate room data
function validateRoomData(data) {
    if (!data.room_id || data.room_id <= 0) {
        throw new Error("Invalid Room ID");
    }
    if (!data.RoomType || data.RoomType.trim().length === 0) {
        throw new Error("Room Type is required");
    }
    if (!data.Description || data.Description.trim().length === 0) {
        throw new Error("Description is required");
    }
    if (!data.PricePerNight || data.PricePerNight <= 0) {
        throw new Error("Price must be greater than 0");
    }
    if (!data.MaxGuests || data.MaxGuests <= 0) {
        throw new Error("Maximum guests must be greater than 0");
    }
    if (!Array.isArray(data.Amenities) || data.Amenities.length === 0) {
        throw new Error("At least one amenity is required");
    }
    return true;
}

// Open the modal for adding or editing a room
function openRoomModal(action, roomId = null) {
    const modal = new bootstrap.Modal(document.getElementById("roomModal"));
    const form = document.getElementById("roomForm");
    const modalTitle = document.getElementById("roomModalLabel");
    const saveButton = document.getElementById("saveRoomButton");

    // Remove previous click event listeners
    saveButton.replaceWith(saveButton.cloneNode(true)); // Replace the button to clear all event listeners
    const newSaveButton = document.getElementById("saveRoomButton");

    form.reset(); // Reset the form

    if (action === "add") {
        modalTitle.textContent = "Add New Room";
        form.room_id.disabled = false;
        newSaveButton.onclick = handleRoomAdd; // Bind to handleRoomAdd
    } else if (action === "edit") {
        modalTitle.textContent = "Edit Room";
        form.room_id.disabled = true;
        fetchRoomDetails(roomId); // Load the room details into the form
        newSaveButton.onclick = () => handleRoomEdit(roomId); // Bind to handleRoomEdit
    }

    modal.show();
}


// Fetch room details for editing
async function fetchRoomDetails(roomId) {
    try {
        const apiUrl = `https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching room details: ${response.status}`);
        }

        const data = await response.json();
        const rooms = JSON.parse(data.body) || [];
        const room = rooms.find(r => r.room_id === roomId);

        if (!room) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        const form = document.getElementById("roomForm");
        
        // Fill form with room data
        form.room_id.value = room.room_id;
        form.RoomType.value = room.RoomType;
        form.Description.value = room.Description;
        form.PricePerNight.value = room.PricePerNight;
        form.MaxGuests.value = room.MaxGuests;
        form.Available.value = room.Available.toString();
        form.Amenities.value = Array.isArray(room.Amenities) ? room.Amenities.join(", ") : "";

    } catch (error) {
        alert(`Failed to fetch room details: ${error.message}`);
    }
}

// Handle room addition
async function handleRoomAdd() {
    showLoading(true);
    
    const apiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";
    const form = document.getElementById("roomForm");

    try {
        const roomData = {
            room_id: parseInt(form.room_id.value),
            RoomType: form.RoomType.value.trim(),
            Description: form.Description.value.trim(),
            PricePerNight: parseFloat(form.PricePerNight.value),
            MaxGuests: parseInt(form.MaxGuests.value),
            Available: form.Available.value === "true",
            Amenities: form.Amenities.value.split(",").map(item => item.trim())
        };

        // Validate the data
        validateRoomData(roomData);


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
        alert("Room added successfully!");

        await fetchAndDisplayRooms(apiUrl);

        const modal = bootstrap.Modal.getInstance(document.getElementById("roomModal"));
        modal.hide();
    } catch (error) {
        console.error("Error adding room:", error);
        alert(`Failed to add room: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Handle room editing
async function handleRoomEdit(roomId) {

    // Validate roomId
    if (typeof roomId === 'undefined' || roomId === null) {
        console.error("Room ID is missing");
        alert("Cannot edit room: Room ID is missing");
        return;
    }

    showLoading(true);

    const apiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";
    const form = document.getElementById("roomForm");

    try {
        const roomData = {
            room_id: parseInt(roomId),
            RoomType: form.RoomType.value.trim(),
            Description: form.Description.value.trim(),
            PricePerNight: parseFloat(form.PricePerNight.value),
            MaxGuests: parseInt(form.MaxGuests.value),
            Available: form.Available.value === "true",
            Amenities: form.Amenities.value.split(",").map(item => item.trim())
        };

        // Validation
        validateRoomData(roomData);

        // Wrap the body as required by the Lambda function
        const requestBody = JSON.stringify({ body: JSON.stringify(roomData) });

        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: requestBody // Send the body in the correct format
        });


        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error updating room: ${errorResponse.message || response.status}`);
        }

        const result = await response.json();
        alert("Room updated successfully!");

        // Refresh the table
        await fetchAndDisplayRooms(apiUrl);

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("roomModal"));
        modal.hide();
    } catch (error) {
        console.error("Error updating room:", error);
        alert(`Failed to update room: ${error.message}`);
    } finally {
        showLoading(false);
    }
}


// Handle room deletion
async function handleRoomDelete(roomId) {
    if (!confirm(`Are you sure you want to delete the room with ID: ${roomId}?`)) {
        return;
    }

    const apiUrl = "https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/Rooms-Table";

    try {

        // Wrap the body as required by the Lambda function
        const requestBody = JSON.stringify({ body: JSON.stringify({ room_id: roomId }) });

        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: requestBody // Send the body in the correct format
        });


        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Error deleting room: ${result.message || response.status}`);
        }

        alert("Room deleted successfully!");

        // Refresh the table after deletion
        await fetchAndDisplayRooms(apiUrl);
    } catch (error) {
        alert(`Failed to delete room: ${error.message}`);
    }
}
