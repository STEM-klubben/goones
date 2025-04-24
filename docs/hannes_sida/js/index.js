//javascript enbart för index

//start
let slideIndex = 1;
showSlides(slideIndex);
let halfSlideY = 0;

//för slideshowen

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("cirkel");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].id = "";
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].id = "aktiv";
}

function checkOnResizeIndex () {
    //byter slideshowbilder vid liten skärm
    let slideImgs = document.getElementsByClassName("slideshow-img");
    //itererar varje slidebild och byter storlek
    for (let i = 0; i < slideImgs.length; i++) {
        if (window.innerWidth < 390) {
            slideImgs.item(i).src = "img/placeholder_hero_phone.png";
        } else {
            slideImgs.item(i).src = "img/placeholder_hero.png";
        }
    }
    //ändrar höjd av pilar beroende på vilken bildstorlek
    let halfImageHeight = 0;
    if (window.innerWidth < 390) {
        halfImageHeight = window.innerWidth/3*4/2;
    } else {
        halfImageHeight = ((window.innerWidth/5)*2)/2;
    }

    //ändrar position för pilarna
    halfSlideY = parseFloat(window.getComputedStyle(document.getElementById("header")).height) + halfImageHeight;
    document.getElementById("nasta").style.top = halfSlideY + "px";
    document.getElementById("forra").style.top = halfSlideY + "px";
}

/*event vid resize*/
addEventListener("resize", checkOnResizeIndex);

