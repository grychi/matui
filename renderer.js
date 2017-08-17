var ById = function (id) {
    return document.getElementById(id);
};

var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');
var bookmarks = path.join(__dirname, 'bookmarks.json');

var Bookmark = function (id, url, faviconUrl, title) {
    this.id = id;
    this.url = url;
    this.icon = faviconUrl;
    this.title = title;
};

var currentZoom = 6;
var zooms = [25, 33, 50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250, 300];

Bookmark.prototype.ELEMENT = function () {
    var a_tag = document.createElement('a');
    a_tag.href = this.url;
    a_tag.className = 'link';
    a_tag.textContent = this.title;
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);
    return a_tag;
};

(function () {
    const remote = require('electron').remote;
    function init() {
        var minBtn = ById('min-btn'),
            maxBtn = ById('max-btn'),
            closeBtn = ById('close-btn'),
            menu = ById('menu'),
            back = ById('back'),
            protocol = ById('protocol'),
            omni = ById('url'),
            forward = ById('forward'),
            refresh = ById('refresh'),
            home = ById('home'),
            fave = ById('fave'),
            private = ById('private'),
            block = ById('block'),
            list = ById('list'),
            downloads = ById('downloads'),
            history = ById('history'),
            finder = ById('find'),
            printer = ById('print'),
            fullscreen = ById('fullscreen'),
            zoomIn = ById('zoom-in'),
            zoomOut = ById('zoom-out'),
            zoomShow = ById('zoom-level'),
            theme = ById('theme'),
            contCut = ById('cut'),
            contCopy = ById('copy'),
            contPaste = ById('paste'),
            dev = ById('console'),
            settings = ById('settings'),
            feedback = ById('feedback'),
            about = ById('about'),
            quit = ById('exit'),
            popup = ById('fave-popup'),
            view = ById('view');

        function toggleBrowserMenu() {
            var menu = document.getElementById("browser-menu");
            if (menu.style.display == "none") {
                menu.style.display = "block";
            }
            else {
                menu.style.display = "none";
            }
        }

        function reloadView() {
            view.reload();
        }
        function backView() {
            view.goBack();
        }
        function forwardView() {
            view.goForward();
        }

        function goHomeView() {
            view.loadURL('https://www.google.com/');
        }
        function printView() {
            view.print();
        }
        function zoomInView() {
            if (currentZoom < zooms.length - 1) {
                view.setZoomFactor(zooms[++currentZoom] / 100);
                updateZoom();
            }
        }
        function zoomOutView() {
            if (currentZoom > 0) {
                view.setZoomFactor(zooms[--currentZoom] / 100);
                updateZoom();
            }
        }
        function updateZoom() {
            var currentZoomLevel = "";
            currentZoomLevel += zooms[currentZoom];
            currentZoomLevel += "%";
            zoomShow.innerHTML = currentZoomLevel;
        }
        function contCutView() {
            view.cut();
        }
        function contCopyView() {
            view.copy();
        }
        function contPasteView() {
            view.pasteAndMatchStyle();
        }

        function updateURL(event) {
            var searchEngines = ['https://www.google.com/search?&q=', 'https://www.bing.com/search?q='];
            var searchAPI = ['https://api.bing.com/osjson.aspx?query='];
            if (event.keyCode === 13) {
                omni.blur();
                let val = omni.value.trim();
                let https = val.slice(0, 8).toLowerCase();
                let http = val.slice(0, 7).toLowerCase();
                if (https === 'https://' || http === 'http://') {
                    view.loadURL(val);
                }
                //todo: fix criterias
                else if (!val.includes('.') || val.includes(' ')) {
                    view.loadURL(searchEngines[0] + val);
                }
                else {
                    view.loadURL('http://' + val);
                }
            }
        }

        function addBookmark() {
            let url = view.src;
            let title = view.getTitle();
            favicon(url).then(function (fav) {
                let book = new Bookmark(uuid.v1(), url, fav, title);
                jsonfile.readFile(bookmarks, function (err, curr) {
                    curr.push(book);
                    jsonfile.writeFile(bookmarks, curr, function (err) {
                    })
                })
            })
        }
        function openPopUp(event) {
            let state = popup.getAttribute('data-state');
            if (state === 'closed') {
                popup.innerHTML = '';
                jsonfile.readFile(bookmarks, function (err, obj) {
                    if (obj.length !== 0) {
                        for (var i = 0; i < obj.length; i++) {
                            let url = obj[i].url;
                            let icon = obj[i].icon;
                            let id = obj[i].id;
                            let title = obj[i].title;
                            let bookmark = new Bookmark(id, url, icon, title);
                            let el = bookmark.ELEMENT();
                            popup.appendChild(el);
                        }
                    }
                    popup.style.display = 'block';
                    popup.setAttribute('data-state', 'open');
                });
            } else {
                popup.style.display = 'none';
                popup.setAttribute('data-state', 'closed');
            }
        }

        function handleUrl(event) {
            if (event.target.className === 'link') {
                event.preventDefault();
                view.loadURL(event.target.href);
            } else if (event.target.className === 'favicon') {
                event.preventDefault();
                view.loadURL(event.target.parentElement.href);
            }
        }

        function handleDevtools() {
            if (view.isDevToolsOpened()) {
                view.closeDevTools();
            } else {
                view.openDevTools();
            }
        }

        function updateNav(event) {
            omni.value = view.src;
        }

        minBtn.addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            window.minimize();
        });
        maxBtn.addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        });
        closeBtn.addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            window.close();
        });
        menu.addEventListener('click', toggleBrowserMenu);
        back.addEventListener('click', backView);
        omni.addEventListener('keydown', updateURL);
        forward.addEventListener('click', forwardView);
        refresh.addEventListener('click', reloadView);
        home.addEventListener('click', goHomeView);
        fave.addEventListener('click', addBookmark);
        list.addEventListener('click', openPopUp);
        printer.addEventListener('click', printView);
        zoomIn.addEventListener('click', zoomInView);
        zoomOut.addEventListener('click', zoomOutView);
        contCut.addEventListener('click', contCutView);
        contCopy.addEventListener('click', contCopyView);
        contPaste.addEventListener('click', contPasteView);
        dev.addEventListener('click', handleDevtools);
        quit.addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            window.close();
        });
        popup.addEventListener('click', handleUrl);
        view.addEventListener('did-finish-load', updateNav);
    };
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };
})();