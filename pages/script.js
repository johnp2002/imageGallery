document.getElementById('add').addEventListener('click', function () {
    // Trigger the hidden file input when the button is clicked
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    var selectedImage = event.target.files[0];

    // Check if an image is selected
    if (selectedImage) {
        // Convert the selected image to Blob
        var reader = new FileReader();
        reader.onload = function (e) {
            var imageData = e.target.result; // This is the Blob data
            console.log('Blob Data:', imageData);

            // Set the Blob data as the source of the image
            var previewImage = document.getElementById('previewImage');
            previewImage.src = imageData;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(selectedImage);
    } else {
        console.error('No image selected');
    }
});

// document.getElementById('add').addEventListener('click', function () {
//     // Trigger the hidden file input when the button is clicked
//     document.getElementById('fileInput').click();
// });

// document.getElementById('fileInput').addEventListener('change', function (event) {
//     var selectedImage = event.target.files[0];

//     // Check if an image is selected
//     if (selectedImage) {
//         // Show the cropping modal
//         showCroppingModal(selectedImage);
//     } else {
//         console.error('No image selected');
//     }
// });

// function showCroppingModal(imageFile) {
//     // Show the modal
//     var modal = document.getElementById('croppingModal');
//     modal.style.display = 'block';

//     // Initialize Cropper.js
//     var cropper = new Cropper(document.getElementById('croppingImage'), {
//         aspectRatio: 1, // Adjust as needed
//         viewMode: 1,
//         movable: false,
//         zoomable: false,
//         rotatable: false,
//     });

//     // Load the selected image into the cropper
//     var reader = new FileReader();
//     reader.onload = function (e) {
//         cropper.replace(e.target.result);
//     };
//     reader.readAsDataURL(imageFile);

//     // Handle Crop and Save button click
//     document.getElementById('cropAndSave').addEventListener('click', function () {
//         // Get the cropped canvas
//         var canvas = cropper.getCroppedCanvas();

//         // Convert the canvas to a Blob
//         canvas.toBlob(function (croppedBlob) {
//             // Create an img element with the cropped image
//             var imgElement = document.createElement('img');
//             imgElement.src = URL.createObjectURL(croppedBlob);
//             imgElement.alt = 'Cropped Image';

//             // Append the img element to the container
//             var container = document.getElementById('croppedImageContainer');
//             container.innerHTML = ''; // Clear previous content
//             container.appendChild(imgElement);

//             // Hide the modal
//             modal.style.display = 'none';
//         });
//     });
// }