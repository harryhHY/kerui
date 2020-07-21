var is_mobile = navigator.userAgent.toLowerCase().match(
    /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
let url = sessionStorage.getItem('url')

function goto(to) {
    window.location.href = `./${to}.html`;
    sessionStorage.setItem('url', to)
}
if (url == null) {
    if (!is_mobile) {
        goto("index")
    } else if (is_mobile && url == "web") {
        goto("web")
    }
} else {
    if (!is_mobile && url == "web") {
        goto("index")
    } else if (is_mobile && url == "index") {
        goto("web")
    }
}