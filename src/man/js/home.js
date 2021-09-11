if (Math.random() > 0.93) { 
	var easterEgg = document.getElementById('homeDescTxt');
	if (easterEgg) { easterEgg.innerHTML = '😜 报修单多吗? 加油!'; }
}

SToken.opera = 10;
//显示权限足够显示的项目
SToken.checkCallback = function(data,param){
	//data && data.operator 如果没有,直接结束
	var opta = data.operator.access,p = '[data-permit=',e = 'es[i].className';
	//对指定的CSS筛选语句出来的DOM元素数组进行批量显示操作
	var show = function(q){
		var es = document.querySelectorAll(q);
		eval('for(var i=0;i<es.length;i++)'+e+'='+e+'.replace("hide","");');
	}
	//显示各个权限能看的操作
	opta > 3 || show(p+'KTM]');
	opta > 6 || show(p+'PKA]');
	show(p+'LBN]');
	data.operator.id == 1514 && confirm('老司机,准备开车了.B~B~B~');
}