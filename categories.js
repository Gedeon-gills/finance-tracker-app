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

        const addCategoryBtn = document.getElementById('addCategoryBtn');

        addCategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Overlay
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = 0;
            modal.style.left = 0;
            modal.style.right = 0;
            modal.style.bottom = 0;
            modal.style.background = 'rgba(0,0,0,0.4)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '2000';

            // Modal content box
            const box = document.createElement('div');
            box.style.width = '430px';
            box.style.background = '#fff';
            box.style.borderRadius = '16px';
            box.style.padding = '30px';
            box.style.fontFamily = 'Inter, sans-serif';
            box.style.position = 'relative';

            
            box.innerHTML = `
                <h2 style="margin:0; font-weight:600; font-size:20px;">Add Category</h2>

                <!-- FORM -->
                <div style="margin-top:20px;">
                    <label style="font-size:14px; font-weight:700;">Name</label>
                        <input id="nameInput" type="text" placeholder="Category Name"
                            style="width:100%; margin-top:6px; margin-bottom:18px; 
                            padding:10px; border:1px solid #dce1e7; border-radius:8px; transition:0.2s;">
                    

                    <!-- CUSTOM DROPDOWN (replaces native select) -->
                    <label style="font-size:14px; font-weight:700;">Type </label>
                    <div id="typeCustom" style="position:relative; margin-top:6px; margin-bottom:16px;">
                        <button id="typeTrigger" type="button"
                            style="width:100%; text-align:left; padding:10px; border:1px solid #dce1e7; border-radius:8px; background:white; cursor:pointer;">
                            Select Type 
                        </button>
                        <ul id="typeOptions"
                            style="position:absolute; left:0; right:0; margin:6px 0 0 0; padding:6px 0; list-style:none;
                                max-height:160px; overflow:auto; background:#fff; border:1px solid #e6e9ee; border-radius:8px;
                                box-shadow:0 6px 18px rgba(0,0,0,0.08); display:none; z-index:3000;">
                            <li data-value="Income" style="padding:10px 12px; cursor:pointer;" bullet>Income</li>
                            <li data-value="Expense" style="padding:10px 12px; cursor:pointer;">Expense</li>
                        </ul>
                        <!-- hidden input to store the selected value so your existing submit logic can read it -->
                        <input type="hidden" id="colorValue" value="">
                    </div>

                    <label style="font-size:14px; font-weight:700;">Color </label>
                    <div id="colorCustom" style="position:relative; margin-top:6px; margin-bottom:16px;">
                        <button id="colorTrigger" type="button"
                            style="width:100%; text-align:left; padding:10px; border:1px solid #dce1e7; border-radius:8px; background:white; cursor:pointer;">
                            Select Color 
                        </button>
                        <ul id="colorOptions"
                            style="position:absolute; left:0; right:0; margin:6px 0 0 0; padding:6px 0; list-style:none;
                                max-height:160px; overflow:auto; background:#fff; border:1px solid #e6e9ee; border-radius:8px;
                                box-shadow:0 6px 18px rgba(0,0,0,0.08); display:none; z-index:3000;">
                            <li data-value="Red"     data-color="#ff3b30" style="padding:10px 12px; list-style:none; cursor:pointer;">Red</li>
                            <li data-value="Green"   data-color="#34c759" style="padding:10px 12px; list-style:none; cursor:pointer;">Green</li>
                            <li data-value="Blue"    data-color="#007aff" style="padding:10px 12px; list-style:none; cursor:pointer;">Blue</li>
                            <li data-value="Orange"  data-color="#ff9500" style="padding:10px 12px; list-style:none; cursor:pointer;">Orange</li>
                            <li data-value="Purple"  data-color="#af52de" style="padding:10px 12px; list-style:none; cursor:pointer;">Purple</li>
                            <li data-value="Pink"    data-color="#ff2d55" style="padding:10px 12px; list-style:none; cursor:pointer;">Pink</li>
                            <li data-value="Yellow"  data-color="#ffcc00" style="padding:10px 12px; list-style:none; cursor:pointer;">Yellow</li>
                            <li data-value="Emerald" data-color="#2ecc71" style="padding:10px 12px; list-style:none; cursor:pointer;">Emerald</li>
                            <li data-value="Gray"    data-color="#8e8e93" style="padding:10px 12px; list-style:none; cursor:pointer;">Gray</li>
                        </ul>
                        <!-- hidden input to store the selected value so your existing submit logic can read it -->
                        <input type="hidden" id="colorValue" value="">
                    </div>

                    

                </div>

                <!-- Buttons -->
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button id="cancelBtn"
                        style="padding:10px 24px; border-radius:8px; border:1px solid #d4d9df; background:#fff;
                        cursor:pointer; font-weight:500;">Cancel</button>

                    <button id="submitBtn"
                        style="padding:10px 24px; border-radius:8px; background:#0cb463; border:none; color:white;
                        cursor:pointer; font-weight:500;">Create</button>
                </div>
            `;

            

            modal.appendChild(box);
            document.body.appendChild(modal);

            
            // Button hover effects (your existing code)
            const submitBtn = box.querySelector("#submitBtn");
            const clearBtn = box.querySelector("#cancelBtn");

            submitBtn.addEventListener("mouseenter", () => {
                submitBtn.style.background = "rgba(12, 180, 99, 0.8)";   
            });
            submitBtn.addEventListener("mouseleave", () => {
                submitBtn.style.background = "#0cb463";   
            });

            clearBtn.addEventListener("mouseenter", () => {
                clearBtn.style.background = "#0cb463"; 
                clearBtn.style.color = "white";  
            });
            clearBtn.addEventListener("mouseleave", () => {
                clearBtn.style.background = "#d4d9df"; 
                clearBtn.style.color = "black";  
            });


            // GREEN FOCUS EFFECT FOR *ALL* INPUTS (keeps your outline removal)
            box.querySelectorAll('input[type="number"], input[type="date"], input[type="text"], input[type="hidden"]').forEach(field => {
                field.addEventListener('focus', () => {
                    field.style.outline = 'none';
                    field.style.outlineColor = 'transparent';
                    field.style.border = '1.5px solid #0cb463';
                    field.style.boxShadow = '0 0 0 2px rgba(12,180,99,0.2)';
                });
                field.addEventListener('blur', () => {
                    // hidden input should not change border so skip it
                    if (field.type === 'hidden') return;
                    field.style.border = '1px solid #dce1e7';
                    field.style.boxShadow = 'none';
                });
            });

            
            // CUSTOM DROPDOWN LOGIC
            const typeTrigger = box.querySelector('#typeTrigger');
            const colorTrigger = box.querySelector('#colorTrigger');

            const typeOptionsList = box.querySelector('#typeOptions');
            const colorOptionsList = box.querySelector('#colorOptions');

            const typeOptions = typeOptionsList.querySelectorAll("li");
            const colorOptions = colorOptionsList.querySelectorAll("li");

            const hiddenType = box.querySelector('#typeValue');
            const hiddenColor = box.querySelector('#colorValue');
            

            // Close all
            function closeAllDropdowns() {
                typeOptionsList.style.display = "none";
                colorOptionsList.style.display = "none";
            }

            //  Open Type
            typeTrigger.addEventListener("click", (e) => {
                e.stopPropagation();

                // Close the other dropdown
                colorOptionsList.style.display = "none";

                // Toggle type dropdown
                typeOptionsList.style.display =
                    typeOptionsList.style.display === "block" ? "none" : "block";

                // Add green border
                typeTrigger.style.border = "1.5px solid #0cb463";
                typeTrigger.style.boxShadow = "0 0 0 2px rgba(12,180,99,0.2)";
            });

            colorTrigger.addEventListener("click", (e) => {
                e.stopPropagation();

                // Close the other dropdown
                typeOptionsList.style.display = "none";

                // Toggle color dropdown
                colorOptionsList.style.display =
                    colorOptionsList.style.display === "block" ? "none" : "block";

                // Add green border
                colorTrigger.style.border = "1.5px solid #0cb463";
                colorTrigger.style.boxShadow = "0 0 0 2px rgba(12,180,99,0.2)";
            });

            // When selecting TYPE → close dropdown
            typeOptions.forEach(li => {
                li.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const value = li.dataset.value;

                    // remove previous ticks
                    typeOptions.forEach(opt => opt.classList.remove("selected-option"));

                    // add tick to this option
                    li.classList.add("selected-option");

                    // update button
                    typeTrigger.textContent = value;
                    hiddenType.value = value;

                    typeOptionsList.style.display = "none";
                    typeTrigger.style.border = "1.5px solid #0cb463";
                    typeTrigger.style.boxShadow = "0 0 0 2px rgba(12,180,99,0.2)";
                });
            });
            

            //  When selecting COLOR → keep bullet + close dropdown
            colorOptions.forEach(li => {
                li.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const value = li.dataset.value;
                    const bulletColor = li.dataset.color;

                    // remove previous ticks
                    colorOptions.forEach(opt => opt.classList.remove("selected-option"));

                    // add tick to this one
                    li.classList.add("selected-option");

                    // update button text with bullet
                    hiddenColor.value = value;
                    colorTrigger.innerHTML = `
                        <span class="color-bullet" style="background:${bulletColor};"></span>
                        ${value}
                    `;

                    colorOptionsList.style.display = "none";
                    colorTrigger.style.border = "1.5px solid #0cb463";
                    colorTrigger.style.boxShadow = "0 0 0 2px rgba(12,180,99,0.2)";
                });
            });



            
            // Click outside → close everything
            
            document.addEventListener("click", (e) => {
                if (!box.contains(e.target)) {
                    closeAllDropdowns();
                }
            });



            // Close modal handlers
            box.querySelector('#cancelBtn').onclick = () => modal.remove();
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            // Submit handler: read hidden input for type
            box.querySelector('#submitBtn').onclick = () => {
                const type = box.querySelector('#typeValue').value; // from custom dropdown
                const color = box.querySelector('#colorValue').value; // from custom dropdown
                const name = box.querySelector('#nameInput').value;

                console.log({ type, color, name });
                modal.remove();
            };
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