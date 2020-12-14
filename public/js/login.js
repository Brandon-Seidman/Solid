// username should be case insensitive
// all forms should have client side javascript
// validate users forms in 3 places - Client side, routes, and database

(async function () {
  function formCheck(username, password) {
    if (!username || !username.trim() || !password)
      throw "Invalid username or password";
    // check if username is in the database
    // check if hashed password input matches hashed password stored
    return "ok";
  }

  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        try {
          event.preventDefault();
          const username = document
            .getElementById("username")
            .value.toLowerCase();
          const password = document.getElementById("password").value;
          formCheck(username, password);
          //make call to server
          let response = await fetch("/login", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password }),
          });
          console.log(response);
          if (response.status !== 200) {
            throw "Incorrect username or password";
          }
        } catch (e) {
          const messages = document.getElementById("messages");
          const error = document.getElementById("error");
          if (!error) {
            let newError = document.createElement("h2");
            newError.textContent = `${e}`;
            newError.setAttribute("id", "error");

            messages.appendChild(newError);
          } else {
            error.remove();
            newError = document.createElement("h2");

            newError.textContent = `${e}`;
            newError.setAttribute("id", "error");
            messages.appendChild(newError);
          }
        }
      }
      // otherwise that means they successfully logged in! Take them to authentication page
    );
  }
})();
