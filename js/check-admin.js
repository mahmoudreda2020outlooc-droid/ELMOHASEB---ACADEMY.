
// Temporary script to check for admin users
async function checkAdmin() {
    const { databases, DB_ID, COLLECTIONS, Query } = window.appwrite;
    const response = await databases.listDocuments(DB_ID, COLLECTIONS.USERS, [
        Query.equal("role", "admin")
    ]);
    console.log("Admin users found:", response.documents.map(d => ({ username: d.username, id: d.$id })));
}
checkAdmin();
