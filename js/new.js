document.addEventListener("DOMContentLoaded", function () {
    function formatWithZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function startTime() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        m = formatWithZero(m);
        document.getElementById('time').innerHTML = h + ":" + m;
        document.getElementById('date').innerHTML = now.toDateString();
        var msg = document.getElementById('message');
        if (h < 12) {
            msg.innerHTML = 'Good morning!';
        }
        else if (h < 18) {
            msg.innerHTML = 'Good afternoon';
        }
        else {
            msg.innerHTML = 'Good evening';
        }
        t = setTimeout(function () {
            startTime()
        }, 1000);
    }
    startTime();
});