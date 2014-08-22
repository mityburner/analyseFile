//包装函数
module.exports = function(grunt) {

'use strict';

//任务配置
grunt.initConfig({
	//读取package文件
	pkg: grunt.file.readJSON('package.json'),

	//配置 concat 任务
	concat: {
		cat: {
			src: ['src/amd.js','src/math.js','src/jquery.js','src/main.js', 'src/date.js'],
			dest: 'src/<%= pkg.name %>.js'
		}
	},
	//配置 uglify 任务
	uglify: {
		build: {
			src: 'src/<%= pkg.name %>.js',
			dest: 'dest/<%= pkg.name %>.min.js'
		}
	},
	//配置 watch 任务
	watch: {
		files: ['<%= concat.cat.src %>', 'Gruntfile.js'],
		tasks: ['concat:cat', 'uglify']
	}
});



//任务加载
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');




//默认执行的任务
grunt.registerTask('default', ['concat:cat', 'uglify']);


};