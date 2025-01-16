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
  gallery.innerHTML = ""; // Clear gallery content
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
const modal = document.getElementById("myModal");
const addModal = document.getElementById("addModal");
const btn = document.getElementById("myBtn");

btn.onclick = () => {
  modal.style.display = "block";
  generateModalContent();
};

// Generate content for the modal
function generateModalContent() {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";

  const modalHeader = document.createElement("div");
  const close = document.createElement("span");
  close.classList.add("close");
  close.innerHTML = "&times;";
  close.onclick = () => (modal.style.display = "none");

  const headerText = document.createElement("p");
  headerText.innerText = "Galerie photo";

  modalHeader.appendChild(close);
  modalHeader.appendChild(headerText);
  modalContent.appendChild(modalHeader);

  // Display each work in the modal
  allworks.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("fig");

    const trashBox = document.createElement("button");
    trashBox.classList.add("trash-box");

    const trashIcon = document.createElement("img");
    trashIcon.src = "./assets/icons/trash.svg";
    trashIcon.alt = "Delete";
    trashBox.appendChild(trashIcon);

    trashBox.addEventListener("click", () => deleteWork(work.id, figure));

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");

    figure.appendChild(imageElement);
    figure.appendChild(trashBox);
    modalContent.appendChild(figure);
  });

  // Add modal line and button to add a new photo
  const line = document.createElement("div");
  line.classList.add("modal-line");
  modalContent.appendChild(line);

  const modalBtn = document.createElement("button");
  modalBtn.classList.add("modal-btn");
  modalBtn.innerText = "Ajouter une photo";
  modalBtn.onclick = openAddModal;

  modalContent.appendChild(modalBtn);
}

// Delete work functionality
async function deleteWork(id, figureElement) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      figureElement.remove();
      allworks = allworks.filter((work) => work.id !== id);
      window.localStorage.setItem("allworks", JSON.stringify(allworks));
    } else {
      console.error("Failed to delete work:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting work:", error);
  }
}

// Open add work modal
function openAddModal() {
  modal.style.display = "none";
  addModal.style.display = "block";
  setupAddModal();
}

// Setup add work modal
function setupAddModal() {
  const addModalContent = document.querySelector(".addModal-content");
  addModalContent.innerHTML = "";

  const addModalHeader = document.createElement("div");
  const close = document.createElement("span");
  close.classList.add("addClose");
  close.innerHTML = "&times;";
  close.onclick = () => (addModal.style.display = "none");

  const headerText = document.createElement("p");
  headerText.innerText = "Ajout photo";

  addModalHeader.appendChild(headerText);
  addModalHeader.appendChild(close);
  addModalContent.appendChild(addModalHeader);

  const form = createAddWorkForm();
  addModalContent.appendChild(form);
}

// Create add work form
function createAddWorkForm() {
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
  placeholderOption.innerText = "Sélectionner une catégorie";
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

  const fileLabel = document.createElement("label");
  fileLabel.innerText = "Ajouter photo :";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerText = "Valider";

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);
  form.appendChild(fileLabel);
  form.appendChild(fileInput);
  form.appendChild(submitButton);

  form.addEventListener("submit", async (event) => {
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
      if (response.ok) {
        allworks = null;
        window.localStorage.removeItem("allworks");
        getWorks();
        addModal.style.display = "none";
      } else {
        alert("Failed to add work.");
      }
    } catch (error) {
      console.error("Error adding work:", error);
    }
  });

  return form;
}

window.onclick = (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === addModal) addModal.style.display = "none";
};
