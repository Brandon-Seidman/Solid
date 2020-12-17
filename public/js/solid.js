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
            var elem = $(`<div class="cardelem" >${user}</div>`, {});

            card.append(elem);
            elem = $(`<div class="cardelem" >${body}</div>`, {});
            // elem.attr("text", body);
            card.append(elem);
            elem = $(`<div class="cardelem" >$${price}</div>`, {});
            card.append(elem);
            elem = $(`<div class="cardelem" >07030</div>`, {});
            card.append(elem);
            elem = $(`<div class="cardelem" >${new Date()}</div>`, {});
            card.append(elem);
            elem = $(`<div class="cardbot" >${tags}</div>`, {});
            card.append(elem);
            newSolid.prepend(card);
            let mainPage = $("#card");
            mainPage.replaceWith(newSolid);
          });
		  const solid = {
			id:id,
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