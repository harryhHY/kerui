(function (n, e) {
    var t = n.documentElement,
        i = "orientationchange" in window ? "orientationchange" : "resize",
        d = function () {
            var n = t.clientWidth;
            n && (t.style.fontSize = n / 9.6 + "px")
        };
    n.addEventListener && (e.addEventListener(i, d, !1), n.addEventListener("DOMContentLoaded", d, !1))
})(document, window);
var is_mobile = navigator.userAgent.toLowerCase().match(
    /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
if (is_mobile) {
    window.location.href = "./web.html";
}