var express =  require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var FCM = require('fcm-push');
var app = express();

var server = require('http').createServer(app);
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

var port = process.env.PORT || 4000;

var conn2 = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'wjdgns@@23',
    database : 'band_cctv2'
});

server.on('connection', function(socket) {
    console.log('클라이언트 정보 - ip : %s, port : %d', socket.remoteAddress, socket.remotePort);
});

server.on('request',function (req) {
    //console.log('클라이언트로부터 요청들어옴',req);
});

server.listen(port, function () {
    console.log(port,'포트 시작~');
});


app.get("/bpm",function (req,res) {
    console.log("/bpm 요청옴!");
    //console.log(req.query);
    //callfcm();
});

app.post('/fcmtoken',function (req,res) {
    var token = req.body.user_token;
    var userid = req.body.user_id;
    console.log("fcmtoken 요청날라옴 !!!");
    //insert into test_db1(token,userid) values('aswda11111sdd','adm') on duplicate key update token='aswda11111sdd',userid='adm';
    conn2.query('insert into appusertoken_tb (user_token , user_id) values (?,?) on duplicate key update user_token=?,user_id=?',[token,userid,token,userid],function (err,results) {
        if(err){
            throw err;
        }else{

        }
    });
    console.log('fcmtoken result ->',token,",",userid);
});

//var obj2;
global.obj2 = null;
app.get('/gettoken',function (req,res) {
    //var user_id = req.param("user_id");
    console.log(user_id);
    var user_id = 'test';
    console.log('/gettoken request');
    //select user_token from appusertoken_tb where user_id =?

    conn2.query('select user_token from appusertoken_tb order by user_index desc limit 1',[user_id],function (err, result) {
        if(err){
            throw err;
        }else {
            res.json(result);
            var tk = JSON.stringify(result);
            var obj = JSON.parse(tk);
            //obj2 = obj[0].user_token;
            obj2 = obj[0].user_token;
            console.log('token 값 @@@@@',obj2);
            callfcm();
        }
    })
});

var FCM = require('fcm-push');

function callfcm() {
    console.log('@@fcm alarm1');
    /** Firebase(구글 개발자 사이트)에서 발급받은 서버키 */
// 가급적 이 값은 별도의 설정파일로 분리하는 것이 좋다.
    var serverKey = 'AAAA8_dFopQ:APA91bE0pAj5V3p36AhQ70x4bhp6jX6OaCFB6dO1qkxglzxyNGG5EJDUX8A9dYHnBhc5WScbdfdFIo63YkLmJVBY-vPqT_SnHMQ3ajQ_e2IzaDLpbkP241caRdi86PzJFZHO1nvU1PTLhKu_C_0VpKP0xNnt3DPCjQ';

    /** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
    var client_token = obj2;
    console.log('obj2 =',obj2);
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        data: {
            title: "심박수 이상 감지",
            body: "움직이 감지되지 않았습니다.",
            sound: "default",
            click_action: "OPEN_ACTIVITY",
            icon: "notification"
        },
        // 메시지 중요도
        priority: "high",
        // App 패키지 이름
        restricted_package_name: "com.example.soring.bandcv12",
        // App에게 전달할 데이터
    };

    /** 아래는 푸시메시지 발송절차 */
    var fcm = new FCM(serverKey);

    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지1 발송에 실패했습니다.');
            console.error(err);
            return;
        }

        console.log('Push메시지가1/심박x/움직임x 발송되었습니다.');
        console.log(response);
    });
}




function callfcm2() {
    console.log('@@fcm alarm2');
    var serverKey = 'AAAA8_dFopQ:APA91bE0pAj5V3p36AhQ70x4bhp6jX6OaCFB6dO1qkxglzxyNGG5EJDUX8A9dYHnBhc5WScbdfdFIo63YkLmJVBY-vPqT_SnHMQ3ajQ_e2IzaDLpbkP241caRdi86PzJFZHO1nvU1PTLhKu_C_0VpKP0xNnt3DPCjQ';
    /** 안드로이드 단말에서 추출한 token값 */
// 안드로이드 App이 적절한 구현절차를 통해서 생성해야 하는 값이다.
// 안드로이드 단말에서 Node server로 POST방식 전송 후,
// Node서버는 이 값을 DB에 보관하고 있으면 된다.
    var client_token = obj2;
    /** 발송할 Push 메시지 내용 */
    var push_data = {
        // 수신대상
        to: client_token,
        // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
        data: {
            title: "BandCCTV",
            body: "심박수 이상 감지",
            sound: "default",
            click_action: "OPEN_ACTIVITY",
            icon: "sos",
            "check": "notouch"
        },
        // 메시지 중요도
        priority: "high",
        // App 패키지 이름
        restricted_package_name: "com.example.soring.bandcv12",
    };

    /** 아래는 푸시메시지 발송절차 */
    var fcm = new FCM(serverKey);

    fcm.send(push_data, function (err, response) {
        if (err) {
            console.error('Push메시지2 발송에 실패했습니다.');
            console.error(err);
            return;
        }

        console.log('Push메시지가2/터치x 발송되었습니다.');
        console.log(response);
    });
}







