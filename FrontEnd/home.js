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
        (work) => work.category?.name === category.name
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

// Reference to the modal dialog and other elements
const modalContainer = document.getElementById("modal-container");
const btn = document.getElementById("myBtn");
const modalContent = modalContainer.querySelector(".modal-content");
const modalBtns = modalContainer.querySelector(".close-back");
const closeDialogBtn = modalBtns.querySelector(".close");
const modalBtn = modalContent.querySelector(".modal-btn");
const worksGallery = modalContent.querySelectorAll(".fig"); // Static placeholder; updated dynamically
const modalLine = modalContent.querySelector(".modal-line");

// State for temporary works
let tempWorks = [...allworks];

// Open the modal on button click
btn.addEventListener("click", () => {
  modalContainer.showModal();
  generateModalContent();
});

// Close the modal and update API on close
closeDialogBtn.addEventListener("click", () => {
  modalContainer.close();
  closeAndUpdate();
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

// Function to delete a work locally
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
  try {
    const token = localStorage.getItem("token");

    // Find deleted works by comparing tempWorks with allworks
    const deletedWorks = allworks.filter(
      (work) => !tempWorks.some((tempWork) => tempWork.id === work.id)
    );

    // Delete each work from the server
    for (const work of deletedWorks) {
      const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error(`Failed to delete work with ID ${work.id}:`, response.statusText);
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
  modalContent.style.display = "none";
  setupAddModal();
});

  // // Setup add work modal
  function setupAddModal() {
    const addModal = document.getElementById("addModal");
    const back = addModal.querySelector(".back");
    const previewBox = addModal.querySelector(".previewBox");
    const previewBoxImage = previewBox.querySelector(".preview-img");
    const uploadBtn = addModal.querySelector(".upload-btn");
    const fileInput = uploadBtn.querySelector("input[type='file']");
    const form = addModal.querySelector("form");
    const titleInput = form.querySelector("#title");
    const categorySelect = form.querySelector("#category");
    const submitButton = form.querySelector(".addWindowBtn");
  
    
    back.addEventListener("click", () => {
      addModal.close();
      modal.sho(); 
    });
  
    // Handle file input change
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
  
    // Fetch and populate categories
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
  
    // Form validation
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
    validateForm(); // Initialize form validation
  
    // Handle form submission
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
  
        if (response.ok) {
          const newWork = await response.json();
          allworks.push(newWork); // Add new work to the global array
          window.localStorage.setItem("allworks", JSON.stringify(allworks)); // Update local storage
  
          // Dynamically add the new work to the modal
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
          modal.style.display = "flex";
  
          generateModalContent();
        } else {
          alert("Failed to add work.");
        }
      } catch (error) {
        console.error("Error adding work:", error);
      }
    });
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

window.onclick = async (event) => {
  if (event.target === modalContainer) {
    modalContainer.close;
    await closeAndUpdate(); 
  }
};
