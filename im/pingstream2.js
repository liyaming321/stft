
// XMPP服务器BOSH地址
var BOSH_SERVICE = 'http://139.129.230.130:7070/http-bind/';

// XMPP连接
var connection = null;

// 当前状态是否连接
var connected = false;

// 当前登录的JID
//var jid = "test003@imtest";
var jid = "";

//唯一cookie标示
var channel = "";
// 连接状态改变的事件
function onConnect(status) {

	console.log(status)
	
    if (status == Strophe.Status.CONNFAIL) {
		alert("连接失败！");
    } else if (status == Strophe.Status.AUTHFAIL) {
		alert("登录失败！");
    } else if (status == Strophe.Status.DISCONNECTED) {
		alert("连接断开！");
		connected = false;
    } else if (status == Strophe.Status.CONNECTED) {
//		alert("连接成功，可以开始聊天了！");
		connected = true;
		
		// 当接收到<message>节，调用onMessage回调函数
		connection.addHandler(onMessage, null, 'message', null, null, null);
		
		// 首先要发送一个<presence>给服务器（initial presence）
		connection.send($pres().tree());
    }
}

// 接收到<message>
function onMessage(msg) {
	
	// 解析出<message>的from、type属性，以及body子元素
    var from = msg.getAttribute('from');
     
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body'); 
    spstr = from.split('/');
    if (type == "chat" && elems.length > 0) {
		var body = elems[0];
		$("#msg").append(spstr[spstr.length-2] + ":<br>" + Strophe.getText(body) + "<br>")
    }
    var div = document.getElementById('msg');
    div.scrollTop = div.scrollHeight;
    return true;
}


$(document).ready(function() {
	$("#btn-send").click(function() {
		if(connected) {				
			var msg = $msg({
				to:'test001@imtest', 
				from: jid, 
				type: 'chat'
			}).c("body", null, $("#input-contacts").val());
			connection.(msg.tree());

			$("#msg").append(jid + ":<br>" + $("#input-contacts").val() + "<br>");
			$("#input-contacts").val('');
			var div2 = document.getElementById('msg');
		    div2.scrollTop = div2.scrollHeight;
			
		} else {
			alert("请先登录！");
		}
	});
});


	function tips_pop() {
		var MsgPop = document.getElementById("winpop");
		var popH = parseInt(MsgPop.style.height);
		if (popH == 0) { 
			MsgPop.style.display = "block";
			show = setInterval("changeH('up')", 2);
		} else { //否则
			hide = setInterval("changeH('down')", 2);
		}
	}
	function changeH(str) {
		var MsgPop = document.getElementById("winpop");
		var popH = parseInt(MsgPop.style.height);
		if (str == "up") { //如果这个参数是UP
			if (popH <= 300) { //如果转化为数值的高度小于等于100
				MsgPop.style.height = (popH + 100).toString() + "px";//高度增加4个象素
			} else {
				clearInterval(show);//否则就取消这个函数调用,意思就是如果高度超过100象度了,就不再增长了
			}
		}
		if (str == "down") {
			if (popH >= 4) { //如果这个参数是down
				MsgPop.style.height = (popH - 4).toString() + "px";//那么窗口的高度减少4个象素
			} else { //否则
				clearInterval(hide); //否则就取消这个函数调用,意思就是如果高度小于4个象度的时候,就不再减了
				MsgPop.style.display = "none"; //因为窗口有边框,所以还是可以看见1~2象素没缩进去,这时候就把DIV隐藏掉
			}
		}
	}
	
	function uuid(len, radix) {
	    var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
	    var uuid = [], i;
	    radix = radix || chars.length;
	 
	    if (len) {
	      // Compact form
	      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	    } else {
	      // rfc4122, version 4 form
	      var r;
	 
	      // rfc4122 requires these characters
	      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	      uuid[14] = '4';
	 
	      // Fill in random data.  At i==19 set the high bits of clock sequence as
	      // per rfc4122, sec. 4.1.5
	      for (i = 0; i < 36; i++) {
	        if (!uuid[i]) {
	          r = 0 | Math.random()*16;
	          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	        }
	      }
	    }
	 
	    return uuid.join('');
	}
	function setCookie(name,value)
	{
	    var Days = 10000; //此 cookie 将被保存 30 天
	    var exp  = new Date();    //new Date("December 31, 9998");
	    exp.setTime(exp.getTime() + Days*24*60*60*1000);
	    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	function getCookie(name)
	{
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)) return unescape(arr[2]);					
	    else return null;
	}
	function delCookie(name)
	{
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=getCookie(name);
	    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
	function setchannel(channelflag){
	
	}

		
	var callback = function (status) {
	    if (status === Strophe.Status.REGISTER) {
	        jid= uuid(16, 16);
	        connection.register.fields.username = jid;
	        connection.register.fields.password = "123";
	        connection.register.submit();
	    } else if (status === Strophe.Status.REGISTERED) {
	        console.log("registered!");
	        connection.authenticate();
	        connection.disconnect();
	        connection.reset;
	        setCookie("class","");
	      
	        
	        setCookie("name",jid);
	        
	        connection = new Strophe.Connection(BOSH_SERVICE);
	        connection.connect(jid+"@imtest", "123", onConnect);	
	        //console.log("registered!"+jid+"@imtest");
	    } else if (status === Strophe.Status.CONNECTED) {
	        console.log("logged in!");
	    } else {
	        // every other status a connection.connect would receive
	    }
	};
	window.onload = function() { //加载
	//	if(!connected) {
			//alert("自动连接服务器！");
		//	connection = new Strophe.Connection(BOSH_SERVICE);
		//	connection.connect("test003@imtest", "123", onConnect);			
		//}
		//document.getElementById('winpop').style.height = '0px';//我不知道为什么要初始化这个高度,CSS里不是已经初始化了吗,知道的告诉我一下
		if(getCookie("name")!=null){
		     jid  = getCookie("name");
			 connection = new Strophe.Connection(BOSH_SERVICE);
		     connection.connect(jid+"@imtest", "123", onConnect);	
		}else{
			connection = new Strophe.Connection(BOSH_SERVICE);
			connection.register.connect(BOSH_SERVICE, callback, 60, 1);
		}
		
		
	}

  
	
