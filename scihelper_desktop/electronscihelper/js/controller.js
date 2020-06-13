const ipcRenderer = require("electron").ipcRenderer;
const remote = require("electron").remote;
const { dialog } = require("electron").remote;
const app = remote.app;

function checkDOI(selections) {
  let pattens = new RegExp(
    /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/g
  );
  let isDoi = pattens.test(selections);
  let doi = "";
  if (isDoi) {
    doi = selections.match(pattens);
  }
  return doi[0];
}

function getScihubServerUrl() {
  var se = document.getElementById("id_sever_path");
  var sciHubServer = se.options[se.selectedIndex].value;
  return sciHubServer;
}

function getPdfUrl(postUrl) {
  console.log("postUrl", postUrl);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var parser = new DOMParser();
      var responseDoc = parser.parseFromString(this.responseText, "text/html");
      var pdfUrl = responseDoc.getElementById("pdf").src;
      savePdf(pdfUrl.split("#")[0]);
    }
  };

  xmlHttp.open("GET", postUrl, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send();
}

function savePdf(pdfUrl) {
  var savedPathStr = document.getElementById("id_save_path").value;
  ipcRenderer.send("download_request", [pdfUrl, savedPathStr]); //Send to main.js
}

window.onload = function () {
  var searchText = document.getElementById("id_input_text");
  var searchBtn = document.getElementById("id_search_btn");
  var fileBtn = document.getElementById("id_folder_btn");
  var filePath = this.document.getElementById("id_save_path");
  var serverBtn = document.getElementById("id_serve_btn");

  var doiStr = "";
  filePath.value = app.getPath("desktop");
  //input doi
  searchText.addEventListener("input", (evt) => {
    doiStr = checkDOI(searchText.value);
    if (doiStr) {
      searchBtn.disabled = false;
      searchBtn.className = "btn btn-success";
    } else {
      searchBtn.disabled = true;
      searchBtn.className = "btn btn-secondary";
    }
  });
  //get file
  searchBtn.addEventListener("click", function () {
    if (doiStr) {
      getPdfUrl(getScihubServerUrl() + doiStr);
    }
  });
  //set path
  fileBtn.addEventListener("click", function () {
    dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (result.canceled) {
          console.log(result.canceled);
        } else {
          console.log("hao:", result.filePaths);
          filePath.value = result.filePaths;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  //get scihub url
  serverBtn.addEventListener("click", function () {
    console.log("serveclick");
  });
};
