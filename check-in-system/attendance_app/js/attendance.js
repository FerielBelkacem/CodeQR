// attendance.js
import { db } from "./firebase.js";
import { showMessage } from "./ui.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firestore collection name
const ATTENDANCE_COLLECTION = "attendance";

// Keep a temporary cache to prevent double-scans within a short time
const recentScans = new Set();
const SCAN_COOLDOWN_MS = 3000; // 3 seconds

export async function updateAttendance(attendeeId) {
  // Prevent multiple scans in a short time
  if (recentScans.has(attendeeId)) return;
  recentScans.add(attendeeId);
  setTimeout(() => recentScans.delete(attendeeId), SCAN_COOLDOWN_MS);

  try {
    const attendeeRef = doc(db, ATTENDANCE_COLLECTION, attendeeId);
    const attendeeSnap = await getDoc(attendeeRef);

    if (attendeeSnap.exists()) {
      const data = attendeeSnap.data();
      if (data.present) {
        showMessage(`⚠️ Already checked in: ${attendeeId}`);
        return;
      }

      // Update presence
      await updateDoc(attendeeRef, {
        present: true,
        timestamp: serverTimestamp(),
      });
      showMessage(`✅ Attendance updated for: ${attendeeId}`);
    } else {
      // If new attendee, create record
      await setDoc(attendeeRef, {
        present: true,
        timestamp: serverTimestamp(),
      });
      showMessage(`✅ Attendance recorded for new attendee: ${attendeeId}`);
    }
  } catch (err) {
    console.error("Error updating attendance:", err);
    showMessage(`❌ Failed to update: ${attendeeId}`);
  }
}
