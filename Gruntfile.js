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
		      src: ['default/js/src/intro.js','default/js/src/config.js','default/js/src/cache.js','default/js/src/util-ev.js','default/js/src/ready.js', 
		      		'default/js/src/slide.js','default/js/src/util-instreet.js','default/js/src/module.js', 'default/js/src/outro.js'],
		      dest: 'default/js/dist/instreet.default.js'
		    }
		  }

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default',['jshint','uglify']);
	
};