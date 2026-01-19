/**
 * Exams Builder & Parser for ELMOHASEB ACADEMY
 * Handles native quiz logic and database interactions.
 */

window.ExamsBuilder = {
    // Phase 1: Database Interaction
    async saveExam(examData) {
        const { databases, DB_ID, ID } = window.appwrite;
        const COLLECTIONS_EXAMS = "exams";

        const docData = {
            id: examData.id || ID.unique(),
            subjectId: examData.subjectId,
            title: examData.title,
            questions: JSON.stringify(examData.questions),
            timeLimit: parseInt(examData.timeLimit) || 30,
            expiryDate: examData.expiryDate || "",
            isOpen: examData.isOpen || false
        };

        try {
            await databases.createDocument(DB_ID, COLLECTIONS_EXAMS, docData.id, docData);
            return docData;
        } catch (e) {
            console.error("Save Exam Error:", e);
            throw e;
        }
    },

    async getAllExams(subjectId = null) {
        const { databases, DB_ID, Query } = window.appwrite;
        const COLLECTIONS_EXAMS = "exams";

        try {
            const queries = [];
            if (subjectId) {
                queries.push(Query.equal("subjectId", subjectId));
            }

            const response = await databases.listDocuments(DB_ID, COLLECTIONS_EXAMS, queries);
            return response.documents.map(doc => ({
                ...doc,
                questions: JSON.parse(doc.questions || "[]")
            }));
        } catch (e) {
            console.error("Get Exams Error:", e);
            return [];
        }
    },

    async saveExamResult(userId, examId, score, total) {
        const { databases, DB_ID, COLLECTIONS } = window.appwrite;
        const COLLECTION = COLLECTIONS.RESULTS || "exam_results";
        const docId = `${userId}_${examId}`.replace(/[^a-zA-Z0-9]/g, "_"); // Valid ID

        const data = {
            userId,
            examId,
            score: parseInt(score),
            total: parseInt(total),
            timestamp: new Date().toISOString()
        };

        try {
            // Check if document exists
            try {
                await databases.getDocument(DB_ID, COLLECTION, docId);
                // If exists, update
                await databases.updateDocument(DB_ID, COLLECTION, docId, data);
            } catch (e) {
                // If not exists, create
                await databases.createDocument(DB_ID, COLLECTION, docId, data);
            }
        } catch (e) {
            console.error("Save/Update Result Error:", e);
            throw e;
        }
    },

    async checkExamAttempt(userId, examId) {
        if (!userId || !examId) return null;
        const { databases, DB_ID, Query, COLLECTIONS } = window.appwrite;
        const COLLECTION = COLLECTIONS.RESULTS || "exam_results";

        try {
            const response = await databases.listDocuments(DB_ID, COLLECTION, [
                Query.equal("userId", userId),
                Query.equal("examId", examId)
            ]);
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (e) {
            console.error("Check Attempt Error:", e);
            return null;
        }
    },

    async toggleExamMode(examId, isOpen) {
        const { databases, DB_ID, COLLECTIONS } = window.appwrite;
        const COLLECTION = COLLECTIONS.EXAMS;

        try {
            await databases.updateDocument(DB_ID, COLLECTION, examId, {
                isOpen: isOpen
            });
            return true;
        } catch (e) {
            console.error("Toggle Mode Error:", e);
            throw e;
        }
    }
};
