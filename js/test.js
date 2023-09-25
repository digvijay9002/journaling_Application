const btn = document.getElementById("submitBtn")
btn.addEventListener("click", function () {
    console.log("hello")
    event.preventDefault();
    var text = "lfdkghfgfdhgjfdgjsfdjkfds";
    var filename = "helloFile"
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename + ".txt");
});
