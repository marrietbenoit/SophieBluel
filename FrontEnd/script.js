 async function getResponse (url){
    const response = await fetch(url);
    return await response.json();
 }
 
async function createImage(work){
    let imgSite = document.getElementById("galleryImg");
    const baliseImg =`<figure>
                            <img src ="${work.imageUrl}"/>
                            <figcaption> ${work.title} </figcaption>
                        </figure>`
    imgSite.innerHTML += baliseImg;
}

async function createCategories(categorie){
    let buttonFiltre = document.getElementById("categoriesButton");
    const baliseButton =`<button id=${categorie.id} onClick ="getWorksByCat(${categorie.id})" class="buttonFiltre"> ${categorie.name}</button>`;
    buttonFiltre.innerHTML += baliseButton;
}

function getWorksByCat(idCat){
    let imgSite = document.getElementById("galleryImg");
    imgSite.innerHTML = ""
    for(let i=0; i<works.length; i++){
        if (works[i].categoryId == idCat){
            createImage(works[i]);
        }
    }
}

function getAllWork(){
    let imgSite = document.getElementById("galleryImg");
    imgSite.innerHTML = ""
    for(i=0; i<works.length; i++){
        createImage(works[i]);
    }
}

async function onLoadApi(){
    works = await getResponse("http://localhost:5678/api/works")
    categories = await getResponse("http://localhost:5678/api/categories")
    for(let i =0; i< works.length;i++){
        createImage(works[i]);
    }
    for(let i =0; i< categories.length;i++){
        createCategories(categories[i])
    }
}

let works = [];
let categories = new Set();
window.onload = onLoadApi;



