//设置SToken的操作为(2)(提交报修)
SToken.opera = 2;

$('#cb_sure').change(function(){
	if(this.checked)$('#div_form').show();
	else $('#div_form').hide();
});
$('#btn_subtmit').click(function(){
	var oriDesc = $('#text_ori_desc').val().trim();
	if(oriDesc.length == 0){
		onFormError('请填写一下故障简述吧','cell_dec','textarea');
		return false;
	}else if(oriDesc.length >=255){
		onFormError('请你简述一下就好了,不需要太长的哦','cell_dec','textarea');
		return false;
	}
	var desc = '',tmp;
	if((tmp = $('#text_date').val()).length != 0){
		desc += '发生时间: '+tmp+'\n';
	}
	if((tmp = $('#text_code').val()).length != 0){
		desc += '故障代码: '+tmp+'\n';
	}
	desc += '故障简述: '+$('#text_ori_desc').val().trim();
	$('#desc').val(desc);
	$('#loadingToast').show();
	var u = '/*@echo URL_SOLA_SUBMIT*/?desc='+encodeURIComponent(desc)+'&token='+$('#token').val()+'&';
	NMFunc.reqServer(u, rrepair_onSubmit, 0, solaDisappear);
	return true;
});

loadUserInfo();
function loadUserInfo(){
	var getP = NMFunc.getURLParam;
	$('#text_user').text(getP('name','霸气的名字'));
	$('#text_phone').text(getP('phone','外星人的联系方式'));
	$('#text_room').text(userf.getAllInfo(
		parseInt(getP('block',0)),getP('room','舍管房间'),
		parseInt(getP('isp',0))
	));
}
/*
 * --------------------------已经提交----------------------
 */
//XXX window.crcw 当结果弹窗关闭时关闭窗口
window.rrepair_onSubmit = function(data,param){
	window.crcw = false;
	$('#failDlg').hide();
	$('#loadingToast').hide();
	if(!data.errCode)
		return NMFunc.result(2,1);
	data.errCode == -20 && (window.crcw = true);
	$('#failDlg p').text(data.errMsg || 'Sola居然不说是什么错误...');
	$('#failDlg').show();
}

//Sola消失了
function solaDisappear(){
	$('#loadingToast').hide();
	$('#failDlg p').text('Sola端出问题了,无法回应你的报修请求');
	$('#failDlg').show();
}

/*
 * XXX 可重用表单错误处理机制
 */
function onFormError(errMsg,cellId,inputTag){
	inputTag = inputTag==undefined?'input':inputTag;
	$('#err_tip').text(errMsg).show();
	setTimeout(error_hide,2500);
	$('#'+cellId).addClass('weui_cell_warn')
		.find(inputTag).unbind('focus').focusout(onError_focus).focus();
}
function onError_focus(){$(this).parents('.weui_cell').removeClass('weui_cell_warn');}
function error_hide(){$('#err_tip').hide();}
