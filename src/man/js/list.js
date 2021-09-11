(function(){
	//暴露this给私有方法
	var self = this;
	
	//获取查询范围
	listStat = NMFunc.getURLParam('stat');
	//查询当日,修正显示
	var isToday = listStat == 'today';
	updateHead(isToday && '今日待修',
			   isToday ? '开动吧,少年.今日的主线任务等着你  <(￣︶￣)/' : '查看报修记录');

	// 表格需要显示的列
	list_tbHead = ['状态', '联系方式', '信息', '报修时间', '简述'];

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
		if(new Date().getTime() - (window.fuckios || 0) < 500)
			return ;
		dlg_q.hide();
		queryAction(parseInt($('#sel_block').val()));
	});
	$('#btn_q_cancel').click(function () {
		if(new Date().getTime() - (window.fuckios || 0) < 500)
			return ;
		dlg_q.hide();
		msg_q_err.hide();
	});
	$('#btn_op_cancel').click(function () {
		dlg_op.hide();
	});

	//默认查询当天情况
	queryAction();

	/**
	 * 内置浏览器方法
	 * 显示指定报修记录的报修历史
	 * @param {Number} id 报修记录ID
	 */
	window.showTicketTrack = function(id) {
		$('#if_browser').attr('src', 'track.sub.html?token=' + $('#token').val() + '&id=' + id);
		$('#dlg_browser').show();
	}
	
	function updateHead(title, desc){
		$('#text_title').text(title || '报修记录');
		$('#text_brief').text(desc);
	}
	
	/*
	 * -------------------------------------------
	 * _______________查询方法_____________________
	 * -------------------------------------------
	 */
	//XXX window.lastQuery 上一次查询的blockId, 便于对某单记录进行操作后重新查询一次
	//查询动作,block可以为空,查询用户指定的,block为空也表示自动查询,非人工再次查询
	function queryAction(block) {
		window.lastQuery = block;
		toast_loading.show();
		var queryURL = '/*@echo URL_SOLA_TICKET_LOOKUP*/?token=' + $('#token').val() + (block ? ('&block=' + block + '&') : '&');
		NMFunc.reqServer(queryURL, list_queryDone, block?1:0, solaDisappear);
		if (block) {
			var blockName = '火星';
			$('#sel_block option').each(function () {
				if ($(this).val() == block) blockName = $(this).text();
			});
			updateHead(0, blockName + '- 未修记录');
		}
	}

	//Sola消失了
	function solaDisappear() {
		toast_loading.hide();
		alert('Sola端出问题了,无法回应你的请求\n \tˋ( ° ▽、° )');
	}

	//查询结束,result:[Boolean:byUser,String:timestamp]
	function list_queryDone(data, byUser) {
		toast_loading.hide();
		if (data.errCode == -20)
			return NMFunc.result(1,0,'你还没有登录或页面超时');
		if (data.errCode) {
			alert('查询出错:\n(' + data.errCode + ')' + data.errMsg);
			return byUser && (msg_q_err.show(), dlg_q.show());
		}
			
		listResult = [];
		//只有状态码为0或2才能显示(除开已上报)
		for(var i in data)
			showMe(data[i]) && listResult.push(data[i]);
		var tb = $('#tb_ret');
		tb.tableFill(list_tbHead, listResult.length, onFillTable);
		tb.lyTable();
		$('#tb_ret tbody tr').each(function (i) {
			$(this).attr('data-row', i);
		}).unbind('click').click(onClickTable);
		
	}
	//判断一条记录是否已改被显示
	function showMe(item){
		return !item.status || (item.status==2 && item.updateTime && (new Date()).getTime() - item.updateTime > 10 * 60 * 60 * 1000);
	}

	/*
	 * ------------------------------------------
	 * ________________处理结果___________________
	 * ------------------------------------------
	 */
	//填充表格
	function onFillTable(row, col, head) {//1459241852000/1459370058000/1459370179627
		var d = listResult[row];
		switch (col) {
		case 0:
			return userf.getStatHTML(d.status);
		case 1:
			return d.user.phone + '(' + d.user.name + ')';
		case 2:
			return '<b style="font-size: 120%">' + userf.getAllInfo(
					d.user.block,
					d.user.room,
					d.user.isp) + '</b>';
		case 3:
			var tt = userf.getDate(d.submitTime);
			return tt.slice(tt.indexOf('年') + 1, tt.length); //Mini Time
		case 4:
			return userf.getDesc(d.description, true);
		}
	}

	//点击查询得到的列表时的响应事件
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
		NMFunc.reqServer(queryURL, list_opDone);
		window.solat = setTimeout(solaDisappear, 8000);
	}
	/*
	 * 操作结束
	 */
	window.list_opDone = function(data, param) {
		clearTimeout(window.solat);
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

})();