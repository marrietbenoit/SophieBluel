//retrieve array "works" from API
let allworks = window.localStorage.getItem("allworks");
// console.log(allworks);

if (allworks === null) {
  getWorks();
} else {
  allworks = JSON.parse(allworks);
  generateWorks(allworks);
}

async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const allworks = await reponse.json();
  window.localStorage.setItem("allworks", JSON.stringify(allworks));
  generateWorks(allworks);
}

function generateWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(imageElement);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

//for buttons
//retrieve btns and add listener
//empty gallery and replace with targegted elements
const btnTous = document.getElementById("btn-tous");
const btnObjets = document.getElementById("btn-objets");
const btnApartements = document.getElementById("btn-appartements");
const btnHotels = document.getElementById("btn-hotels-restaurants");

btnTous.addEventListener("click", filterTous);
btnObjets.addEventListener("click", filterObjets);
btnApartements.addEventListener("click", filterAppartement);
btnHotels.addEventListener("click", filterHotels);

function filterTous() {
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(allworks); 
}


function filterObjets() {
  const galleryObjets = allworks.filter(function (work) {
    return work.category.name === "Objets";
  });
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(galleryObjets);
}

function filterAppartement() {
  const galleryAppartement = allworks.filter(function (work) {
    return work.category.name === "Appartements";
  });
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(galleryAppartement);
}

function filterHotels() {
  const galleryHotels = allworks.filter(function (work) {
    return work.category.name === "Hotels & restaurants";
  });
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(galleryHotels);
}
