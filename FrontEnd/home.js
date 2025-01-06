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

      document.querySelectorAll(".filter-btns").forEach(button => {
        button.style.backgroundColor = "#ffffff"; 
        button.style.color = " #1d6154"; 
      });

      // Change background color of the clicked button
      currentBtn.style.backgroundColor = " #1d6154"; 
      currentBtn.style.color = "#ffffff"; 
      const worksBtns = allworks.filter(function (work) {
        return work.category.name === btn.name;
      });
      document.querySelector(".gallery").innerHTML = "";
      generateWorks(worksBtns);
    });
  }
}
const btnTous = document.createElement("button");
const filterSection = document.getElementsByClassName("filtres");
filterSection[0].appendChild(btnTous);
btnTous.addEventListener("click", filterTous);
btnTous.classList.add("tous-btn");
btnTous.innerText = "Tous";

// Function for filtering all works and styling the Tous button

async function filterTous() {
 
  document.querySelectorAll(".filter-btns, .tous-btn").forEach(button => {
    button.style.backgroundColor = "#ffffff"; 
    button.style.color = "#1d6154"; 
  });

 
  btnTous.style.backgroundColor = "#1d6154"; 
  btnTous.style.color = "#ffffff"; 

  
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(allworks);
}

function generateBtns(btns) {
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    const currentBtn = document.createElement("button");
    currentBtn.classList.add("filter-btns");
    currentBtn.innerText = btn.name;

    filterSection[0].appendChild(currentBtn);

    currentBtn.addEventListener("click", function () {
     
      document.querySelectorAll(".filter-btns, .tous-btn").forEach(button => {
        button.style.backgroundColor = "#ffffff"; 
        button.style.color = "#1d6154"; 
      });

      // onclick btn color change
      currentBtn.style.backgroundColor = "#1d6154";
      currentBtn.style.color = "#ffffff"; 

      // Clear the projects and regenerate filtered works
      const allGallery = allworks.filter(function (work) {
        return work.category.name === btn.name;
      });
      document.querySelector(".gallery").innerHTML = "";
      generateWorks(allGallery);
    });
  }
}
