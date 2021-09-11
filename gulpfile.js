/*
 * A gulpfile created by LiuYue(hangxingliu)
 * 2016/03/26 Version 3.0 
 * A Gulp Scipt To Quickly Build NetMaintain Platform)
 */
//允许了Js文件中使用preprocess
/*
 * 构建源码说明:
 * *.part.html 会当作HTML部件,在最终的发布版中会被删除(但是可以被include到其他html文件中)
 * *.min.js/*.min.css 会被当作已压缩过了的文件,不予与压缩处理
 */

//加载构建选项版本
var builder = require('./build_config.js');

//源代码目录
var SRC = builder._src;
//生成目录
var DEST = 'dist/tmp';
//版本名称
var VERSION = 'temp version';
//注释信息
var COMMENT = '临时测试版本';
//是否压缩CSS和JS
var MINI_JS = false;
var MINI_CSS = false;
var MINI_HTML = false;
//默认的清理参数
var OPT_CLEAN = builder._clean_cfg;
//默认的HTML压缩参数
var OPT_HTML_COMPRESS = builder._html_compress_cfg;

//装载指定的构建配置
var buildCfgName = process.argv[process.argv.length - 1];
if (buildCfgName && buildCfgName[0] == '-') {
	buildCfgName = buildCfgName.slice(1);
	if(builder[buildCfgName]){
		var buildCfg = builder[buildCfgName];
		DEST = buildCfg.dest;
		COMMENT = buildCfg.comment;
		VERSION = buildCfg.version;
		MINI_JS = buildCfg.compress[0];
		MINI_CSS = buildCfg.compress[1];
		MINI_HTML = buildCfg.compress[2];
		
		console.log('--------------------------');
		console.log('构建配置 "' + COMMENT + '" 加载成功!');
		console.log('--------------------------');
	}else{
		console.log('"' + buildCfgName + '" (指定构建配置不存在!)');
		process.exit();
	}
}


//默认的Preprocess参数
var PREPROCESS_PARAMS = {
	context: {
		//时间参数更新引入文件
		TIME: (new Date()).getTime(),
		//版本
		VERSION: VERSION
	}
};

//加载URL参数
var urls_obj = require('./url_config.js');
var urls = urls_obj.release_urls;
for (var url_key in urls) {
	eval("PREPROCESS_PARAMS.context.URL_" + url_key.toUpperCase() + " = urls." + url_key + ";");
}

//加载字段
var fields_obj = require('./field_config.js');
var fields = fields_obj.release_fields;
for (var field_key in fields) {
	eval("PREPROCESS_PARAMS.context.MSG_" + field_key.toUpperCase() + " = fields." + field_key + ";");
}

//console.log(JSON.stringify(PREPROCESS_PARAMS.context,null,4));

var HELP = [
	'', '',
	'----------------------',
	'gulp [help]: 查看脚本帮助',
	'gulp (go|build): 编译优化源代码',
	'gulp (watch|live|edit) : 实时编译优化源代码(首先会编译优化一次)',
	'----------',
	'在 (go/watch/live/edit)参数后面可带参数:',
	'\t-XX :表示以XX构建配置构建编译',
	'----------------------',
	'刘越,16/03/26', ''
];


var DEST_PATH = DEST + '/';
var SRC_PATH = SRC + '/';

//-------------____引入一些必要的Gulp外挂____-------------------
var g = require("gulp");
var cleaner = require("gulp-clean");
var minijs = require('gulp-uglify');
var minicss = require('gulp-clean-css');
var minihtml = require('gulp-htmlmin');
var pp = require('gulp-preprocess');
var runSeq = require('gulp-sequence');


g.task('default', ['help']);
g.task('help', function () {
	for (var i = 0; i < HELP.length; i++)
		console.log(HELP[i]);
});

//编译构建
g.task('build',['go']);

g.task('go', runSeq('copy_all_files', ['handler_all_css', 'handler_all_js', 'handler_html']));

g.task('live', ['watch']);
g.task('edit', ['watch']);

//监视文件变动
g.task('watch', ['go'], function () {
	g.watch(SRC_PATH + '**/*', function (event) {
		console.log(event.type + ': ' + event.path);
		if (event.type == 'deleted' || event.type == 'added') return;
		var path = event.path;
		var index = path.lastIndexOf('.');
		var suffix = index == -1 ? '' : path.slice(index + 1);
		var isMin = index == -1 ? false : (path.slice(index - 4, index) == '.min');
		switch (suffix) {
		case 'js':
			g.start(isMin ? 'handler_min_js' : 'handler_js');
			break;
		case 'css':
			g.start(isMin ? 'handler_min_css' : 'handler_css');
			break;
		case 'html':
			g.start('handler_html');
			break;
		default:
			g.start('default');
		}
	});
});

/*--------------------------CSS------------------------------*/
g.task('handler_all_css', ['handler_css', 'handler_min_css']);
g.task('handler_css', ['clean_css'], function () {
	var s = g.src([SRC_PATH + '**/*.css', '!' + SRC_PATH + '**/*.min.css']);
	if (MINI_CSS) s = s.pipe(minicss());
	s = s.pipe(g.dest(DEST_PATH));
	return s;
});
g.task('clean_css', function () {
	var s = g.src([DEST_PATH + '**/*.css', '!' + DEST_PATH + '**/*.min.css'], {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});
g.task('handler_min_css', ['clean_min_css'], function () {
	var s = g.src(SRC_PATH + '**/*.min.css').pipe(g.dest(DEST_PATH));
	return s;
});
g.task('clean_min_css', function () {
	var s = g.src(DEST_PATH + '**/*.min.css', {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});

/*-------------------Javascript-----------------------------*/
g.task('handler_all_js', ['handler_js', 'handler_min_js']);
g.task('handler_js', ['clean_js'], function () {
	var s = g.src([SRC_PATH + '**/*.js', '!' + SRC_PATH + '**/*.min.js']);
	s = s.pipe(pp(PREPROCESS_PARAMS))
		.on('error', function (err) {
			console.error(err);
			this.emit('end');
		});
	if (MINI_JS) s = s.pipe(minijs());
	s = s.pipe(g.dest(DEST_PATH));
	return s;
});
g.task('clean_js', function () {
	var s = g.src([DEST_PATH + '**/*.js', '!' + DEST_PATH + '**/*.min.js'], {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});
g.task('handler_min_js', ['clean_min_js'], function () {
	var s = g.src(SRC_PATH + '**/*.min.js').pipe(g.dest(DEST_PATH));
	return s;
});
g.task('clean_min_js', function () {
	var s = g.src(DEST_PATH + '**/*.min.js', {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});


/*-------------------HTML-----------------------------*/
g.task('handler_html', ['clean_html'], function () {
	var s = g.src(['./' + SRC_PATH + '**/*.html', '!./' + SRC_PATH + '**/*.part.html'])
		.pipe(pp(PREPROCESS_PARAMS))
		.on('error', function (err) {
			console.error(err);
			this.emit('end');
		});
		if (MINI_HTML) s = s.pipe(minihtml(OPT_HTML_COMPRESS));
		s = s.pipe(g.dest(DEST_PATH));
	return s;
});
g.task('clean_html', function () {
	var s = g.src([
		'./' + DEST_PATH + '**/*.html', './' + DEST_PATH + '**/*.html'
	], {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});


/*-------------------ALL-----------------------------*/
g.task('copy_all_files', ['clean_all'], function () {
	var s = g.src('./' + SRC_PATH + '**', {
			'base': ''
		})
		.pipe(g.dest(DEST_PATH));
	return s;
});
//清空dist目录
g.task('clean_all', function () {
	var s = g.src([DEST_PATH + '*'], {
		'read': false
	}).pipe(cleaner(OPT_CLEAN));
	return s;
});