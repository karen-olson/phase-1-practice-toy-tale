let addToy = false;

// Add an event listener to the document for the event DOMContentLoaded
// Once DOM content is loaded, add an event listener to the New Toy Button manipulate DOM elements
// If the New Toy Button is clicked, toggle the display to show or hide the form and button
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// GET request and initial toy rendering on DOM
// Send a GET request to the server to get the toy data
// Pass the toy data to a callback function (handle toy data)
fetch("http://localhost:3000/toys")
  .then((resp) => resp.json())
  .then((toyData) => handleToyData(toyData));

// FUNCTION handleToyData(toyData)
// Iterate through the toy data list and render each toy
function handleToyData(toyData) {
  for (const toyObject of toyData) {
    renderOneToy(toyObject);
  }

  // FUNCTION renderOneToy(toyObject)
  function renderOneToy(toyObject) {
    // Get the "Toy Collection" container element and save it in a variable
    const toyCollection = document.querySelector("#toy-collection");

    // Create and populate elements: li, h1, img, p, button
    const li = document.createElement("li");
    li.className = "card";

    const h1 = document.createElement("h1");
    h1.innerText = toyObject.name;

    const img = document.createElement("img");
    img.src = toyObject.image;
    img.className = "toy-avatar";

    const likeCounter = document.createElement("p");
    if (toyObject.likes === 1) {
      likeCounter.innerText = `${toyObject.likes} like`;
    } else {
      likeCounter.innerText = `${toyObject.likes} likes`;
    }

    const likeButton = document.createElement("button");
    likeButton.innerText = "like";
    likeButton.className = "like-btn";
    likeButton.id = toyObject.id;

    // Add an event listener to the like button and pass it handleLike
    // Whenever a like button is clicked, it will invoke handleLike
    likeButton.addEventListener("click", handleLike);

    // Append the new elements to the "Toy Collection" container
    li.append(h1, img, likeCounter, likeButton);
    toyCollection.appendChild(li);
  }

  // FUNCTION handleLike(e)
  function handleLike(e) {
    // Get the id of the button that's been clicked
    const id = parseInt(e.target.id);

    // Find the toy object using the ID
    const matchingToy = toyData.find((element) => element["id"] === id);

    //Look up how many likes that toy currently has and save it in a variable
    const currentLikes = matchingToy["likes"];

    // Increase the value of currentLikes by 1
    const newLikes = currentLikes + 1;

    // Communicate with the server using a patch request to update part of the toy object
    // Send and receive data in JSON format
    // Send the updated like count in the body as a string
    // Once the promise is fulfilled, convert the response back to a JS object
    // Update the like count in the DOM by calling updateLikeCounter on the udpatedToyObject
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    })
      .then((resp) => resp.json())
      .then((updatedToyObject) => updateLikeCounter(updatedToyObject));

    // DOM Manipulator function
    // Check to see how many likes the updatedToyObject has
    // Based on whether the number of likes will be singular or plural,
    //    update the DOM by accessing the target's "previous element sibling" property and changing the inner text.
    function updateLikeCounter(updatedToyObject) {
      if (updatedToyObject.likes === 1) {
        e.target.previousElementSibling.innerText = `${updatedToyObject.likes} like`;
      } else {
        e.target.previousElementSibling.innerText = `${updatedToyObject.likes} likes`;
      }
    }
  }

  // Event listener for form
  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", (e) => handleSubmit(e));

  // FUNCTION handleSubmit(e)
  function handleSubmit(e) {
    e.preventDefault();

    const dataObject = {
      name: e.target[0].value,
      image: e.target[1].value,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataObject),
    })
      .then((resp) => resp.json())
      .then((newToyObject) => renderOneToy(newToyObject));
  }
}
