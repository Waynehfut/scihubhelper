let pattens = new RegExp(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/g);
let strs = String('eucom.2020.05.042 https://doi.org/10.1016/j.neucom.2020.042 https://doi.org/10.1016/j.neucom.2020.05.042')
let isdoi = pattens.test(strs)
console.log(isdoi)
var found = strs.match(pattens);
console.log("found", found);