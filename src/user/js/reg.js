
//页面上重要的控件对象
btn_sb 		= $('#btn_bind');
text_warn 	= $('#text_error');

text_name 	= $('#name');
text_sid 	= $('#sid');
sel_isp 	= $('#isp');
text_user 	= $('#username');
text_room 	= $('#room');
text_phone 	= $('#phone');

//字段的正则匹配式
// rule_sid = /^20\d{11}$/g;
rule_sid = /^[0-9A-Za-z]{1,20}$/g;
rule_name = /^\S{2,5}$/g;
rule_user = [
	/^1\d{10}$/g,//电
	/^([0-9A-Za-z\-_\.]+)@16900.gd$/g,//联
	/^1\d{10}@139.gd$/g,//移
	/^\S+$/g];//其
rule_room = /^[1-9]{1}\d{2,4}$/g;
rule_phone = /^1\d{10}$/g;

//绑定字段合法性检测事件(光标移开时)
text_name.blur(checkName);
text_sid.blur(checkSid);
sel_isp.blur(checkUserFromISP);
text_user.blur(checkUser);
text_room.blur(checkRoom);
text_phone.blur(checkPhone);

//提交绑定
btn_sb.click(function(){
	text_warn.hide();
	if(!checkName()){text_name.focus();return false;}
	if(!checkSid()){text_sid.focus();return false;}
	if(!checkUser()){text_user.focus();return false;}
	if(!checkRoom()){text_room.focus();return false;}
	if(!checkPhone()){text_phone.focus();return false;}
	regRequest();
	return true;
});

/*
 * 收到Sola端传来的数据
 */
window.onRegResult = function(data,param){
	$('#loadingToast').hide();
	var code = parseInt(data.errCode || 0);
	switch(code){
	case 0://注册成功
		return NMFunc.result(0,1);
	case -20:
	case -9://Auth验证错误,跳转
		return NMFunc.result(0,0,data.errMsg);
	case -5://输入错误,显示错误即可
		if(!data.errMsg)
			return alert('Sola说你的输入有误,但是他不告诉你是哪儿有误~~');
		bindErrorInput(data.errMsg);
		return ;
	default:
		alert('Sola端服务器通信异常,返回的数据我不认识了(⊙０⊙)!\n状态码:'+code+'\n描述:'+data.errMsg);
	}
}
/*
 * 从Sola返回结果中绑定错误字段
 */
function bindErrorInput(retMsg){
	retMsg = retMsg.toUpperCase().trim();
	var e = undefined;
	var eMsg = '';
while(true){
	if(retMsg.indexOf('DUPLICATED_')>=0){//字段重复
		if(retMsg.indexOf('PHONE')>=0){
			e = text_phone; eMsg = '当前联系方式已被绑定';break;
		}else if(retMsg.indexOf('ACCOUNT')>=0){
			e = text_user; eMsg = '当前宽带账户已被绑定';break;
		}else if(retMsg.indexOf('WECHAT')>=0){
			window.location.href = '/*@echo URL_RESULT */?type=0&msg=当前微信已被绑定';return ;
		}
	}
	if(retMsg == 'USER_ALREADY_REGISTERED'){
		window.location.href = '/*@echo URL_RESULT */?type=0&msg=当前微信已绑定';return ;
	}
	if(retMsg.indexOf('INVALID_')>=0){//字段不合法
		if(retMsg.indexOf('STUDENT')>=0){
			e = text_sid;eMsg = '请输入正确的学号(后端验证失败)';break;
		}
		if(retMsg.indexOf('NAME')>=0){
			e = text_name;eMsg = '请输入正确的姓名(后端验证失败)';break;
		}
		if(retMsg.indexOf('ISP')>=0 || retMsg.indexOf('ACCOUNT')>=0){
			e = text_user;eMsg = '请输入正确的宽带帐号(后端验证失败)';break;
		}
		if(retMsg.indexOf('ROOM')>=0){
			e = text_room;eMsg = '请输入正确的宿舍号(后端验证失败)';break;
		}
		if(retMsg.indexOf('PHONE')>=0){
			e = text_phone;eMsg = '请输入正确的手机号(后端验证失败)';break;
		}
	}
	alert('Sola说:\n\t'+retMsg+'\nP.s.他之前没和我说过这个,所以我也不知道什么意思.(∵)nnn');
	return;}
	hasError(e,eMsg)
}

//Sola消失了
function solaDisappear(){
	window.location.href = '/*@echo URL_RESULT */?op=1&type=0&msg=Sola端出问题了,无法回应你的报修请求';
}

/*
 * 当用户点击注册时
 */
function regRequest(){
	baseURL = '/*@echo URL_SOLA_REG */?';
	var regURL = baseURL
				+'name='+encodeURIComponent(text_name.val())
				+'&sid='+String(text_sid.val()).replace(/^JJ/i, '').replace(/^Z/i, '')
				+'&phone='+text_phone.val()
				+'&room='+text_room.val()
				+'&username='+encodeURIComponent(text_user.val())
				+'&block='+$('#block').val()
				+'&isp='+sel_isp.val()
				+'&token='+$('#token').val()
				+'&';
	$('#loadingToast').show();
	NMFunc.reqServer(regURL, onRegResult, 0, solaDisappear);
}

function hasError(e,errmsg,nofocus){
	if(nofocus==undefined)nofocus=false;
	if(e!=undefined && e!=null)
		e.parents(".weui_cell").addClass("weui_cell_warn");
	if(!nofocus)e.focus();
	text_warn.text(errmsg);
	text_warn.show();
}
function hasnotError(e){
	e.parents(".weui_cell").removeClass("weui_cell_warn");
	text_warn.hide();
}
function checkName(){
	if(!text_name.val().match(rule_name)){
		hasError(text_name,"请输入正确的姓名",isThisAInput(this));
		return false;
	}else{hasnotError(text_name);return true;}
}
function checkSid(){
	if(!text_sid.val().match(rule_sid)){
		hasError(text_sid,"请输入正确的学号",isThisAInput(this));
		return false;
	}else{hasnotError(text_sid);}return true;
}
function checkUserFromISP(){
	if(text_user.val().trim().length>0)
		checkUser();
}

function checkUser(){
	if(!text_user.val().trim().match(rule_user[sel_isp.val()-1])){
		hasError(text_user,"请输入正确的宽带帐号",isThisAInput(this));
		return false;
	}else{hasnotError(text_user);}return true;
}
function checkRoom(){
	if(!text_room.val().match(rule_room)){
		hasError(text_room,"请输入正确的宿舍房号",isThisAInput(this));
		return false;
	}else{hasnotError(text_room);}return true;
}
function checkPhone(){
	if(!text_phone.val().match(rule_phone)){
		hasError(text_phone,"请输入正确的手机号码",isThisAInput(this));
		return false;
	}else{hasnotError(text_phone);}return true;
}
/*
 * 判断检测报错的对象是否来自输入控件
 */
function isThisAInput(obj){
	if(!obj.outerHTML)return false;
	return obj.outerHTML.search(/^<input/g)>=0;
}
