const loginForm = document.getElementById("loginForm");
const apiUrl = "http://localhost:5678/api/users/login";

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    email: email,
    password: password,
  };

  async function auth() {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok === true) {
      const responseData = await response.json();
      window.localStorage.setItem("id", responseData.userId);
      window.localStorage.setItem("token", responseData.token);
      window.location.href = "index.html";
    } else {
      const errorMsg = document.querySelector(".accessDenied");
      errorMsg.style.display = "block";
    }
  }

  auth();
});
