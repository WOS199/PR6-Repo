document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(works => {

        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works);
        
        
        const allWorksBtn = document.querySelector(".allWorksBtn");
        const objectsBtn = document.querySelector(".objectsBtn");
        const appartementsBtn = document.querySelector(".appartementsBtn");
        const hotelsBtn = document.querySelector(".hotelsBtn");

        const worksObjects = Array.from(works);
        const worksAppartements = Array.from(works);
        const worksHotels = Array.from(works);



        objectsBtn.addEventListener("click", () => {
            sortObjects();
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(worksObjects);
            const allLinks = document.querySelectorAll(".filters a");
            allLinks.forEach((link) => {
                link.classList.remove("selected");
                if(link.classList.contains("objectsBtn")){
                    link.classList.add("selected");
                }
              });
        })

        appartementsBtn.addEventListener("click", () => {
            sortAppartements();
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(worksAppartements);
            const allLinks = document.querySelectorAll(".filters a");
            allLinks.forEach((link) => {
                link.classList.remove("selected");
                if(link.classList.contains("appartementsBtn")){
                    link.classList.add("selected");
                }
              });
        })

        hotelsBtn.addEventListener("click", () => {
            sortHotels();
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(worksHotels);
            const allLinks = document.querySelectorAll(".filters a");
            allLinks.forEach((link) => {
                link.classList.remove("selected");
                if(link.classList.contains("hotelsBtn")){
                    link.classList.add("selected");
                }
              });
        })

        allWorksBtn.addEventListener("click", () => {
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(works);
            const allLinks = document.querySelectorAll(".filters a");
            allLinks.forEach((link) => {
                link.classList.remove("selected");
                if(link.classList.contains("allWorksBtn")){
                    link.classList.add("selected");
                }
              });
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

        /* const catSet = new Set();
        for(let i = 0 ; i < works.length ; i++){
            catSet.add(works[i].category.id);
        } */
        

        function sortObjects() {
            for(let i = worksObjects.length -1 ; i >= 0 ; i--){
                if(worksObjects[i].category.id !== 1){
                    worksObjects.splice(i,1)
                }
            }
        }

        function sortAppartements() {
            for(let i = worksAppartements.length -1 ; i >= 0 ; i--){
                if(worksAppartements[i].category.id !== 2){
                    worksAppartements.splice(i,1)
                }
            }
        }

        function sortHotels() {
            for(let i = worksHotels.length -1 ; i >= 0 ; i--){
                if(worksHotels[i].category.id !== 3){
                    worksHotels.splice(i,1)
                }
            }
        }


    })
});

