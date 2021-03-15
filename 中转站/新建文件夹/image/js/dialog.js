/**
 * dialog  v2.0.0
 * @date  2016-10-12
 * @author 方雨_Yu
 * @home  https://github.com/sufangyu/dialog2
 * @bugs  https://github.com/sufangyu/dialog2/issues
 * Licensed under MIT
 */
/**
 * @TODO:
 */
; (function ($, window, document, undefined) {
    'use strict';

    var Dialog = (function () {

        /**
         * 弹窗构造函�?
         * @param {dom obj}   element   调用对象 
         * @param {json obj}  options   弹窗配置�?
         */
        function Dialog(element, options) {
            this.$element = $(element);
            this.settings = $.extend({}, $.fn.dialog.defaults, options);
        }

        // 使用 prototype 挂载通用方法，接省每次实例化对象的方法占用�?
        Dialog.prototype = {
            /**
             * 初始化弹�?
             */
            _init: function () {
                var self = this;

                clearTimeout(self.autoCloseTimer);

                self.isHided = false;                   // 是否已经隐藏
                self.tapBug = self._hasTapBug();        // 是否有点�? BUG
                self.platform = mobileUtil.platform;    // 访问设备平台
                self.dislogStyle = self.settings.style === 'default' ? self.platform : self.settings.style;    // 弹窗风格, 默认自动判断平台; 否则, 为指定平�?

                self._renderDOM();
                self._bindEvents();
            },

            /**
             * 渲染弹窗 DOM 结构
             */
            _renderDOM: function () {
                var self = this;

                self.settings.onBeforeShow();
                self._createDialogDOM(self.settings.type);
                self.settings.onShow();
            },

            /**
             * 绑定弹窗相关事件
             */
            _bindEvents: function () {
                var self = this;

                // 确定按钮关闭弹窗
                self.$confirmBtn.on(mobileUtil.tapEvent, function (ev) {
                    self.closeDialog();
                    self.settings.onClickConfirmBtn();
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 取消按钮关闭弹窗
                self.$cancelBtn.on(mobileUtil.tapEvent, function (ev) {
                    self.closeDialog();
                    self.settings.onClickCancelBtn();
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 关闭按钮关闭弹窗
                self.$closeBtn.on(mobileUtil.tapEvent, function (ev) {
                    self.closeDialog();
                    self.settings.onClickCloseBtn();
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 遮罩层关闭弹�?
                if (self.settings.overlayClose) {
                    $(document).on(mobileUtil.tapEvent, '.dialog-overlay', function (ev) {
                        self.closeDialog();
                    });
                }

                // 自动关闭弹窗
                if (self.settings.autoClose > 0) {
                    console.log(self.settings.autoClose / 1000 + '秒后, 自动关闭弹窗');
                    self._autoClose();
                }

                // 删除弹窗�? tap 点�? BUG 遮罩�?, 在隐藏弹窗的动画结束后执�?
                $(document).on('webkitAnimationEnd MSAnimationEnd animationend', '.dialog-content', function () {
                    if (self.isHided) {
                        self.removeDialog();

                        if (self.tapBug) {
                            self._removeTapOverlayer();
                        }
                    }
                });

                // 为自定义按钮组绑定回调函�?
                if (self.settings.buttons.length) {
                    $.each(self.settings.buttons, function (index, item) {
                        self.$dialogContentFt.children('button').eq(index).on(mobileUtil.tapEvent, function (ev) {
                            self.closeDialog();
                            item.callback();
                            ev.preventDefault();
                        });
                    });
                }

                // 如果弹窗有最大高度设置项, 在窗口大小改变时, 重新设置弹窗最大高�?
                $(window).on("onorientationchange" in window ? "orientationchange" : "resize", function () {
                    if (self.settings.contentScroll) {
                        setTimeout(function () {
                            self._resetDialog();
                        }, 200);
                    }
                });


                // 阻止 body 内容滑动
                $(document).on('touchmove', function (e) {
                    if (self.$dialog.find($(e.target)).length) {
                        return false;
                    } else {
                        return true;
                    }
                });

                // 弹窗有最大高度设置项, 设置提示内容滑动
                if (self.settings.contentScroll) {
                    self._contentScrollEvent();
                }


                // 安卓风格的点击水波纹
                if (self.dislogStyle === 'android') {
                    $('.dialog-content-ft > .dialog-btn').ripple();
                }

            },

            /**
             * 根据弹窗类型, 创建弹窗 DOM 结构
             * @param {string}  dialogType   弹窗类型
             */
            _createDialogDOM: function (dialogType) {
                var self = this;

                self.$dialog = $('<div class="dialog dialog-open ' + self.settings.dialogClass + '" data-style="' + self.dislogStyle + '"></div>');
                self.$dialogOverlay = $('<div class="dialog-overlay"></div>');
                self.$dialogContent = $('<div class="dialog-content"></div>');
                self.$dialogTitle = $('<div class="dialog-content-hd"><h3 class="dialog-content-title">' + self.settings.titleText + '</h3></div>');
                self.$dialogContentFt = $('<div class="dialog-content-ft"></div>');
                self.$dialogContentBd = $('<div class="dialog-content-bd"></div>');
                self.$closeBtn = $('<div class="dialog-btn-close"><span>close</span></div>');
                self.$confirmBtn = $('<button class="dialog-btn dialog-btn-confirm ' + self.settings.buttonClassConfirm + '">' + self.settings.buttonTextConfirm + '</button>');
                self.$cancelBtn = $('<button class="dialog-btn dialog-btn-cancel ' + self.settings.buttonClassCancel + '">' + self.settings.buttonTextCancel + '</button>');

                switch (dialogType) {
                    case 'alert':
                        // 添加 alert 类型弹窗标识
                        self.$dialog.addClass('dialog-modal');

                        // 显示遮罩�?
                        if (self.settings.overlayShow) {
                            self.$dialog.append(self.$dialogOverlay);
                        }
                        // 显示标题
                        if (self.settings.titleShow) {
                            self.$dialogContent.append(self.$dialogTitle);
                        }
                        // 显示关闭按钮
                        if (self.settings.closeBtnShow) {
                            self.$dialogTitle.append(self.$closeBtn);
                        }

                        self.$dialogContentBd.html(self.settings.content);
                        self.$dialogContentFt.append(self.$confirmBtn);
                        self.$dialogContent.append(self.$dialogContentBd).append(self.$dialogContentFt);
                        self.$dialog.append(self.$dialogContent);
                        $('body').append(self.$dialog);

                        // 设置弹窗提示内容最大高�?
                        if (self.settings.contentScroll) {
                            self._setDialogContentHeight();
                        }

                        break;
                    case 'confirm':
                        // 添加 confirm 类型弹窗标识
                        self.$dialog.addClass('dialog-modal');

                        // 显示遮罩�?
                        if (self.settings.overlayShow) {
                            self.$dialog.append(self.$dialogOverlay);
                        }
                        // 显示标题
                        if (self.settings.titleShow) {
                            self.$dialogContent.append(self.$dialogTitle);
                        }
                        // 显示关闭按钮
                        if (self.settings.closeBtnShow) {
                            self.$dialogTitle.append(self.$closeBtn);
                        }

                        // 按钮: 如果有设置自定义按钮�?, 则用自定义按钮组; 否则用默认的"确定"�?"取消"按钮
                        if (self.settings.buttons.length) {
                            var buttonGroupHtml = '';
                            $.each(self.settings.buttons, function (index, item) {
                                buttonGroupHtml += '<button class="dialog-btn ' + item.class + '">' + item.name + '</button>';

                            });
                            self.$dialogContentFt.append(buttonGroupHtml).addClass(self.settings.buttonStyle);
                        } else {
                            self.$dialogContentFt.append(self.$cancelBtn).append(self.$confirmBtn).addClass(self.settings.buttonStyle);
                        }

                        self.$dialogContentBd.html(self.settings.content);
                        self.$dialogContent.append(self.$dialogContentBd).append(self.$dialogContentFt);
                        self.$dialog.append(self.$dialogContent);
                        $('body').append(self.$dialog);

                        // 设置弹窗提示内容最大高�?
                        if (self.settings.contentScroll) {
                            self._setDialogContentHeight();
                        }

                        break;
                    case 'toast':
                        // 添加 toast 类型弹窗标识
                        self.$dialog.addClass('dialog-toast');

                        // 显示遮罩�?
                        if (self.settings.overlayShow) {
                            self.$dialog.append(self.$dialogOverlay);
                        }

                        // 弹窗内容 HTML, 默认�? content; 如果设置 icon �? text, 则覆�? content 的设�?
                        var toastContentHtml = $(self.settings.content);

                        if (self.settings.infoIcon !== '' && self.settings.infoText !== '') {
                            toastContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" /><span class="info-text">' + self.settings.infoText + '</span>');
                        } else if (self.settings.infoIcon === '' && self.settings.infoText !== '') {
                            toastContentHtml = $('<span class="info-text">' + self.settings.infoText + '</span>');
                        } else if (self.settings.infoIcon !== '' && self.settings.infoText === '') {
                            toastContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" />');
                        }

                        self.$dialogContentBd.append(toastContentHtml);
                        self.$dialogContent.append(self.$dialogContentBd);
                        self.$dialog.append(self.$dialogContent);
                        $('body').append(self.$dialog);

                        break;
                    case 'notice':
                        // 添加 toast 类型弹窗标识
                        self.$dialog.addClass('dialog-notice');

                        // 底部显示�? toast
                        if (self.settings.position === 'bottom') {
                            self.$dialog.addClass('dialog-notice-bottom');
                        }

                        // 显示遮罩�?
                        if (self.settings.overlayShow) {
                            self.$dialog.append(self.$dialogOverlay);
                        }

                        // 弹窗内容 HTML, 默认�? content; 如果设置 icon �? text, 则覆�? content 的设�?
                        var noticeContentHtml = $(self.settings.content);

                        if (self.settings.infoIcon !== '' && self.settings.infoText !== '') {
                            noticeContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" /><span class="info-text">' + self.settings.infoText + '</span>');
                        } else if (self.settings.infoIcon === '' && self.settings.infoText !== '') {
                            noticeContentHtml = $('<span class="info-text">' + self.settings.infoText + '</span>');
                        } else if (self.settings.infoIcon !== '' && self.settings.infoText === '') {
                            noticeContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" />');
                        }

                        self.$dialogContentBd.append(noticeContentHtml);
                        self.$dialogContent.append(self.$dialogContentBd);
                        self.$dialog.append(self.$dialogContent);
                        $('body').append(self.$dialog);

                        break;
                    default:
                        console.log('running default');
                        break;
                }
            },

            /**
             * 设置弹窗内容最大高�?
             * 延迟执行, 避免获取相关尺寸不正�?
             */
            _setDialogContentHeight: function () {
                var self = this;

                setTimeout(function () {
                    var dialogDefaultContentHeight = self.$dialogContentBd.height();
                    var dialogContentMaxHeight = self._getDialogContentMaxHeight();

                    self.$dialogContentBd.css({
                        'max-height': dialogContentMaxHeight,
                    }).addClass('content-scroll');

                    // 提示内容大于最大高度时, 添加底部按钮顶部边框线标�? class; 反之, 删除
                    if (dialogDefaultContentHeight > dialogContentMaxHeight) {
                        self.$dialogContentFt.addClass('dialog-content-ft-border');
                    } else {
                        self.$dialogContentFt.removeClass('dialog-content-ft-border');
                    }

                }, 80);
            },

            /**
             * 获取弹窗内容最大高�?
             * @return height
             */
            _getDialogContentMaxHeight: function () {
                var self = this;
                var winHeight = $(window).height(),
                    dialogContentHdHeight = self.$dialogTitle.height(),
                    dialogContentFtHeight = self.$dialogContentFt.height(),
                    dialogContentBdHeight = winHeight - dialogContentHdHeight - dialogContentFtHeight - 60;

                // 最大高度取偶数
                dialogContentBdHeight = dialogContentBdHeight % 2 === 0 ? dialogContentBdHeight : dialogContentBdHeight - 1;
                return dialogContentBdHeight;
            },

            /**
             * 重置弹窗, 在窗口大小发生变化时触发 
             */
            _resetDialog: function () {
                var self = this;
                self._setDialogContentHeight();
            },

            /**
             * 有最大高度弹窗的提示内容滑动
             */
            _contentScrollEvent: function () {
                var self = this;

                var isTouchDown = false;
                // 初始位置
                var position = {
                    x: 0,
                    y: 0,
                    top: 0,
                    left: 0
                };

                // 监听滑动相关事件
                $(document)
                    .on('touchstart mousedown', '.content-scroll', function (ev) {
                        var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                        isTouchDown = true;
                        position.x = touch.clientX;
                        position.y = touch.clientY;
                        position.top = $(this).scrollTop();
                        position.left = $(this).scrollLeft();
                        return false;
                    })
                    .on('touchmove mousemove', '.content-scroll', function (ev) {
                        var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                        if (!isTouchDown) {
                            // 未按�?
                            return false;
                        } else {
                            // 要滑动的距离 = 已经滑动的距�? - (当前坐标 - 按下坐标)
                            var moveTop = position.top - (touch.clientY - position.y);
                            var moveLeft = position.left - (touch.clientX - position.x);

                            $(this).scrollTop(moveTop).scrollLeft(moveLeft);
                        }
                    })
                    .on('touchend mouseup', '.content-scroll', function (ev) {
                        ev.preventDefault();
                        isTouchDown = false;
                    });

            },

            /**
             * 自动关闭弹窗
             */
            _autoClose: function () {
                var self = this;

                self.autoCloseTimer = setTimeout(function () {
                    self.closeDialog();
                }, self.settings.autoClose);
            },

            /**
             * 关闭弹窗
             */
            closeDialog: function () {
                var self = this;

                self.isHided = true;
                self.settings.onBeforeClosed();
                self.$dialog.addClass('dialog-close').removeClass('dialog-open');

                if (self.tapBug) {
                    self._appendTapOverlayer();
                }
            },

            /**
             * 删除弹窗
             * @public method
             */
            removeDialog: function () {
                var self = this;

                self.$dialog.remove();
                self.isHided = false;
                self.settings.onClosed();
                // 重新初始化默认配�?
                self.settings = $.fn.dialog.defaults;
            },

            /**
             * 更改 toast �? notice 类型弹窗内容 
             * @public method
             * @param {string}  content          弹窗内容, 可以是HTML
             * @param {string}  infoIcon         弹窗提示图标
             * @param {string}  infoText         弹窗提示文字
             * @param {int}     autoClose        自动关闭的延迟时�?
             * @param {fn}      onBeforeClosed   关闭前回调函�?
             * @param {fn}      onClosed         关闭后回调函�?
             */
            update: function (settings) {
                var self = this;

                clearTimeout(self.autoCloseTimer);

                // 设置默认值，并且指向给对象的默认�?
                self.settings = $.extend({}, $.fn.dialog.defaults, settings);

                // 通过 content 更改弹窗内容
                if (self.settings.content !== '') {
                    self.$dialogContentBd.html(self.settings.content);
                }

                // 通过设置 infoIcon �? infoText 更改弹窗内容, 会覆�? content 的设�?
                var $infoIcon = self.$dialogContentBd.find('.info-icon');
                var $infoText = self.$dialogContentBd.find('.info-text');
                $infoIcon.attr({ 'src': self.settings.infoIcon });
                $infoText.html(self.settings.infoText);

                // 重新为更改后�? DOM 元素绑定事件
                self._bindEvents();
            },

            /**
             * 是否有点�? BUG
             * 条件: 安卓手机并且版本号小�?4.4
             * @return Boolean
             */
            _hasTapBug: function () {
                return mobileUtil.isAndroid && (mobileUtil.version < 4.4);
            },

            /**
             * 添加点透遮罩层, 解决点�? BUG
             */
            _appendTapOverlayer: function () {
                var self = this;

                self.$tapBugOverlayer = $('.solve-tap-bug');

                if (!self.$tapBugOverlayer.length) {
                    self.$tapBugOverlayer = $('<div class="solve-tap-bug" style="margin:0;padding:0;border:0;background:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;height:100%;position:fixed;top:0;left:0;"></div>');
                    $('body').append(self.$tapBugOverlayer);
                }
            },

            /**
             * 删除点透遮罩层, 延迟执行的时间大于移动端�? click 触发时间
             */
            _removeTapOverlayer: function () {
                var self = this;

                setTimeout(function () {
                    self.$tapBugOverlayer.remove();
                }, 350);
            }
        };

        return Dialog;
    })();

    /**----------------------------
     *  私有方法
     ----------------------------*/
    /** 
     * 移动端相关数�? =>> mobileUtil 对象
     * 是否是安�?  : isAndroid
     * 是否是IOS   : isIOS
     * 是否是移动端: isMobile
     * 设备平台    : platform [ ios �? android ]
     * 事件类型    : tapEvent [ tapEvent �? click ]
     * 系统版本�?  : version [ �?: ios 9.1 �? andriod 6.0 ]
     * 是否支持 touch 事件: isSupportTouch
     */
    var mobileUtil = (function (window) {
        var UA = window.navigator.userAgent,
            isAndroid = /android|adr/gi.test(UA),
            isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
            isMobile = isAndroid || isIOS,
            platform = isIOS ? 'ios' : (isAndroid ? 'android' : 'default'),
            isSupportTouch = "ontouchend" in document ? true : false;

        var reg = isIOS ? (/os [\d._]*/gi) : (/android [\d._]*/gi),
            verinfo = UA.match(reg),
            version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");

        return {
            isIOS: isIOS,
            isAndroid: isAndroid,
            isMobile: isMobile,
            platform: platform,
            version: parseFloat(version),
            isSupportTouch: isSupportTouch,
            tapEvent: isMobile && isSupportTouch ? 'tapEvent' : 'click'
        };
    })(window);


    $.fn.dialog = function (options) {
        var self = this;

        return this.each(function () {
            var $this = $(this),
                instance = window.jQuery ? $this.data('dialog') : $.fn.dialog.lookup[$this.data('dialog')];

            if (!instance) {
                var obj = new Dialog(this, options);
                obj._init();

                if (window.jQuery) {
                    $this.data('dialog', obj);
                } else {
                    $.fn.dialog.lookup[++$.fn.dialog.lookup.i] = obj;
                    $this.data('dialog', $.fn.dialog.lookup.i);
                    instance = $.fn.dialog.lookup[$this.data('dialog')];
                }
            } else {
                var obj = new Dialog(this, options);
                obj._init();
            }

            if (typeof options === 'string') { instance[options](); }

            // 提供外部调用公共方法
            self.close = function () {
                obj.closeDialog();
            };

            self.update = function (settings) {
                obj.update(settings);
            };
        });
    };

    if (!window.jQuery) { $.fn.dialog.lookup = { i: 0 }; }


    /**
     * 插件默认�?
     */
    $.fn.dialog.defaults = {
        type: 'alert',   // 弹窗的类�? [ alert: 确定; confirm: 确定/取消; toast: 状态提�?; notice: 提示信息 ]
        style: 'default', // alert �? confirm 弹窗的风�? [ default: 根据访问设备平台; ios: ios 风格; android: MD design 风格 ]
        titleShow: true,      // 是否显示标题
        titleText: '提示',    // 标题文字
        closeBtnShow: false,     // 是否显示关闭按钮
        content: '',        // 弹窗提示内容, 值可以是 HTML 内容
        contentScroll: true,      // alert �? confirm 弹窗提示内容是否限制最大高�?, 使其可以滚动
        dialogClass: '',        // 弹窗自定�? class
        autoClose: 0,         // 弹窗自动关闭的延迟时�?(毫秒)�?0: 不自动关�?; 大于0: 自动关闭弹窗的延迟时�?
        overlayShow: true,      // 是否显示遮罩�?
        overlayClose: false,     // 是否可以点击遮罩层关闭弹�?

        buttonStyle: 'side',   // 按钮排版样式 [ side: 并排; stacked: 堆叠 ]
        buttonTextConfirm: '确定',   // 确定按钮文字
        buttonTextCancel: '取消',   // 取消按钮文字
        buttonClassConfirm: '',       // 确定按钮自定�? class
        buttonClassCancel: '',       // 取消按钮自定�? class
        buttons: [],       // confirm 弹窗自定义按钮组, 会覆�?"确定"�?"取消"按钮; 单个 button 对象可设�? name [ 名称 ]、class [ 自定义class ]、callback [ 点击执行的函�? ]

        infoIcon: '',        // toast �? notice 弹窗的提示图�?, 值为图标的路径。不设置=不显�?
        infoText: '',        // toast �? notice 弹窗的提示文�?, 会覆�? content 的设�?
        position: 'center',  // notice 弹窗的位�?, [ center: 居中; bottom: 底部 ]

        onClickConfirmBtn: function () { },  // “确定”按钮的回调函数
        onClickCancelBtn: function () { },  // “取消”按钮的回调函数
        onClickCloseBtn: function () { },  // “关闭”按钮的回调函数
        onBeforeShow: function () { },  // 弹窗显示前的回调函数
        onShow: function () { },  // 弹窗显示后的回调函数
        onBeforeClosed: function () { },  // 弹窗关闭前的回调函数
        onClosed: function () { }   // 弹窗关闭后的回调函数
    };

})(window.jQuery || window.Zepto, window, document);
/**
 * tapEvent  v1.0.0
 * @date  2016-09-27
 * @author 方雨_Yu
 * Licensed under MIT
 */
; (function ($, window, document, undefined) {
    'use strict';

    $(document).ready(function () {
        var startX,       // 开始横坐标
            startY,       // 开始纵坐标
            endX,         // 结束横坐�?
            endY,         // 结束纵坐�?
            startTime,    // 按下的开始时�?
            element;      // 触发事件元素

        $(document)
            .on('touchstart', function (e) {
                var e = e.originalEvent || e;
                var touch = e.changedTouches[0];

                element = $('tagName' in touch.target ? touch.target : touch.target.parentNode);
                startTime = new Date();
                startX = touch.clientX;
                startY = touch.clientY;
                endX = touch.clientX;
                endY = touch.clientY;
            })
            .on('touchmove', function (e) {
                var e = e.originalEvent || e;
                var touch = e.changedTouches[0];

                endX = touch.clientX;
                endY = touch.clientY;
            })
            .on('touchend', function (e) {
                var e = e.originalEvent || e;
                var touch = e.changedTouches[0];
                var endTime = new Date();

                // 结束时间 - 开始时�? < 300毫秒, 并且移动距离(开始坐�?-结束左边)<20, 则触发事�? tapEvent
                if (endTime - startTime < 300) {
                    if (Math.abs(endX - startX) + Math.abs(endY - startY) < 30) {
                        element.trigger('tapEvent');
                    }
                }

                startTime = 0;
                startX = 0;
                startY = 0;
                endX = 0;
                endY = 0;
            });
    });

    // 注册快捷事件 tapEvent, 调用: $element.tapEvent(fn);
    ['tapEvent'].forEach(function (eventName) {
        $.fn[eventName] = function (callback) {
            return this.on(eventName, callback);
        };
    });
})(window.jQuery || window.Zepto, window, document);
/**
 * ripple  v1.0.0 
 * @date  2016-10-09
 * @author  方雨_Yu
 * @home  https://github.com/sufangyu/ripple
 * Licensed under MIT
 */
; (function ($, window, document, undefined) {
    'use strict';

    var Ripple = (function () {

        function Ripple(element, options) {
            var self = this;

            self.$element = $(element);
            self.settings = $.extend({}, $.fn.ripple.defaults, options);

            self.target = null;  // 目标元素
            self.positionX = 0;  // 点击位置的横坐标
            self.positionY = 0;  // 点击位置的纵坐标 

            self.init();
        }

        Ripple.prototype = {
			/**
			 * 初始�?
			 */
            init: function () {
                var self = this;

                self.bindEvents();
            },

			/**
			 * 绑定事件
			 */
            bindEvents: function () {
                var self = this;

                // 点击�?, 获取点击的目标元素以及其点击位置, 并创建水波纹 DOM
                self.$element.on(event.downEvent, function (ev) {
                    var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                    self.target = $(touch.target);
                    self.positionX = touch.pageX;
                    self.positionY = touch.pageY;

                    self.creatRipple();
                });

                // 运动结束�?, 删除水波�? DOM
                $(document).on('webkitAnimationEnd MSAnimationEnd animationend', ('.' + self.settings.className), function () {
                    var $removeElement = this;
                    self.removeRipple($removeElement);
                });
            },

			/**
			 * 创建水波�?
			 */
            creatRipple: function () {
                var self = this;

                var rect = getRect(self.target[0]);
                var size = Math.max(rect.width, rect.height);    // 目标元素相对窗口宽、高的最大�?
                var elementLeft = self.target.offset().left;     // 目标元素相对窗口的横坐标
                var elementTop = self.target.offset().top;      // 目标元素相对窗口的纵坐标

                // 创建水波纹DOM
                self.$rippleElement = $('<' + self.settings.tagName + '></' + self.settings.tagName + '>');

                // 设置水波纹DOM的位置与大小, 并添加到目标元素�?
                self.$rippleElement
                    .addClass(self.settings.className)
                    .css({
                        left: self.positionX - elementLeft - size / 2,
                        top: self.positionY - elementTop - size / 2,
                        width: size,
                        height: size
                    });
                self.target.append(self.$rippleElement);
            },

			/**
			 * 删除水波�?
			 * @param {jQuery obj}  $element   jQuery 对象
			 */
            removeRipple: function ($element) {
                var self = this;
                $element.remove();
            }
        };

        return Ripple;
    })();



	/**
	 * 获取元素的左、右、上、下相对浏览器视窗的位置
	 * @param {DOM obj}  element   DOM 对象
	 */
    function getRect(element) {
        try {
            return element.getBoundingClientRect();
        } catch (error) {
            console.log('No support getBoundingClientRect', error.message);
        }
    }

    /** 
     * 按下的事件类�?: event.downEvent [ touchstart �? mousedown ]
     */
    var event = (function (window) {
        var UA = window.navigator.userAgent,
            isAndroid = /android|adr/gi.test(UA),
            isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
            isMobile = isAndroid || isIOS,
            isSupportTouch = "ontouchend" in document ? true : false;

        return {
            downEvent: isMobile && isSupportTouch ? 'touchstart' : 'mousedown'
        };
    })(window);


    $.fn.ripple = function (options) {
        var self = this;
        var list = [];
        this.each(function (i, self) {
            list.push(new Ripple(self, options));
        });
        return list;
    };

    $.fn.ripple.defaults = {
        tagName: 'span',
        className: 'ripple'
    };


    // 通过 data-ripple 的方式实例化插件
    $(function () {
        return new Ripple($('[data-ripple]'));
    });
})(window.jQuery || window.Zepto, window, document);