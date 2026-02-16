// scanner.js
import { updateAttendance } from "./attendance.js";
import { showMessage } from "./ui.js";
import { db } from "./firebase.js";
// We'll use the browser's built-in camera API and a QR decoding library (like jsQR)
// You need to include jsQR in index.html:
// <script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>

let videoStream = null;
let scanning = false;

export async function startScanner(videoElement) {
  if (scanning) return;

  try {
    // Access camera
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    videoElement.srcObject = videoStream;
    videoElement.setAttribute("playsinline", true); // iOS fix
    await videoElement.play();
    scanning = true;

    requestAnimationFrame(tick);
  } catch (err) {
    console.error("Error accessing camera:", err);
    showMessage("❌ Cannot access camera");
  }
}

export function stopScanner(videoElement) {
  scanning = false;
  if (videoStream) {
    videoStream.getTracks().forEach((track) => track.stop());
  }
  videoElement.srcObject = null;
}

// Scan loop
function tick() {
  if (!scanning) return;

  const canvas = document.createElement("canvas");
  const video = document.querySelector("video");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    try {
      const qrData = JSON.parse(code.data); // we encoded JSON in QR
      if (qrData.id) {
        updateAttendance(qrData.id); // send ID to attendance module
      }
    } catch (err) {
      console.warn("Invalid QR code scanned");
    }
  }

  requestAnimationFrame(tick);
}
