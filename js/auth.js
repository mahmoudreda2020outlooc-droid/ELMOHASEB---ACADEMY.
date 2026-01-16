import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Simple fingerprint for now (User Agent + Screen Res + Timezone)
// In production, use FingerprintJS
function getDeviceFingerprint() {
    const data = [
        navigator.userAgent,
        screen.height,
        screen.width,
        new Date().getTimezoneOffset()
    ];
    return btoa(data.join('|'));
}

export async function loginUser(email, password) {
    // 1. Authenticate with Firebase Auth
    // DEV MODE: If API key is placeholder, simulate successful login
    if (auth.app.options.apiKey === "API_KEY_HERE") {
        console.warn("Using MOCK LOGIN (Dev Mode)");
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Return dummy user
        const mockUser = {
            uid: "test-user-123",
            email: email,
            displayName: "Test Student"
        };

        // We skip Firestore checks in Dev Mode
        return mockUser;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const currentDevice = getDeviceFingerprint();

        // 2. Check Device Lock in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();

            if (userData.isSuspended) {
                await signOut(auth);
                throw new Error("This account is suspended.");
            }

            // Check if device matches
            if (userData.deviceId && userData.deviceId !== currentDevice) {
                await signOut(auth);
                throw new Error("Login blocked: You can only login from your registered device.");
            }

            // If no device registered (first login), register it
            if (!userData.deviceId) {
                await updateDoc(userRef, {
                    deviceId: currentDevice,
                    lastLogin: serverTimestamp()
                });
            } else {
                await updateDoc(userRef, {
                    lastLogin: serverTimestamp()
                });
            }

        } else {
            // First time user record creation (if not exists)
            await setDoc(userRef, {
                email: email,
                deviceId: currentDevice,
                isSuspended: false,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
        }

        return user;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

export async function logoutUser() {
    await signOut(auth);
    window.location.href = 'login.html';
}
