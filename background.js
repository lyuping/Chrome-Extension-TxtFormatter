/*
 * Copyright Yuping Lin 2015
 * 
 * todo: 
 * hook input focus on button
 * pin/unpin at top
 * bookmark(local cookies problem)
 * line-height allow float, need regex
 * chapter regex rule like (1) ¡]¤@¡^
 * title hight light
 * hight light background
 * (no need maybe) background/font color picker
 */

"use strict";

/* BACKGROUND */

function LoadBasic(tab) {
    chrome.tabs.insertCSS(null, { file: 'style.css', "allFrames": true });
    chrome.tabs.executeScript(null, { file: "txtReader.js" });
}

chrome.browserAction.onClicked.addListener(LoadBasic);