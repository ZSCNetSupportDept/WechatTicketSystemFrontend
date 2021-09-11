//代码构建配置文件
var build_config = {
	//调试版
	debug	: {
		comment		: '非主线调试',
		dest		: 'dist/debug',
		version		: 'debug',
		compress	: [true,false,false],
	},
	//v2调试版
	v2d		: {
		comment		: 'v2调试版',
		dest		: 'dist/v2',
		version		: 'v2 debug',
		compress	: [false,false,false],//js,css,html
	},
	
	//v2发布版
	v2		: {
		comment		: 'v2发布版',
		dest		: 'dist/v2',
		version		: 'v2 prod',
		compress	: [true,true,true],//js,css,html
	},
	
	
	//源文件目录
	_src	: 'src',
	//清理选项
	_clean_cfg : {},
	//HTML压缩选项
	_html_compress_cfg	: {
		removeComments : true,//去除注释
		collapseWhitespace : true,//去掉空格
		conservativeCollapse : true,//去掉空格但保留一个空格
		collapseBooleanAttributes : true,//去掉布尔值HTML属性的值
		removeAttributeQuotes : false,//不去掉可以去掉的HTML属性值的引号
		minifyJS : true,
		minifyCSS : true,
	},
	
};
module.exports = build_config;