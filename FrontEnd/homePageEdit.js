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
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
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

    const trashBox = document.createElement("btn");
    trashBox.classList.add("trash-box");
    trashBox.addEventListener("click", async function () {
      const id = work.id;
      const token = localStorage.getItem("token");

      // Make the DELETE request
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        figure.remove();
        allworks = allworks.filter((remainingWork) => remainingWork.id !== id);
        const storedWorks = JSON.parse(localStorage.getItem("allworks")) || [];
        const updatedWorks = storedWorks.filter(
          (storedWork) => storedWork.id !== id
        );
        localStorage.setItem("allworks", JSON.stringify(updatedWorks));
        window.location.href = window.location.href;
      } else {
        console.error("Impossible de supprimer:", response.statusText);
      }
    });

    const trash = document.createElement("img");
    trash.src = "./assets/icons/trash.svg";
    trash.classList.add("trash-div");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");

    figure.appendChild(imageElement);
    trashBox.appendChild(trash);
    trash.classList.add("trash-div");
    trash.classList.add("trashpic");
    figure.appendChild(trashBox);
    modalContent.appendChild(figure);
  }
  const line = document.createElement("div");
  line.classList.add("modal-line");
  modalContent.appendChild(line);

  // btn to open addModal

  const modalBtn = document.createElement("button");
  modalBtn.classList.add("modal-btn");
  modalContent.appendChild(modalBtn);
  const modalBtnP = document.createElement("p");
  modalBtn.appendChild(modalBtnP);
  modalBtnP.innerText = "Ajouter une photo";

  //add work modal
  modalBtn.onclick = async function () {
    modal.style.display = "none";

    addModal.style.display = "block";

    const addModalContent = document.querySelector(".addModal-content");
    addModalContent.innerHTML = "";

    const addModalHeader = document.createElement("div");
    addModalHeader.classList.add("headerBox");

    const previewBox = document.createElement("div");
    previewBox.classList.add("previewBox");
    const previewBoxImage = document.createElement("img");
    previewBoxImage.src = "./assets/icons/picture.png";
    previewBoxImage.alt = "Preview Image";
    previewBoxImage.classList.add("preview-img");
    const addModalHeaderText = document.createElement("p");
    addModalHeaderText.innerText = "Ajout photo";
    const addModalClose = document.createElement("span");
    addModalClose.classList.add("addClose");
    addModalClose.innerHTML = "&times;";

    const addModalArrow = document.createElement("div");
    addModalArrow.classList.add("addArrow");
    addModalArrow.innerHTML = "&larr;";

    const addModalWindow = document.createElement("div");
    addModalWindow.classList.add("addUploadWindow");

    const uploadBtn = document.createElement("button");
    uploadBtn.classList.add("upload-btn");
    uploadBtn.innerText = "+ Ajouter photo";

    const addForm = document.getElementById("addForm");
    addForm.enctype = "multipart/form-data";
    addForm.method = "POST";

    const labelTitre = document.createElement("label");
    labelTitre.innerText = "Titre :";
    const titreInput = document.createElement("input");

    const labelFile = document.createElement("label");
    labelFile.htmlFor = "fileInput";

    const fileInput = document.createElement("input");
    fileInput.classList.add("file-input");
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.name = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    const addModalWindowText = document.createElement("p");
    addModalWindowText.innerText = "jpg. png. 4mo max";

    const addModalLine = document.createElement("div");
    addModalLine.classList.add("addModal-line");

    const select = document.createElement("select");
    select.id = "addModal-select";

    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const placeholder = document.createElement("option");
    placeholder.textContent = "";

    select.appendChild(placeholder);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });

    const labelSelect = document.createElement("label");
    labelSelect.innerText = "Catégorie :";
    labelSelect.htmlFor = "addModal-select";

    const addBtn = document.createElement("button");
    addBtn.classList.add("addWindowBtn");
    addBtn.innerText = "Valider";


function validateForm() {
  const titleFilled = titreInput.value.trim() !== "";
  const fileChosen = fileInput.files.length > 0;
  const categorySelected = select.value !== "";

  if (titleFilled && fileChosen && categorySelected) {
    addBtn.classList.add("active");
    addBtn.disabled = false;
  } else {
    addBtn.classList.remove("active");
    addBtn.disabled = true;
  }
};

titreInput.addEventListener("input", validateForm);
fileInput.addEventListener("change", validateForm);
select.addEventListener("change", validateForm);

validateForm();


    addModalContent.appendChild(addModalHeader);
    addModalHeader.appendChild(addModalHeaderText);
    addModalContent.appendChild(addModalArrow);
    addModalHeader.appendChild(addModalClose);
    addModalContent.appendChild(addModalWindow);
    addModalContent.appendChild(addForm);
    addForm.appendChild(labelTitre);
    addForm.appendChild(titreInput);
    addForm.appendChild(labelSelect);
    addForm.appendChild(select);
    addModalWindow.appendChild(labelFile);
    addModalWindow.appendChild(fileInput);
    addModalWindow.appendChild(previewBox);
    previewBox.appendChild(previewBoxImage);
    addModalWindow.appendChild(uploadBtn);
    addModalWindow.appendChild(addModalWindowText);
    addModalContent.appendChild(addModalLine);
    addModalContent.appendChild(addBtn);

    uploadBtn.addEventListener("click", function () {
      fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewBox.innerHTML = "";

          // Create an image element and set its src to the uploaded file
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-img");
          previewBox.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });

    addBtn.addEventListener("click", async function (e) {
      const title = titreInput.value.trim();
      const file = fileInput.files[0];
      const category = select.value;

      if (!title || !file) {
        return alert("All fields are required.");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", file);
      formData.append("category", category);

      const token = localStorage.getItem("token");
      if (!token) {
        return alert("You are not logged in.");
      }

      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.localStorage.removeItem("allworks");
        window.location.href = window.location.href;
        getWorks();
        addModal.style.display = "none";
      } else {
        alert("Failed to upload the image.");
      }
    });

    addModalArrow.onclick = function () {
      modal.style.display = "block";
      addModal.style.display = "none";
    };
    addModalClose.onclick = function () {
      addModal.style.display = "none";
    };
  };

  close.onclick = function () {
    modal.style.display = "none";
  };
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  } else if (event.target == addModal) {
    addModal.style.display = "none";
  }
};
