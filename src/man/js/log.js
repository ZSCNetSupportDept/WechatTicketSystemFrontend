/*
 * -----------------内置浏览器方法-----------------
 */
/**
 * 当日志子页面请求显示指定报修记录的操作历史
 * @author 刘越
 * @param {number} id 指定报修的ID
 */
window.onSonCallMe = function(id){
	log_browserOpenTrack(id);
}
/**
 * 在对话框中显示某个报修的操作历史
 * @author 刘越
 * @param {number} id 指定报修的ID
 */
window.log_browserOpenTrack = function(id){
	$('#if_browser2').attr('src','track.sub.html?token='+$('#token').val()+'&id='+id);
	$('#track_id').text(id);
	$('#dlg_browser').show();
}
/**
 * 在页面的iframe内显示日志记录
 * @author 刘越
 * @param {number} d1 起始时间戳
 * @param {number} d2 截止时间戳(可选)
 */
window.log_browserOpenLog = function(d1,d2){
	$('#if_browser').attr('src','log.sub.html?token='+$('#token').val() + '&d1=' + d1 + '&d2=' + (d2 || d1) );
}

/**
 * 调整显示日志子页面的iframe的高度
 * 说明: 子页面会调用这个函数
 * @author 刘越
 * @param {Number|undefined} h 子页面的高度(可选)
 */
window.log_resizeLogBrowser = function(h){
	try{
		//如果是子页面调用的(传入了具体的高度值)
		if(h)
			return $('#if_browser').height(h + 20);
		var oe = window.frames['if_browser'].contentWindow.document.getElementById('page_result');
		$('#if_browser').height($(oe).height() + 20);
	}catch(e){
	}
}

//打开页面显示一次日志
log_browserOpenLog(dateFormat(new Date().getTime()));

log_onQueryBtnClick = function(){
	var dd1 = $('#date_start').val();
	var dd2 = $('#date_stop').val();
	if(!dd1)dd1 = dateFormat(new Date().getTime());
	else dd1 = dd1.replace(/-/g,'');
	if(!dd2)dd2 = dateFormat(new Date().getTime());
	else dd2 = dd2.replace(/-/g,'');
	log_browserOpenLog(dd1,dd2);
}

function dateFormat(ms){
	var d = new Date(ms);
	return d.getFullYear()+_22(d.getMonth()+1)+_22(d.getDate());
}
function _22(str){
	return ('000'+str).slice(-2)
}