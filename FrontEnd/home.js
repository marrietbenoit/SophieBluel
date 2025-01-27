// Retrieve "works" from API or localStorage
let allworks = window.localStorage.getItem("allworks");

if (!allworks) {
  getWorks();
} else {
  allworks = JSON.parse(allworks);
  generateWorks(allworks);
}

// Fetch "works" from API and store in localStorage
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.localStorage.setItem("allworks", JSON.stringify(works));
    generateWorks(works);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

// Generate gallery works
function generateWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    figure.appendChild(imageElement);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Fetch and generate category filter buttons
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    window.localStorage.setItem("allbtn", JSON.stringify(categories));
    generateCategoryButtons(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
getCategories();

// Generate filter buttons and attach functionality
function generateCategoryButtons(categories) {
  const filterSection = document.querySelector(".filtres");
  filterSection.innerHTML = ""; // Clear any existing buttons

  // Create "Tous" button
  const btnTous = document.createElement("button");
  btnTous.classList.add("filter-btns", "tous-btn");
  btnTous.innerText = "Tous";
  btnTous.addEventListener("click", () => {
    setActiveButton(btnTous);
    generateWorks(allworks);
  });
  filterSection.appendChild(btnTous);

  // Create category-specific buttons
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.classList.add("filter-btns");
    btn.innerText = category.name;
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filteredWorks = allworks.filter(
        (work) => work.category.name === category.name
      );
      generateWorks(filteredWorks);
    });
    filterSection.appendChild(btn);
  });
}

// Set active button style
function setActiveButton(activeButton) {
  document.querySelectorAll(".filter-btns").forEach((btn) => {
    btn.style.backgroundColor = "#ffffff";
    btn.style.color = "#1d6154";
  });
  activeButton.style.backgroundColor = "#1d6154";
  activeButton.style.color = "#ffffff";
}

// Modal functionality for managing works
const modalContainer = document.getElementById("modal-container");
const btn = document.getElementById("myBtn");
const modalBtns = document.createElement("div");
modalBtns.classList.add("close-back");
modalContainer.appendChild(modalBtns);

btn.addEventListener("click", () => {
  modalContainer.style.display = "flex";
  generateModalContent();
});

function generateModalContent() {
  modalContainer.innerText = "";

  modalBtns.classList.add("close-back");
  modalContainer.appendChild(modalBtns);

  //Dialog closing button
  const closeDialogBtn = document.createElement("span");
  closeDialogBtn.classList.add("close");
  closeDialogBtn.innerHTML = "&times;";
  modalBtns.appendChild(closeDialogBtn);

  const modal = document.createElement("div");
  modal.classList.add("modal-content");
  modalContainer.appendChild(modal);

  const modalContainerTitle = document.createElement("div");
  modalContainerTitle.classList.add("modal-container-title");
  modal.appendChild(modalContainerTitle);

  const headersTitle = document.createElement("h4");
  headersTitle.innerHTML = "Galerie photo";
  modalContainerTitle.appendChild(headersTitle);

  // Display each work in the modal
  allworks.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("fig");

    const trashBox = document.createElement("button");
    trashBox.type = "button";
    trashBox.classList.add("trash-box");

    const trashIcon = document.createElement("img");
    trashIcon.src = "./assets/icons/trash.svg";
    trashIcon.alt = "Delete";
    trashBox.appendChild(trashIcon);

    trashBox.addEventListener("click", (event) => {
      event.preventDefault();
      deleteWork(work.id, figure, event);
    });

    let tempWorks = [...allworks];

    // Delete work locally and update modal view
    function deleteWork(id, figureElement, event) {
      try {
        event.preventDefault();

        // Remove from local storage
        tempWorks = tempWorks.filter((work) => work.id !== id);

        // Update the modal view
        figureElement.remove();
        window.localStorage.setItem("tempWorks", JSON.stringify(tempWorks)); // Save the updated tempWorks in localStorage
      } catch (error) {
        console.error("Error deleting work locally:", error);
      }
    }

    closeDialogBtn.addEventListener("click", () => {
      modalContainer.style.display = "none";
      closeDialogBtn.innerText = "";
      closeAndUpdate();
    });
    // Update the API when the modal is closed
    async function closeAndUpdate() {
      try {
        const token = localStorage.getItem("token");

        // Find deleted works by comparing tempWorks with allworks
        const deletedWorks = allworks.filter(
          (work) => !tempWorks.some((tempWork) => tempWork.id === work.id)
        );
        // Update API for deleted works
        for (const work of deletedWorks) {
          const response = await fetch(
            `http://localhost:5678/api/works/${work.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to delete work with ID ${work.id}:`,
              response.statusText
            );
          }
        }

        // Sync global state with tempWorks after API updates
        allworks = [...tempWorks];
        window.localStorage.setItem("allworks", JSON.stringify(allworks));
      } catch (error) {
        console.error("Error updating API on modal close:", error);
      }
    }

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");

    figure.appendChild(imageElement);
    figure.appendChild(trashBox);
    modal.appendChild(figure);
  });

  // Add modal line and button to add a new photo
  const line = document.createElement("div");
  line.classList.add("modal-line");
  modal.appendChild(line);

  const modalBtn = document.createElement("button");
  modalBtn.classList.add("modal-btn");
  modalBtn.innerText = "Ajouter une photo";

  modalBtn.onclick = () => {
    modal.style.display = "none";
    setupAddModal();
  };
  modal.appendChild(modalBtn);

  // // Setup add work modal
  function setupAddModal() {
    const addModal = document.createElement("div");
    addModal.classList.add("addModal-content");
    modalContainer.appendChild(addModal);

    const addModalContainerTitle = document.createElement("div");
    addModalContainerTitle.classList.add("addModal-container-title");
    addModal.appendChild(modalContainerTitle);

    const addModalheadersTitle = document.createElement("h4");
    addModalheadersTitle.innerHTML = "Ajout photo";
    addModalContainerTitle.appendChild(addModalheadersTitle);

    const back = document.createElement("span");
    back.classList.add("back");
    back.innerHTML = "&larr;";
    modalContainer.appendChild(back);

    back.onclick = () => {
      addModal.style.display = "none";
      modal.style.display = "flex";
      back.style.display = "none";
    };

    const addModalWindow = document.createElement("div");
    addModalWindow.classList.add("addUploadWindow");
    addModal.appendChild(addModalWindow);

    const previewBox = document.createElement("div");
    previewBox.classList.add("previewBox");

    const previewBoxImage = document.createElement("img");
    previewBoxImage.src = "./assets/icons/picture.png";
    previewBoxImage.alt = "Preview Image";
    previewBoxImage.classList.add("preview-img");

    previewBox.appendChild(previewBoxImage);

    const uploadBtn = document.createElement("button");
    uploadBtn.classList.add("upload-btn");
    uploadBtn.innerText = "+ Ajouter photo";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.required = true;

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewBox.innerHTML = "";
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-img");
          previewBox.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });

    uploadBtn.appendChild(fileInput);
    addModalWindow.appendChild(previewBox);
    addModalWindow.appendChild(uploadBtn);

    const form = document.createElement("form");
    form.enctype = "multipart/form-data";
    form.method = "POST";

    const titleLabel = document.createElement("label");
    titleLabel.innerText = "Titre :";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.required = true;

    const categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Catégorie :";
    const categorySelect = document.createElement("select");
    categorySelect.required = true;

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.innerText = "";
    categorySelect.appendChild(placeholderOption);

    fetch("http://localhost:5678/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.innerText = category.name;
          categorySelect.appendChild(option);
        });
      });

    const submitButton = document.createElement("button");
    submitButton.classList.add("addWindowBtn");
    submitButton.type = "submit";
    submitButton.innerText = "Valider";

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);
    form.appendChild(submitButton);

    addModal.appendChild(form);

    // Form Validation and submission
    function validateForm() {
      const titleFilled = titleInput.value.trim() !== "";
      const fileChosen = fileInput.files.length > 0;
      const categorySelected = categorySelect.value !== "";

      if (titleFilled && fileChosen && categorySelected) {
        submitButton.classList.add("active");
        submitButton.disabled = false;
      } else {
        submitButton.classList.remove("active");
        submitButton.disabled = true;
      }
    }

    titleInput.addEventListener("input", validateForm);
    fileInput.addEventListener("change", validateForm);
    categorySelect.addEventListener("change", validateForm);

    validateForm();

    submitButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("title", titleInput.value);
      formData.append("image", fileInput.files[0]);
      formData.append("category", categorySelect.value);

      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        // Get the newly created work from the response
        // Add the new work to the global `allworks` array
        // Update localStorage with the new state of `allworks`
        // Add the new work dynamically to the modal
        // Attach delete functionality to the new work

        if (response.ok) {
          const newWork = await response.json();

          allworks.push(newWork);

          window.localStorage.setItem("allworks", JSON.stringify(allworks));

          const figure = document.createElement("figure");
          figure.classList.add("fig");

          const imageElement = document.createElement("img");
          imageElement.src = newWork.imageUrl;
          imageElement.classList.add("modal-img");

          const trashBox = document.createElement("button");
          trashBox.type = "button";
          trashBox.classList.add("trash-box");

          const trashIcon = document.createElement("img");
          trashIcon.src = "./assets/icons/trash.svg";
          trashIcon.alt = "Delete";
          trashBox.appendChild(trashIcon);

          trashBox.addEventListener("click", (event) => {
            event.preventDefault();
            deleteWork(newWork.id, figure, event);
          });

          figure.appendChild(imageElement);
          figure.appendChild(trashBox);

          const modal = document.querySelector(".modal-content");

          modal.appendChild(figure);
          modalContainer.style.display = "flex";
          generateModalContent();

          titleInput.value = "";
          fileInput.value = "";
          categorySelect.value = "";
          
          modalContainer.style.display = "flex";

        } else {
          alert("Failed to add work.");
        }
      } catch (error) {
        console.error("Error adding work:", error);
      }
    });
  }
}

const token = localStorage.getItem("token");
const heroBtn = document.querySelector("#hero");
const editBtn = document.querySelector("#myBtn");
const logBtn = document.getElementById("logBtn");

if (token != null) {
  heroBtn.style.display = "flex";
  editBtn.style.display = "flex";
  logBtn.innerText = "Log out";
}

function logout() {
  localStorage.removeItem("token");

  heroBtn.style.display = "none";
  editBtn.style.display = "none";
  logBtn.innerText = "Log in";

  window.location.href = "index.html";
}

logBtn.addEventListener("click", logout);

window.onclick = (event) => {
  if (event.target === modalContainer) modalContainer.style.display = "none";
};
