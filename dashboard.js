import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

    onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Prevent direct access when not logged in
        window.location.href = "signUp.html";
        return;
    }

    // If user IS logged in → load data
    const docRef = doc(db, "users", user.uid);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('welcomeUser').innerText = `Welcome, ${userData.fullName}`;
                document.getElementById('userFullName').innerText = userData.fullName;
                document.getElementById('userEmail').innerText = userData.email;
            }
        });
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
