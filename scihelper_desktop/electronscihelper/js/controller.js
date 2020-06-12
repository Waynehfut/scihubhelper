const ipcRenderer = require('electron').ipcRenderer;
function checkDOI(selections) {
    let pattens = new RegExp(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/g);
    let isDoi = pattens.test(selections);
    let doi = "";
    if (isDoi) {
        doi = selections.match(pattens);
    }
    return doi[0];
}

function getPdfUrl(postUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(this.responseText, "text/html");
            var pdfUrl = responseDoc.getElementById('pdf').src;
            savePdf(pdfUrl.split('#')[0]);
        }
    };

    xmlHttp.open("GET", postUrl, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xmlHttp.send();

}

function savePdf(pdfUrl) {
    var savedPathStr = document.getElementById('id_save_path').value;
    ipcRenderer.send('download_request', [pdfUrl, savedPathStr]); //Send to main.js
}


window.onload = function () {
    var searchText = document.getElementById('id_input_text');
    var searchBtn = document.getElementById('id_search_btn');
    var sciHubServer = document.getElementById('id_sever_path').value;
    var doiStr = '';
    searchText.addEventListener('input', (evt) => {
        doiStr = checkDOI(searchText.value);
        if (doiStr) {
            searchBtn.disabled = false;
        } else {
            searchBtn.disabled = true;
        }
    })
    searchBtn.addEventListener('click', function () {
        if (doiStr) {
            getPdfUrl(sciHubServer + doiStr);
        }
    });

}