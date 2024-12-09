import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

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

export const writeDocument = async (
  path: string,
  data: Record<string, any>
) => {
  try {
    const docRef = db.doc(path);
    await docRef.set(data, { merge: false });
    console.log(`Document written to path: ${path}`);
  } catch (error) {
    console.error("Error writing document:", error);
    throw error;
  }
};

export const updateDocument = async (
  path: string,
  data: Record<string, any>
) => {
  try {
    const docRef = db.doc(path);
    await docRef.update(data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error(`Failed to update document at path: ${path}`);
  }
};

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

export const getSpaceId = () => db.collection("spaces").id;
