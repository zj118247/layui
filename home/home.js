layui.use("element", function() {
	var element = layui.element;
	var globalTabIdIndex = 0;
	 
	 
	 //iframe自适应
$(window).on('resize', function() {
	
	console.log(555)
    var $content = $('#larry-tab .layui-tab-content');
    $content.height($(this).height() - 136);
    $content.find('iframe').each(function() {
      $(this).height($content.height());
    });
    tab_W = $('#larry-tab').width();
    // larry-footer：p-admin宽度设定
    var larryFoot = $('#larry-footer').width();
    $('#larry-footer p.p-admin').width(larryFoot - 300);
}).resize();
	
	
	
	
	
	
	$(function() {
//		$("#slideScroll").click(function() {
	
			
			$("#slideScroll").children("ul").find("li").each(function() {
				var $this = $(this);
				if($this.find('dl').length > 0) {
					$this.find("dd").each(function() {
						$(this).click(function() {
							var $a = $(this).children('a');
							var href = $a.data('url');
							var icon = $a.children('i:first').data('icon');
							var title = $a.children('span').text();
							var data = {
								"href": href,
								"icon": icon,
								"title": title,
							}
							tabAdd(data);
							res()
						})
					})

				} else {
					$this.click(function() {
						console.log(99)
						var $a = $(this).children('a');
						var href = $a.data('url');
						var icon = $a.children('i:first').data('icon');
						var title = $a.children('span').text();
						var data = {
							href: href,
							icon: icon,
							title: title
						}
						tabAdd(data);
						res()
						
					});

				}

			})

		$("#admin-home").on("contextmenu",function(){
			return false
		})
		
		/*
		var $container1 = $(".layui-tab"),
			titleBox1 = $container1.children('ul.layui-tab-title');
		var tabTitle="";
		
		titleBox1.find("li").each(function(){
		
			$(this).on("contextmenu",function(ev){
				tabTitle=$(this).find("em").text();
				console.log(tabTitle)
				ev.preventDefault();
				console.log(ev.pageX-200);
				var left=ev.pageX-200;
				$(".rightJ").css({"top":ev.offsetY+'px',"left":left+'px'}).show();
			})
		})
		
		$(".rightJ").hover(function(){
			$(this).show();
		},function(){
			$(this).hide()
		})
		
		$(".rightJ button").each(function(index){
			$(this).click(function(){
				var dd=$(this).data("name");
				console.log(dd);
			})
		})
		*/
		
		$(".rightJ button").each(function(index){
			$(this).click(function(){
				var dd=$(this).data("name");
				console.log(dd);
				var Id=$(this).data("id");
				
				switch(dd){
					case "refreshCurrent":
					console.log("刷新页面")
					console.log($("iframe[data-id='" + Id + "']").attr("src"));
						$("iframe[data-id='" + Id + "']").attr("src", $("iframe[data-id='" + Id + "']").attr("src")) //刷新框架
					break;
					case "closeCurrent":
					console.log("关闭当前页面")
					element.tabDelete('demo', Id); //删除
					break;
					
					case "closeOthers":
					console.log("关闭其他页面");
					
					var tabtitle = $(".layui-tab-title li");
					$.each(tabtitle, function(i) {
						if ($(this).attr("lay-id") != Id) {
							element.tabDelete('demo', $(this).attr("lay-id")); //删除
						}
					})
					
					break;
					
					case "closeAll":
					console.log("关闭所有页面")
					var tabtitle = $(".layui-tab-title li");
					$.each(tabtitle, function(i) {
						element.tabDelete('demo', $(this).attr("lay-id")); //删除
					})
					
					break;
					
				}
				
				
			})
		})
	
		$(".right").click(function(){
			$(".layui-side").animate({"left":"-200px"},500);
			$(".layui-body").animate({"left":"0px"},500);
			$(".layui-layout-admin .layui-footer").animate({"left":"0px"},500);
			
			$(this).hide();
			$(".left").show();
		});
		$(".left").click(function(){
			$(".layui-side").animate({"left":"0px"},500);
			$(".layui-body").animate({"left":"200px"},500);
			$(".layui-layout-admin .layui-footer").animate({"left":"200px"},500);
			$(this).hide();
			$(".right").show();
		})
		
		
		
	})

	function res(){
			
		    var $content = $('#larry-tab .layui-tab-content');
		    $content.height($(window).height() - 136);
		    $content.find('iframe').each(function() {
		      $(this).height($content.height());
		    });
		    tab_W = $('#larry-tab').width();
		    // larry-footer：p-admin宽度设定
		    var larryFoot = $('#larry-footer').width();
		    $('#larry-footer p.p-admin').width(larryFoot - 300);
	}

	function tabAdd(data) {
		var $container = $(".layui-tab"),
			titleBox = $container.children('ul.layui-tab-title');
		var tabIndex = exists(data.title);

		if(tabIndex === -1) {
			//不存在
			globalTabIdIndex++;
			var content = '<iframe src="' + data.href + '" data-id="' + globalTabIdIndex + '"></iframe>';
			var title = '<i class="' + data.icon + '"></i><em>' + data.title + '</em>';
			title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + globalTabIdIndex + '">&#x1006;</i>';

			//添加tab
			element.tabAdd('demo', {
				title: title,
				content: content,
				id: globalTabIdIndex

			});
			$(".layui-tab-title li[lay-id=" + globalTabIdIndex + "]").mouseover(function() {
				console.log()
					var tabId = $(this).attr("lay-id");
					CustomRightClick(tabId); //给tab绑定右击事件
//					FrameWH(); //计算ifram层的大小
			});
			
			titleBox.find('li').children('i.layui-tab-close[data-id=' + globalTabIdIndex + ']').on('click', function() {
				console.log("删除")

				var ss=$(this).parent('li').attr('lay-id');
				console.log(ss)
				element.tabDelete("demo", $(this).parent('li').attr('lay-id'));
				
				
			});
			setTimeout(function(){
				element.tabChange("demo", globalTabIdIndex);
			},50)

		} else {
			//已存在
			element.tabChange("demo", tabIndex);
			$("iframe[src='"+data.href+"']").attr('src', data.href);
			
			return false;
		}
	}
		function CustomRightClick(id) {
			//取消右键  rightmenu属性开始是隐藏的 ，当右击的时候显示，左击的时候隐藏
			$('.layui-tab-title li').on('contextmenu', function() {
				return false;
			})
			$('.layui-tab-title,.layui-tab-title li').click(function() {
				$('.rightJ').hide();
			});
			//单击取消右键菜单
			$('body,#aaa').click(function() {
				$('.rightJ').hide();
			});
			//tab点击右键 
			$('.layui-tab-title li').on('contextmenu', function(e) {
				var popupmenu = $(".rightJ");
				popupmenu.find("button").attr("data-id", id); //在右键菜单中的标签绑定id属性
				//判断右侧菜单的位置 
//				l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;
//				t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;
				
				l=e.pageX-200;
				t=e.offsetY;
				popupmenu.css({
					left: l,
					top: t
				}).show(); //进行绝对定位
				return false;
			});
		}
 


	function exists(title) { //判断选项卡是否存在并设置变量
		var $container = $(".layui-tab"),
			titleBox = $container.children('ul.layui-tab-title'),
			tabIndex = -1;
		titleBox.find('li').each(function(i, e) {
			var $em = $(this).children('em');
			if($em.text() === title) {
				tabIndex = $(this).attr("lay-id");
			};
		});
		return tabIndex;
	};

});