function checkDOI(selections) {
    let pattens = new RegExp(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/g);
    let selectStrings = String(selections);
    let isDoi = pattens.test(selectStrings);
    let doi = "";
    if (isDoi) {
        doi = selectStrings.match(pattens);
    }
    return doi[0];
}

var $sinaMiniBlogShare = function (eleShare, eleContainer) {
    var eleTitle = document.getElementsByTagName("title")[0];
    eleContainer = eleContainer || document;
    var funGetSelectTxt = function () {
        var txt = "";
        if (document.selection) {
            txt = document.selection.createRange().text;    // IE
        } else {
            txt = document.getSelection();
        }
        return checkDOI(txt);
    };
    eleContainer.onmouseup = function (e) {
        e = e || window.event;
        var txt = funGetSelectTxt(), sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var left = (e.clientX - 40 < 0) ? e.clientX + 40 : e.clientX, top = (e.clientY - 40 < 0) ? e.clientY + sh + 30 : e.clientY + sh - 40;
        if (txt) {
            eleShare.style.display = "inline";
            eleShare.style.left = left + "px";
            eleShare.style.top = top + "px";
        } else {
            eleShare.style.display = "none";
        }
    };
    eleShare.onclick = function () {
        var txt = funGetSelectTxt();
        if (txt) {
            window.open('http://sci-hub.tw/' + txt);
        }
    };
};

let div = document.createElement('button');
div.id = 'content';
div.className='img_find_div';
div.innerHTML = '<img id="scihubBtm" class="img_find_btn" title="Find On Scihub" src="https://raw.githubusercontent.com/Waynehfut/blog/master/source/assets/img/mysite.jpg"/>';
document.body.appendChild(div);
var eleImgShare = $sinaMiniBlogShare(document.getElementById("content"));