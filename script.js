/*  Project 01_11_02

    Author: Daniel Truong
    Date:   9.4.18

    Filename: script.js
*/

"use strict";
//Global Vars
var httpRequest = false;
var entry = "^IXIC";

function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    } catch (requestError) {
        return false;
    }
    alert(httpRequest);
    return httpRequest;
}

function stopSubmisson(evt) {
    alert("stopSubmission");
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}

function getQuote() {
    alert("getQuote");
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
    }
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", "StockCheck.php?t=" + entry, true);
    httpRequest.send(null);
    clearTimeout(updateQuote);
    var updateQuote = setTimeout('getQuote()', 10000);
}
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        var stockItems = stockResults.split(/,|\"/);
        for (let i = stockItems.length - 1; i >= 0; i--) {
            if (stockItems[i] === "") {
                stockItems.splice(i,1);
            }
        }
        document.getElementById("ticker").innerHTML = stockItems[0];

        document.getElementById("openingPrice").innerHTML = stockItems[6];
        document.getElementById("lastTrade").innerHTML = stockItems[1];
        document.getElementById("lastTradeDT").innerHTML = stockItems[2] + ", " + stockItems[3];
        document.getElementById("change").innerHTML = stockItems[4];
        document.getElementById("range").innerHTML = (stockItems[8] * 1).toFixed(2) + "&ndash;" + (stockItems[7] * 1).toFixed(2);
        document.getElementById("volume").innerHTML = (stockItems[9] * 1).toLocaleString();
    }
}

function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}
httpRequest.onreadystatechange = displayData;

//When the page loads the function getRequestObject would launch.
var form = document.getElementsByTagName("form")[0];
if (window.addEventListener) {
    form.addEventListener("submit", stopSubmisson, false);
    window.addEventListener("load", formatTable, false)
    window.addEventListener("load", getQuote, false);
} else {
    form.attachEvent("onsubmit", stopSubmisson);
    window.attachEvent("onload", formatTable)
    window.attachEvent("onload", getQuote);
}