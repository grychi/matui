var screenshots = ["screenshot.png", "screenshot2.png", "screenshot3.png"];
var currentSlide = -1;
var slideTimer = setTimeout(autoSlide, 5000);

$('document').ready(function () {
    $("#footAbout").hover(function () {
        $("#footText").html("About");
    },
        function () {
            clearFootText();
        });
    $("#footReleases").hover(function () {
        $("#footText").html("Downloads");
    },
        function () {
            clearFootText();
        });
    $("#footTerms").hover(function () {
        $("#footText").html("Terms");
    },
        function () {
            clearFootText();
        });
    $("#footGithub").hover(function () {
        $("#footText").html("Github");
    },
        function () {
            clearFootText();
        });

    $('#leftArr').click(function () {
        $('#presenting').css("background-image", "url('" + screenshots[Math.abs(--currentSlide % 3)] + "')");
    });
    $('#rightArr').click(function () {
        nextSlide();
    });
    autoSlide();
});
function clearFootText() {
    $("#footText").html("");
    slideTimer = setTimeout(autoSlide, 5000);
}
function nextSlide() {
    $('#presenting').css("background-image", "url('" + screenshots[Math.abs(++currentSlide % 3)] + "')");
    slideTimer = setTimeout(autoSlide, 5000);
}
function autoSlide() {
    nextSlide();
    slideTimer = setTimeout(autoSlide, 5000);
}
