//Verify if works exist in localStorage
let allworks = JSON.parse(window.localStorage.getItem("allworks"));

if (!allworks) {
  getWorks(); // Fetch from API if not in localStorage
} else {
  generateWorks(allworks); // Use works from localStorage if available
}

//***  1  ***/ Fetch "works" from API and store in localStorage
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.localStorage.setItem("allworks", JSON.stringify(works)); // Store in localStorage
    allworks = works; // Update global allworks
    generateWorks(works);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

//***  1:b  ***/ Generate gallery works
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

//** 2 **/ Fetch and generate category filter buttons
// Store categories in localStorage
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

//** 2:b **/ Generate filter buttons and attach functionality
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
  setActiveButton(btnTous);
  generateWorks(allworks);

  // Create category-specific buttons
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.classList.add("filter-btns");
    btn.innerText = category.name;
    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filteredWorks = allworks.filter(
        (work) => work.category?.name === category.name // Ensure that category exists and matches
      );
      generateWorks(filteredWorks);
    });
    filterSection.appendChild(btn);
  });
}

//** 2:c **/ Set active button style
function setActiveButton(activeButton) {
  document.querySelectorAll(".filter-btns").forEach((btn) => {
    btn.style.backgroundColor = "#ffffff";
    btn.style.color = "#1d6154";
  });
  activeButton.style.backgroundColor = "#1d6154";
  activeButton.style.color = "#ffffff";
}

// Reference to the modal dialog and other elements
const modalContainer = document.getElementById("modal-container");
const btn = document.getElementById("myBtn");
const modalContent = modalContainer.querySelector(".modal-content");
const modalBtns = modalContainer.querySelector(".close-back");
const closeDialogBtn = modalBtns.querySelector(".close");
const modalBtn = modalContent.querySelector(".modal-btn");
const worksGallery = modalContent.querySelectorAll(".fig"); // Static placeholder; updated dynamically
const modalLine = modalContent.querySelector(".modal-line");
const addModal = document.getElementById("addModal");
// State for temporary works
let tempWorks = [...allworks];

//** 3:b **/ Open the modal on button click
btn.addEventListener("click", () => {
  modalContainer.showModal();
  generateModalContent();
});
console.log(window.localStorage.getItem("openFirstModal") == "true");

if (window.localStorage.getItem("openFirstModal") !== null) {
  modalContainer.showModal();
  generateModalContent();
}

//*** 3:c **/ Close the modal and update API on close
closeDialogBtn.addEventListener("click", () => {
  modalContainer.close();
  closeAndUpdate();
  generateWorks(allworks);
});

// Function to populate the modal content dynamically
function generateModalContent() {
  // Clear previous works (skip static elements like title, line, and button)
  const figures = modalContent.querySelectorAll(".fig");
  figures.forEach((figure) => figure.remove());

  // Populate with dynamic works
  tempWorks.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("fig");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.classList.add("modal-img");

    const trashBox = document.createElement("button");
    trashBox.type = "button";
    trashBox.classList.add("trash-box");

    const trashIcon = document.createElement("img");
    trashIcon.src = "./assets/icons/trash.svg";
    trashIcon.alt = "Delete";
    trashBox.appendChild(trashIcon);

    // Add delete functionality
    trashBox.addEventListener("click", (event) => {
      event.preventDefault();
      deleteWork(work.id, figure);
    });

    figure.appendChild(imageElement);
    figure.appendChild(trashBox);
    modalContent.insertBefore(figure, modalLine); // Insert before the line divider
  });
}

//*** 4 **/ Function to delete a work locally
function deleteWork(id, figureElement) {
  try {
    // Remove from temporary state
    tempWorks = tempWorks.filter((work) => work.id !== id);

    // Remove the work from the modal view
    figureElement.remove();

    // Update localStorage with tempWorks
    window.localStorage.setItem("tempWorks", JSON.stringify(tempWorks));
  } catch (error) {
    console.error("Error deleting work locally:", error);
  }
}

// Function to close the modal and update the API
async function closeAndUpdate() {
  window.localStorage.removeItem("openFirstModal");
  try {
    const token = localStorage.getItem("token");

    // Find deleted works by comparing tempWorks with allworks
    const deletedWorks = allworks.filter(
      (work) => !tempWorks.some((tempWork) => tempWork.id === work.id)
    );

    // Delete each work from the server
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

// Add functionality to the "Ajouter une photo" button
modalBtn.addEventListener("click", () => {
  modalContainer.close();
  addModal.showModal();
  setupAddModal();
});

// // Setup add work modal
// Assuming that the form already has the necessary structure

function setupAddModal() {
  const addModal = document.getElementById("addModal");
  const back = addModal.querySelector(".back");
  const closeAddDialogBtn = addModal.querySelector(".add-close");
  const previewBox = addModal.querySelector(".previewBox");
  const fileInput = addModal.querySelector("input[type='file']");
  const form = addModal.querySelector("form");
  const titleInput = form.querySelector("#title");
  const categorySelect = form.querySelector("#category");
  const submitButton = form.querySelector(".addWindowBtn");

  // Close the modal
  closeAddDialogBtn.addEventListener("click", () => {
    addModal.close();
  });

  // Back to previous modal
  back.addEventListener("click", () => {
    addModal.close();
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) modalContainer.showModal();
  });

  // File input event for preview image
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewBox.innerHTML = ""; 
            const img = document.createElement("img");
            img.src = e.target.result;
            img.alt = "Preview";
            img.classList.add("preview-img");
            previewBox.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

//  Reset file input & preview when user leaves
window.addEventListener("beforeunload", resetInputs);
document.addEventListener("visibilitychange", () => {
    if (document.hidden) resetInputs();
});

// Reset when modal closes
addModal.addEventListener("close", resetInputs);

//  Function to reset file input & preview 
function resetInputs() {
    fileInput.value = ""; // Clears file input
    previewBox.innerHTML = ""; // Clears preview
    categorySelect.innerText = ""; // Resets category 
}

// Fetch categories to populate the select dropdown
fetch("http://localhost:5678/api/categories")
.then((res) => res.json())
.then((categories) => {
  categories.forEach((category , key) => {
    if (key == 0 ){
      const defaultoption = document.createElement("option");
      defaultoption.value = 'default categorie';
      defaultoption.innerText = '';
      
      categorySelect.appendChild(defaultoption);

    }
    
          const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            categorySelect.appendChild(option);
        });
    });


  // Validation 
  function validateForm() {
    const titleFilled = titleInput.value.trim() !== "";
    const fileChosen = fileInput.files.length > 0;
    const categorySelected = categorySelect.value !== "";

    // Enable or disable the submit button based on validation
    if (titleFilled && fileChosen && categorySelected) {
      submitButton.classList.add("active");
      submitButton.disabled = false;
    } else {
      submitButton.classList.remove("active");
      submitButton.disabled = true;
    }
  }

  // Validate form only when inputs change
  titleInput.addEventListener("input", validateForm);
  fileInput.addEventListener("change", validateForm);
  categorySelect.addEventListener("change", validateForm);
  validateForm();

  // Form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("image", fileInput.files[0]);
    formData.append("category", categorySelect.value); // Make sure category is sent

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();

        // Refetch all works from localStorage and update
        let allworks =
          JSON.parse(window.localStorage.getItem("allworks")) || [];
        allworks.push(newWork);
        window.localStorage.setItem("allworks", JSON.stringify(allworks));
        window.localStorage.setItem("openFirstModal", true);

        modalContainer.showModal();

        // add the new work to modal content
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

        trashBox.addEventListener("click", () => {
          deleteWork(newWork.id, figure);
        });

        figure.appendChild(imageElement);
        figure.appendChild(trashBox);
        modalContent.insertBefore(figure, modalLine);

        // Reset the form
        form.reset();
        //to refresh the gallery(especialy to get category!!!)
        getWorks();
      } else {
        console.error("Failed to add work:", await response.text());
      }
    } catch (error) {
      console.error("Error adding work:", error);
    }
  });
}

//***  3  ***Affichage d'un bouton d’édition si l’utilisateur est authentifié
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

window.onclick = async (event) => {
  if (event.target === modalContainer || event.target === addModal) {
    modalContainer.close();
    addModal.close();
    await closeAndUpdate();
  }
};

console.log(token);
