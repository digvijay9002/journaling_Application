
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
                    console.log(showPost)
                    // Insert the post data into the HTML

                    indexTitle.insertAdjacentHTML(
                        "beforeend",
                        `
            <div class="indexes__div" data-id=${key} >
                <div class="star__image">
                    <img src="../images/purple_star.svg" class="star__icon">
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
});
