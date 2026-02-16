// ui.js
import { db } from "./firebase.js";
// Select your message container in index.html
const messageContainer = document.getElementById("message-container");

/**
 * Show a message in the UI
 * @param {string} text - Message text
 * @param {string} type - "success" | "warning" | "error"
 */
export function showMessage(text, type = "success") {
  if (!messageContainer) return;

  // Clear previous messages
  messageContainer.innerHTML = "";

  // Create new message element
  const msg = document.createElement("div");
  msg.textContent = text;

  // Apply styles based on type
  switch (type) {
    case "success":
      msg.style.color = "green";
      break;
    case "warning":
      msg.style.color = "orange";
      break;
    case "error":
      msg.style.color = "red";
      break;
    default:
      msg.style.color = "black";
  }

  messageContainer.appendChild(msg);

  // Optional: auto-clear after 3 seconds
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 3000);
}
