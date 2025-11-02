document.addEventListener("DOMContentLoaded", function () {
    console.log('I am here')
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle) {
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            navLinks.classList.toggle("active");
        });
    }


    document.addEventListener("click", function (e) {
        if (!e.target.closest(".navbar")) {
            navLinks.classList.remove("active");
            document.querySelectorAll(".dropdown").forEach((dropdown) => {
                dropdown.classList.remove("active");
            });
        }
    });


    if (navLinks) {
        navLinks.addEventListener("click", function (e) {
            e.stopPropagation();
        });

    }

    document.querySelectorAll(".dropdown-toggle").forEach((item) => {
        item.addEventListener("click", function (e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdown = this.parentNode;
                dropdown.classList.toggle("active");

                document.querySelectorAll(".dropdown").forEach((d) => {
                    if (d !== dropdown) {
                        d.classList.remove("active");
                    }
                });
            }
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 992) {
            navLinks.classList.remove("active");
            document.querySelectorAll(".dropdown").forEach((dropdown) => {
                dropdown.classList.remove("active");
            });
        }
    });

    // Check if user is logged in
    function checkAuthStatus() {
        console.log('Checking auth status...');
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

        console.log('Token:', token ? 'Found' : 'Not found');
        console.log('User data:', userStr ? 'Found' : 'Not found');

        const loginLink = document.getElementById('loginLink');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');

        console.log('Elements found:', {
            loginLink: !!loginLink,
            userInfo: !!userInfo,
            userName: !!userName
        });

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                console.log('User logged in:', user.firstName);
                // User is logged in
                loginLink.style.display = 'none';
                userInfo.style.display = 'flex';
                userName.textContent = `مرحباً، ${user.firstName}`;
                console.log('UI updated to show logout button');
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        } else {
            // User is not logged in
            console.log('User not logged in - showing login link');
            loginLink.style.display = 'block';
            userInfo.style.display = 'none';
        }

    }


    setTimeout(() => {
        // Check auth status on page load
        checkAuthStatus();


        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                // Clear auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');

                // Redirect to home page
                window.location.href = 'HomePage.html';
            });
        }
    }, 1000)
});