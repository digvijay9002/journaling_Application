



var btn = document.querySelector("#add_icon_btn")
var postBtn = document.querySelector(".post__details__form");


btn.addEventListener("click", () => {
    var modal = document.querySelector("#add_post_modal");

    modal.style.display = "flex";

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
})



const posts = [];

postBtn.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("events", event)
    const postData = new FormData(event.target);
    console.log(event.target)
    console.log("Yo", [...postData]);
    const post = [...postData].reduce((acc, cur) => {

        console.log(cur)
        acc[cur[0]] = cur[1]
        return acc;
    }, {})

    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts))
});


window.addEventListener("load", (event) => {

    if (localStorage.getItem("posts")) {
        console.log("All posts:", JSON.parse(localStorage.getItem("posts")))

    }
});


let file = document.querySelector(".choose__file");

file.addEventListener("change", (event) => {

    const selectedFile = event.target.files[0];

    console.log(selectedFile)

    if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {

            console.log("D")

            const imageDataUrl = e.target.result;

        }
    }
})



