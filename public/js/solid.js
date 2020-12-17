(function ($) {
	
  function formCheck(price, body) {
    if (!body || !body.trim() || !price)
      throw "Please input a description, price, and tags for your solid";
    if (typeof body !== "string") throw "Description must be a string";
    if (!Number.isInteger(parseInt(price))) throw "Price must be an Integer";
    if (price <= 0) throw "Price must be greater than 0";
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
          const date = new Date().toDateString();
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
          //make call to server
		  
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
            timestamp: date,
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
})(window.jquery);