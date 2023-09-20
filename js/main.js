
let posts = [];



var btn = document.querySelector("#add_icon_btn")
var postBtn = document.querySelector(".post__details__form");

function selectPost() {
  console.log("event", "HII");
}
btn.addEventListener("click", () => {
  var modal = document.querySelector("#add_post_modal");

  modal.style.display = "flex";

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
})




postBtn.addEventListener("submit", (event) => {
  event.preventDefault();
  const postData = new FormData(event.target);
  const post = [...postData].reduce((acc, cur) => {
    acc[cur[0]] = cur[1]
    return acc;
  }, { date: new Date() })




  if (showPost) {
    posts = [...showPost]
  } else {
    localStorage.setItem("posts", JSON.stringify([]))
  }
  let items = JSON.parse(localStorage.getItem("posts"))
  posts = [...items, post]
  localStorage.setItem("posts", JSON.stringify(posts))
});


const showPost = JSON.parse(localStorage.getItem("posts"));


let addPostWrapper = document.getElementById("post__preview__wrapper");

showPost.forEach((showPost, key) => {
  addPostWrapper.insertAdjacentHTML("beforeend", `
        <div class="post__preview" data-id=${key} onclick="selectPost" >
                <div class="pin__image">
                  <img src="./images/page_pin.svg" class="page__pin">
                </div>
                <div></div>
                <div class="post_preview_title">
                  ${showPost.title}
                </div>
                <div class="post__date">
                  July 2nd, 2022
                </div>

                <div class="post__preview__description">
                 ${showPost.description}
                </div>

              </div>
        `);
});


// let file = document.querySelector(".choose__file");

// file.addEventListener("change", (event) => {

//     const selectedFile = event.target.files[0];

//     console.log(selectedFile)

//     if (selectedFile) {
//         const reader = new FileReader();

//         reader.onload = (e) => {

//             console.log("D")

//             const imageDataUrl = e.target.result;

//         }
//     }
// })



