// Fetching elements needed //
const loginForm = document.getElementById("loginForm");
const apiUrl = "http://localhost:5678/api/users/login";

// Adding an eventListener on the form (on submit) //
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Fecthing the data we neen and placing them in an object //
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email: email,
    password: password,
  };

  // This function sends the data to the API via Fetch and handles the response //
  async function auth() {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // If the datas are verified, id and token are stored and the user is redirected to the homepage //
    if (response.ok === true) {
      const responseData = await response.json();

      window.localStorage.setItem("token", responseData.token);
      window.location.href = "index.html";
      // If not, error message is displayed //
    } else {
      const errorMsg = document.querySelector(".accessDenied");
      errorMsg.style.display = "block";
    }
  }

  auth();
});
