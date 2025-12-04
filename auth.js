    const signinTab = document.getElementById("signinTab");
    const createTab = document.getElementById("createTab");
    const signinForm = document.getElementById("signinForm");
    const createForm = document.getElementById("createForm");
    const googleBtn = signinForm.querySelector(".google-btn");

    const signinError = document.createElement("div");
    signinError.id = "signinError";
    signinError.className = "error";
    signinForm.insertBefore(signinError, signinForm.children[2]);

    const createError = document.createElement("div");
    createError.id = "createError";
    createError.className = "error";
    createForm.insertBefore(createError, createForm.children[3]);

    function getAccounts() {
        return JSON.parse(localStorage.getItem("accounts")) || [];
    }

    function saveAccounts(accounts) {
        localStorage.setItem("accounts", JSON.stringify(accounts));
    }

    // ---------- SIGN IN ----------
    signinForm.addEventListener("submit", function (e) {
        e.preventDefault();
        signinError.textContent = "";

        let email = this.querySelector('input[type="email"]').value.trim();
        let password = this.querySelector('input[type="password"]').value.trim();

        let accounts = getAccounts();
        let user = accounts.find(acc => acc.email === email);

        if (!user) {
            signinError.textContent = "⚠ Account does not exist";
            return;
        }

        if (user.password !== password) {
            signinError.textContent = "⚠ Incorrect password";
            return;
        }

        window.location.href = "dashboard.html";
    });

    // ---------- CREATE ACCOUNT ----------
    createForm.addEventListener("submit", function (e) {
        e.preventDefault();
        createError.textContent = "";

        let name = this.querySelector('input[type="text"]').value.trim();
        let email = this.querySelector('input[type="email"]').value.trim();
        let password = this.querySelector('input[type="password"]').value.trim();

        let accounts = getAccounts();

        if (accounts.find(acc => acc.email === email)) {
            createError.textContent = "⚠ Email is already registered";
            return;
        }

        if (password.length < 8) {
            createError.textContent = "⚠ Password must be at least 8 characters";
            return;
        }

        accounts.push({ name, email, password });
        saveAccounts(accounts);

        // Switch to sign in
        signinTab.click();
    }); 

    // ---------- TAB SWITCH ----------
    signinTab.onclick = () => {
        signinTab.classList.add("active");
        createTab.classList.remove("active");
        signinForm.classList.remove("hidden");
        createForm.classList.add("hidden");
    };

    createTab.onclick = () => {
        createTab.classList.add("active");
        signinTab.classList.remove("active");
        createForm.classList.remove("hidden");
        signinForm.classList.add("hidden");
    };