fetch('http://localhost:5678/api/works')
.then(response => response.json())
.then(works => {
    
    // Reset du HTML du portfolio et affichage de tous les travaux.
    function reset() {
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works);
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



    


