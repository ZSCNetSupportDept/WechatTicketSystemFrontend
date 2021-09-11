
//添加验证SToken失败的时候的回调函数
SToken.checkBadCallback = function(data,param){
	onError('页面/登录已失效,请重新登录以操作');
};
//重写Sola消失的方法
SToken.solaDisappear = function(){
	onError('Sola端出问题了,无法回应你的查询请求\n请尝试关闭窗口后重新进入');
};
//验证SolaToken
SToken.init(NMFunc.getURLParam('token'),'token');

var d1 = NMFunc.getURLParam('d1');
var d2 = NMFunc.getURLParam('d2');
var st = NMFunc.getURLParam('st',0);
window.itemLim = SToken.isWechat ? 20 : 30;
if(st != 0) 
	$('#btn_last').show().click(function(){turnPage(st-itemLim)});
$('#btn_next').show().click(function(){turnPage(parseInt(st)+itemLim);});

function turnPage(st){
	var d1 = NMFunc.getURLParam('d1'),d2 = NMFunc.getURLParam('d2');
	var gourl = 'log.sub.html?token='+$('#token').val()
		+(d1?('&d1='+d1):'')+(d2?('&d2='+d2):'')
		+'&st='+st;
	window.location.href = gourl;
}

//获取日志
var queryURL = '/*@echo URL_SOLA_TICKET_LOG*/?token='+$('#token').val()
		+'&limit='+itemLim+'&first='+st
		+(d1?('&start='+d1):'')
		+(d2?('&end='+d2):'')
		+'&';
NMFunc.reqServer(queryURL,log_sub_queryDone);

function log_sub_queryDone(data,param){
try{
	if(data.errCode)
		return onError(data.errMsg);
	var retList = data;
	var showList = [];
	for(var i=0;i<retList.length;i++){
		showList[i]={};
		if(retList[i][0].operator){
			showList[i].names = retList[i][0].operator.name;
			if(showList[i].names=='用户操作')showList[i].names='<b>'+showList[i].names+'</b>';
		}else showList[i].names='<b>用户操作</b>';
		showList[i].tid = retList[i][0].id;
		var user = retList[i][0].user;
		showList[i].user= '['+user.name+']'+userf.getAllInfo(user.block,user.room,user.isp);
		showList[i].desc= retList[i][0].description;
		showList[i].remark = retList[i][0].remark;
		showList[i].status = retList[i][0].status;
		showList[i].mod = retList[i][2];
		showList[i].time = retList[i][1].timestamp;
	}
	showResult(showList);
}catch(e){
	var showText = '('+(e.lineno?e.lineno:'?')+','+(e.colno?e.colno:'?')+')<br/>'+e;
	console.log(showText);
	onError('查询异常:<br />'+showText);
}
}

/*
 * resArr:[Object,....]Object{'names','remark','status','mod','time'}
 */
function showResult(resArr){
	//结果长度
	var len = resArr.length;
	//长度为0,表示没有结果
	len || $('#page_result').append("<div class='p_fg' style='text-align:center;'>操作记录为空!</div>");
	//长度不足就不显示下一页按钮
	resArr.length>=itemLim || $('#btn_next').hide();
	//循环遍历
	for(var i=0;i<resArr.length;i++){
		var bv = $($('#base_item').prop('outerHTML')).removeClass('hide');
		var iv = bv.find('.ti_icon');
		bv.attr('data-id',resArr[i].tid);
		bv.find('.ti_id').text(resArr[i].tid);
		bv.find('.ti_user').html(resArr[i].user);
		bv.find('.ti_desc').html(userf.getDesc(resArr[i].desc));//.replace('故障','<br />故障'));
		bv.find('.ti_name').html(resArr[i].names);
		bv.find('.ti_status').html(userf.getStatHTML(resArr[i].status).replace('待解决','新增报修'));//ti_remark
		bv.find('.ti_remark').text(resArr[i].remark);
		var dateStr = userf.getDate(resArr[i].time);
		bv.find('.ti_time').html(dateStr.slice(3,dateStr.length).replace(' ','<br />')+'&nbsp;');
		switch(resArr[i].mod){
			case 'ADD':	iv.addClass('p_start');break;
			case 'DEL':	iv.addClass('p_del');break;
			default:	iv.addClass(resArr[i].status==9?'p_done':'p_continue');
		}
		//绑定列表点击后显示此报修记录的操作历史
		bv.bind('click',showTicketHistory);
		$('#page_result').append(bv);
	}
	setTimeout(fixBgLine,400);
}
function fixBgLine(){
	var bgBase = $('.ti_icon').eq(1);
	bgBase.length && $('.p_bg').height($('#page_result').height()+150)
								.offset({
									left:bgBase.offset().left + bgBase.width() / 2,
									top :$('.p_fg').eq(1).offset().top
								});
	try{
		callParentFunc('log_resizeLogBrowser',$('#page_result').height()+200);
	}catch(e){
		console.error(e);
		//调用父框架方法出错
	}
}

function onError(about){
	$('#page_error').show().find('p').html(about);
	$('#page_result').hide()
}

/*
 * 呼叫父框架显示指定的历史操作
 */
function showTicketHistory(){
	callParentFunc('onSonCallMe',$(this).attr('data-id'));
}

/**
 * 调用父框架方法
 * @author 刘越
 * @param {string} func  父框架函数名
 * @param {object} param 参数
 */
function callParentFunc(func,param){
	return eval('window.parent.' + func + '(param);');
}

