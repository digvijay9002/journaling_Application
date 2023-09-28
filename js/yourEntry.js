let menuBtn = document.querySelector("#menu__icon");

menuBtn.addEventListener("click", () => {
    document.getElementById("full__menu").style.display = "flex";

    window.onclick = function (event) {
        if (event.target == document.getElementById("full__menu")) {
            document.getElementById("full__menu").style.display = "none";
        }
    };
});
