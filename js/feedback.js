function getFormData() {
    var elements = document.getElementById("fbForm").elements;
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
        }
    }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function (k) {
        data[k] = elements[k].value;
    });
    return data;
}
function handleFormSubmit(event) {
    event.preventDefault();
    var data = getFormData();
    var url = event.target.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        document.getElementById('fbForm').style.display = 'none';
        document.getElementById('fbSent').style.display = 'block';
        return;
    };
    var encoded = Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
}
function loaded() {
    var form = document.getElementById('fbForm');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);