const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const overlay = document.getElementById("overlay");
const websiteTitle = document.getElementById("website-name-text");

// Function to open menu
function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to close menu
function closeMenu() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Adds listener to menu button
menuButton.addEventListener("click", e => {
    e.preventDefault();

    if (sideMenu.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when clicking on menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu when clicking outside of bar
overlay.addEventListener('click', closeMenu);

// Returns home with title text
websiteTitle.addEventListener('click', (e) => {
    window.location.href = 'index.html';
});