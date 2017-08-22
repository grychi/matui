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

//needs to load from user setings
var currentZoom = 6;
var zooms = [25, 33, 50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250, 300];

var currentView;

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
            tabs = ById('tabs'),
            newTab = ById('newTab'),
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
            zoomIn = ById('zoom-in'),
            zoomOut = ById('zoom-out'),
            zoomShow = ById('zoom-level'),
            fullscreen = ById('fullscreen'),
            pinner = ById('pinned'),
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
            views = ById('views'),
            view = ById(currentView);

        function updateCurrentView() {
            view = ById(currentView);
            updateNav();
        }
        function newView(how) {
            var allViews = document.getElementsByTagName('webview');
            for (var i = 0; i < allViews.length; i++) {
                allViews[i].style.visibility = "hidden";
            }
            //or other pages
            if (typeof how != 'string') {
                how = 'file:///' + __dirname + '/pages/new.html';
            }
            //Might need to change
            var newViewID = uuid.v4();
            var newViewHTML = '<webview id="view-' + newViewID + '" class="page" src="' + how + '" useragent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 matui/1.0.0" autosize="on"></webview>';
            var newTabHTML = `
            <div id="tab-` + newViewID + `" class="oneTab">
                <i class="material-icons">note</i>
                <div id="` + newViewID + `"class="closeTab"></div>
            </div>`;
            views.insertAdjacentHTML('beforeend', newViewHTML);
            tabs.insertAdjacentHTML('beforeend', newTabHTML);
            currentView = 'view-' + newViewID;
            document.getElementById(newViewID).addEventListener('click', function (e) {
                var removeView = document.getElementById('view-' + newViewID);
                views.removeChild(removeView);
                var removeTab = document.getElementById('tab-' + newViewID);
                tabs.removeChild(removeTab);
            });
            updateCurrentView();
        }
        function activeTab(n) {
            console.log("set active tab");
        }

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
        //needs to change
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
            //should change to json file
            var searchEngines = ['https://www.google.com/search?&q=', 'https://www.bing.com/search?q=', 'https://www.ecosia.org/search?q=', 'https://duckduckgo.com/?q=', 'http://www.wolframalpha.com/input/?i=', 'https://search.aol.com/aol/search?q='];
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
            });
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

        function toggleTheme(e) {
            let state = theme.getAttribute('data-state');
            if (state === 'light') {
                theme.innerHTML = '<i class="material-icons">brightness_2</i> <div class="menu-description">Dark theme</div>';
                document.body.className += "dark-theme";
                theme.setAttribute('data-state', 'dark');
            } else {
                theme.innerHTML = '<i class="material-icons">brightness_5</i> <div class="menu-description">Light theme</div>';
                document.body.className = "";
                theme.setAttribute('data-state', 'light');
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
            var matuiDir = 'file:///' + __dirname + '/pages/';
            matuiDir = matuiDir.split('\\').join('/');
            if (view.src.includes(matuiDir)) {
                omni.value = 'matui://' + view.src.substring(matuiDir.length, view.src.length - 5);
            }
            else {
                omni.value = view.src;
            }
        }
        //load from user settings
        newView("https://www.google.com/");
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
        newTab.addEventListener('click', newView);
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
        pinner.addEventListener('click', function (e) {
            const window = remote.getCurrentWindow();
            let state = pinner.getAttribute('data-state');
            if (state === 'notPinned') {
                pinner.innerHTML = '<i class="material-icons">radio_button_checked</i> <div class="menu-description">Unpin browser</div>';
                window.setAlwaysOnTop(true);
                pinner.setAttribute('data-state', 'isPinned');
            } else {
                pinner.innerHTML = '<i class="material-icons">radio_button_unchecked</i> <div class="menu-description">Pin browser</div>';
                window.setAlwaysOnTop(false);
                pinner.setAttribute('data-state', 'notPinned');
            }
        });
        theme.addEventListener('click', toggleTheme);
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