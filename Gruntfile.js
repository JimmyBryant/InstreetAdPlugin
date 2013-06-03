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
		 	src:['pinad/js/dist/instreet.pinad.js']
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
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default',['concat','jshint','uglify','cssmin']);

};