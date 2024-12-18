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

btn.onclick = function () {
  modal.style.display = "block";
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";
  const modalHeader = document.createElement("div");
  const close = document.createElement("span");
  close.classList.add("close");
  close.innerHTML = "&times;";
  const headerText = document.createElement("p");
  headerText.innerText = "Galerie photo";
  
  modalHeader.appendChild(close);
  modalHeader.appendChild(headerText);
  modalContent.appendChild(modalHeader);

  for (let i = 0; i < allworks.length; i++) {
    const work = allworks[i];
    const figure = document.createElement("figure");
    figure.classList.add("fig");
    const trashBox = document.createElement("div");
    trashBox.classList.add("trash-box");
    const trash = document.createElement("img");
    trash.src = "./assets/icons/trash.svg";
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");
   
    figure.appendChild(imageElement);
    modalContent.appendChild(figure);
    trashBox.appendChild(trash);
    trash.classList.add("trash-div");
    figure.appendChild(trashBox);
    trash.classList.add("trashpic");
  }
  const line = document.createElement("div");
  line.classList.add("modal-line");
  modalContent.appendChild(line);

  const modalBtn = document.createElement("button");
  modalBtn.classList.add("modal-btn");
  modalContent.appendChild(modalBtn);
  const modalBtnP = document.createElement("p");
  modalBtn.appendChild(modalBtnP);
  modalBtnP.innerText = "Ajouter une photo"
  close.onclick = function () {
    modal.style.display = "none";
  };
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
