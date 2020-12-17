(function () {
  function formCheck(newUser) {
    if (
      !newUser.email ||
      !newUser.username ||
      !newUser.password ||
      !newUser.first_name ||
      !newUser.last_name ||
      !newUser.zip
    )
      throw "Missing fields";
    if (
      newUser.email.trim().length === 0 ||
      !newUser.username.trim().length === 0 ||
      !newUser.password.trim().length === 0 ||
      !newUser.passwordCheck.trim().length === 0 ||
      !newUser.first_name.trim().length === 0 ||
      !newUser.last_name.trim().length === 0 ||
      !newUser.zip.trim()
    )
      throw "All fields are required";
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
    if (newUser.zip.length !== 5) {
      throw "Invalid Zipcode";
    }

    const checkU = filterXSS(newUser.username);
    const checkFN = filterXSS(newUser.first_name);
    const checkLS = filterXSS(newUser.last_name);
    const checkZip = filterXSS(newUser.zip);
    const checkE = filterXSS(newUser.email);
    if (
      checkU !== newUser.username ||
      checkFN !== newUser.first_name ||
      checkLS !== newUser.last_name ||
      checkZip !== newUser.zip ||
      checkE !== newUser.email
    )
      throw "Error XSS attack detected";

    // we can add more constraints later if you guys want
    return "Ok";
  }

  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        try {
          event.preventDefault();

          const newUser = {
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            username: document.getElementById("username").value.toLowerCase(),
            password: document.getElementById("password").value,
            email: document.getElementById("email").value,
            zip: document.getElementById("zip").value,
            passwordCheck: document.getElementById("passwordCheck").value,
          };
          formCheck(newUser);
          //make call to server
          let response = await fetch("/signup", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
          if (response.status === 200) {
            window.location = "/mainview";
          } else {
            throw "Oh no! Looks like that username or email is already taken!";
          }
          return;
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
