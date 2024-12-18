//retrieve array "works" from API
let allworks = window.localStorage.getItem("allworks");

if (allworks === null || allworks.length === 0) {
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

async function getBtn() {
  const btnReponse = await fetch("http://localhost:5678/api/categories");
  const allBtn = await btnReponse.json();
  window.localStorage.setItem("allbtn", JSON.stringify(allBtn));
  generateBtns(allBtn);
  console.log(allBtn);
}
getBtn();

function generateBtns(btns) {
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    const currentBtn = document.createElement("button");
    currentBtn.classList.add("filter-btns");
    currentBtn.innerText = btn.name;
    const filterSection = document.getElementsByClassName("filtres");
    //console.log(filterSection[0]);
    filterSection[0].appendChild(currentBtn);
    currentBtn.addEventListener("click", function () {
      console.log("toto");

      const galleryAppartement = allworks.filter(function (work) {
        return work.category.name === btn.name;
      });
      document.querySelector(".gallery").innerHTML = "";
      generateWorks(galleryAppartement);
    });
  }
}
const btnTous = document.createElement("button");
const filterSection = document.getElementsByClassName("filtres");
filterSection[0].appendChild(btnTous);
btnTous.addEventListener("click", filterTous);
btnTous.innerText = "Tous";

async function filterTous() {
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(allworks);
}

function filters(categoriesName) {
  console.log("toto");

  const galleryAppartement = allworks.filter(function (work) {
    return work.category.name === categoriesName;
  });
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(galleryAppartement);
}

