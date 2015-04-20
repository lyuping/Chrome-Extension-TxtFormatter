/* 
 * Copyright Yuping Lin 2015
 * 
 */

"use strict";

function LoadBasic(tab) {
    chrome.tabs.insertCSS(null, { file: 'style.css', "allFrames": true });
    chrome.tabs.executeScript(null, { file: "txtReader.js" }, function () {

    });
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
    chrome.tabs.query({ active: true }, function (tabs) {
        //need to use chrome.tabs.sendMessage to send msg to content script 
        chrome.tabs.sendMessage(tabs[0].id, { name: 'cookieback', value: data }, function (response) {
            console.log('sendContentMessage callback');
        });
    });
    console.log('sendContentMessage push data: ' + data);
}

function onMessageEvt(message, sender, sendResponse) {
    if (message.name == 'cookie') {
        //cookies
        var value = 'test123';
        setCookie(value, function (data) {
            console.log('set cookie call back');
            getCookie(function (data) {
                console.log('get cookie call back');
                sendContentMessage(data.value);
            });
            return true;
        })

        sendResponse({ msg: 'background recevied and cookies setting done' });
    }
}

chrome.runtime.onMessage.addListener(onMessageEvt);