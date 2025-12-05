import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

  function showMessage(message, divId){
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerText = message;
    messageDiv.style.opacity = '1';
    setTimeout(function() {
      messageDiv.style.opacity = '0';
    }, 5000);
  }
  const signUp = document.getElementById('createBtn');
  signUp.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value; 
    const fullName = document.getElementById('fullName').value;

    const auth= getAuth();
    const db = getFirestore(app);

    createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
              const user = userCredential.user;
              console.log("USER ID:", user.uid); // Check if UID exists

              const userData = {
                  fullName: fullName,
                  email: email,
                  createdAt: new Date()
              };
          showMessage('Account created successfully!', 'signUpMessage');
          const docRef = doc(db, "users", user.uid);
          setDoc(docRef, userData)
          .then(() => {
              window.location.href = "dashboard.html";
          })
          .catch((error) => {
              console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/email-already-in-use'){
          showMessage(' Email address already Exists !!!', 'signUpMessage');
        } else if (password.length < 8){
          showMessage(' Password should be at least 8 characters long', 'signUpMessage');
        }else {
          showMessage('unable to create user', 'signUpMessage');
        }
      });
  })


  const signIn = document.getElementById('signInBtn');
  signIn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth= getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('Signed in successfully!', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUser', user.uid);
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/wrong-email') {
          showMessage(' Incorrect Email.', 'signInMessage');
        } else if (errorCode === 'auth/wrong-password' || password.length < 8) {
          showMessage(' Incorrect Password.', 'signInMessage');
        } else {
          showMessage('Account does not exist. Please sign up.', 'signInMessage');
        }
      });
  })

  const googleSignIn = document.getElementById('google-btn');
    googleSignIn.addEventListener('click', (e) => {
      e.preventDefault();
      showMessage('Google Sign-In is currently under development.', 'signInMessage');
  });



  