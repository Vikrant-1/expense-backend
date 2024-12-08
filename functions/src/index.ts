import * as functions from 'firebase-functions';
import app from './app';

export const expenseApi = functions.https.onRequest(app);