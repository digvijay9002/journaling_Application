
document.addEventListener("DOMContentLoaded", () => {
    let menuBtn = document.querySelector("#menu__icon");

    menuBtn.addEventListener("click", () => {
        document.getElementById("full__menu").style.display = "flex";

        window.onclick = function (event) {
            if (event.target == document.getElementById("full__menu")) {
                document.getElementById("full__menu").style.display = "none";
            }
        };
    });


    const openDatabase = () => {
        const request = window.indexedDB.open("Images", 1);

        // Handle the upgrade needed event
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            console.log(db);
            console.log(!db.objectStoreNames.contains('posts'));
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



    /// Show data in indexpage

    const displayPost = async () => {

        const db = await openDatabase();
        const request = window.indexedDB.open("Images", 1);
        const indexTitle = document.getElementById("entry__title__container");
        const indexDate = document.getElementById("date__of__entry__container");

        if (!db.objectStoreNames.contains('posts')) {
            db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
        }

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

                    indexTitle.insertAdjacentHTML(
                        "beforeend",
                        `
            <div class="indexes__div" data-id=${key} >
                <div class="star__image">
                    <img src="${showPost.is_favourite ? '../images/star_filled.svg' : '../images/purple_star.svg'}" class="star__icon">
                 </div>
               <a href = "../html/Entry.html?id=${key}">
                <div class="showPost__title__style">
                  ${showPost.title}
                </div>
            </a>
            
             `);
                    indexDate.insertAdjacentHTML("beforeend", `
      
                  <div class="showPost__date__style" data-id=${key}>
                         ${showPost.date}
                 </div>               
                
             `);
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


    displayPost();

    document.addEventListener("click", (event) => {

        if (event.target.classList.contains("star__icon")) {
            // Get the parent div with the data-id attribute
            const parentDiv = event.target.closest(".indexes__div");
            if (parentDiv) {
                const postId = parentDiv.getAttribute("data-id");
                const isFavourite = !event.target.src.includes("star_filled.svg");

                // Update the is_favourite status in IndexedDB
                updateFavouriteStatus(postId, isFavourite);

                // Toggle the star__image src
                event.target.src = isFavourite ? "../images/star_filled.svg" : "../images/purple_star.svg";
            }
        }
    });
    const updateFavouriteStatus = (postId, isFavourite) => {
        const request = window.indexedDB.open("Images", 1);

        request.onsuccess = async (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["posts"], "readwrite");
            const objectStore = transaction.objectStore("posts");

            // Get the post by ID
            const getRequest = objectStore.get(Number(postId));

            getRequest.onsuccess = (event) => {
                const post = event.target.result;
                if (post) {
                    // Update the is_favourite status
                    post.is_favourite = isFavourite;

                    // Put the updated post back into the object store
                    const putRequest = objectStore.put(post);
                    putRequest.onsuccess = () => {
                        console.log(`Updated is_favourite status for post ${postId} to true`);
                    };
                }
            };
        };
    };



});
