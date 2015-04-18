/*
 * Copyright Yuping Lin 2015
 */

'use strict';


var regexPtrn = {
    float: /[-+]?([0-9]*.[0-9]+|[0-9]+)/g,
    prologue: /楔子.*/g,
    chapter: /(第(.+)章.*)/g,
    chapter2: /(第(.?)百?(.?)十?(.)章)?(第$.?章$)?/g,
    br: /(?:\\[rn]|[\r\n]+)+/g
};

var dpData = {
    theme: [{ key: 'default', text: '-- 預設布景 --' }, { key: 'black', text: '黑色布景' }, { key: 'darkGray', text: '深灰布景' }, { key: 'gray', text: '灰色布景' }],
    fontFamily: [{ key: '', text: '-- 預設字體 --' }, { key: 'SimSun', text: '新宋體' }, { key: 'Microsoft_YaHei', text: '微軟雅黑' }, { key: 'Microsoft_JhengHei', text: '微軟正黑' }],
};

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
    createInput: function (id, inputAttrs, btnText, onClickEvt, onKeyDownEvt) {
        var span = this.createDom('span');
        var input = this.createDom('input');
        var btn = this.createDom('button');
        input.id = id;
        input.type = 'text';
        for (var i = 0, al = inputAttrs.length; i < al; i++) {
            input.setAttribute(inputAttrs[i].name, inputAttrs[i].value);
        }

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

        span.appendChild(input);
        span.appendChild(btn);
        return span;
    }
};


function initFunc() {
    //init
    var func = document.createElement('div');
    func.id = 'func';
    func.className = 'default';
    document.body.insertBefore(func, lib.getDom('container'));


    var queue = [];
    queue.push(lib.createDropdown('dpTheme', dpData.theme, function (e) {
        document.body.className = e.currentTarget.value;
    }));
    queue.push(lib.createDropdown('dpFontFamily', dpData.fontFamily, function (e) {
        document.body.style.fontFamily = lib.getDom('dpFontFamily').value.replace('_', ' ');
    }));

    queue.push(lib.createInput('tbFontSize'
        , [{ name: 'placeholder', value: ' px' }, { name: 'maxlength', value: '2' }, { name: 'value', value: '16' }]
        , '更改字體大小'
        , function (e) {
            document.body.style.fontSize = lib.getDom('tbFontSize').value + 'px';
        }
    ));

    queue.push(lib.createInput('tbLineHeight'
        , [{ name: 'placeholder', value: ' 倍' }, { name: 'maxlength', value: '3' }, { name: 'value', value: '2' }]
        , '更改行高'
        , function (e) {
            document.body.style.lineHeight = lib.getDom('tbLineHeight').value + 'em';
        }, function (e) {
            var value = e.currentTarget.value;
            if (!value.match(/[0-9]+|\./)) {
                e.currentTarget.value = value.replace(value.slice(-1), "");
            }
        }
    ));

    for (var i = 0, q = queue.length; i < q; i++) {
        func.appendChild(queue[i]);
    }
}

function txtFmt(text) {
    var rtn = '';
    rtn = text.replace(regexPtrn.prologue, '<h1>$1</h1>');
    rtn = text.replace(regexPtrn.chapter, '<h1>$1</h1>');
    rtn = text.replace(regexPtrn.br, '</p><p>');
    return rtn;
}

function wrapAndFmt() {
    var div, pre;
    pre = document.getElementsByTagName('pre')[0];
    div = lib.createDom('div');
    div.id = 'container';
    div.innerHTML = txtFmt(pre.innerHTML);
    document.body.replaceChild(div, pre);
}

var init = function () {
    if ($('#func').length < 1) {
        wrapAndFmt();
        initFunc();
        console.log('Load txt formatter success');
    }
}();