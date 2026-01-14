// IndexedDB Wrapper for Large File Storage (Global Version)
const DB_NAME = 'CommercePlatformDB';
const DB_VERSION = 4; // Upgraded to force 'security_logs' creation

window.dbInit = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Materials Store
            if (!db.objectStoreNames.contains('materials')) {
                db.createObjectStore('materials', { keyPath: 'id' });
            }

            // Users Store
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id' });
                userStore.createIndex("username", "username", { unique: true });
            }

            // Security Logs Store (New)
            if (!db.objectStoreNames.contains('security_logs')) {
                db.createObjectStore('security_logs', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

// --- Materials Functions ---
window.dbAdd = async (item) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('materials', 'readwrite');
        const store = tx.objectStore('materials');
        const request = store.add(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

window.dbGetAll = async () => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('materials', 'readonly');
        const store = tx.objectStore('materials');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

window.dbDelete = async (id) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('materials', 'readwrite');
        const store = tx.objectStore('materials');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// --- Users Functions ---
window.dbUserAdd = async (user) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.add(user);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error); // Likely username duplicate
    });
};

window.dbUserGetAll = async () => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

window.dbUserDelete = async (id) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

window.dbUserUpdate = async (user) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        const request = store.put(user); // Put updates or adds
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

window.dbUserLogin = async (username, password) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('users', 'readonly');
        const store = tx.objectStore('users');
        const index = store.index("username");
        const request = index.get(username);

        request.onsuccess = () => {
            const user = request.result;
            if (user && user.password === password) {
                resolve(user);
            } else {
                resolve(null); // Invalid
            }
        };
        request.onerror = () => reject(request.error);
    });
};

// --- Security Log Functions ---
window.dbLogAdd = async (log) => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('security_logs', 'readwrite');
        const store = tx.objectStore('security_logs');
        const request = store.add(log);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

window.dbLogGetAll = async () => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('security_logs', 'readonly');
        const store = tx.objectStore('security_logs');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

window.dbLogClearAll = async () => {
    const db = await window.dbInit();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('security_logs', 'readwrite');
        const store = tx.objectStore('security_logs');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
