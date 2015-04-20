/* 
 * Copyright Yuping Lin 2015
 * 
 */

"use strict";

function LoadBasic(tab) {
    chrome.tabs.insertCSS(null, { file: 'style.css', "allFrames": true });
    chrome.tabs.executeScript(null, { file: "txtReader.js" });
}

chrome.browserAction.onClicked.addListener(LoadBasic);

function setCookie(value, callback) {
    chrome.cookies.set(
        {
            url: 'http://www.google.com.tw/',
            name: 'bookmark',
            value: value,
            domain: null
        }, function (cookies) {
            callback(cookies);
        }
    );
}

function getCookie(callback) {
    chrome.cookies.get({
        url: 'http://www.google.com.tw/',
        name: 'bookmark',
    },
    function (cookies) {
        callback(cookies);
    });
}

function sendContentMessage(data) {
    console.log('sendContentMessage push data: ' + data);
    chrome.runtime.sendMessage({ name: 'cookieback', value: data }, function (response) {
        console.log('sendContentMessage callback');
    });
}

function onMessageEvt(message, sender, sendResponse) {
    if (message.name == 'cookie') {
        //cookies
        setCookie('test123', function (data) {
            console.log('set cookie call back');
            getCookie(function (data) {
                //data.value; 
                console.log('get cookie call back');
                sendContentMessage(data.value);
            });
        })

        sendResponse({ msg: 'background recevied and cookies setting done' });
    }
}

chrome.runtime.onMessage.addListener(onMessageEvt);