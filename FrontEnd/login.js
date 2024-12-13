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

  const creds = JSON.stringify(info);

  let response = fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: creds,
  });
  response = await response;

  if (!response.ok){
    const errorDiv = document.getElementById("logIn");
    const errorMessage = document.createElement('p');
    errorMessage.innerText = "E-mail ou mot de passe inexact";
    errorMessage.style.color = "red";
    errorDiv.appendChild(errorMessage);
  }else{
    window.location.href = "http://127.0.0.1:5500/FrontEnd/homepage_edit.html"
  }

});
