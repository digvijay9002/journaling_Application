document.addEventListener("DOMContentLoaded", () => {
    let menuBtn = document.querySelector("#menu__icon");

    menuBtn.addEventListener("click", () => {
        document.getElementById("full__menu").style.display = "flex";

        window.onclick = function (event) {
            if (event.target == document.getElementById("full__menu")) {
                document.getElementById("full__menu").style.display = "none";
            }
        };
    })

    var imageData;
    var is_favourite = false;
    const fileInput = document.querySelector("#file-input");

    fileInput.addEventListener("change", () => {
        const fr = new FileReader();
        fr.readAsDataURL(fileInput.files[0]);
        fr.addEventListener("load", () => {
            imageData = fr.result;
        })
    });


    var postBtn = document.querySelector(".post__details__form");
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
        const { date, title, description } = post;
        storePostInIndexedDB(imageData, title, description, date, is_favourite);
    });

    const storePostInIndexedDB = (imageData, title, description, date, is_favourite) => {
        // Open the database
        const request = window.indexedDB.open("Images", 1);
        // Handle successful database open
        request.onsuccess = (event) => {
            const db = event.target.result;
            // Create a new transaction
            const transaction = db.transaction(['posts'], 'readwrite');
            // Get the object store
            const objectStore = transaction.objectStore('posts');
            // Get the current highest key in the object store
            const getRequest = objectStore.openCursor(null, 'prev');
            getRequest.onsuccess = () => {
                const cursor = getRequest.result;
                const nextKey = cursor ? cursor.key + 1 : 0; // Calculate the next key
                // Add the base64 encoded image, title, and description with the next available key
                const requestAdd = objectStore.add({ id: nextKey, base64Image: imageData, title, description, date, is_favourite });
                // Handle the success of adding the post
                requestAdd.onsuccess = (event) => {
                };
                // Commit the transaction
                transaction.oncomplete = () => {
                    db.close();
                };
                transaction.onerror = (error) => {
                    console.error("Transaction error:", error);
                };
            };
        };
        // Handle errors when opening the database
        request.onerror = (error) => {
            console.error("Error opening database:", error);
        };


    }

});