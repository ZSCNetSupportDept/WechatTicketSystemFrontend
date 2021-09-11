//localStorage.clear();//DEBUG FIXME 
/*
 * 显示绑定结果
 */
//消息图标
$icon  = NMFunc.e('icon_main');
//消息简述
$brief = NMFunc.e('text_brief');
//消息标题
$title = NMFunc.e('text_title');
//确定按钮
$btn   = NMFunc.e('btn_ok');

$btn.onclick = function(){
	WeixinJSBridge.call('closeWindow');
};

//获得参数
var up			= NMFunc.getURLParam;
var op			= parseInt(	up('op'			, 0 ));
var type		= parseInt(	up('type'		, -1));
//msg,title和icon为自定义标题,说明,图标样式,在type存在并且不为88时生效,否则为默认标题,说明,图标样式
var msg			= 			up('msg'		, '').replace(/\+/g,' ');
var title		= 			up('title'		, '').replace(/\+/g,' ');
var btnStatus	= 			up('btn'		, '');
var icon		= 			up('icon'		, '');
window.gotoPage	= 			up('redirect'	, '');

//设置整个文档的标题
document.title = title || genDocTitle(op, type);
//如果需要跳转
gotoPage && setTimeout('window.location.href=gotoPage;',3500);

switch(type){
	case 88:
		showResult('抱歉', '可能我们忘记告诉您 \n 请使用微信访问我们的平台 ( > c < ) ', 'weui_icon_info');
		break;
	case 1:
		showResult(title	|| getSuccessTitle(op),
				   msg		|| '点击 确定 退出页面',
				   icon 	|| 'weui_icon_success');
		btnStatus == 'hide'	|| showButton(btnStatus || '确定','weui_btn_primary');
		break;
	case 0:
		showResult(title	|| getFailTitle(op),
				   msg		|| (getFailTitle(op) + '.Sola不说是什么原因,让你猜'),
				   icon		|| 'weui_icon_warn');
		btnStatus == 'hide'	|| showButton(btnStatus || '关闭','weui_btn_warn');
		break;
	default://-1
		showResult('警告你哦', '不要乱来,我们已经记录你的微信信息了哦', 'weui_icon_safe_warn');
}


//* 生成用于当前HTML文档的标题
//* op: 操作, type: 操作结果类型
function genDocTitle(op,type){
	if(type == 88)//非微信访问
		return '(｡・`ω´･)抱歉';
	var t = [['', '绑定结果' ], ['', '查询失败' ], ['报修失败', '报修成功' ], ['', '' ], ['修改失败', '修改成功' ] ];
	return (t[op] && t[op][type]) || '非法请求';
}

//将信息显示出来
function showResult(title, msg, iconClass) {
	addClass($icon, iconClass);
	$title.innerText = title;
	$brief.innerText = msg;
}
//将按钮显示出来
function showButton(text, btnClass) {
	addClass($btn,btnClass);
	$btn.innerText = text;
	removeClass($btn,'hide');
}

function getSuccessTitle(op){
	var t = ['绑定成功','','修改成功']
	return t[op] || '报修成功';
}
function getFailTitle(op){
	var t = ['绑定失败', '查询出错', '报修出错', '修改失败'];t[10] = '页面失效';
	return t[op] || '操作有误';
}

/*
 * DOM样式操作
 */
function hasClass(e, c){return new RegExp('(\\s|^)' + c + '(\\s|$)').test(e.className);}
function addClass(e, c) {
	hasClass(e, c) || (e.className += ' ' + c );
}
function removeClass(e, c) {
	if(hasClass(e, c))
		e.className = e.className.replace(new RegExp('(\\s|^)' + c + '(\\s|$)'),' ');
}