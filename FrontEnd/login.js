
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const submit = document.getElementById("btnSubmit");




submit.addEventListener("click", async function (event) {
  event.preventDefault();


  const info = {
    email: email.value,
    password: password.value,
  };

  
  try {
    let response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
     

      window.location.href = "index.html";
      
    
    } else {
      showError("E-mail ou mot de passe incorrect");
    }
  } catch (error) {
    showError("An unexpected error occurred. Please try again.");
  }



  function showError(message) {
    const errorDiv = document.getElementById("logIn");
    errorDiv.innerHTML = "";
    const errorMessage = document.createElement("p");
    errorMessage.innerText = message;
    errorMessage.style.color = "red";
    errorDiv.appendChild(errorMessage);
  }
});
