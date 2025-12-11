import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, query, where, doc, getDoc, getDocs, addDoc  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

      // ---------- Income vs Expense (Bar Chart) ----------
        const ctx1 = document.getElementById("incomeExpenseChart").getContext("2d");

        new Chart(ctx1, {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                    {
                        label: "income",
                        data: [4000, 3000, 2000, 2500, 1500, 2300],
                        backgroundColor: "#22c55e",
                        borderRadius: 6
                    },
                    {
                        label: "expense",
                        data: [2000, 1200, 10000, 3500, 4500, 2800],
                        backgroundColor: "#ef4444",
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0,
                        max: 10000,
                        ticks: {
                            stepSize: 2500,
                            callback: (value) => value
                        },
                        grid: {
                            color: "rgba(0,0,0,0.05)"
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });


        // ---------- Spending by Category (Pie Chart) ----------
        const ctx2 = document.getElementById("spendingChart").getContext("2d");

        new Chart(ctx2, {
            type: "pie",
            data: {
                labels: ["Food", "Transportation", "Entertainment", "Utilities", "Other"],
                datasets: [{
                    data: [450.00, 320.00, 280.00, 200.00, 150.00],
                    backgroundColor: [
                        "#22c55e",
                        "#06b6d4",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || "";
                                const value = context.raw;
                                return `${label}: $${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "signUp.html";
                return;
            }
            document.getElementById('userFullName').innerText = "Loading...";
            document.getElementById('userEmail').innerText = user.email || "";
        
                    // If user IS logged in → load data
            const docRef = doc(db, "users", user.uid);
                getDoc(docRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        document.getElementById('userFullName').innerText = userData.fullName;
                        document.getElementById('userEmail').innerText = userData.email;
                    }        
                });
            });

            const sidebarLogout = document.getElementById('signoutBtn');
        const topbarLogout = document.getElementById('topbarSignout');
        const topbarUserIcon = document.querySelector(".bx-user");

        const hamburger = document.getElementById("hamburgerMenu");
        const closeBtn = document.getElementById("close");
        const menu = document.querySelector(".menu");

        let menuWasOpen = false;

        // OPEN LOGOUT MODAL
        function openLogoutModal() {

            // Detect previous hamburger state BUT ONLY on mobile
            if (window.innerWidth <= 768) {
                menuWasOpen = menu.classList.contains("open");

                menu.classList.remove("open");
                document.body.classList.remove("menu-open");
                document.body.classList.remove("body-no-scroll");
                closeBtn.style.display = "none";
                hamburger.style.display = menuWasOpen ? "none" : "block";
            }

            // Hide topbar signout dropdown
            if (topbarLogout) topbarLogout.style.display = "none";

            // Create modal
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.right = '0';
            modal.style.bottom = '0';
            modal.style.background = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            const content = document.createElement('div');
            content.style.background = 'white';
            content.style.padding = '20px 30px';
            content.style.borderRadius = '10px';
            content.style.textAlign = 'center';
            content.style.maxWidth = '300px';

            const message = document.createElement('p');
            message.innerText = 'Are you sure you want to logout?';
            message.style.marginBottom = '20px';

            const buttons = document.createElement('div');
            buttons.style.display = 'flex';
            buttons.style.justifyContent = 'space-around';

            const yesBtn = document.createElement('button');
            yesBtn.innerText = 'Yes';
            yesBtn.style.padding = '8px 20px';
            yesBtn.style.background = '#0cb463';
            yesBtn.style.color = 'white';
            yesBtn.style.border = 'none';
            yesBtn.style.borderRadius = '5px';

            const noBtn = document.createElement('button');
            noBtn.innerText = 'No';
            noBtn.style.padding = '8px 20px';
            noBtn.style.background = '#ccc';
            noBtn.style.border = 'none';
            noBtn.style.borderRadius = '5px';

            // Append
            buttons.appendChild(yesBtn);
            buttons.appendChild(noBtn);
            content.appendChild(message);
            content.appendChild(buttons);
            modal.appendChild(content);
            document.body.appendChild(modal);

            // YES → Log Out
            yesBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    localStorage.removeItem('loggedInUserId');
                    window.location.href = 'signUp.html';
                });
            });

            // NO → Restore menu ONLY for mobile
            noBtn.addEventListener('click', () => {
                modal.remove();

                if (window.innerWidth <= 768) {
                    if (menuWasOpen) {
                        menu.classList.add("open");
                        document.body.classList.add("menu-open");
                        document.body.classList.add("body-no-scroll");
                        closeBtn.style.display = "block";
                        hamburger.style.display = "none";
                    } else {
                        menu.classList.remove("open");
                        document.body.classList.remove("menu-open");
                        document.body.classList.remove("body-no-scroll");
                        closeBtn.style.display = "none";
                        hamburger.style.display = "block";
                    }
                }
            });
        }

        // Attach logout events
        if (sidebarLogout) sidebarLogout.addEventListener('click', openLogoutModal);
        if (topbarLogout) topbarLogout.addEventListener('click', openLogoutModal);

        // HAMBURGER MENU (mobile only)
        hamburger.addEventListener("click", () => {
            menu.classList.add("open");
            document.body.classList.add("menu-open");
            document.body.classList.add("body-no-scroll");
            hamburger.style.display = "none";
            closeBtn.style.display = "block";
        });

        closeBtn.addEventListener("click", () => {
            menu.classList.remove("open");
            document.body.classList.remove("menu-open");
            document.body.classList.remove("body-no-scroll");
            hamburger.style.display = "block";
            closeBtn.style.display = "none";
        });

        // TOPBAR SIGNOUT DROPDOWN
        topbarUserIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            topbarLogout.style.display =
                topbarLogout.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!topbarUserIcon.contains(e.target) &&
                !topbarLogout.contains(e.target)) {
                topbarLogout.style.display = "none";
            }
        });