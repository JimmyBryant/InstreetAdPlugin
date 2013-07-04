	var instreet={	//instreet对象

		init :function(){

			var cssurl=config.cssurl;
			ev.importFile('css',cssurl);
			instreet.createContainer();

		},
		createContainer: function(){						//创建广告容器
	       var container=document.createElement('div'),
		       spotBox=document.createElement('div');
		   container.id="instreet-plugin-container";
		   spotBox.id="instreet-plugin-spotbox";
		   instreet.container=container;
		   instreet.spotBox=spotBox;
		   container.appendChild(spotBox);
		   document.body.children&&document.body.insertBefore(container,document.body.firstChild);
		}

	};