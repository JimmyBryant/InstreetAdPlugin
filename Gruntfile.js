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
		 	sprint:['sprint/js/dist/instreet.sprint.js'],
		 	metro:['metro/js/dist/instreet.metro.js'],
		 	msncouplet:['msncouplet/js/dist/instreet.msncouplet.js']
		 },
		 uglify: {
			options: {
				banner: '/*!<%= grunt.template.today("yyyy-mm-dd H:mm:ss") %> */\n'
			},
			pinad:{
				files: {
				  'pinad/js/dist/instreet.pinad.min.js': ['pinad/js/dist/instreet.pinad.js'],
				}
			},
			sprint:{
				files: {
					'sprint/js/dist/instreet.sprint.min.js':['sprint/js/dist/instreet.sprint.js'],
					'sprint/js/dist/instreet.sprint.zhonghua.min.js':['sprint/js/dist/instreet.sprint.zhonghua.js'],
				}
			},
			msncouplet:{
				files: {
					'msncouplet/js/dist/instreet.msncouplet.min.js':['msncouplet/js/dist/instreet.msncouplet.js'],
				}
			},
			ifeng:{
				files: {
				  'blue/js/instreet.ifeng.min.js': ['blue/js/instreet.ifeng.js'],
				}
			},
			metro:{
				files: {
				  'metro/js/dist/instreet.metro.min.js': ['metro/js/instreet.metro.js'],
				}
			},
			default:{
				files: {
				  'default/js/instreet.default.min.js': ['default/js/instreet.default.js'],
				}
			}

		  },
		  cssmin:{
	  		options: {
		    	banner: '/* minified css file <%= grunt.template.today("yyyy-mm-dd") %>*/'
		    },
		  	minify:{
			    files:{
			    	'pinad/css/instreet.pinad.min.css':'pinad/css/instreet.pinad.css'
			    }
		  	},
		    sprint:{
			    files:{
		    		'sprint/css/instreet.sprint.min.css':'sprint/css/instreet.sprint.css'
		   		}
		    },
		    metro:{
			    files:{
		    		'metro/css/instreet.metro.min.css':'metro/css/instreet.metro.css'
		   		}
		    },
		    msncouplet:{
			    files:{
		    		'msncouplet/css/instreet.msncouplet.min.css':'msncouplet/css/instreet.msncouplet.css'
		   		}
		    }
		  },
		  concat:{
		  	options: {

		    },
		    metro: {
				src: ['metro/js/src/intro.js','metro/js/src/config.js','metro/js/src/util-ev.js','metro/js/src/ready.js','metro/js/src/css.js','metro/js/src/anim.js',
					'metro/js/src/request.js','metro/js/src/metro.js','metro/js/src/app.js','metro/js/src/record.js', 'metro/js/src/outro.js'],
				dest: 'metro/js/dist/instreet.metro.js'
		    },
		    pinad: {
				src: ['pinad/js/src/intro.js','pinad/js/src/config.js','pinad/js/src/cache.js','pinad/js/src/util-ev.js','pinad/js/src/ready.js',
						'pinad/js/src/slide.js','pinad/js/src/util-instreet.js','pinad/js/src/module.js','pinad/js/src/record.js', 'pinad/js/src/outro.js'],
				dest: 'pinad/js/dist/instreet.pinad.js'
		    },
		    sprint:{
				src: ['sprint/js/src/intro.js','sprint/js/src/config.js','sprint/js/src/util-ev.js','sprint/js/src/ready.js','sprint/js/src/css.js','sprint/js/src/anim.js',
						'sprint/js/src/cache.js','sprint/js/src/sprint.js','sprint/js/src/record.js','sprint/js/src/app.js','sprint/js/src/outro.js'],
				dest: 'sprint/js/dist/instreet.sprint.js'
		    },
		    msncouplet:{
				src: ['msncouplet/js/src/intro.js','msncouplet/js/src/config.js','msncouplet/js/src/util-ev.js','msncouplet/js/src/ready.js',
						'msncouplet/js/src/cache.js','msncouplet/js/src/couplet.js','msncouplet/js/src/tick.js','msncouplet/js/src/outro.js'],
				dest: 'msncouplet/js/dist/instreet.msncouplet.js'
		    }
		  }

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('pinad',['concat:pinad','jshint','uglify','cssmin']);
	grunt.registerTask('sprint',['concat:sprint','jshint:sprint','uglify:sprint','cssmin:sprint']);
	grunt.registerTask('metro',['concat:metro','jshint:metro','uglify:metro','cssmin:metro']);
	grunt.registerTask('msncouplet',['concat:msncouplet','jshint:msncouplet','uglify:msncouplet','cssmin:msncouplet']);

};