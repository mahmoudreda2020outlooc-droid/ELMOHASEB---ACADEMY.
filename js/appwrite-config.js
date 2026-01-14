// Appwrite Configuration
if (typeof Appwrite === 'undefined') {
    console.error('Appwrite SDK not loaded!');
    alert('فشل تحميل Appwrite SDK. تأكد من اتصالك بالإنترنت.');
}
const { Client, Account, Databases, Storage, ID, Query } = Appwrite || {};

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your endpoint
    .setProject('69662d2200214465b1d3'); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs (Confirmed from screenshot)
const DB_ID = 'MainDatabase';
const COLLECTIONS = {
    MATERIALS: 'materials',
    USERS: 'users',
    LOGS: 'security_logs'
};
const BUCKET_ID = '696634ee001b4024cc9d'; // Updated from screenshot

// Exporting to window for easy access in scripts
window.appwrite = {
    client,
    account,
    databases,
    storage,
    ID,
    Query,
    DB_ID,
    COLLECTIONS,
    BUCKET_ID
};
