// username should be case insensitive
// all forms should have client side javascript
// validate users forms in 3 places - Client side, routes, and database

(async function () {
  function formCheck(username, password) {
    if (!username || !username.trim() || !password)
      throw "Invalid username or password";
    const check = filterXSS(username);
    if (check !== username) throw "Error XSS attack detected";

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
          console.log(password);
          formCheck(username, password);
          //make call to server
          const user = { username: username, password: password };
          let response = await fetch("/login", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
          if (response.status !== 200) {
            throw "Incorrect username or password";
          } else {
            window.location = "/mainview";
          }
        } catch (e) {
          const messages = document.getElementById("messages");
          const error = document.getElementById("error");
          const loggedOut = document.getElementById("loggedOut");
          if (loggedOut) {
            loggedOut.remove();
          }
          if (!error) {
            let newError = document.createElement("h2");
            newError.textContent = `${e}`;
            newError.setAttribute("id", "error");

            messages.appendChild(newError);
          } else {
            error.remove();

            let newError = document.createElement("h2");

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
