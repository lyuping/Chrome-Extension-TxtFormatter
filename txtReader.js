/*
 * Copyright Yuping Lin 2015
 */

"use strict";

var themeDropdown = {
    target: $("<select id='dpTheme'></select>"),
    data: { "default": "-- 選擇布景 --", "black": "黑色布景", "darkGray": "深灰布景", "gray": "灰色布景" },
    getDropdownfunction: function () {
        for (var val in this.data) {
            $("<option />", { value: val, text: this.data[val] }).appendTo(this.target);
        }
        return this.target;
    },
    bindEvent: function () {
        this.target.on("change", function (evt) {
            $("body").prop("class", this.selectedOptions[0].value);
        });
    },
    init: function () {
        this.getDropdownfunction();
        this.bindEvent();
        return this.target;
    }
}

var fontDropdown = {
    target: $("<select id='dpFontFamily'></select>"),
    data: { "": "-- 預設字體 --", "SimSun": "新宋體", "Microsoft_YaHei": "微軟雅黑", "Microsoft_JhengHei": "微軟正黑" },
    getDropdownfunction: function () {
        for (var val in this.data) {
            $("<option />", { value: val, text: this.data[val] }).appendTo(this.target);
        }
        return this.target;
    },
    bindEvent: function () {
        this.target.on("change", function (evt) {
            var font = this.selectedOptions[0].value;
            font = font.replace("_", " ");
            $("body").css("font-family", font);
        });
    },
    init: function () {
        this.getDropdownfunction();
        this.bindEvent();
        return this.target;
    }
}

var fontSizeInput = {
    id: "FontSize",
    container: $("<span id='"+ this.id +"'></span>"),
    wrapUI: function () {
        //this.container.append("<label>更改字體大小</label>");
        this.container.append("<input type='text' id='tb" + this.id + "' placeholder=' px' maxlength='2' value='16' />");
        this.container.append("<button id='btn" + this.id + "'>更改字體大小</button>");
    },
    bindEvent: function () {
        this.container.on("click", "#btn" + this.id + "", function (evt) {
            //todo: regex
            var size = $("#tbFontSize").val();
            if (size && size > 0) {
                $("body").css("font-size", size + 'px');
            }
        });
    },
    init: function () {
        this.wrapUI();
        this.bindEvent();
        return this.container;
    }
}

var lineHeightInput = {
    id: "LineHeight",
    container: $("<span id='" + this.id + "'></span>"),
    wrapUI: function () {
        this.container.append("<input id='tb" + this.id + "' type='text' placeholder=' 倍' maxlength='1' value='2' />");
        this.container.append("<button id='btn" + this.id + "'>更改行高</button>");
    },
    bindEvent: function () {
        this.container.on("click", "#btn" + this.id, function (evt) {
            //todo: regex & float
            var size = $("#tbLineHeight").val();
            if (size && size > 0) {
                $("body").css("line-height", size + "em");
            }
        });
    },
    init: function () {
        this.wrapUI();
        this.bindEvent();
        return this.container;
    }
}

function initFunctionSet() {
    var func = $("<div id='func'></div>");
    func.append(themeDropdown.init());
    func.append(fontDropdown.init());
    func.append(fontSizeInput.init());
    func.append(lineHeightInput.init());

    $("body").prop("class", "default").prepend(func);
}

function txtFormatter() {
    var txt = $("pre").html();
    txt = txt.replace(/(第(.+)章.*)/g, "<h1>$1</h1>");
    txt = txt.replace(/楔子.*/, "<h1>楔子</h1>");
    txt = txt.replace(/(?:\\[rn]|[\r\n]+)+/g, "</p><p>");
    $("pre").replaceWith("<div id='container'><p>" + txt + "</p></div>");
}

var init = function () {
    if ($("#func").length < 1) {
        txtFormatter();
        initFunctionSet();
        console.log('load txt formatter success');
    }
}();