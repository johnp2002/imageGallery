// document.getElementById('add').addEventListener('click', function () {
//     // Trigger the hidden file input when the button is clicked
//     document.getElementById('fileInput').click();
// });

// document.getElementById('fileInput').addEventListener('change', function (event) {
//     var selectedImage = event.target.files[0];

//     // Check if an image is selected
//     if (selectedImage) {
//         // Convert the selected image to Blob
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             var imageData = e.target.result; // This is the Blob data
//             console.log('Blob Data:', imageData);

//             // Set the Blob data as the source of the image
//             var previewImage = document.getElementById('previewImage');
//             previewImage.src = imageData;
//             previewImage.style.display = 'block';
//         };
//         reader.readAsDataURL(selectedImage);
//     } else {
//         console.error('No image selected');
//     }
// });

// v1 above upload nad just view image

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

// v2 just cropping and view cropped file
console.log("script fileee");

var btn = document.getElementById("");

document.getElementById("add").addEventListener("click", function () {
  // Trigger the hidden file input when the button is clicked
  document.getElementById("fileInput").click();
});

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    var selectedImage = event.target.files[0];

    // Check if an image is selected
    if (selectedImage) {
      // Show the cropping modal
      showCroppingModal(selectedImage);
    } else {
      console.error("No image selected");
    }
  });

function showCroppingModal(imageFile) {
  // Show the modal
  var modal = document.getElementById("croppingModal");
  modal.style.display = "block";

  // Initialize Cropper.js
  var cropper = new Cropper(document.getElementById("croppingImage"), {
    aspectRatio: 1, // Adjust as needed
    viewMode: 1,
    movable: false,
    zoomable: false,
    rotatable: false,
  });

  // Load the selected image into the cropper
  var reader = new FileReader();
  reader.onload = function (e) {
    cropper.replace(e.target.result);
  };
  reader.readAsDataURL(imageFile);

  // Handle Crop and Save button click
  document.getElementById("cropAndSave").addEventListener("click", function () {
    // Get the cropped canvas
    var canvas = cropper.getCroppedCanvas();

    // Convert the canvas to a Blob
    canvas.toBlob(function (croppedBlob) {
      // Create a FormData object to send the blob data
      var formData = new FormData();
      formData.append("imageData", croppedBlob, "croppedImage.png");

      // Send a POST request to the server
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          console.log("Server response:", data);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });

      // Hide the modal
      modal.style.display = "none";
    });
  });
}

fetch("http://localhost:5000/details")
  .then((response) => {
    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON from the response
    return response.json();
  })
  .then((data) => {
    // Handle the JSON data
    console.log(data);
    setDetails(data);

    // Now you can work with the 'data' object
    // For example, you can access properties like data.propertyName
  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch
    console.error("Fetch error:", error);
  });

function setDetails(data) {
  document.getElementById("usrName").innerText = data.displayName;
}

function chk() {
    fetch("http://localhost:5000/getImages")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const imgs = data.map((item) => {
          const userEmail = item.userEmail;
          const base64ImageData = item.imageData;
  
          // Do something with the email and base64ImageData
          console.log(`User: ${userEmail}`);
  
          return {
            user: userEmail,
            base64Data: base64ImageData,
          };
        });
  
        console.log(imgs);
        setImages(imgs);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }
  
  function setImages(imagesArray) {
    const container = document.getElementById("croppedImageContainer");
  
    // Clear existing images in the container
    container.innerHTML = "";
  
    imagesArray.forEach((image) => {
      const imgElement = document.createElement("img");
      
      // Set the image source directly to the base64 data
      imgElement.src = `data:image/jpeg;base64,${image.base64Data}`;
      imgElement.alt = `Image for ${image.user}`;
      
      container.appendChild(imgElement);
    });
  }
  
// Call the chk function to initiate the image fetching and rendering
