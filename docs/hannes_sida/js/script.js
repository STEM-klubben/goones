//försök
let menu = document.getElementById("hamburgarmeny");
let forceOn = false;
let onHover = false;

// This handler will be executed only once when the cursor enters
// sätter på hover när man är över menyknappen
menu.addEventListener(
    "mouseenter",
    (event) => {
        onHover = true;
    },
    false,
);

//om hover och inom särskild box vid mousemove, visa
// annars göm och stäng av hover då musen har lämnat området
document.addEventListener("mousemove", (event) => {
    let view = {width: window.innerWidth, height: window.innerHeight};
    if (!forceOn) {
        if (onHover && event.clientX < view.width-20 && event.clientX > view.width-134 && event.clientY < 248 && event.clientY > 0) {
            openMenu("show");
        } else {
            openMenu("hide");
            onHover = false;
        }
    }
}, false);

//ändrar menyns visability efter tre olika cases: switch, show och hide
function openMenu (change = "switch") {
    let oppenMeny = document.getElementById("oppen-hamburgarmeny");
    switch (change) {
        case "switch":
            if (forceOn) {
                oppenMeny.style.display = "none";
                forceOn = false;
            } else {
                oppenMeny.style.display = "flex";
                forceOn = true;
            }
            break;

        case "show":
            oppenMeny.style.display = "flex";
            break;

        case "hide":
            oppenMeny.style.display = "none";
            break;
    }
}

//leaflet

let mapOptions = {center: [59.533230, 18.080873], zoom: 13, minZoom: 13, maxZoom: 13, dragging: false, boxZoom: false, doubleClickZoom: false, zoomControl: false};

let map = new L.map("map", mapOptions);

let layer = new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png");

map.addLayer(layer);

let marker = new L.Marker([59.533230, 18.080873]);
marker.addTo(map);
