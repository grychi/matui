document.addEventListener("DOMContentLoaded", function () {

});

function toggleBrowserMenu() {
    var menu = document.getElementById("browser-menu");
    if (menu.style.display == "none") {
        menu.style.display = "block";
    }
    else {
        menu.style.display = "none";
    }
}