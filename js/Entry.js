let menuBtn = document.querySelector("#menu__icon");

menuBtn.addEventListener("click", () => {
    document.getElementById("full__menu").style.display = "flex";

    window.onclick = function (event) {
        if (event.target == document.getElementById("full__menu")) {
            document.getElementById("full__menu").style.display = "none";
        }
    };
});


function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const postId = getQueryParam('id');
console.log("selected Post's ID:", postId);


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

getSelectedDataFromIndexedDB({ postId: postId }, (posts) => {
    if (posts && posts.length > postId) {
        const post = posts[postId];
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


        <span class="post__options" id="delete__option"}> 
            <img alt="delete_option" src="../images/delete__icon.svg" onclick="deletePost(${postId})">
        </span>
        `
        );
    } else {
        fullDescription.innerHTML = "";
    }
});

window.deletePost = (postId) => {

    // deletePostFromIndexedDB(postId);
    window.open("../html/yourEntry.html", "_self");
};








