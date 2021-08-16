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
  likeButton.addEventListener("click", (e) => handleLike(e));

  // Append the new elements to the "Toy Collection" container
  li.append(h1, img, likeCounter, likeButton);
  toyCollection.appendChild(li);
}

// FUNCTION handleLike(e)
// This is logging 1 like per button BEFORE refreshing the page.
// The button looks disabled after it's been clicked once, but e.target.disabled is false
function handleLike(e) {
  // Get the id of the button that's been clicked and use it to look up the corresponding toy object
  // const id = parseInt(e.target.id);
  // const matchingToy = toyData.find((element) => element["id"] === id);

  // Look up how many likes that toy currently has, add 1, and save it in a variable
  // console.log("current likes: ", matchingToy["likes"]);
  // const newLikes = matchingToy["likes"] + 1;
  // console.log("new likes before fetch request: ", newLikes);

  // Communicate with the server using a patch request to update the toy's likes property
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: parseInt(e.target.previousElementSibling.innerText) + 1,
    }),
  })
    .then((resp) => resp.json())
    .then(function (updatedToyObject) {
      if (updatedToyObject.likes === 1) {
        e.target.previousElementSibling.innerText = `${updatedToyObject.likes} like`;
      } else {
        e.target.previousElementSibling.innerText = `${updatedToyObject.likes} likes`;
      }
    });
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
