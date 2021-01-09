<div class="header">
        <!-- 新UI-header -->
        <div class="whitehead">
            <ul>
                <a href="https://www.baidu.com"><li class="head_home"></li></a>
                <a href="#"><li class="head_live_bg"></li></a>
                <a href="#"><li class="head_news_bg"></li></a>
            </ul>
        </div>
        <div class="head_logo">
            <img src="../image/logo.png" alt="">
        </div>
        <div class="head_collect">
            <!-- 此div点击收藏的提示框 -->
        </div>
    </div>




    function toast(text) {
        let toast = document.getElementById('toast');
        let toast_box = document.getElementsByClassName('toast_box')[0];
        toast.innerHTML = text;
        toast_box.style.animation = 'show 1.5s'
        toast_box.style.display = 'inline-block';
        setTimeout(function () {
        toast_box.style.animation = 'hide 1.5s'
        setTimeout(function () {
            toast_box.style.display = 'none';
        }, 1400)
        }, 1500)
    }
    $('.head_collect').click(function(){
        toast('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    })