const modal = document.querySelector("myModal");


const btn = document.querySelector("modalbtn");


const span = document.getElementsByClassName("close")[0];


btn.onclick = function() {
  modal.style.display = "block";
}


span.onclick = function() {
  modal.style.display = "none";
}


