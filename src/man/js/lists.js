/*对话框,消息,Toast配置管理*/
dlg_q = $('#dlg_q');
dlg_op = $('#dlg_op');
msg_q_err = $('#msg_q_error');
toast_loading = $('#toast_loading');



/*查询对话框功能*/
$('#btn_open_qdlg').click(function () {
	dlg_q.show();
});
$('#btn_query').click(function () {
	dlg_q.hide();
	queryAction(parseInt($('#sel_block').val()));
});
$('#btn_q_cancel').click(function () {
	dlg_q.hide();
	msg_q_err.hide();
});
$('#btn_op_cancel').click(function () {
	dlg_op.hide();
});

//默认查询当天情况
queryAction(0);


/**
 * 内置浏览器方法
 * 显示指定报修记录的报修历史
 * @param {Number} id 报修记录ID
 */
showTicketTrack = function(id) {
	$('#if_browser').attr('src', 'track.sub.html?token=' + $('#token').val() + '&id=' + id);
	$('#dlg_browser').show();
}

/*
 * -------------------------------------------
 * _______________查询方法_____________________
 * -------------------------------------------
 */
//XXX window.lastQuery 上一次查询的blockId
//查询动作,block可以为空,查询用户指定的,block为空也表示自动查询,非人工再次查询
function queryAction(block) {
	window.lastQuery = block;
	toast_loading.show();
	var queryURL = '/*@echo URL_SOLA_TICKET_LOOKUP*/?token=' + $('#token').val() + (block == undefined ? '&' : ('&block=' + block + '&'));
	NMFunc.reqServer(queryURL, lists_queryDone, block?1:0, solaDisappear);
}
//Sola消失了
function solaDisappear() {
	toast_loading.hide();
	alert('Sola端出问题了,无法回应你的请求\n \tˋ( ° ▽、° )');
}
//查询结束,result:[Boolean:byUser,String:timestamp]
function lists_queryDone(data, byUser) {
	toast_loading.hide();
	if (!data.errCode) {
		window.listResult = data;
		handlerResult();
		return;
	}
	if (data.errCode == -20)
		return NMFunc.result(1,0,'你还没有登录或页面超时');
	alert('查询出错:\n(' + data.errCode + ')' + data.errMsg);
	if (byUser) {
		msg_q_err.show();
		dlg_q.show();
	}
}

/*
 * ------------------------------------------
 * ________________处理结果___________________
 * ------------------------------------------
 */
//@XXX window.listResult
//@XXX window.tfOffset 表示表格填充时的位移,例如填充香晖苑(4)的时候前面已经过来10条记录,那么offset=10
function onFillTable(row, col, head) {
	switch (col) {
	case 0:
		return listResult[tfOffset + row].id;
	case 1:
		return userf.getStatHTML(listResult[tfOffset + row].status);
	case 2:
		return listResult[tfOffset + row].user.phone + '(' + listResult[tfOffset + row].user.name + ')';
	case 3:
		return userf.getAllInfo(
				listResult[tfOffset + row].user.block,
				listResult[tfOffset + row].user.room,
				listResult[tfOffset + row].user.isp) +
			'<br />{' + listResult[tfOffset + row].user.netAccount + '}';
	case 4:
		var tt = userf.getDate(listResult[tfOffset + row].submitTime);
		return tt.slice(tt.indexOf('年') + 1, tt.length); //Mini Time
	case 5:
		return userf.getDesc(listResult[tfOffset + row].description, true);
	}
}

window.tbColor = ['#FDFEFC', '#EDF7EA', '#F9F8EC', '#F9F0EC'];

function handlerResult() {
	var head = ['编号', '状态', '联系方式', '信息', '报修时间', '简述'];
	//表格填充位移从0开始
	window.tfOffset = 0;
	//为了解决手动添加的报修没有宿舍区块的显示问题
	while (!listResult[tfOffset].user.block) { tfOffset++; }
	//遍历区块ID,(十位):b
	for (var blockId = 1; blockId <= 8; blockId++) {
		//目前这块区域的报修量(即当前要填充的表格的数据长度)
		var currentCount = 0;
		var nextOffset = tfOffset;
		while (nextOffset < listResult.length && parseInt(listResult[nextOffset].user.block / 10) == blockId) {
			nextOffset++;
			currentCount++;
		}

		//跳过 6: 别墅 和 7: 保留片区
		if (blockId != 6 && blockId != 7) {
			$('#btn_more' + blockId + ' .weui_cell_ft').text(currentCount || '');

			var colorIndex = parseInt((currentCount + 2) / 3);
			var color = tbColor[colorIndex > 3 ? 3 : colorIndex];
			$('#btn_more' + blockId).css('background-color', color);
		
			var tb = $('#tb_ret' + blockId);
			tb.tableFill(head, currentCount, onFillTable);
			tb.lyTable();
		}

		//下一个填充表格的数据位移量增加
		tfOffset = nextOffset;
	}
	
	$('.table tbody tr').each(function (i) {
		$(this).attr('data-row', i);
	}).unbind('click').click(onClickTable);
}

//目前点击的对象
function onClickTable() {
	window.nowOpObj = listResult[parseInt($(this).attr('data-row'))];
	$('#text_op_brief').val('');
	dlg_op.show();
	$('#dlg_op_title').text(userf.getAllInfo(nowOpObj.user.block, nowOpObj.user.room, nowOpObj.user.isp));
}

/*
 * 当用户点击操作按钮时懂得响应事件: 处理记录提交
 */
window.onOpActionBtnClick = function(stat) {
	desc = $('#text_op_brief').val();
	if (desc.trim().length == 0) {
		alert('请填写维修简述!');
		return;
	}
	toast_loading.show();
	dlg_op.hide();
	var queryURL = '/*@echo URL_SOLA_TICKET_UPDATE*/?token=' + $('#token').val() + '&ticket=' + nowOpObj.id + '&status=' + stat + '&remark=' + encodeURIComponent(desc) + '&';
	NMFunc.reqServer(queryURL,lists_opDone, 0, solaDisappear);
}

/*
 * 操作结束
 */
lists_opDone = function(data, param) {
	toast_loading.hide();
	console.log(data);
	if (!data.errCode) {
		var extraInfo = '';
		if (data.user) {
			var user = data.user;
			extraInfo = '\n' + userf.getAllInfo(user.block,user.room,user.isp) + '{' + user.netAccount + '}';
		}
		alert('操作成功!' + extraInfo);
		queryAction(window.lastQuery);
	} else {
		alert('操作出错!(・□・、*)\n' + data.errMsg + '(' + data.errCode + ')');
		dlg_op.show();
	}
}

/**
 * 点击某个宿舍分类然后显示/隐藏结果
 * @author 刘越
 * @param {Number} item 分类ID
 */
window.lists_toggleResult = function (item) {
	//window.ltii 表示上一次显示的分类区块
	if (!window.ltii) window.ltii = 0;
	//如果就是上次显示的分类,就切换
	if (ltii == item) {
		$('#tb_ret' + ltii).toggle();
	} else {
		$('#tb_ret' + ltii).hide();
		$('#tb_ret' + item).show();
	}
	location.href = '#btn_more' + item;
	//记录上一次显示的分类区块
	window.ltii = item;
}