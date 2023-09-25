let posts = [];

var btn = document.querySelector("#add_icon_btn");
var postBtn = document.querySelector(".post__details__form");

let showPosts = JSON.parse(localStorage.getItem("posts"));
if (showPosts) {
  posts = [...showPosts];

} else {
  localStorage.setItem("posts", JSON.stringify([]));
}

let imageDiv = document.querySelector(".image__preview");


btn.addEventListener("click", () => {
  var modal = document.querySelector("#add_post_modal");

  modal.style.display = "grid";

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

let menuBtn = document.querySelector("#menu__icon");

menuBtn.addEventListener("click", () => {
  document.getElementById("full__menu").style.display = "flex";

  window.onclick = function (event) {
    if (event.target == document.getElementById("full__menu")) {
      document.getElementById("full__menu").style.display = "none";
    }
  };
});

postBtn.addEventListener("submit", (event) => {
  event.preventDefault();

  const postData = new FormData(event.target);
  const post = [...postData].reduce(
    (acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    },
    {
      image: imageData,
      date: new Date().toLocaleDateString("en-us", {
        year: "numeric",
        day: "numeric",
        month: "short",
      }),
    }
  );

  storePostInIndexedDB(imageData, 'posts');



  let items = JSON.parse(localStorage.getItem("posts"));

  posts = [...items, post];

  localStorage.setItem("posts", JSON.stringify(posts));
});

const displayPost = () => {
  let addPostWrapper = document.getElementById("post__preview__wrapper");
  addPostWrapper.innerHTML = "";
  showPosts.forEach((showPost, key) => {
    addPostWrapper.insertAdjacentHTML(
      "beforeend",
      `
  <div class="post__preview pointer" data-id=${key} onclick="selectPost(${key})" >
  <div class="pin__image">
  <img src="./images/page_pin.svg" class="page__pin">
  </div>
  <div></div>
  <div class="post_preview_title">
    <div>
      ${showPost.title}
    </div>
    <div class= "close__icon__div">
      <img src="./images/close_icon.svg" class= "close__icon" data-id=${key} onclick="deletePost(${key})">
    </div>  
  </div>
  <div class="post__date">
  
${showPost.date}
  </div>
  
  <div class="post__preview__description" id="post__preview__description">
  ${showPost.description}
  
  </div>
  
  </div>
  `
    );
  });
};

displayPost();

const selectPost = (key) => {
  let fullDescription = document.getElementById("full__description");
  if (showPosts && showPosts[key]) {
    fullDescription.innerHTML = "";
    fullDescription.insertAdjacentHTML(
      "beforeend",
      `
  
  <span class="full__description__title">
  ${showPosts[key].title}
  </span>
  
  <span class="detailed__description example">
  ${showPosts[key].description}
  </span>
  `
    );
  } else {
    fullDescription.innerHTML = "";
  }
};

selectPost();

const fileInput = document.querySelector("#img-input");
const previewImage = document.querySelector(".image__preview");


var imageData;

fileInput.addEventListener("change", () => {

  const fr = new FileReader();

  fr.readAsDataURL(fileInput.files[0]);

  fr.addEventListener("load", () => {
    imageData = fr.result;
    console.log(imageData)
    // imageData = url

    const prevImg = document.getElementById("img-from-local-storage")
    prevImg.src = imageData;
  })
});



const deletePost = (key) => {
  showPosts = showPosts.filter((_item, index) => {
    return index !== key;
  });

  localStorage.setItem("posts", JSON.stringify(showPosts));
  displayPost();
};



const storePostInIndexedDB = (imageData) => {
  // Open the database
  const request = window.indexedDB.open("Images", 1);

  // Handle successful database open
  request.onsuccess = (event) => {
    const db = event.target.result;

    // Create a new transaction
    const transaction = db.transaction(['posts'], 'readwrite');

    // Get the object store
    const objectStore = transaction.objectStore('posts');

    // Add the base64 encoded image to the object store
    objectStore.add({ base64Image: imageData });

    // Commit the transaction
    transaction.oncomplete = () => {
      console.log("Transaction completed successfully");
      db.close();
    };

    transaction.onerror = (error) => {
      console.error("Transaction error:", error);
    };
  };

  // Handle errors when opening the database
  request.onerror = (error) => {
    console.error("Error opening database:", error);
  };

  // Handle the database creation or version change event
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create an object store with the name 'posts' if it doesn't exist
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
    }
  };
};
