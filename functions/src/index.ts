
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.assignClientRole = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.auth().setCustomUserClaims(user.uid, { role: 'client' });
    console.log(`Successfully assigned 'client' role to user: ${user.uid}`);
  } catch (error) {
    console.error(`Error assigning 'client' role to user: ${user.uid}`, error);
  }
});
