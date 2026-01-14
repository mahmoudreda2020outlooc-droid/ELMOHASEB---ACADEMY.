
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7UWLVEUvoMyD3L9qLdvRlV0-qT4Gh0pU",
    authDomain: "centerplatform-4917a.firebaseapp.com",
    projectId: "centerplatform-4917a",
    storageBucket: "centerplatform-4917a.firebasestorage.app",
    messagingSenderId: "459707126656",
    appId: "1:459707126656:web:03440331aaa9734737e765"
};

// Initialize Firebase (Assuming compat scripts are loaded in HTML)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

console.log("🔥 Firebase (Compat) Initialized");

window.dbInit = async () => {
    return true;
};

// --- MATERIALS FUNCTIONS ---
window.dbAdd = async (item) => {
    console.log("💾 dbAdd function triggered with item:", item);
    try {
        if (item.isBlob && item.url instanceof File) {
            console.log("📤 Detected file upload. Ref:", item.id);
            const file = item.url;
            const storageRef = storage.ref('materials/' + item.id + '_' + file.name);
            console.log("⏳ Uploading to storage...");
            const snapshot = await storageRef.put(file);
            console.log("✅ Upload complete. Fetching URL...");
            const downloadURL = await snapshot.ref.getDownloadURL();

            item.url = downloadURL;
            item.isBlob = false;
            item.storagePath = 'materials/' + item.id + '_' + file.name;
        }

        const docId = String(item.id);
        console.log("📝 Attempting to save to Firestore. Collection: materials, ID:", docId);

        // Timeout check: Firestore sometimes hangs if no network or wrong rules
        const savePromise = db.collection("materials").doc(docId).set(item);
        await savePromise;

        console.log("✅ Firestore save successful!");
        return item;
    } catch (e) {
        console.error("❌ Firebase Add Error Detailed:", e);
        alert("خطأ أثناء الحفظ: " + e.message);
        throw e;
    }
};

window.dbGetAll = async () => {
    const querySnapshot = await db.collection("materials").get();
    const list = [];
    querySnapshot.forEach((doc) => {
        list.push(doc.data());
    });
    return list;
};

window.dbDelete = async (id) => {
    const docId = String(id);
    await db.collection("materials").doc(docId).delete();
};

// --- USERS FUNCTIONS ---
window.dbUserLogin = async (username, password) => {
    const querySnapshot = await db.collection("users").where("username", "==", username).get();

    if (querySnapshot.empty) return null;

    let validUser = null;
    querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.password === password) {
            validUser = user;
            validUser.docId = doc.id;
        }
    });
    return validUser;
};

window.dbUserGetAll = async () => {
    const querySnapshot = await db.collection("users").get();
    const list = [];
    querySnapshot.forEach((doc) => {
        const u = doc.data();
        u.docId = doc.id;
        list.push(u);
    });
    return list;
};

window.dbUserAdd = async (user) => {
    const querySnapshot = await db.collection("users").where("username", "==", user.username).get();
    if (!querySnapshot.empty) {
        throw new Error("Username already exists");
    }

    const docId = String(user.id);
    await db.collection("users").doc(docId).set(user);
    return user;
};

window.dbUserUpdate = async (user) => {
    const docId = String(user.id);
    await db.collection("users").doc(docId).set(user, { merge: true });
    return user;
};

window.dbUserDelete = async (id) => {
    const docId = String(id);
    await db.collection("users").doc(docId).delete();
};

// --- LOGS FUNCTIONS ---
window.dbLogAdd = async (log) => {
    await db.collection("security_logs").add(log);
};

window.dbLogGetAll = async () => {
    const querySnapshot = await db.collection("security_logs").get();
    const list = [];
    querySnapshot.forEach((doc) => {
        list.push(doc.data());
    });
    return list;
};

window.dbLogClearAll = async () => {
    const querySnapshot = await db.collection("security_logs").get();
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};
