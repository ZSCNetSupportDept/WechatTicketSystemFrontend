text_sid = $('#sid');
text_name= $('#name');
cell_sid = $('#cell_sid');

/*
 * 目前有没有有效的SID
 */
sid_ok = false;

$('#btn_subtmit').click(function(){
	var oriDesc = $('#text_ori_desc').val().trim();
	if(!sid_ok)
		return onFormError('请指定一个有效的学号','xxx','xxx'),false;
	if(!oriDesc.length)
		return onFormError('请填写一下故障简述吧','cell_dec','textarea'),false;
	if(oriDesc.length >=255)
		return onFormError('请你简述一下就好了,不需要太长的哦','cell_dec','textarea'),false;
	var desc = '',tmp;
	if((tmp = $('#text_date').val()).length)
		desc += '发生时间: '+tmp+'\n';
	if((tmp = $('#text_code').val()).length)
		desc += '故障代码: '+tmp+'\n';
	desc += '故障简述: '+$('#text_ori_desc').val().trim();
	$('#desc').val(desc);
	$('#loadingToast').show();
	var u = '/*@echo URL_SOLA_TICKET_PUSH*/?uid='+text_sid.val()+'&desc='+encodeURIComponent(desc)+'&token='+$('#token').val()+'&';
	NMFunc.reqServer(u, add_onSubmit, 0, solaDisappear);
	return true;
});
/*
 * --------------------------已经提交----------------------
 */
//XXX window.crcw 当结果弹窗关闭时关闭窗口
add_onSubmit = function(data,param){
	window.crcw = false;
	$('#failDlg').hide();
	$('#toast_loading').hide();
	if(!data.errCode)
		return NMFunc.result(2,1);
	data.errCode == -20 && (window.crcw = true);
	$('#failDlg p').text(data.errMsg || 'Sola居然不说是什么错误...');
	$('#failDlg').show();
}

//Sola消失了
function solaDisappear(){
	$('#toast_loading').hide();
	$('#failDlg p').text('Sola端出问题了,无法回应你的报修请求');
	$('#failDlg').show();
}

/*
 * 校检用户存在性,并显示用户名
 */
add_checkUser = function(){
	var sid = $('#sid').val();
	var url='/*@echo URL_SOLA_GET_USER*/?id=' + sid + '&token=' + $('#token').val() + '&';
	$('#toast_loading').show();
	sid_ok = false;
	NMFunc.reqServer(url, add_checkUserDone, 0, checkBadNet);
}
/*
 * 检测用户存在性完成
 */
add_checkUserDone = function(data,p){
	$('#toast_loading').hide();
	if(data.errCode == -20)
		return NMFunc.result(10,0,data.errMsg);
	if(data.errCode) {
		cell_sid.addClass('weui_cell_warn');
		onFormError('学号不存在','sid','input');
	} else {
		sid_ok = true;
		text_sid.removeClass('weui_cell_warn');
		cell_sid.removeClass('weui_cell_warn');
	}
	$('#name').val(data.name || '学号不存在');
}

//Sola消失了
function checkBadNet(){
	$('#toast_loading').hide();
	$('#name').val('查询出错');
}

/*
 * 选择运营商工单号码的ActionSheet的动作
 */
as_bd	=	$('#as_body');
as_mask	=	$('#as_mask');
as_all	=	$('#as_all');
/**
 * 当点击了弹出AS的按钮的事件:弹出AS
 */
add_openAS = function(){
	as_all.removeClass('hide');as_mask.show().addClass('weui_fade_toggle');
	as_bd.show().addClass('weui_actionsheet_toggle');
}
add_onASClick = function(sid,t){
	text_sid.val(sid);
	text_name.val(t.innerHTML.replace('工单','').replace('片区',''));
	
	text_sid.removeClass('weui_cell_warn');
	cell_sid.removeClass('weui_cell_warn');
	
	sid_ok = true;
	add_hideAS();
}
add_hideAS = function() {
	as_bd.removeClass('weui_actionsheet_toggle');as_mask.removeClass('weui_fade_toggle');
	setTimeout('as_bd.hide();as_mask.hide();as_all.addClass("hide");',300);
}


/*
 * XXX 可重用表单错误处理机制
 */
function onFormError(errMsg,cellId,inputTag){
	inputTag = inputTag || 'input';
	$('#err_tip').text(errMsg).show();
	setTimeout(error_hide,2500);
	$('#'+cellId).addClass('weui_cell_warn')
		.find(inputTag).unbind('focus').focusout(onError_focus).focus();
}
function onError_focus(){$(this).parents('.weui_cell').removeClass('weui_cell_warn');}
function error_hide(){$('#err_tip').hide();}