//包装函数
module.exports = function(grunt) {

'use strict';

//任务配置
grunt.initConfig({
	//读取package文件
	pkg: grunt.file.readJSON('package.json'),
	
	//配置 jshint任务 【作用：语法检查】
	jshint: {
		all: ['src/*.js']
	},
	//配置 autoprefixer 任务【作用：自动补齐css前缀】
	autoprefixer: {
		dist: {
			src: 'src/style.css',
			dest: 'dest/style.css'
		}
	},
	//配置 cssmin 任务 【作用：压缩css文件】
	cssmin: {
		css:{
			files:{'dest/style.min.css' : 'dest/style.css'}
		}
	},
	
	//配置 concat 任务【作用：拼接文件】
	concat: {
		cat: {
			src: ['src/amd.js','src/math.js','src/jquery.js','src/main.js', 'src/date.js'],
			dest: 'src/<%= pkg.name %>.js'
		}
	},
	//配置 uglify 任务【作用：压缩js文件】
	uglify: {
		build: {
			src: 'src/<%= pkg.name %>.js',
			dest: 'dest/<%= pkg.name %>.min.js'
		}
	},
	//配置 watch 任务【作用：监视文件，当文件发生变化时执行相关任务】
	watch: {
		files: ['<%= concat.cat.src %>', 'Gruntfile.js'],
		tasks: ['concat:cat', 'uglify']
	}
});



//任务加载
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-cssmin');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');




//默认执行的任务
grunt.registerTask('default', ['jshint', 'autoprefixer', 'cssmin', 'concat:cat', 'uglify']);


};
