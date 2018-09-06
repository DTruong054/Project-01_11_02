/*  Project 01_11_02

    Author: Daniel Truong
    Date: 8.31.18  

    Filename: script.js
*/

"use strict";

// Global Variable
var httpRequest = false;
var entry = "MSFT";

// Create XHR and request an object
function getRequestedObject() {
    try {
        httpRequest = new XMLHttpRequest();
    } catch (requestError) {
        return false;
    }
    return httpRequest;
}

// Stop default submission
function stopSubmission(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    // Calls getQuote
    getQuote();
}

// Request stop data
function getQuote() {
    // console.log("getQuote()");
    if (document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
    } else {
        document.getElementsByTagName("input")[0].value = entry;
    }
    if (!httpRequest) {
        httpRequest = getRequestedObject();
    }
    // Generate the ajax request
    httpRequest.abort();
    httpRequest.open("get", "StockCheck.php?t=" + entry, true);
    httpRequest.send(null);
    httpRequest.onreadystatechange = displayData;
    clearTimeout(updateQuote);
    var updateQuote = setTimeout('getQuote()', 10000);
}

// Retrieve data and show it
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        var stockItems = JSON.parse(stockResults);
        console.log(stockItems);
        // Displays stock symbols
        document.getElementById("ticker").innerHTML = stockItems.symbol;
        document.getElementById("openingPrice").innerHTML = stockItems.open;
        document.getElementById("lastTrade").innerHTML = stockItems.latestPrice;
        var date = new Date(stockItems.latestUpdate);
        document.getElementById("lastTradeDT").innerHTML = date.toDateString() + "<br>" + date.toLocaleTimeString();
        document.getElementById("change").innerHTML = (stockItems.latestPrice - stockItems.open).toFixed(2);
        document.getElementById("range").innerHTML = "Low " + (stockItems.low * 1).toFixed(2) + "<br>High " + (stockItems.high * 1).toFixed(2);
        document.getElementById("volume").innerHTML = (stockItems.latestVolume * 1).toLocaleString();
    }
}

// Get style in stock data
function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}

// Event handlers
var form = document.getElementsByTagName("form")[0];
if (form.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", formatTable, false);
    window.addEventListener("load", getQuote, false);
} else if (form.attachEvent) {
    form.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", formatTable);
    window.attachEvent("onload", getQuote);
}