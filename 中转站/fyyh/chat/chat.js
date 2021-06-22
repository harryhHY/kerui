        //serverUrl
        let socketUrl = 'wss://ws.haoxingtiyu.com/ws';
        // let socketUrl = 'wss://echo.websocket.org';
        //保存websocket对象
        let socket;
        // reConnect函数节流标识符
        let flag = true;

        let mathcode = "" //游客随机码
        // let room_id = sessionStorage.getItem("roomid") //房间id
        // console.log(room_id)

        

        function GetUrlRelativePath() {
            //获取当前URL
            var url = document.location.toString();
            var arrUrl = url.split("//");

            var start = arrUrl[1].indexOf("/");
            var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

            if (relUrl.indexOf("?") != -1) {
                relUrl = relUrl.split("?")[0];
            }
            return relUrl;
        }


        function getParentUrl() { 
            var url = null;
            if (parent !== window) { 
                try {
                   url = document.referrer; 
                }catch (e) { 
                   url = document.referrer; 
                } 
             }
             return url;
        }
        let url = GetUrlRelativePath(getParentUrl());
        let room_id = url.split('/',4)[3] * 1
        console.log(url,room_id,document.referrer)
        //心跳机制
        let heart = {
            timeOut: 30000,
            timeObj: null,
            serverTimeObj: null,
            start: function () {
                console.log('start');
                let self = this;
                //清除延时器
                this.timeObj && clearTimeout(this.timeObj);
                this.serverTimeObj && clearTimeout(this.serverTimeObj);
                this.timeObj = setTimeout(function () {
                    // let token  = localStorage.getItem("token")
                    // if(token != null && token != false && token.length > 1){

                    //     var msgdata = {
                    //         'status': 3,
                    //         'data': {
                    //             'uid': localStorage.getItem("user_uid") * 1,
                    //             'username': JSON.parse(localStorage.getItem("user_info")).user_name,
                    //             'avatar_id': JSON.parse(localStorage.getItem("user_info")).user_pic,
                    //             'room_id': JSON.stringify(room_id),
                    //             'content': "heartbeat",
                    //             'to_uid': '0'
                    //         }
                    //     }
                    // }else{
                    //     var msgdata = {
                    //         'status': 3,
                    //         'data': {
                    //             'uid': mathcode * 1,
                    //             'username': `游客${mathcode}`,
                    //             'avatar_id': '',
                    //             'room_id': JSON.stringify(room_id),
                    //             'content': "heartbeat",
                    //             'to_uid': '0'
                    //         }
                    //     }
                    // }

                    // socket.send(JSON.stringify(msgdata));
                    socket.send("heartbeat")


                    //发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
                    //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
                    self.serverTimeObj = setTimeout(function () {
                        socket.close();
                        reConnect(socketUrl);
                    }, self.timeOut)
                }, this.timeOut)
            }
        }
        //建立websocket连接函数
        function createWebsocket(url) {
            try {
                socket = new WebSocket(url);
                init();
            } catch (e) {
                //进行重连;
                console.log(e)
                console.log('websocket连接错误');
                reConnect(socketUrl);
            }
        }
        //对WebSocket各种事件进行监听   
        function init() {
            socket.onopen = function () {
                //连接已经打开
                console.log("开始")
                //重置心跳机制
                heart.start();
                let token = localStorage.getItem("token")
                let data
                if (token != null && token != false && token.length > 1) {
                    let joinroom = {
                        'status': 1,
                        'data': {
                            'uid': localStorage.getItem("user_uid") * 1,
                            'room_id': room_id,
                            'avatar_id': JSON.parse(localStorage.getItem("user_info")).user_pic,
                            'username': JSON.parse(localStorage.getItem("user_info")).user_name,
                            'to_user': null
                        }
                    }
                    data = joinroom
                } else {
                    let joinroom1 = {
                        'status': 1,
                        'data': {
                            'uid': mathcode * 1,
                            'room_id': room_id,
                            'avatar_id': '',
                            'username': `游客${mathcode}`,
                            'to_user': null
                        }
                    }
                    data = joinroom1
                }
                socket.send(JSON.stringify(data))
            }
            socket.onmessage = function (event) {
                //通过event.data获取server发送的信息
                //对数据进行操作
                console.log(event.data);
                let data = JSON.parse(event.data)
                if (data.status == 3) {
                    $(".chat_send_div").append(`
                    <div class="user_img">
                        <img src="${data.data.avatar_id}" alt="">
                        <span class="ov">
                            ${data.data.username}
                        </span>
                        <span>
                            ；
                        </span>
                        <span class="mag_div">
                            ${data.data.content}
                        </span>
                    </div>
                    `)
                } else if (data.status == 1) {
                    // $(".chat_send_div").append(`
                    // <div class="user_img">
                    //     <img src="${data.data.avatar_id}" alt="">
                    //     <span class="ov">
                    //         ${data.data.username}
                    //     </span>
                    //     <span>
                    //         ；
                    //     </span>
                    //     <span class="mag_div">
                    //         进入
                    //     </span>
                    // </div>
                    // `)
                }
                gotobottom()
                //收到消息表示连接正常，所以重置心跳机制
                heart.start();
            }
            socket.onerror = function () {
                //报错+重连
                console.log('socket连接出错');
                reConnect(socketUrl);
            }
            socket.onclose = function () {
                console.log('socket连接关闭');
            }
        }
        //消息自动滚动底部
        function gotobottom() {
            $(".chat_main").scrollTop($(".chat_main")[0].scrollHeight)
        }
        //发送消息
        function sendmsg() {
            let token = localStorage.getItem("token")
            if (token != null && token != false && token.length > 1) {
                let msgdata = {
                    'status': 3,
                    'data': {
                        'uid': localStorage.getItem("user_uid") * 1,
                        'username': JSON.parse(localStorage.getItem("user_info")).user_name,
                        'avatar_id': JSON.parse(localStorage.getItem("user_info")).user_pic,
                        'room_id': room_id,
                        'content': $(".send_input").val(),
                        'to_uid': '0'
                    }
                }
                socket.send(JSON.stringify(msgdata));
                $(".chat_send_div").append(`
                <div class="user_img">
                    <img src="${JSON.parse(localStorage.getItem("user_info")).user_pic}" alt="">
                    <span class="ov">
                        ${JSON.parse(localStorage.getItem("user_info")).user_name}
                    </span>
                    <span>
                        ；
                    </span>
                    <span class="mag_div">
                        ${$(".send_input").val()}
                    </span>
                </div>
                `)
                $(".send_input").val('')
                gotobottom()
            }
        }
        //重连函数
        //因为重连函数会被socket事件频繁触发，所以通过函数节流限制重连请求发送
        function reConnect(url) {
            if (!flag) {
                return;
            }
            flag = false;
            setTimeout(function () {
                createWebsocket(url);
                flag = true;
            }, 15000)
        }
        createWebsocket(socketUrl)

        //先创建函数来封装这个方法
        function getRnadomFiveInt() {
            var Num = "";
            for (var i = 0; i < 5; i++) {
                Num += Math.floor(Math.random() * 10);
            }
            mathcode = Num
            console.log(mathcode)
        }
        //执行函数
        getRnadomFiveInt();