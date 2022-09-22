// Set constraints for the video stream
const constraints = {video: {facingMode: "environment"}, audio: false, zoom: true};
// Define constants
const cameraView = document.querySelector("#camera--view")




// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;

            const capabilities = track.getCapabilities();
            const settings = track.getSettings();

            const input = document.querySelector("#zoom");

            // Check whether zoom is supported or not.
            if (!('zoom' in settings)) {
                input.style.display = "None";
                return;
            }

            // Map zoom to a slider element.
            input.min = capabilities.zoom.min;
            input.max = capabilities.zoom.max;
            input.step = capabilities.zoom.step;
            input.value = settings.zoom;

            input.oninput = function(event) {
                track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
            }
            input.hidden = false;

        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}


// Take a picture when cameraTrigger is tapped

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);






