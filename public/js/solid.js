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
          const user = document.getElementById("name").value;
		  const id = document.getElementById("id").value;
		  const zip = document.getElementById("zip").value;
		  

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
          $.ajax().then(function () {
            var newSolid = $("<a></a>", { class: "solidcardlink" });
            var card = $("<div class='solidcard'></div>", {});
            var elem = $(`<h2 class="cardelem" >${user}</h2>`, {});
            card.append(elem);
			 elem = $(`<h2 class="cardelem" >${new Date()}</h2>`, {});
            card.append(elem);
			elem = $(`<p class="cardelem" >${zip}</p>`, {});
            card.append(elem);
			 elem = $(`<pclass="cardelem" >$${price}</p>`, {});
            card.append(elem)
            elem = $(`<p class="cardelem" >${body}</p>`, {});
            // elem.attr("text", body);
            card.append(elem);
            elem = $(`<p class="cardbot" >${tags}</p>`, {});
            card.append(elem);
            newSolid.prepend(card);
            let mainPage = $("#card");
            mainPage.replaceWith(newSolid);
          });
          const solid = {
            id: id,
            location: "Not Provided",
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

          let response = await fetch("/solids", {
            method: "PUT",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(solid),
          });

          console.log(response);

          if (response.status !== 200) {
            throw "An Error Occured";
          }
        } catch (e) {
          console.log(e);
        }
      }
      // otherwise that means they successfully logged in! Take them to authentication page
    );
  }
})(window.jQuery);
