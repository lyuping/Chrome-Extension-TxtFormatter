/*
 * Copyright Yuping Lin 2015
 */

"use strict";

function LoadBasic(tab) {
    chrome.tabs.insertCSS(null, { file: 'style.css', "allFrames": true });
    chrome.tabs.executeScript(null, { file: "jquery-2.1.3.min.js" }, function () {
        chrome.tabs.executeScript(null, { file: "txtReader.js" });
    });
}

function SetCookies() {
    chrome.cookies.set({
        "name": "txtReader",
        "url": "http://127.0.0.1/",
        "value": "Dummy Data"
    }, function (cookie) {
        console.log(JSON.stringify(cookie));
        console.log(chrome.extension.lastError);
        console.log(chrome.runtime.lastError);
        debugger;
    });
}

chrome.browserAction.onClicked.addListener(LoadBasic);

chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
    if (isAllowedAccess) return; // Great, we've got access

    chrome.tabs.create({
        url: 'chrome://extensions/?id=' + chrome.runtime.id
    });
});