document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works);
    })
    

    function generateWorks(works){
        for(let i=0 ; i < works.length ; i++){
            // Création des balises HTML pour chaque carte, qui seront injectées dans ".gallery"
            const figureElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            const imgCaptionElement = document.createElement("figcaption");
            
            // Remplissage des données pour chaque nouvel élément
            imageElement.src = works[i].imageUrl;
            imageElement.alt = works[i].title;
            imgCaptionElement.innerText = works[i].title;

            // Injection des éléments dans le DOM
            document.querySelector(".gallery").appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(imgCaptionElement);
        }
    } 
});