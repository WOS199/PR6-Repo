fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(works => {
    
    // Reset du HTML du portfolio et affichage de tous les travaux.
    function reset() {
        document.querySelector(".gallery").innerHTML = "";
        document.querySelector(".modalGallery").innerHTML = "";
        generateWorks(works);
        generateModalGallery(works);
    }

    reset();
    
    // Récupération des 4 boutons de la section "filters".
    const allWorksBtn = document.querySelector(".allWorksBtn");
    const objectsBtn = document.querySelector(".objectsBtn");
    const appartementsBtn = document.querySelector(".appartementsBtn");
    const hotelsBtn = document.querySelector(".hotelsBtn");

    // Fonction de génération des travaux dans le HTML.
    function generateWorks(works){
        for(let i=0 ; i < works.length ; i++){
            // Création des balises HTML pour chaque carte, qui seront injectées dans ".gallery".
            const figureElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            const imgCaptionElement = document.createElement("figcaption");
            
            // Remplissage des données pour chaque nouvel élément.
            imageElement.src = works[i].imageUrl;
            imageElement.alt = works[i].title;
            imgCaptionElement.innerText = works[i].title;

            // Injection des éléments dans le DOM.
            document.querySelector(".gallery").appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(imgCaptionElement);
        }
    } 

    function generateModalGallery(works){
        for(let i=0 ; i < works.length ; i++){
            // Création des balises HTML "img" qui seront injectées dans la modale.
            const modalFigElement = document.createElement("figure");
            const modalImageElement = document.createElement("img");
            const modalIconDiv = document.createElement("div");
            // Remplissage des données pour chaque nouvel élément.
            modalImageElement.src = works[i].imageUrl;
            modalIconDiv.id = works[i].id;
            // Injection des éléments dans le DOM.
            document.querySelector(".modalGallery").appendChild(modalFigElement);
            modalFigElement.appendChild(modalImageElement);
            modalFigElement.appendChild(modalIconDiv);
            modalIconDiv.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            // Suppression.
            modalIconDiv.addEventListener("click", (event) => {
                const supressId = modalIconDiv.id;
                const apiUrl = "http://localhost:5678/api/works/";
                const deleteUrl = apiUrl + supressId;
                const token = window.localStorage.getItem("token");
                fetch(deleteUrl, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({}),
                })
                reset();
            })
        }
    }

    // Reset de la classe "selected" sur les liens de la section "filters".
    function resetSelected(){
        const allLinks = document.querySelectorAll(".filters a");
        allLinks.forEach((link) => {
            link.classList.remove("selected");
        });
    }

    // Fonction de filtrage en fonction d'une id de catégorie.
    function filterWorks(catId){
        const filteredWorks = works.filter((work) => work.category.id === catId);
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(filteredWorks);
        resetSelected();
    }

    // Comportement de chaque bouton de la section "filters" au clic.
    objectsBtn.addEventListener("click", (event) => {
        filterWorks(1)
        event.target.classList.add("selected");
    });
    appartementsBtn.addEventListener("click", (event) => {
        filterWorks(2)
        event.target.classList.add("selected");
    });
    hotelsBtn.addEventListener("click", (event) => {
        filterWorks(3)
        event.target.classList.add("selected");
    });
    allWorksBtn.addEventListener("click", (event) => {
        reset()
        resetSelected()
        event.target.classList.add("selected");
    });

     // ----- MODAL ----- //

    const modBtn = document.querySelector(".modBtn");
    const target = document.querySelector(".modal");
    const modalWrapper = document.querySelector(".modalWrapper")
    const closeBtn = document.querySelector(".closeBtn");

    const openModal = function(event){
        event.preventDefault();
        target.style.display = null;
        modalWrapper.addEventListener("click", stopPropagation);
        target.addEventListener("click", closeModal);
        closeBtn.addEventListener("click", closeModal);
    }

    const closeModal = function(event){
        event.preventDefault();
        target.style.display = "none";
        target.removeEventListener("click", closeModal);
        closeBtn.removeEventListener("click", closeModal);
    }

    const stopPropagation = function(event){
        event.stopPropagation();
    }

    modBtn.addEventListener("click", openModal);


})

let authentified = false;
const token = localStorage.getItem('token');
const loggedOnly = document.querySelectorAll(".loggedOnly");
const allUsers = document.querySelectorAll(".allUsers");

if (token) {
    authentified = true;
    for (let i=0 ; i < loggedOnly.length ; i++){
        loggedOnly[i].style.display = "null";
    }
    for(let i=0 ; i < allUsers.length ; i++){
        allUsers[i].style.display = "none"
    }
    
} else {
    authentified = false;
    for (let i=0 ; i < loggedOnly.length ; i++){
        loggedOnly[i].style.display = "none";
    }
    for(let i=0 ; i < allUsers.length ; i++){
        allUsers[i].style.display = "null"
    }
}




 // ----- POST PROJECT ----- //   

 /* function getBackProject11 () {
    const token = window.localStorage.getItem("token");
    const projectImg = document.getElementById("postProject");
    
    projectImg.addEventListener("change", () => {
        const newImg = projectImg.files[0]; // Obtenez le premier fichier sélectionné

        const formData = new FormData();
        formData.append("image", newImg); // Ajoutez le fichier à l'objet FormData
        formData.append("title", "Hotel First Arte - New Delhi");
        formData.append("category", 3);

        fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    });
}

getBackProject11(); */


