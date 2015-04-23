/**
 * TxtFormatter
 * A chrome extension for reading txt.
 * https://github.com/lyuping/Chrome-Extension-TxtFormatter
 *
 * Author: Yuping Lin 
 * Copyright (c) 2015
 **/

'use strict';

var config = {
    resp: null,
    name: 'txt-bookmark',
    url: 'http://www.google.com.tw/'
}

function LoadBasic(tab) {
    chrome.tabs.insertCSS(null, { file: 'style.css', 'allFrames': true });
    chrome.tabs.executeScript(null, { file: 'txtReader.js' }, function () {
        chrome.runtime.onMessage.addListener(onMessageBgEvt);
    });
}


function setCookie(name, value, callback) {
    chrome.cookies.set(
        {
            url: config.url,
            name: name, //config.name,
            value: value + '',
            domain: null
        }, function (cookies) {
            if(callback){
                callback(cookies);
            }
        }
    );
}

function getCookie(name) {
    chrome.cookies.get({
        url: config.url,
        name: name //config.name,
    },
    function (cookies) {
        console.log(cookies.value);
        chrome.tabs.query({ active: true }, function (tabs) {
            var obj = {
                value: cookies.value
            };
            chrome.tabs.sendMessage(tabs[0].id, obj, function (response) {
            });
        });

    });
}


function onMessageBgEvt(obj, sender, sendResponse) {
    if (obj.action == 'setBookmark') {
        sendResponse.tag = 'set';
        setCookie(obj.name, obj.value);
    }
    if (obj.action == 'getBookmark') {
        getCookie(obj.name);
    }
}

chrome.browserAction.onClicked.addListener(LoadBasic);
