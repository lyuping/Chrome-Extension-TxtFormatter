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
    isPreBM: false,
    text: '',
    offset: 0,
    lang: 'TW',
    l10n: {
        msgTW: { noBM: '查無書籤紀錄', saved: '儲存書籤成功' },
        themeTW: [{ key: 'default', text: '-- 預設布景 --' }, { key: 'black', text: '黑色布景' }, { key: 'darkGray', text: '深灰布景' }, { key: 'gray', text: '灰色布景' }],
        fontFamilyTW: [{ key: '', text: '-- 預設字體 --' }, { key: 'SimSun', text: '新宋體' }, { key: 'Microsoft_YaHei', text: '微軟雅黑' }, { key: 'Microsoft_JhengHei', text: '微軟正黑' }],
        btnTW: { fontSize: '字體大小:', lineHeight: '行高:', btnOK: '設定', bookmark: '設定此頁為書籤', loadBookmark: '回到書籤記憶位置', toTop: '回頂部', lang: 'EN' },

        msgEN: { noBM: 'No bookmark found',saved: 'Set bookmark successd' },
        themeEN: [{ key: 'default', text: '-- Default Theme --' }, { key: 'black', text: 'Black' }, { key: 'darkGray', text: 'Dark Gray' }, { key: 'gray', text: 'Gray' }],
        fontFamilyEN: [{ key: '', text: '-- Default Font --' }, { key: 'SimSun', text: 'SimSun' }, { key: 'Microsoft_YaHei', text: 'Microsoft YaHei' }, { key: 'Microsoft_JhengHei', text: 'Microsoft JhengHei' }],
        btnEN: { fontSize: 'Font Size:', lineHeight: 'Line Height:', btnOK: 'Submit', bookmark: 'Set Bookmark', loadBookmark: 'Load Bookmark', toTop: 'To Top', lang: '中文' },

        theme: [],
        fontFamily: [],
        btnText: {},

        setLang: function () {
            config.lang = config.lang == 'TW' ? 'EN' : 'TW';
            this.theme = config.lang == 'TW' ? this.themeTW : this.themeEN;
            this.fontFamily = config.lang == 'TW' ? this.fontFamilyTW : this.fontFamilyEN;
            this.btnText = config.lang == 'TW' ? this.btnTW : this.btnEN;
        }
    },
}

var lib = {
    getDom: function (id) {
        return document.getElementById(id);
    },
    createDom: function (type) {
        return document.createElement(type);
    },
    createDropdown: function (id, data, onChangeFn) {
        var dp = this.createDom('select');
        dp.id = id;

        for (var i = 0; i < data.length; i++) {
            var option = this.createDom('option');
            option.value = data[i].key;
            option.text = data[i].text;
            dp.appendChild(option);
        }

        onChangeFn && (dp.onchange = function (e) {
            onChangeFn(e);
        });
        return dp;
    },
    createInput: function (id, inputAttrs, lblText, btnText, onClickEvt, onKeyDownEvt) {
        var span = this.createDom('span');
        var label = this.createDom('label')
        var input = this.createDom('input');
        var btn = this.createDom('button');
        input.id = id;
        input.type = 'text';
        for (var i = 0, al = inputAttrs.length; i < al; i++) {
            input.setAttribute(inputAttrs[i].name, inputAttrs[i].value);
        }

        label.id = id + 'Lbl';
        label.htmlFor = id;
        label.innerText = lblText;

        btn.id = id + 'Button';
        btn.innerHTML = btnText;

        onClickEvt && (btn.onclick = function (e) {
            onClickEvt(e);
        });

        onKeyDownEvt && (input.onkeyup = function (e) {
            onKeyDownEvt(e);
        });

        input.onkeydown = function (e) {
            if (e.keyCode == 13) {
                e.currentTarget.nextElementSibling.focus();
                e.currentTarget.nextElementSibling.click();
            }
        };

        span.appendChild(label);
        span.appendChild(input);
        span.appendChild(btn);
        return span;
    },
    createBtn: function (id, text, onClickFn) {
        var btn = this.createDom('button');
        btn.id = id;
        btn.innerText = text;
        btn.onclick = function (e) {
            onClickFn(e);
        }
        return btn;
    },
    jump: function (offset) {
        window.scrollTo(0, offset);
    },
    jumpDom: function (domId) {
        var top = document.getElementById(domId).offsetTop;
        window.scrollTo(0, top);
    },
    notice: function (text) {
        alert(text);
    },
    parseUrl: function () {
        var tmp = window.location.pathname.split('/');
        return tmp[tmp.length - 1].substring(0, 10);
    }
};

function setBookmark() {
    var point = window.scrollY;
    config.offset = point;
    chrome.runtime.sendMessage({ action: 'setBookmark', name: lib.parseUrl(), value: point });
    lib.notice(config.lang == 'TW' ? config.l10n.msgTW.saved : config.l10n.msgEN.saved);
}

function getBookmark() {
    var obj = {
        action: 'getBookmark', name: lib.parseUrl()
    };
    chrome.runtime.sendMessage(
        obj,
        function (response) {
        }
    );
}

function setFunc() {
    var func = lib.getDom('func');
    func.innerHTML = '';

    var queue = [];

    queue.push(lib.createDropdown('dpTheme', config.l10n.theme, function (e) {
        document.body.className = e.currentTarget.value;
    }));

    queue.push(lib.createDropdown('dpFontFamily', config.l10n.fontFamily, function (e) {
        document.body.style.fontFamily = lib.getDom('dpFontFamily').value.replace('_', ' ');
    }));

    queue.push(lib.createInput('tbFontSize'
        , [{ name: 'placeholder', value: ' px' }, { name: 'maxlength', value: '2' }, { name: 'value', value: '16' }]
        , config.l10n.btnText.fontSize
        , config.l10n.btnText.btnOK
        , function (e) {
            document.body.style.fontSize = lib.getDom('tbFontSize').value + 'px';
        }
    ));

    queue.push(lib.createInput('tbLineHeight'
        , [{ name: 'placeholder', value: ' em' }, { name: 'maxlength', value: '3' }, { name: 'value', value: '2' }]
        , config.l10n.btnText.lineHeight
        , config.l10n.btnText.btnOK
        , function (e) {
            document.body.style.lineHeight = lib.getDom('tbLineHeight').value + 'em';
        }, function (e) {
            var value = e.currentTarget.value;
            if (!value.match(/[0-9]+|\./)) {
                e.currentTarget.value = value.replace(value.slice(-1), "");
            }
        }
    ));

    queue.push(lib.createBtn('btnSetBM', config.l10n.btnText.bookmark
        , function (e) {
            setBookmark();
        }
    ));

    queue.push(lib.createBtn('btnGetBM', config.l10n.btnText.loadBookmark
        , function (e) {
            config.offset == 0 ? getBookmark() : lib.jump(config.offset);
        }
    ));

    queue.push(lib.createBtn('btnTop', config.l10n.btnText.toTop
        , function (e) {
            lib.jump(0);
        }
    ));

    queue.push(lib.createBtn('btnLang', config.l10n.btnText.lang
        , function (e) {
            config.l10n.setLang();
            setFunc();
        }
    ));

    for (var i = 0, q = queue.length; i < q; i++) {
        func.appendChild(queue[i]);
    }
}

function initFunc() {
    var base = document.createElement('div');
    base.id = 'base';
    var func = document.createElement('div');
    func.id = 'func';
    func.className = 'default';
    base.appendChild(func);

    document.body.insertBefore(base, lib.getDom('container'));

    setFunc();
}

function parseBookmark(kw) {
    var idx = kw ? config.text.indexOf(kw) : 0;
    if (idx != -1) {
        config.text = config.text.replace(kw, '<span id="bookmark">' + kw + '</span>');
    }
    return idx;
}

function txtFmt(txt) {
    txt = '<p>' + txt;
    txt = txt.replace(/楔子.*/g, '<h1>楔子</h1>');
    txt = txt.replace(/(第(.+)章.*)/g, '<h1>$1</h1>');
    txt = txt.replace(/(Chapter(\s+)?(\d+))/g, '<h1>$1</h1>');
    txt = txt.replace(/(?:\\[rn]|[\r\n]+)+/g, '</p><p>');

    if (txt.indexOf('<p></p>') == 0) {
        txt = txt.slice('<p></p>'.length);
    }

    return txt;
}

function wrapAndFmt(kw) {
    var offset = 0;
    var div, pre;
    pre = document.getElementsByTagName('pre')[0];
    div = lib.createDom('div');
    div.id = 'container';
    config.text = txtFmt(pre.innerHTML);
    offset = parseBookmark(kw);
    div.innerHTML = config.text;
    document.body.replaceChild(div, pre);
    lib.jump(offset);
}


function onCntMessageEvt(obj, sender, response) {
    if (config.isPreBM && config.offset == 0) {
        wrapAndFmt(obj.value);
        initFunc();
    } else if (!obj.value) {
        lib.notice(config.lang == 'TW' ? config.l10n.msgTW.noBM : config.l10n.msgEn.noBM);
    } else {
        config.offset = obj.value;
        lib.jump(obj.value);
    }
}

var init = function () {
    config.l10n.btnText = config.l10n.btnTW;
    config.l10n.theme = config.l10n.themeTW;
    config.l10n.fontFamily = config.l10n.fontFamilyTW;
    if (!document.getElementById('func')) {
        if (config.isPreBM) {
            getBookmark();
        } else {
            wrapAndFmt();
            initFunc();
            console.log('Load txt formatter success');
        }
    }
    chrome.runtime.onMessage.addListener(onCntMessageEvt);
}();


