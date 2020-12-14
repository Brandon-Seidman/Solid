(function () {
  function formCheck(newUser) {
    if (!newUser.email || !newUser.username || !newUser.password)
      throw "Missing fields";
    if (
      newUser.email.trim().length === 0 ||
      !newUser.username.trim().length === 0 ||
      !newUser.password.trim().length === 0
    )
      throw "All fields are required";
    // ******** current issue ****** all fields are required logs but does not add the element to messages
    // make sure no spaces - make sure it's long enough
    if (!newUser.email.includes("@")) throw "Invalid Email";
    if (newUser.password !== newUser.passwordCheck)
      throw "Passwords do not match";
    // spaces aren't allowed we aint about to have someone named "hi mom"
    if (newUser.email.includes(" ") || newUser.username.includes(" "))
      throw "Spaces detected in input";

    if (newUser.username.length <= 4)
      throw "Username must be at least 5 characters";
    if (newUser.password.length < 8)
      throw "Password must be at least 8 characters";
    // we can add more constraints later if you guys want
    return "Ok";
  }

  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener(
      "submit",
      (event) => {
        try {
          event.preventDefault();

          const newUser = {
            username: document.getElementById("username").value.toLowerCase(),
            password: document.getElementById("password").value,
            email: document.getElementById("email").value,
            passwordCheck: document.getElementById("passwordCheck").value,
          };
          formCheck(newUser);
          //make call to server
          let request = new XMLHttpRequest();
          request.open("POST", "/signup");
          request.send(form);
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
