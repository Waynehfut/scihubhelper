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
  var info = { url: pdfUrl, properties: { directory: savedPathStr } };
  ipcRenderer.send("download_request", info); //Send to main.js
}

window.onload = function () {
  var searchText = document.getElementById("id_input_text");
  var searchBtn = document.getElementById("id_search_btn");
  var fileBtn = document.getElementById("id_folder_btn");
  var filePath = this.document.getElementById("id_save_path");
  var serverBtn = document.getElementById("id_serve_btn");
  var processBar = this.document.getElementById("id_process_bar");
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
    var se = document.getElementById("id_sever_path");
    se.value = "https://sci-hub.tw/";
  });
  //handle download
  ipcRenderer.on("download_start", (event) => {
    console.log("download start");
    searchBtn.disabled = true;
    searchBtn.className = "btn btn-secondary";
  });

  ipcRenderer.on("download_progress", (event, process) => {
    const percent = process.percent;
    const transferredBytes = process.transferredBytes;
    const totalBytes = process.totalBytes;
    const valuenow = Math.floor(percent * 100);
    console.log(valuenow);
    processBar.innerHTML = valuenow + "%";
    processBar.style = "width: " + valuenow + "%";
    processBar.className =
      "progress-bar progress-bar-striped progress-bar-animated";
  });

  ipcRenderer.on("download_complete", (event, file) => {
    console.log("downloaded!");
    searchBtn.disabled = false;
    searchBtn.className = "btn btn-success";
    processBar.className = "progress-bar bg-success";
    processBar.innerHTML = "Saved in " + file;
  });
};
