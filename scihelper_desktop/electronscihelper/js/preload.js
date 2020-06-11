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
console.log('hrr')