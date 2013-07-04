module.exports = function(grunt) {
	grunt.initConfig({
		 pkg: grunt.file.readJSON('package.json'),
		 jshint:{
		 	options:{
		 		immed:true,
		 		laxbreak:true,
		 		browser: true,
		 		evil:true,
		 		laxcomma:true,
		 		scripturl:true,
		 		smarttabs:true,
		 		expr:true
		 	},
		 	src:['pinad/js/dist/instreet.pinad.js'],
		 	sprint:['sprint/js/dist/instreet.sprint.js']
		 },
		 uglify: {
			options: {
				banner: '/*!<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			pinad:{
				options: {
					banner: '/*!pinad.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
				  'pinad/js/dist/instreet.pinad.min.js': ['pinad/js/dist/instreet.pinad.js'],
				}
			},
			sprint:{
				files: {
					'sprint/js/dist/instreet.sprint.min.js':['sprint/js/dist/instreet.sprint.js'],
				}
			},
			ifeng:{
				files: {
				  'blue/js/instreet.ifeng.min.js': ['blue/js/instreet.ifeng.js'],
				}
			},
			metro:{
				files: {
				  'metro/js/instreet.metro.min.js': ['metro/js/instreet.metro.js'],
				}
			},
			default:{
				files: {
				  'default/js/instreet.default.min.js': ['default/js/instreet.default.js'],
				}
			}

		  },
		  cssmin:{
		  	minify:{
		  		options: {
			    	banner: '/* minified css file */'
			    },
			    files:{
			    	'pinad/css/instreet.pinad.min.css':'pinad/css/instreet.pinad.css'
			    }
		  	}
		  },
		  concat:{
		  	options: {

		    },
		    pinad: {
		      src: ['pinad/js/src/intro.js','pinad/js/src/config.js','pinad/js/src/cache.js','pinad/js/src/util-ev.js','pinad/js/src/ready.js',
		      		'pinad/js/src/slide.js','pinad/js/src/util-instreet.js','pinad/js/src/module.js','pinad/js/src/record.js', 'pinad/js/src/outro.js'],
		      dest: 'pinad/js/dist/instreet.pinad.js'
		    },
		    sprint:{
		      src: ['sprint/js/src/intro.js','sprint/js/src/config.js','sprint/js/src/util-ev.js','sprint/js/src/ready.js','sprint/js/src/css.js',
		      		'sprint/js/src/anim.js','sprint/js/src/cache.js','sprint/js/src/util-instreet.js','sprint/js/src/sprint.js', 'sprint/js/src/outro.js'],
		      dest: 'sprint/js/dist/instreet.sprint.js'
		    }
		  }

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('pinad',['concat:pinad','jshint','uglify','cssmin']);
	grunt.registerTask('sprint',['concat:sprint','jshint:sprint','uglify:sprint']);

};