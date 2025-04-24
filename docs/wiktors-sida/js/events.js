const SL_API_BASE = "db/sl";
const LOCAL_API_EVENTS = "db/events.json";
const LOCALE = document.querySelector("html").getAttribute("lang") || "sv";

const filter = document.querySelector("#filter");
const eventList = document.querySelector(".railmap-events-list");
const eventListContainer = document.querySelector(".railmap-events");
const aside = document.querySelector("#aside_events");
const asideBtn = document.querySelector(".events button");

const curline = document.querySelector("#cur_line");

function queryLines() {
    const url = `${SL_API_BASE}/lines.json?transport_authority_id=1`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            filter.innerHTML = `<option disabled selected value="none">Välj linje..</option>`;

            filter.innerHTML += "<option disabled>Tunnelbanan</option>";
            data.metro.sort((a, b) => a.id - b.id).forEach((line) => {
                filter.innerHTML += `<option value="${line.id}">${line.designation}${line.name ? ' - ' : ''}${line.name}</option>`;
            });
            filter.innerHTML += "<option disabled>Spårvägar</option>";
            data.tram.sort((a, b) => a.id - b.id).forEach((line) => {
                filter.innerHTML += `<option value="${line.id}">${line.designation}${line.name ? ' - ' : ''}${line.name}</option>`;
            });
            filter.innerHTML += "<option disabled>Pendeltåg</option>";
            data.train.sort((a, b) => a.id - b.id).forEach((line) => {
                filter.innerHTML += `<option value="${line.id}">${line.designation}${line.name ? ' - ' : ''}${line.name}</option>`;
            });
        })
        .catch((error) => console.error("Error fetching stations:", error));
}

function createEventTag(event) {
    const start = new Date(event.timeStart * 1000);
    const startDate = new Date(start); startDate.setHours(0, 0, 0, 0);
    const end = new Date(event.timeEnd * 1000);


    const today = new Date();

    if (start < today) return "";

    today.setHours(0, 0, 0, 0)
    const timeDiff = (startDate - today) / (1000 * 60 * 60 * 24);
    const rtf = new Intl.RelativeTimeFormat(LOCALE, { style: 'long', numeric: "auto" });
    const relativeTimeString = rtf.format(timeDiff, 'days');

    let element = document.createElement("article");
    element.classList.add("event");

    let title = document.createElement("h4");
    title.classList.add("event-title");
    title.innerText = event.title;
    element.appendChild(title);
    
    let date = document.createElement("p");
    date.classList.add("event-date");

    let startTime = document.createElement("time");
    startTime.setAttribute("datetime", start.toUTCString());
    startTime.innerHTML = `${start.toISOString().split('T')[0]}<br>${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`;
    date.appendChild(startTime);

    date.innerHTML += "&nbsp;-&nbsp;";

    let endTime = document.createElement("time");
    endTime.setAttribute("datetime", end.toUTCString());
    endTime.innerHTML = `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`;
    date.appendChild(endTime);

    element.appendChild(date);

    let relativeTime = document.createElement("p");
    relativeTime.classList.add("event-relative-time");
    relativeTime.innerText = relativeTimeString;
    element.appendChild(relativeTime);

    if (event.img) {
        element.style.background = `linear-gradient(#fffa, #fffa), url('${event.img}') center`;
        element.style.backgroundSize = `cover`;
        element.style.backgroundPosition = `center`;
    }

    return element.outerHTML;
}

function updateEvents(e, events) {
    const line = e.target.value;

    if (line !== "none") {
        eventListContainer.classList.remove("hidden");
    }

    const lineEvents = events.filter((event) => event.line.includes(line) /*|| true*/);
    curline.innerText = `linje ${line}`;

    if (lineEvents.length === 0) {
        eventList.innerHTML = "<p>Inga events för vald linje.</p>";
    } else {
        eventList.innerHTML = "";
        
        lineEvents.sort((a, b) => a.timeStart - b.timeStart).forEach(event => eventList.innerHTML += createEventTag(event));
    }
}


const pointerScroll = (elem) => {

    const dragStart = (ev) => elem.setPointerCapture(ev.pointerId);
    const dragEnd = (ev) => elem.releasePointerCapture(ev.pointerId);
    const drag = (ev) => elem.hasPointerCapture(ev.pointerId) && (elem.scrollLeft -= ev.movementX);
    
    elem.addEventListener("pointerdown", dragStart);
    elem.addEventListener("pointerup", dragEnd);
    elem.addEventListener("pointermove", drag);
};


let i = 4;

function getEvents(as, ev, i) {
    let s = "";
    ev.sort((a, b) => a.timeStart - b.timeStart).slice(0, i).forEach(event => s += createEventTag(event));
    as.innerHTML = s;
}
 
(function () {
    queryLines();

    pointerScroll(eventList);

    fetch(LOCAL_API_EVENTS)
        .then((response) => response.json())
        .then((events) => {
            filter.addEventListener("change", (e) => updateEvents(e, events));
            updateEvents({ target: { value: filter.value } }, events);

            asideBtn.addEventListener("click", (e) => getEvents(aside, events, i+=4))
            getEvents(aside, events, i);
        });
})();

