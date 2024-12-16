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

//Code for modal

const modal = document.getElementById("myModal");

const btn = document.getElementById("myBtn");

const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";
  for (let i = 0; i < allworks.length; i++) {
    const work = allworks[i];
    const modalContent = document.querySelector(".modal-content");
    const figure = document.createElement("figure");
    const close = document.createElement("img");
    close.src = "assets/images/trash.svg";
    
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");
    figure.appendChild(imageElement);
    
    modalContent.appendChild(figure);
    imageElement.src = work.imageUrl;
    figure.appendChild(imageElement);
    modalContent.appendChild(figure);
  }
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
