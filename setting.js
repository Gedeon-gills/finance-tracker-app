import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCnSZsrVZqsUPM0PblRp_iIL_JHL62qGig",
    authDomain: "finance-tracker-app-57903.firebaseapp.com",
    projectId: "finance-tracker-app-57903",
    storageBucket: "finance-tracker-app-57903.firebasestorage.app",
    messagingSenderId: "561580732312",
    appId: "1:561580732312:web:0a189a4632237d9933c5ed"
  };

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "signUp.html";
            return;
        }

        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("email").value = user.email;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            const data = snap.data();

            document.getElementById("full-name").value = data.fullName || "";
            document.getElementById("userFullName").textContent = data.fullName || "No Name";
            document.getElementById("currency").value = data.currency || "USD Dollar(USD)";
            document.getElementById("email-notifications").checked = data.emailNotifications || false;

        } else {
            // Create profile if doesn't exist
            await setDoc(userRef, {
                fullName: "",
                currency: "USD Dollar(USD)",
                emailNotifications: false
            });
        }
    });

    
    // UPDATE FULL NAME
    document.getElementById("full-name").addEventListener("change", async () => {
        const user = auth.currentUser;
        const name = document.getElementById("full-name").value;

        await updateDoc(doc(db, "users", user.uid), { fullName: name });

        // Update top bar immediately
        document.getElementById("userFullName").textContent = name;
    });

    // CHANGE PASSWORD (with re-auth + early password check)

    document.querySelector(".change-btn").addEventListener("click", async () => {
        const user = auth.currentUser;

        // Step 1: Ask for current password
        const oldPassword = prompt("Enter your current password:");
        if (!oldPassword) return;

        try {
            
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);

        } catch (error) {
            alert("❌ Incorrect current password. Please try again.");
            return;
        }

        
        const newPassword = prompt("Enter your new password:");
        if (!newPassword) return;

        
        if (newPassword.length < 8) {
            alert("❌ Password should be at least 8 characters long.");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            alert("✅ Password changed successfully!");

        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // UPDATE CURRENCY

    document.getElementById("currency").addEventListener("change", async () => {
        const user = auth.currentUser;

        await updateDoc(doc(db, "users", user.uid), {
            currency: document.getElementById("currency").value
        });
    });

    // EMAIL NOTIFICATIONS TOGGLE

    document.getElementById("email-notifications").addEventListener("change", async () => {
        const user = auth.currentUser;

        await updateDoc(doc(db, "users", user.uid), {
            emailNotifications: document.getElementById("email-notifications").checked
        });
    });

    // DELETE ACCOUNT

    document.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;

        const user = auth.currentUser;

        try {
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(user);

            alert("Account deleted successfully.");
            window.location.href = "signup.html";

        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    const logoutBtn = document.getElementById('signoutBtn');

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Create confirmation modal
        const modal = document.createElement('div');
        modal.style.position = 'fixed'; modal.style.top = '0'; modal.style.left = '0'; modal.style.right = '0'; modal.style.bottom = '0'; modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex'; modal.style.justifyContent = 'center'; modal.style.alignItems = 'center'; modal.style.zIndex = '1000';

        const content = document.createElement('div');
        content.style.background = 'white'; content.style.padding = '20px 30px'; content.style.borderRadius = '10px';
        content.style.textAlign = 'center'; content.style.maxWidth = '300px'; content.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

        const message = document.createElement('p');
        message.innerText = 'Are you sure you want to logout?'; message.style.marginBottom = '20px'; message.style.fontSize = '16px';

        const buttons = document.createElement('div'); 
        buttons.style.display = 'flex'; buttons.style.justifyContent = 'space-around';

        const yesBtn = document.createElement('button');
        yesBtn.innerText = 'Yes'; yesBtn.style.padding = '8px 20px'; yesBtn.style.background = '#0cb463'; yesBtn.style.color = 'white'; yesBtn.style.border = 'none'; yesBtn.style.borderRadius = '5px'; yesBtn.style.cursor = 'pointer';

        const noBtn = document.createElement('button');
        noBtn.innerText = 'No'; noBtn.style.padding = '8px 20px'; noBtn.style.background = '#ccc'; noBtn.style.color = 'black';
        noBtn.style.border = 'none'; noBtn.style.borderRadius = '5px'; noBtn.style.cursor = 'pointer';

        buttons.appendChild(yesBtn); buttons.appendChild(noBtn);

        content.appendChild(message); content.appendChild(buttons); modal.appendChild(content); document.body.appendChild(modal);

        // YES logs out
        yesBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                localStorage.removeItem('loggedInUserId');
                window.location.href = 'signUp.html';
            });
        });

        // NO closes modal
        noBtn.addEventListener('click', () => {
            modal.remove();
        });
    });