SToken.opera = 1;

queryStart();

/*
 * ------------------------------------------
 * ________________处理结果___________________
 * ------------------------------------------
 */
//@XXX window.listResult
function onFillTable(row,col,head){
	switch(col){
		case 0:return listResult[row].id;
		case 1:return userf.getStatHTML(listResult[row].status);
		case 2:return userf.getDate(listResult[row].submitTime);
		case 3:return listResult[row].description.replace(/\n/g,'<br />');
	}
}
function onClickTable(){
	var id = $(this).attr('data-row');
	var ret = listResult[id];
	if(ret.status == undefined || ret.status == 0)return ;
	var fix_people = '外星人⊙﹏⊙‖∣';if(ret.operator!=undefined && ret.operator.name!=undefined)fix_people = ret.operator.name;
	var fix_date = '遇见你的那一天';if(ret.updateTime!=undefined)fix_date = userf.getDate(ret.updateTime);
	var fix_desc = '轻轻的他走了,不留下一点描述....';if(ret.remark!=undefined)fix_desc = ret.remark;
	var god = fix_people.toLowerCase();
	if(god =='sola' || god == '\u5218\u8d8a' || god == '\u59dc\u5b50\u9e92')
		$('#text_fix_id').addClass('god');
	else $('#text_fix_id').removeClass('god');
	$('#text_fix_id').text(fix_people);
	$('#text_fix_date').text(fix_date);
	$('#text_fix_remark').text(fix_desc);
	$('#dlg_fixinfo').show();
	
}

function handlerResult(){
	var head = ['编号','状态','报修日期','简述'];
	var tb = $('#tb_result');
	tb.tableFill(head,listResult.length,onFillTable);
	tb.lyTable();
	$('#tb_result tbody tr').each(function(i){
		$(this).attr('data-row',i);
	}).unbind('click').click(onClickTable);
}


/*
 * -------------------------------------------
 * _______________查询方法_____________________
 * -------------------------------------------
 */
//是时候去查询了
function queryStart() {
	var queryURL = '/*@echo URL_SOLA_TICKET_QUERY*/?token='+$('#token').val()+'&';
	NMFunc.reqServer(queryURL, list_queryDone, 0, solaDisappear);
}
//查询到结果了
function list_queryDone(data,param){
	$('#queryingToast').hide();
	if(!data.errCode){
		window.listResult = data;
		handlerResult();
	}else{
		NMFunc.result(1, 0, data.errMsg || '页面过期');
	}
}
//Sola消失了
function solaDisappear(){
	NMFunc.result(1,0,'Sola端出问题了,无法回应你的查询请求');
}
