(function ($) {
  function formCheck(price, body) {
    if (!body || !body.trim() || !price)
      throw "Please input a description, and price for your solid. Tags are recommended but not required.";
    if (typeof body !== "string") throw "Description must be a string";
    if (!Number.isInteger(parseInt(price))) throw "Price must be an Integer";
    if (price <= 0) throw "Price must be greater than 0";
    const checkBody = filterXSS(body);
    if (checkBody !== body) {
      throw "Error: XSS attack detected, Please edit your input";
    }
    return "ok";
  }

  const form = document.getElementById("post_solid");
  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        try {
          event.preventDefault();

          const body = document.getElementById("body").value;
          const price = document.getElementById("price").value;
          const zip = document.getElementById("zip").value;
          const user = document.getElementById("name").value;

          const error = document.getElementById("error");

          const formTags = [
            document.getElementById("shopping"),
            document.getElementById("pickup"),
            document.getElementById("small_task"),
            document.getElementById("large_task"),
            document.getElementById("car_needed"),
            document.getElementById("art"),
            document.getElementById("computer"),
            document.getElementById("labor"),
            document.getElementById("writing"),
            document.getElementById("household"),
            document.getElementById("quick"),
          ];
          formCheck(price, body);
          let tags = [];
          for (let i = 0; i < formTags.length; i++) {
            if (formTags[i].checked) {
              tags.push(formTags[i].id);
            }
          }

          $("#solidPostModal").modal("toggle");
          if (error) {
            error.remove();
          }
          //make call to server
          document.getElementById("post_solid").reset();
          const solid = {
            location: zip,
            description: body,
            postedBy: user,
            accepted: false,
            completed: false,
            comments: [],
            buddyID: "None",
            price: parseInt(price),
            timestamp: new Date(),
            tags: tags,
          };

          $.ajax().then(function () {
            var newSolid = $("<a class='solidCardLink'></a>", {});
            var card = $("<div class='solidcard'></div>", {});
            var solidContent = $("<div class='solidContent'></div>", {});
            var cardText = $("<div class='solidText'></div>", {});
            var elem = $(
              `<div class="cardelem" ><p>Posted by: ${user}</p></div>`,
              {}
            );

            cardText.append(elem);
            elem = $(
              `<div class="cardelem" ><p>The Job: ${body}</p></div>`,
              {}
            );
            // elem.attr("text", body);
            cardText.append(elem);
            elem = $(`<div class="cardelem"><p>$${price}</p></div>`, {});
            cardText.append(elem);
            elem = $(`<div class="cardelem" ><p>Zipcode: ${zip}</p></div>`, {});
            cardText.append(elem);
            elem = $(
              `<div class="cardelem" ><p>Posted on: ${new Date()}<p></div>`,
              {}
            );
            cardText.append(elem);
            elem = $(
              `<div class="cardelembot" ><p>Tags: ${tags}</p></div>`,
              {}
            );
            cardText.append(elem);
            solidContent.prepend(cardText);
            card.append(solidContent);
            newSolid.append(card);
            let mainPage = $("#cardArea");
            mainPage.prepend(newSolid);
          });
          let response = fetch("/mainview", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(solid),
          });

          if (response.status !== 200) {
            throw "An Error Occured";
          }
        } catch (e) {
          console.log(e);
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
})(window.jQuery);
