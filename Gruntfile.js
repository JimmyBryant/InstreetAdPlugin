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
		 		scripturl:true
		 	},		 			 	
		 	src:['default/js/src/*.js']
		 },
		 uglify: {
			options: {			    
				banner: '/*!<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			'default':{
				options: {			    
					banner: '/*!default.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
				  'default/js/instreet.default.min.js': ['default/js/instreet.default.js'],
				}
			}
			  		  
		  },
		  concat:{
		  	options: {

		    },
		    dist: {
		      src: ['pinad/js/src/intro.js','pinad/js/src/config.js','pinad/js/src/cache.js','pinad/js/src/util-ev.js','pinad/js/src/ready.js', 
		      		'pinad/js/src/slide.js','pinad/js/src/util-instreet.js','pinad/js/src/module.js', 'pinad/js/src/outro.js'],
		      dest: 'pinad/js/dist/instreet.pinad.js'
		    }
		  }

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default',['jshint','uglify']);
	
};