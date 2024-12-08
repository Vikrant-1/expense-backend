import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Read data from Firestore
 * @param path - The path of the document or collection
 * @returns Document data or null if not found
 */
export const readDocument = async (path: string) => {
  try {
    const docRef = db.doc(path);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.error("Error reading document:", error);
    return null;
  }
};

/**
 * Write data to Firestore
 * @param path - The path of the document.
 * @param data - The data to write to the document.
 */
export const writeDocument = async (
  path: string,
  data: Record<string, any>
) => {
  try {
    const docRef = db.doc(path);
    await docRef.set(data, { merge: true });
    console.log(`Document written to path: ${path}`);
  } catch (error) {
    console.error("Error writing document:", error);
    throw error;
  }
};

/**
 * Delete a document from Firestore
 * @param path - The path of the document to delete.
 */
export const deleteDocument = async (path: string) => {
  try {
    const docRef = db.doc(path);
    await docRef.delete();
    console.log(`Document deleted at path: ${path}`);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

/**
 * Read multiple documents from a collection
 * @param collectionPath - The path of the collection.
 */
export const readCollection = async (collectionPath: string) => {
  try {
    const collectionRef = db.collection(collectionPath);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      throw new Error(`No documents found in collection: ${collectionPath}`);
    }

    const documents = snapshot.docs.map((doc) => doc.data());
    return documents;
  } catch (error) {
    console.error("Error reading collection:", error);
    throw error;
  }
};
