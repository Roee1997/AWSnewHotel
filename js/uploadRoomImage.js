document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#roomsTable').addEventListener('click', function(event) {
        if (event.target.classList.contains('upload-image-btn')) {
            const roomId = event.target.getAttribute('data-room-id');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.addEventListener('change', function () {
                if (input.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const base64Image = e.target.result.split(',')[1]; // Extract the base64 part

                        // יצירת האובייקט במבנה המתאים כמו ב-TEST שעבד
                        const payload = {
                            body: JSON.stringify({
                                room_id: roomId,
                                image: `data:image/jpeg;base64,${base64Image}`
                            })
                        };

                        fetch('https://lb15wqqox4.execute-api.us-east-1.amazonaws.com/dev/Admin/postAdminUploadRoomImage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.statusCode === 200) {
                                alert('Image uploaded successfully!');
                                console.log(data);
                            } else {
                                alert('Failed to upload image: ' + data.body);
                                console.error('Error:', data);
                            }
                        })
                        .catch(error => {
                            alert('Error uploading image.');
                            console.error('Error:', error);
                        });
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });

            input.click();
        }
    });
});
