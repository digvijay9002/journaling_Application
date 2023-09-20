let posts = [];

var btn = document.querySelector("#add_icon_btn");
var postBtn = document.querySelector(".post__details__form");

btn.addEventListener("click", () => {
  var modal = document.querySelector("#add_post_modal");

  modal.style.display = "flex";

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
  // event.preventDefault();
  const postData = new FormData(event.target);

  const post = [...postData].reduce(
    (acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    },
    {
      date: new Date().toLocaleDateString("en-us", {
        year: "numeric",
        day: "numeric",
        month: "short",
      }),
    }
  );

  if (showPost) {
    posts = [...showPost];
  } else {
    localStorage.setItem("posts", JSON.stringify([]));
  }
  let items = JSON.parse(localStorage.getItem("posts"));
  posts = [...items, post];
  localStorage.setItem("posts", JSON.stringify(posts));
});

let showPost = JSON.parse(localStorage.getItem("posts"));

let addPostWrapper = document.getElementById("post__preview__wrapper");

showPost.forEach((showPost, key) => {
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

let fullDescription = document.getElementById("full__description");

function selectPost(key) {
  fullDescription.innerHTML = "";
  fullDescription.insertAdjacentHTML(
    "beforeend",
    `
  
  <span class="full__description__title">
  ${showPost[key].title}
  </span>
  
  <span class="detailed__description example">
  ${showPost[key].description}
  </span>
  `
  );
}


closeBtn = document.querySelector(".close__icon__div");

closeBtn.addEventListener("click", () => {


  console.log("You have Clicked Delete button")


})

function deletePost(key) {

  console.log("Full array:", showPost)
  console.log("delete this item:", key)


  showPost = showPost.filter((_item,index) => {
    console.log(showPost);
    return index !== key;



  })

  localStorage.setItem('posts', JSON.stringify(showPost));

  let showPost = JSON.parse(localStorage.getItem("posts"));




}