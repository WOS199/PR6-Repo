// Var declaration (later used in the 'add a project' feature) //

let imgToAdd;
let titleToAdd;
let catToAdd;

const submit = document.querySelector(".sendProjectBtn");
const apiUrl = "http://localhost:5678/api/works/";

// ----- API FETCH FOR WORKS AND CATEGORIES ----- //
const fetchWorks = fetch(apiUrl).then((response) => response.json());
const fetchCategories = fetch("http://localhost:5678/api/categories").then(
  (response) => response.json()
);

Promise.all([fetchWorks, fetchCategories]).then((results) => {
  const works = results[0];
  const categories = results[1];

  // Reseting the main project gallery and the one in the modal if it exists //
  function reset() {
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(works);
    if (document.querySelector(".modalGallery")) {
      document.querySelector(".modalGallery").innerHTML = "";
      generateModalGallery(works);
    }
  }

  reset();

  // Reseting the form entries (activated when closing the modal) //
  function resetValues() {
    document.getElementById("title").value = "";
    document.getElementById("cat").value = "";
    document.querySelector("input[type=file]").value = null;
  }

  // ----- MAIN GALLERY ----- //
  // Generating all the HTML and dynamic contents for the main gallery //
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

  // ----- MODAL GALLERY AND PROJECT SUPRESSION ----- //
  // Generating all the HTML and dynamic contents for the modal gallery and handling the work suppression feature //
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

      // Work suppression feature //
      modalIconDiv.addEventListener("click", (event) => {
        const supressId = modalIconDiv.id;
        const deleteUrl = apiUrl + supressId;
        const token = window.localStorage.getItem("token");

        fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        })
          // Managing possible error 401 //
          .then((response) => {
            if (response.status === 401) {
              window.location.href = "login.html";
              window.localStorage.removeItem("token");
            } else {
              location.reload();
            }
          });
          reset();
      });
    }
  }

  // ----- PROJECTS FILTERING ----- //
  function generateFilters() {
    // Creating HTML tag for the 'all works' btn + assigning content and classes + injecting into the DOM. //
    const allWorks = document.createElement("a");
    allWorks.classList.add("allUsers", "selected");
    allWorks.innerText = "Tous";
    document.querySelector(".filters").appendChild(allWorks);
    allWorks.addEventListener("click", (event) => {
      reset();
      resetSelected();
      event.target.classList.add("selected");
    });

    // Creating HTML tags fot the other btn, using the 'cagteories' fetch result //
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

  generateFilters();

  // Handeling project sorting. Depending on the category passed as an argument, it clears the gallery and regenerates it from a filtered list. //
  function filterWorks(catId) {
    const filteredWorks = works.filter((work) => work.category.id === catId);
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorks);
    resetSelected();
  }

  // Reseting the "selected" classes on links in the "filters" section. //
  function resetSelected() {
    const allLinks = document.querySelectorAll(".filters a");
    allLinks.forEach((link) => {
      link.classList.remove("selected");
    });
  }

  // Handeling the visibility of the filters depending on the presence of an auth Token //
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

  // ----- MODAL PHASE 1 ----- //

  // Fecthing the necessary elements //
  const modBtn = document.querySelector(".modBtn");
  const target = document.querySelector(".modal");
  const modalWrapper = document.querySelector(".modalWrapper");

  // This function opens the modal (phase 1) //
  const openModal = function (event) {
    event.preventDefault();
    target.style.display = null;
    document.querySelector(".phase-1").style.display = null;
    document.querySelector(".phase-2").style.display = "none";
    resetValues();
    modalWrapper.addEventListener("click", stopPropagation);
    target.addEventListener("click", closeModal);
    const closeBtn = document.querySelector(".closeBtn");
    closeBtn.addEventListener("click", closeModal);
    submit.removeEventListener("click", submitProject);
  };

  // ----- MODAL PHASE 2 ----- //
  const addProjetcBtn = document.querySelector(".modalBtn");

  // Opening the modal phase 2 on click //
  addProjetcBtn.addEventListener("click", () => {
    document.querySelector(".accessDenied").style.display = "none";
    setModalPhase2();

    submit.addEventListener("click", submitProject);
  });

  // Generating the content of the select categories input and handling the modal display //
  function setModalPhase2() {
    const select = document.getElementById("cat");
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    select.appendChild(option);

    for (let i = 0; i < categories.length; i++) {
      const catOption = document.createElement("option");
      catOption.value = categories[i].id;
      catOption.innerText = categories[i].name;
      select.appendChild(catOption);
    }

    document.querySelector(".phase-1").style.display = "none";
    document.querySelector(".phase-2").style.display = null;
    const closeBtn2 = document.querySelector(".closeBtn2");
    closeBtn2.addEventListener("click", closeModal);
    document.querySelector(".backModal").addEventListener("click", openModal);
  }

  // Generating a preview of the selected image //
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

      const img = document.querySelector(".dropPhoto img");
      img.style.display = null;
      document.querySelector(".dropPhoto label").style.display = "none";
      img.file = file;

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
    const allFilled = [...inputs].every((input) => input.value.trim() !== "");

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

  // ----- ADDING A PROJECT ----- //
  // The 3 necessary data for the fetch are now collected and placed into a new FromData Object //
  function submitProject() {
    titleToAdd = document.getElementById("title").value;
    catToAdd = document.getElementById("cat").value;

    console.log("SubmitProject");

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
      })
        // Managing possible error 401 //
        .then((response) => {
          if (response.status === 401) {
            window.location.href = "login.html";
            window.localStorage.removeItem("token");
          } else {
            location.reload();
          }
        });
    }
  }

  // This function closes the modal //
  const closeModal = function (event) {
    event.preventDefault();
    resetValues();
    target.style.display = "none";
    document.querySelector(".phase-1").style.display = "none";
    document.querySelector(".phase-2").style.display = "none";
    document.querySelector(".dropPhoto img").style.display = "none";
    document.querySelector(".dropPhoto label").style.display = null;
    target.removeEventListener("click", closeModal);

    const closeBtn = document.querySelector(".closeBtn");
    closeBtn.removeEventListener("click", closeModal);
    submit.removeEventListener("click", submitProject);
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
