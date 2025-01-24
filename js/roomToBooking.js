document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("book-now")) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo || !userInfo.email) {
            alert("You must log in or register to book a room.", "error");
            return;
        }

        const roomId = e.target.getAttribute("data-room-id");
        const roomType = e.target.getAttribute("data-room-type");
        const price = e.target.getAttribute("data-price");
        const maxGuests = e.target.getAttribute("data-max-guests");
        const email = userInfo.email;

        try {
            const checkInDate = localStorage.getItem("checkInDate");
            const checkOutDate = localStorage.getItem("checkOutDate");
            const numberOfGuests = localStorage.getItem("numberOfGuests");

            if (!checkInDate || !checkOutDate || !numberOfGuests) {
                alert("Please fill in check-in, check-out, and number of guests before booking.", "error");
                return;
            }

            const bookingDetails = {
                roomId,
                roomType,
                price,
                maxGuests,
                checkInDate,
                checkOutDate,
                numberOfGuests,
            };

            localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
            window.location.href = "booking.html";
        } catch (error) {
            console.error('Error:', error);
            alert('Error checking booking status. Please try again.', "error");
        }
    }
});