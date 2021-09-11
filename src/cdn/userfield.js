//UserField
window.userf = {
	'blockID'	:[],
	'ispID'		:[],
	'statID'	:[],
	'statHTMLID':[],
	'insertStyle':
		'/*给状态码上色的样式*/'+
		'.stat_done{color: #5CB85C;}'+
		'.stat_wait{color: #D9534F;}'+
		'.stat_warn{color: #F0AD4E;}'+
		'.stat_wait_again{color: #5BC0DE;}',
	'defStatHTML':'<span class="stat_warn">未知状况</span>',
	'defStat'	:'未知状态:',
	'defIsp'	:'其他',
	'defBlock'	:'',
	'getAllInfo':function(block,room,isp){
		return this.getBlock(block)+'-'+
			(room || '' )+'('+this.getIsp(isp)+')';
	},
	'getBlock':function(block){
		block = this.blockID[block];
		return block || this.defBlock;
	},
	'getIsp':function(isp){
		isp = this.ispID[isp];
		return isp || this.defIsp;
	},
	'getDate':function(milliseconds){
		var d = new Date(milliseconds);
		return this._22(d.getFullYear() % 100)+'年'
				+this._22(d.getMonth()+1)+'月'
				+this._22(d.getDate())+'日 '
				+this._22(d.getHours())+':'
				+this._22(d.getMinutes());
	},
	'_22':function(str){
		str='000'+str;
		return str.slice(-2,str.length)
	},
	'getStat':function(stat){
		return this.statID[stat] || this.defStat;
	},
	'getStatHTML':function(stat){
		return this.statHTMLID[stat] || this.defStatHTML;
	},
	'getDesc':function(desc,nl){
		desc = desc.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		if(nl)desc = desc.replace(/\n/g,'<br />')
		return desc;
	},
	'init' :function(){
		var ss = document.createElement("style");
		ss.appendChild(document.createTextNode(this.insertStyle));
		document.getElementsByTagName('body')[0].appendChild(ss);
		
		var t = this.statID;//tmp use
		
		t[0] = '待解决';
		t[4] = '已上报';
		t[2] = '改日修';
		t[9] = '已解决';
		
		t = this.statHTMLID;
		
		t[0] = '<span class="stat_wait">待解决</span>';
		t[4] = '<span class="stat_done">已上报</span>';
		t[2] = '<span class="stat_wait_again">改日修</span>';
		t[9] = '<span class="stat_done">已解决</span>';
		
		t = this.ispID;
		
		t[1] = '电信';
		t[2] = '联通';
		t[3] = '移动';
		
		t = this.blockID;
		
		t[10] = '18栋';
		t[11] = '19栋';
		t[12] = '16栋';
		t[13] = '17栋';
		
		t[20] = '7栋';
		t[21] = '8栋';
		t[22] = '9栋';
		t[23] = '10栋';
		t[24] = '11栋';
		
		t[30] = '12栋';
		t[31] = '13栋';
		t[32] = '14栋';
		t[33] = '15栋';
		t[34] = '20栋';
		t[35] = '21栋';
		t[36] = '22栋A';
		t[37] = '22栋B';
		
		t[40] = '香晖苑A';
		t[41] = '香晖苑B';
		t[42] = '香晖苑C';
		t[43] = '香晖苑D';
		
		t[50] = '1栋';
		t[51] = '2栋';
		t[52] = '3栋';
		t[53] = '4栋';
		t[54] = '5栋';
		t[55] = '6栋';

		t[60] = '别墅1栋';
		t[61] = '别墅2栋';
		t[62] = '别墅3栋';
		t[63] = '别墅4栋';
		t[64] = '别墅5栋';
		t[65] = '别墅6栋';
		t[66] = '别墅7栋';
		t[67] = '别墅8栋';
		t[68] = '别墅9栋';
		
		t[80] = '朝晖苑';

	},
};
userf.init();
