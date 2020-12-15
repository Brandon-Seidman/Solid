

(function ($) {
  function formCheck(title, body) {
    if (!body || !body.trim() || !price || !tags )
      throw "Please input a description, price, and tags for your solid";

    return "ok";
  }

  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        try {
          event.preventDefault();
          const body = document.getElementById("body").value;
          const price =document.getElementById("price").value;
          const date = new Date().toDateString();
          const user = document.getElementById("user").value;

          if(!location || !description || !postedBy || !accepted|| !completed|| !comments|| !buddyID|| !price|| !timestamp|| !tags)
          formCheck("07030",body,, false, false,[],"", price,date, []);
          //make call to server
          const solid = {body: body, tags: [] };
          let response = await fetch("/login", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });
          console.log(response);
          if (response.status !== 200) {
            throw "Incorrect username or password";
          } else {
            window.location = "/mainview";
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
})(window.jquery);
