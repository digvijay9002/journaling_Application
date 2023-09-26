
let posts = [];
var btn = document.querySelector("#add_icon_btn");


let imageDiv = document.querySelector(".image__preview");

const customModal = document.querySelector('custom-modal');
const shadowRoot = customModal.shadowRoot;
const modal = shadowRoot.querySelector('.modal__background');

const openDatabase = () => {
  const request = window.indexedDB.open("Images", 1);

  // Handle the upgrade needed event
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create an object store with the name 'posts' if it doesn't exist
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
    }
  };

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const storePostInIndexedDB = async (imageData, title, description, date) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['posts'], 'readwrite');
    const objectStore = transaction.objectStore('posts');

    const getRequest = objectStore.openCursor(null, 'prev');

    getRequest.onsuccess = () => {
      const cursor = getRequest.result;
      const nextKey = cursor ? cursor.key + 1 : 0; // Calculate the next key

      // Add the base64 encoded image, title, and description with the next available key
      const requestAdd = objectStore.add({ id: nextKey, base64Image: imageData, title, description, date });

      // Handle the success of adding the post
      requestAdd.onsuccess = () => {
        console.log("Post added successfully with key:", nextKey);
      };

      // Commit the transaction
      transaction.oncomplete = () => {
        db.close();
      };

      transaction.onerror = (error) => {
        console.error("Transaction error:", error);
      };
    };
  } catch (error) {
    console.error("Error opening database:", error);
  }
};



window.selectPost = (key) => {
  getSelectedDataFromIndexedDB({ postId: key }, (posts) => {
    if (posts && posts.length > key) {
      const post = posts[key];
      fullDescription.innerHTML = "";
      fullDescription.insertAdjacentHTML(
        "beforeend",
        `
        <span class="full__description__title">
        ${post.title}
        </span>
        
        <span class="detailed__description example">
        ${post.description}
        </span>
        `
      );
    } else {
      fullDescription.innerHTML = "";
    }
  });
};

window.deletePost = (key) => {

  deletePostFromIndexedDB(key);
  displayPost();
};

const deletePostFromIndexedDB = (key) => {
  // Open the database
  const request = window.indexedDB.open("Images", 1);

  // Handle successful database open
  request.onsuccess = (event) => {
    const db = event.target.result;

    // Create a new transaction
    const transaction = db.transaction(['posts'], 'readwrite');

    // Get the object store
    const objectStore = transaction.objectStore('posts');

    // Delete the entry with the specified key
    const deleteRequest = objectStore.delete(key);

    // Handle the success of deleting the post
    deleteRequest.onsuccess = () => {
    };

    // Commit the transaction
    transaction.oncomplete = () => {
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
};


btn.addEventListener("click", () => {
  modal.style.display = "grid";
})
// Add a click event listener to the window to close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Add an event listener to the form itself to prevent it from closing when clicking inside it

const displayPost = () => {
  let addPostWrapper = document.getElementById("post__preview__wrapper");
  addPostWrapper.innerHTML = "";

  // Open the IndexedDB
  const request = window.indexedDB.open("Images", 1);

  request.onsuccess = (event) => {

    const db = event.target.result;
    const transaction = db.transaction(["posts"], "readonly");
    const objectStore = transaction.objectStore("posts");

    // Create a cursor to iterate through the object store
    const cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const key = cursor.key;
        const showPost = cursor.value;

        // Insert the post data into the HTML
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

        // Move to the next cursor item
        cursor.continue();
      }
    };

    cursorRequest.onerror = (error) => {
      console.error("Error iterating through IndexedDB:", error);
    };
  };

  request.onerror = (error) => {
    console.error("Error opening IndexedDB:", error);
  };
};

// Call the displayPost function to display data from IndexedDB
displayPost();


const getSelectedDataFromIndexedDB = (params, callback) => {
  const request = window.indexedDB.open("Images", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["posts"], "readonly");
    const objectStore = transaction.objectStore("posts");

    const getRequest = objectStore.getAll();

    getRequest.onsuccess = () => {
      const post = getRequest.result;
      if (post) {
        callback(post);
      } else {
        console.error("Data not found in IndexedDB");
      }
    };

    getRequest.onerror = (error) => {
      console.error("Error getting image data from IndexedDB:", error);
    };
  };

  request.onerror = (error) => {
    console.error("Error opening database:", error);
  };
};

let fullDescription = document.getElementById("full__description");



// Function to retrieve the image data from IndexedDB

const fileInput = shadowRoot.querySelector("#img-input");
const previewImage = document.querySelector(".image__preview");
const modal_content = shadowRoot.querySelector(".modal_content");
const add_post_modal = shadowRoot.querySelector(".add_post_modal")
var imageData;

fileInput.addEventListener("change", () => {

  const fr = new FileReader();

  fr.readAsDataURL(fileInput.files[0]);

  fr.addEventListener("load", () => {
    imageData = fr.result;


    const prevImg = shadowRoot.getElementById("img-from-local-storage")
    modal_content.classList.add("two_item_display");
    modal_content.classList.remove("modal_content");

    prevImg.classList.add("two_item_display");
    add_post_modal.classList.add("add_post_v2")

    prevImg.src = imageData;
  })
});

shadowRoot.addEventListener("formSubmit", (event) => {
  // Prevent the default form submission


  const formData = event.detail.formData;
  console.log("Form submission event listener triggered.");

  // Extract title and description from formData
  const title = formData.get("title");
  const description = formData.get("description");

  // Create a post object with additional data
  const post = {
    image: imageData,
    date: new Date().toLocaleDateString("en-us", {
      year: "numeric",
      day: "numeric",
      month: "short",
    }),
    title, // Use the extracted title
    description, // Use the extracted description
  };

  // Ensure that title and description are defined
  if (title && description) {
    const { date, title, description } = post;

    storePostInIndexedDB(imageData, title, description, date);
    modal.style.display = "none";
    displayPost();

  } else {
    console.error("Title or description is missing.");
  }
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




