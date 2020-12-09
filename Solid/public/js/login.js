// username should be case insensitive
// all forms should have client side javascript
// validate users forms in 3 places - Client side, routes, and database

(function () {
  function formCheck(username, password) {
    if (!username || !username.trim() || !password)
      throw "Invalid username or password";
    // check if username is in the database
    // check if hashed password input matches hashed password stored
    return "ok";
  }

  function errorMessages(e, document) {
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
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener(
      "submit",
      (event) => {
        try {
          event.preventDefault();
          const username = document
            .getElementById("username")
            .value.toLowerCase();
          const password = document.getElementById("password");
          formCheck(username, password);
          //make call to server
          let request = new XMLHttpRequest();
          request.onreadystatechange = function () {
            if (request.status !== 200) {
              errorMessages("Incorrect username or password :(", document);
            }
          };
          request.open("POST", "/login");
          request.send(form);
        } catch (e) {
          errorMessages(e, document);
        }
      }
      // otherwise that means they successfully logged in! Take them to authentication page
    );
  }
})();
