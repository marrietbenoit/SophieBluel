// Log in form

const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const submit = document.getElementById("btnSubmit");


submit.addEventListener("click", async function (event) {
  event.preventDefault();

  const info = {
    email: email.value,
    password: password.value,
  };

let response = await fetch("http://localhost:5678/api/users/login", {
  method: "POST", 
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify(info), 
});


if (!response.ok) {
  
  showError("E-mail ou mot de passe incorrect");
} else {
  
  const data = await response.json();

  localStorage.setItem("token", data.token);


  window.location.href = "http://127.0.0.1:5500/FrontEnd/homepage_edit.html";
}

function showError(message) {
  const errorDiv = document.getElementById("logIn");
  errorDiv.innerHTML = ""; 
  const errorMessage = document.createElement("p"); 
  errorMessage.innerText = message; 
  errorMessage.style.color = "red"; 
  errorDiv.appendChild(errorMessage); 
}});