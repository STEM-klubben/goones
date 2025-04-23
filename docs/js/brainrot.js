// Select the dialog element
const dialog = document.querySelector('dialog');
let hannesReklam = false;

function hannesreklamFUNC() {
    hannesReklam = !hannesReklam;
}

// Function to show the dialog at a random position
function showDialog() {
    if (hannesReklam) {
        if (!dialog.open) {
            // Set random position
            const randomTop = Math.random() * (window.innerHeight - dialog.offsetHeight);
            const randomLeft = Math.random() * (window.innerWidth - dialog.offsetWidth);
            dialog.style.top = `${randomTop}px`;
            dialog.style.left = `${randomLeft}px`;
            dialog.showModal();
        }
    }
}

// Set an interval to show the dialog every 3 seconds
setInterval(showDialog, 600);

// Optional: Close the dialog when clicked
dialog.addEventListener('click', () => {
    dialog.close();
});