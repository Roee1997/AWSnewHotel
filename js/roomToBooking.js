document.addEventListener("click", (e) => {
    if (e.target.classList.contains("book-now")) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        // בדיקת חיבור המשתמש
        if (!userInfo || !userInfo.email) {
            alert("You must log in or register to book a room.");
            return;
        }

        const roomId = e.target.getAttribute("data-room-id");
        const roomType = e.target.getAttribute("data-room-type");
        const price = e.target.getAttribute("data-price");
        const maxGuests = e.target.getAttribute("data-max-guests");

        const checkInDate = localStorage.getItem("checkInDate");
        const checkOutDate = localStorage.getItem("checkOutDate");
        const numberOfGuests = localStorage.getItem("numberOfGuests");

        if (!checkInDate || !checkOutDate || !numberOfGuests) {
            alert("Please fill in check-in, check-out, and number of guests before booking.");
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

        // שמירת פרטי ההזמנה ל-localStorage
        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

        // הפניה ל-booking.html
        window.location.href = "booking.html";
    }
});
