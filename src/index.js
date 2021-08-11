let addToy = false;

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
fetch("http://localhost:3000/toys")
  .then((resp) => resp.json())
  .then((toyData) => handleToyData(toyData));

// FUNCTION handleToyData(toyData)
function handleToyData(toyData) {
  for (const toyObject of toyData) {
    renderOneToy(toyObject);
  }

  // FUNCTION renderOneToy(toyObject)
  function renderOneToy(toyObject) {
    const toyCollection = document.querySelector("#toy-collection");
    const li = document.createElement("li");
    li.className = "card";

    const h1 = document.createElement("h1");
    h1.innerText = toyObject.name;

    const img = document.createElement("img");
    img.src = toyObject.image;
    img.className = "toy-avatar";

    const likeCounter = document.createElement("p");
    likeCounter.id = "like-counter";
    if (toyObject.likes === 1) {
      likeCounter.innerText = `${toyObject.likes} like`;
    } else {
      likeCounter.innerText = `${toyObject.likes} likes`;
    }

    const likeButton = document.createElement("button");
    likeButton.innerText = "like";
    likeButton.className = "like-btn";
    likeButton.id = toyObject.id;
    likeButton.addEventListener("click", handleLike);

    li.append(h1, img, likeCounter, likeButton);
    toyCollection.appendChild(li);
  }

  // FUNCTION handleLike(e)
  // How can I get handleLike to have access to the toyObject and likeCounter?
  // Tried defining it as a parameter and passing it in as an argument on line 53, but it didn't work
  function handleLike(e) {
    const id = parseInt(e.target.id);
    const numberOfLikes = toyObject.likes + 1;

    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: numberOfLikes,
      }),
    })
      .then((resp) => resp.json())
      .then((updatedToyObject) => updateLikeCounter(updatedToyObject));

    function updateLikeCounter(updatedToyObject) {
      const likeCounter = document.querySelector("#like-counter");
      console.log("like counter: ", likeCounter);

      if (toyObject.likes === 1) {
        likeCounter.innerText = `${updatedToyObject.likes} like`;
      } else {
        likeCounter.innerText = `${updatedToyObject.likes} likes`;
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
