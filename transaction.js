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

    const addTransactionBtn = document.getElementById('addTransactionBtn');

        addTransactionBtn.addEventListener('click', (e) => {
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
                <h2 style="margin:0; font-weight:600; font-size:20px;">Add Transaction</h2>
                <p style="margin-top:6px; color:#6c7a86; font-size:14px;">
                    Record a new income or expense transaction
                </p>

                <!-- Toggle -->
                <div style="display:flex; background:#f2f4f7; padding:4px; border-radius:8px; gap:6px; margin-top:16px;">
                    <button id="expenseTab" 
                        style="flex:1; padding:8px 0; border:none; background:#fff; border-radius:6px;
                        cursor:pointer; font-weight:500;">Expense</button>

                    <button id="incomeTab" 
                        style="flex:1; padding:8px 0; border:none; background:transparent; border-radius:6px;
                        cursor:pointer; font-weight:500; color:#6c7a86;">Income</button>
                </div>

                <!-- FORM -->
                <div style="margin-top:20px;">
                    <label style="font-size:14px; font-weight:500;">Amount *</label>
                    <div style="position:relative; width:100%; margin-top:6px; margin-bottom:16px;">
                        <span id="amountDollar" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#6b6f73; pointer-events:none;">$</span>
                        <input id="amountInput" type="number" step="0.01" inputmode="decimal" placeholder="0.00"
                                style="width:100%; padding:10px 10px 10px 26px; border:1px solid #dce1e7; border-radius:8px; transition:0.2s;">
                    </div>

                    <!-- CUSTOM DROPDOWN (replaces native select) -->
                    <label style="font-size:14px; font-weight:500;">Category *</label>
                    <div id="categoryCustom" style="position:relative; margin-top:6px; margin-bottom:16px;">
                        <button id="categoryTrigger" type="button"
                            style="width:100%; text-align:left; padding:10px; border:1px solid #dce1e7; border-radius:8px; background:white; cursor:pointer;">
                            Select Category
                        </button>
                        <ul id="categoryOptions"
                            style="position:absolute; left:0; right:0; margin:6px 0 0 0; padding:6px 0; list-style:none;
                                max-height:160px; overflow:auto; background:#fff; border:1px solid #e6e9ee; border-radius:8px;
                                box-shadow:0 6px 18px rgba(0,0,0,0.08); display:none; z-index:3000;">
                            <li data-value="Salary" style="padding:10px 12px; cursor:pointer;">Salary</li>
                            <li data-value="Freelance" style="padding:10px 12px; cursor:pointer;">Freelance</li>
                            <li data-value="Shopping" style="padding:10px 12px; cursor:pointer;">Shopping</li>
                            <li data-value="Food" style="padding:10px 12px; cursor:pointer;">Food</li>
                            <li data-value="Rent" style="padding:10px 12px; cursor:pointer;">Rent</li>
                            <li data-value="Utilities" style="padding:10px 12px; cursor:pointer;">Utilities</li>
                            <li data-value="Entertainment" style="padding:10px 12px; cursor:pointer;">Entertainment</li>
                            <li data-value="Travel" style="padding:10px 12px; cursor:pointer;">Travel</li>
                            <li data-value="Education" style="padding:10px 12px; cursor:pointer;">Education</li>
                            <li data-value="Health" style="padding:10px 12px; cursor:pointer;">Health</li>
                            <li data-value="Transportation" style="padding:10px 12px; cursor:pointer;">Transportation</li>
                        </ul>
                        <!-- hidden input to store the selected value so your existing submit logic can read it -->
                        <input type="hidden" id="categoryValue" value="">
                    </div>

                    <label style="font-size:14px; font-weight:500;">Date *</label>
                    <input type="date" id="dateInput"
                        style="width:100%; margin-top:6px; margin-bottom:16px; 
                        padding:10px; border:1px solid #dce1e7; border-radius:8px; transition:0.2s;">

                    <label style="font-size:14px; font-weight:500;">Description *</label>
                    <input id="descriptionInput" type="text" placeholder="e.g., Grocery shopping, Rent..."
                        style="width:100%; margin-top:6px; margin-bottom:18px; 
                        padding:10px; border:1px solid #dce1e7; border-radius:8px; transition:0.2s;">

                    <label style="font-size:14px; font-weight:500;">Receipt (Optional)</label>
                    <div id="uploadBox"
                        style="width:100%; height:110px; border:1.5px dashed #d4d9df; border-radius:12px;
                        display:flex; align-items:center; justify-content:center; color:#7d8794;
                        cursor:pointer; margin-top:8px; margin-bottom:22px;">
                        Click to upload receipt image
                    </div>
                </div>

                <!-- Buttons -->
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button id="cancelBtn"
                        style="padding:10px 24px; border-radius:8px; border:1px solid #d4d9df; background:#fff;
                        cursor:pointer; font-weight:500;">Cancel</button>

                    <button id="submitBtn"
                        style="padding:10px 24px; border-radius:8px; background:#0cb463; border:none; color:white;
                        cursor:pointer; font-weight:500;">Add Transaction</button>
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

            // Toggle logic
            const expenseTab = box.querySelector('#expenseTab');
            const incomeTab = box.querySelector('#incomeTab');

            expenseTab.onclick = () => {
                expenseTab.style.background = '#fff';
                expenseTab.style.color = '#000';
                incomeTab.style.background = 'transparent';
                incomeTab.style.color = '#6c7a86';
            };

            incomeTab.onclick = () => {
                incomeTab.style.background = '#fff';
                incomeTab.style.color = '#000';
                expenseTab.style.background = 'transparent';
                expenseTab.style.color = '#6c7a86';
            };

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

            // -----------------------
            // CUSTOM DROPDOWN LOGIC
            // -----------------------
            const trigger = box.querySelector('#categoryTrigger');
            const optionsList = box.querySelector('#categoryOptions');
            const options = Array.from(optionsList.querySelectorAll('li'));
            const hiddenInput = box.querySelector('#categoryValue');

            // open/close dropdown
            trigger.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const isOpen = optionsList.style.display === 'block';
                optionsList.style.display = isOpen ? 'none' : 'block';
            });

            // click on option (li)
            optionsList.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', () => {
                    // close dropdown
                    optionsList.style.display = 'none';

                    // put selected value
                    trigger.innerText = li.innerText;

                    // apply focus style
                    trigger.style.border = "1.5px solid #0cb463";
                    trigger.style.boxShadow = "0 0 0 2px rgba(12,180,99,0.2)";
                });
            });

            // close when clicking outside and remove focus
            document.addEventListener('click', (ev) => {
                if (!box.contains(ev.target)) {
                    optionsList.style.display = "none";

                    // remove focus effect
                    trigger.style.border = "1px solid #ccc";
                    trigger.style.boxShadow = "none";
                }
            });
            // Hover style for options (green while hovered, revert after leave)
            options.forEach(li => {
                li.addEventListener('mouseenter', () => {
                    li.style.background = '#0cb463';
                    li.style.color = 'white';
                });
                li.addEventListener('mouseleave', () => {
                    li.style.background = '';
                    li.style.color = '';
                });

                // click selects value (but does NOT keep hover color)
                li.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const val = li.getAttribute('data-value');
                    trigger.textContent = val;
                    hiddenInput.value = val;
                    optionsList.style.display = 'none';
                });
            });

            // Close modal handlers
            box.querySelector('#cancelBtn').onclick = () => modal.remove();
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

            // Submit handler: read hidden input for category
            box.querySelector('#submitBtn').onclick = () => {
                const amount = box.querySelector('#amountInput').value;
                const category = box.querySelector('#categoryValue').value; // from custom dropdown
                const date = box.querySelector('#dateInput').value;
                const description = box.querySelector('#descriptionInput').value;

                console.log({ amount, category, date, description });

                modal.remove();
            };
        });         
