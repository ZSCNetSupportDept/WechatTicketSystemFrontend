//添加验证SToken失败的时候的回调函数
SToken.checkBadCallback = function(data,param) {
	onError('页面/登录已失效,请重新登录以操作');
};
//重写Sola消失的方法
SToken.solaDisappear = function() {
	onError('Sola端出问题了,无法回应你的查询请求\n请尝试关闭窗口后重新进入');
};
//当SToken验证成功时,获取历史
SToken.checkCallback = function(data,param) {
	var tid = NMFunc.getURLParam('id','-1');
	var queryURL = '/*@echo URL_SOLA_TICKET_TRACK*/?token='+$('#token').val()
		+'&id='+tid+'&';
	NMFunc.reqServer(queryURL,track_sub_queryDone);
}
//验证SolaToken
SToken.init(NMFunc.getURLParam('token'),'token');

/**
 * 收到服务器端传来的数据回调函数
 */
track_sub_queryDone = function(data,param){
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
			showList[i].remark = retList[i][0].remark;
			showList[i].status = retList[i][0].status;
			showList[i].mod = retList[i][2];
			showList[i].time = retList[i][1].timestamp;
			if(showList[i].status == 0)
				showList[i].remark = retList[i][0].description;
		}
		showResult(showList);
	}catch(e){
		console.log(JSON.stringify(data));
		onError('查询异常:\n'+e);
	}
}

/*
 * resArr:[Object,....]Object{'names','remark','status','mod','time'}
 */
function showResult(resArr){
	if(resArr.length==0){
		return $('#page_result').append("<div class='p_fg' style='text-align:center;'>操作记录为空!</div>");
	}
	for(var i=0;i<resArr.length;i++){
		var bv = $('#base_item').clone().removeClass('hide');
		var iv = bv.find('.ti_icon');
		bv.find('.ti_name').html(resArr[i].names);
		bv.find('.ti_status').html(userf.getStatHTML(resArr[i].status).replace('待解决','新增报修'));//ti_remark
		bv.find('.ti_remark').text(userf.getDesc(resArr[i].remark));
		var dateStr = userf.getDate(resArr[i].time);
		bv.find('.ti_time').html(dateStr.slice(3,dateStr.length).replace(' ','<br />')+'&nbsp;');
		if(resArr[i].mod=='ADD')iv.addClass('p_start');
		else if(resArr[i].mod=='DEL')iv.addClass('p_del');
		else iv.addClass(resArr[i].status==9?'p_done':'p_continue');
		$('#page_result').append(bv);
	}
	setTimeout(fixBgLine,500);
}
function fixBgLine(){
	var bgBase = $('.ti_icon').eq(1);
	$('.p_bg').height($('#page_result').height()+40)
		.offset({'left':bgBase.offset().left+bgBase.width()/2,'top':0});
//	console.log($('.p_bg').offset().left+','+$('.p_bg').offset().top);
}

function onError(about){
	$('#page_error').show().find('p').text(about);
	$('#page_result').hide()
}