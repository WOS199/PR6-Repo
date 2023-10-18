// Data initialization (for the 'add a project' feature) //
let imgToAdd = "";
let titleToAdd = "";
let catToAdd = "";

// Fetch requests for works and categories //
const fetchWorks = fetch("http://localhost:5678/api/works").then((response) =>
  response.json()
);
const fetchCategories = fetch("http://localhost:5678/api/categories").then(
  (response) => response.json()
);

Promise.all([fetchWorks, fetchCategories]).then((results) => {
  const works = results[0];
  const categories = results[1];

  // This function resets the main project gallery and the one in the modal if it exists //
  function reset() {
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
    if (document.querySelector(".modalGallery")) {
      document.querySelector(".modalGallery").innerHTML = "";
      generateModalGallery(works);
    }
  }

  reset();

  // This fonction generates all the HTML and dynamic contents for the main gallery //
  function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
      // Creating HTML tags for each card, which will be injected into '.gallery' //
      const figureElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      const imgCaptionElement = document.createElement("figcaption");

      // Filling data for each new element //
      imageElement.src = works[i].imageUrl;
      imageElement.alt = works[i].title;
      imgCaptionElement.innerText = works[i].title;

      // Injecting the elements into the DOM //
      document.querySelector(".gallery").appendChild(figureElement);
      figureElement.appendChild(imageElement);
      figureElement.appendChild(imgCaptionElement);
    }
  }

  // This fonction generates all the HTML and dynamic contents for the modal gallery and handle the work suppression feature //
  function generateModalGallery(works) {
    for (let i = 0; i < works.length; i++) {
      // Creating HTML tags, which will be injected into the modal //
      const modalFigElement = document.createElement("figure");
      const modalImageElement = document.createElement("img");
      const modalIconDiv = document.createElement("div");

      // Filling data for each new element //
      modalImageElement.src = works[i].imageUrl;
      modalIconDiv.id = works[i].id;

      // Injecting the elements into the DOM //
      document.querySelector(".modalGallery").appendChild(modalFigElement);
      modalFigElement.appendChild(modalImageElement);
      modalFigElement.appendChild(modalIconDiv);
      modalIconDiv.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

      // Work suppression feature
      modalIconDiv.addEventListener("click", (event) => {
        const supressId = modalIconDiv.id;
        const apiUrl = "http://localhost:5678/api/works/";
        const deleteUrl = apiUrl + supressId;
        const token = window.localStorage.getItem("token");
        fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });
        reset();
      });
    }
  }

  // ----- PROJECTS FILTERING ----- //

  /* // Fetching the 4 buttons from the 'filters' section. //
  const allWorksBtn = document.querySelector(".allWorksBtn");
  const objectsBtn = document.querySelector(".objectsBtn");
  const appartementsBtn = document.querySelector(".appartementsBtn");
  const hotelsBtn = document.querySelector(".hotelsBtn"); */

  // ----- FILTERS DYNAMIC GENERATION ----- //

  function generateFilters(cat) {
    // Creating HTML tag for the 'all works' btn + assigning content and classes + injecting to the DOM. //
    const allWorks = document.createElement("a");
    allWorks.classList.add("allUsers", "selected");
    allWorks.innerText = "Tous";
    document.querySelector(".filters").appendChild(allWorks);
    allWorks.addEventListener("click", (event) => {
      reset();
      resetSelected();
      event.target.classList.add("selected");
    });

    // Creating HTML tags fot the other btn, using the 'ctagteories' fetch result //
    for (let i = 0; i < categories.length; i++) {
      const btn = document.createElement("a");
      btn.classList.add("allUsers");
      btn.innerText = `${categories[i].name}`;
      btn.id = `${categories[i].id}`;
      document.querySelector(".filters").appendChild(btn);
      btn.addEventListener("click", (event) => {
        filterWorks(categories[i].id);
        event.target.classList.add("selected");
      });
    }

    filtersVisibility();
  }

  generateFilters(categories);

  // This function handles project sorting. Depending on the category passed as an argument, it clears the gallery and regenerates it from a filtered list. //
  function filterWorks(catId) {
    const filteredWorks = works.filter((work) => work.category.id === catId);
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorks);
    resetSelected();
  }

  // This function resets the "selected" classes on links in the "filters" section. //
  function resetSelected() {
    const allLinks = document.querySelectorAll(".filters a");
    allLinks.forEach((link) => {
      link.classList.remove("selected");
    });
  }

  // This function handles the visibility of the filters depending on the presence of an auth Token //
  function filtersVisibility() {
    // Fetching the necessary elements //
    const token = localStorage.getItem("token");
    const loggedOnly = document.querySelectorAll(".loggedOnly");
    const allUsers = document.querySelectorAll(".allUsers");

    // Behaviours
    if (token) {
      for (let i = 0; i < loggedOnly.length; i++) {
        loggedOnly[i].style.display = "null";
      }
      for (let i = 0; i < allUsers.length; i++) {
        allUsers[i].style.display = "none";
      }
    } else {
      for (let i = 0; i < loggedOnly.length; i++) {
        loggedOnly[i].style.display = "none";
      }
      for (let i = 0; i < allUsers.length; i++) {
        allUsers[i].style.display = "null";
      }
    }
  }

  /* // Buttons behaviour in the "filters" section.
  objectsBtn.addEventListener("click", (event) => {
    filterWorks(1);
    event.target.classList.add("selected");
  });
  appartementsBtn.addEventListener("click", (event) => {
    filterWorks(2);
    event.target.classList.add("selected");
  });
  hotelsBtn.addEventListener("click", (event) => {
    filterWorks(3);
    event.target.classList.add("selected");
  });
  allWorksBtn.addEventListener("click", (event) => {
    reset();
    resetSelected();
    event.target.classList.add("selected");
  }); */

  // ----- MODAL ----- //

  // Fecthing the necessary elements //
  const modBtn = document.querySelector(".modBtn");
  const target = document.querySelector(".modal");
  const modalWrapper = document.querySelector(".modalWrapper");
  const closeBtn = document.querySelector(".closeBtn");

  // This function opens the modal (phase 1) //
  const openModal = function (event) {
    event.preventDefault();
    target.style.display = null;

    // Generating contents for the phase 1 //
    modalWrapper.innerHTML = `
          <a href="#">
                  <i class="closeBtn fa-solid fa-xmark"></i>
              </a>
              <h3>Galerie Photo</h3>
              <div class="modalGallery">
              </div>
              <hr class="separator">
              <a class="modalBtn">Ajouter une photo</a>`;

    generateModalGallery(works);

    modalWrapper.addEventListener("click", stopPropagation);
    target.addEventListener("click", closeModal);
    const closeBtn = document.querySelector(".closeBtn");
    closeBtn.addEventListener("click", closeModal);

    // This function handles the phase 2 of the modal //
    OpenProjectForm();
  };

  // Modal phase 2 //

  function OpenProjectForm() {
    const addProjetcBtn = document.querySelector(".modalBtn");
    // Content of the phase 2 //
    const addProjectHTML = `
          <a href="#">
          <i class="backModal fa-solid fa-arrow-left"></i>
          </a>
          <a href="#">
          <i class="closeBtn fa-solid fa-xmark"></i>
          </a>
          <h3>Ajout photo</h3>
          <form class="form" action="" method="">
          <div class="dropPhoto">
              <label for="inputFile">
                  <i class="imgIcon fa-regular fa-image"></i>
                  <input class="visually-hidden input" id="inputFile" type="file" name="projectPhoto" accept=".jpg, .png">
                  <span class="fileBtn">+ Ajouter photos</span>
                  <p>jpg, png : 4mo max</p>
              </label>
          </div>
          <label for="title">Titre</label>
          <input class="input" type="text" name="title" id="title">
          <label for="cat">Catégorie</label>
          <select class="input" name="cat" id="cat">
              <option value=""></option>
              <option value=${categories[0].id}>${categories[0].name}</option>
              <option value=${categories[1].id}>${categories[1].name}</option>
              <option value=${categories[2].id}>${categories[2].name}</option>
          </select>
          <hr class="separator">
          <p class="accessDenied">Veuillez renseigner tous les champs</p>
          <a type="submit" class="sendProjectBtn">Valider</a>
          </form>`;

    // If the button is clicked on, generating the new content of the modal phase 2 (described just before) //
    addProjetcBtn.addEventListener("click", () => {
      document.querySelector(".modalWrapper").innerHTML = addProjectHTML;
      const closeBtn = document.querySelector(".closeBtn");
      closeBtn.addEventListener("click", closeModal);
      document.querySelector(".backModal").addEventListener("click", openModal);

      // Generating a preview of the selected image //
      const dropPhoto = document.querySelector(".dropPhoto");
      const inputFile = document.getElementById("inputFile");
      inputFile.addEventListener("change", () => {
        handleFiles(inputFile.files);
      });

      // This function fecthes the selected img, assign it the the imgToAdd var and displays the img //
      function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          imgToAdd = files[i];

          if (!file.type.startsWith("image/")) {
            continue;
          }

          const img = document.createElement("img");
          img.file = file;

          dropPhoto.innerHTML = "";
          dropPhoto.appendChild(img);

          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }

      // Modal phase 2 button behaviour - change color if all fields are countaining something //

      const inputs = document.querySelectorAll(".input");
      inputs.forEach((input) => {
        input.addEventListener("input", checkInputs);
      });

      function checkInputs() {
        const allFilled = [...inputs].every(
          (input) => input.value.trim() !== ""
        );

        if (allFilled) {
          document
            .querySelector(".sendProjectBtn")
            .classList.add("sendProjectBtn--active");
        } else {
          document
            .querySelector(".sendProjectBtn")
            .classList.remove("sendProjectBtn--active");
        }
      }

      // 'Adding a project' feature //

      // The 3 necessary data for the fetch are now collected and placed into a new FromData Object //
      const submit = document.querySelector(".sendProjectBtn");
      submit.addEventListener("click", () => {
        const title = document.getElementById("title").value;
        titleToAdd = title;
        const cat = document.getElementById("cat").value;
        catToAdd = cat;

        const newProject = new FormData();
        newProject.append("image", imgToAdd);
        newProject.append("title", titleToAdd);
        newProject.append("category", catToAdd);

        const token = window.localStorage.getItem("token");

        if (!titleToAdd || !catToAdd || !imgToAdd) {
          document.querySelector(".accessDenied").style.display = "block";
        } else {
          // Fetch request to post a new project //
          fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: newProject,
          });
        }
      });
    });
  }

  // This function closes the modal //
  const closeModal = function (event) {
    event.preventDefault();
    target.style.display = "none";
    target.removeEventListener("click", closeModal);
    const closeBtn = document.querySelector(".closeBtn");
    closeBtn.removeEventListener("click", closeModal);
  };

  // This function stops the propagation of the eventListeners handling the closing of the modal //
  const stopPropagation = function (event) {
    event.stopPropagation();
  };

  // Actual eventListener for the opening of the modal //
  modBtn.addEventListener("click", openModal);
});

// Logout
const logOut = document.querySelector(".logout");
logOut.addEventListener("click", () => {
  window.localStorage.removeItem("token");
});

/* document.addEventListener("keydown", (e) => {
    if(e.key === "m"){
        const newProject = new FormData();
        newProject.append("image", imgToAdd); 
        newProject.append("title", titleToAdd);
        newProject.append("category", catToAdd);
        console.log(newProject);
    }
})

document.addEventListener("keydown", (e) => {
    if(e.key === "l"){
        console.log(imgToAdd);
    }
})

document.addEventListener("keydown", (e) => {
    if(e.key === "k"){
        console.log(titleToAdd);
    }
}) */

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
