	layui.use('element', function() {
		var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
 
		//触发事件
		var active = {
			//在这里给active绑定几项事件，后面可通过active调用这些事件
			tabAdd: function(url, id, name) {
				//新增一个Tab项 传入三个参数，分别是tab页面的地址，还有一个规定的id，对应其标题，是标签中data-id的属性值
				//关于tabAdd的方法所传入的参数可看layui的开发文档中基础方法部分
				element.tabAdd('home-tabs', {
					title: name,
					content: '<iframe id="aaa" data-frameid="' + id + '" scrolling="auto" frameborder="0" src="' + url +
						'" style="width:100%;height:99%;"></iframe>',
					id: id //规定好的id
				})
				//通过鼠标mouseover事件  动态将新增的tab下的li标签绑定鼠标右键功能的菜单   
				//下面的json.id是动态新增Tab的id，一定要传入这个id,避免重复加载mouseover数据
				$(".layui-tab-title li[lay-id=" + id + "]").mouseover(function() {
					var tabId = $(this).attr("lay-id");
					CustomRightClick(tabId); //给tab绑定右击事件
					FrameWH(); //计算ifram层的大小
				});
			},
			tabChange: function(id) {
				//切换到指定Tab项
				element.tabChange('home-tabs', id); //根据传入的id传入到指定的tab项
			},
			tabDelete: function(id) {
				element.tabDelete('home-tabs', id); //删除
			},
			tabRefresh: function(id) { //刷新页面
				$("iframe[data-frameid='" + id + "']").attr("src", $("iframe[data-frameid='" + id + "']").attr("src")) //刷新框架
			}
		};
 
		//当点击有site-demo-active属性的标签时，即左侧菜单栏中内容 ，触发点击事件
		$('.site-demo-active').on('click', function() {
			var dataid = $(this);
 
			//这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
			if ($(".layui-tab-title li[lay-id]").length <= 0) {
				//如果比零小，则直接打开新的tab项
				active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"), dataid.attr("data-title"));
			} else {
				//否则判断该tab项是否以及存在
 
				var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
				$.each($(".layui-tab-title li[lay-id]"), function() {
					//如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
					if ($(this).attr("lay-id") == dataid.attr("data-id")) {
						isData = true;
					}
				})
				if (isData == false) {
					//标志为false 新增一个tab项
					active.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"), dataid.attr("data-title"));
				}
			}
			//最后不管是否新增tab，最后都转到要打开的选项页面上
			active.tabChange(dataid.attr("data-id"));
		});
 
		function CustomRightClick(id) {
			//取消右键  rightmenu属性开始是隐藏的 ，当右击的时候显示，左击的时候隐藏
			$('.layui-tab-title li').on('contextmenu', function() {
				return false;
			})
			$('.layui-tab-title,.layui-tab-title li').click(function() {
				$('.rightmenu').hide();
			});
			//单击取消右键菜单
			$('body,#aaa').click(function() {
				$('.rightmenu').hide();
			});
			//tab点击右键 
			$('.layui-tab-title li').on('contextmenu', function(e) {
				var popupmenu = $(".rightmenu");
				popupmenu.find("li").attr("data-id", id); //在右键菜单中的标签绑定id属性
 
				//判断右侧菜单的位置 
				l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;
				t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;
				popupmenu.css({
					left: l,
					top: t
				}).show(); //进行绝对定位
				return false;
			});
		}
 
		$(".rightmenu li").click(function() {
			//当前的tabId
			var currentTabId = $(this).attr("data-id");
 
			if ($(this).attr("data-type") == "closeOthers") { //关闭其他
				var tabtitle = $(".layui-tab-title li");
				$.each(tabtitle, function(i) {
					if ($(this).attr("lay-id") != currentTabId) {
						active.tabDelete($(this).attr("lay-id"))
					}
				})
			} else if ($(this).attr("data-type") == "closeAll") { //关闭全部
				var tabtitle = $(".layui-tab-title li");
				$.each(tabtitle, function(i) {
					active.tabDelete($(this).attr("lay-id"))
				})
 
			} else if ($(this).attr("data-type") == "refresh") { //刷新页面
				active.tabRefresh($(this).attr("data-id"));
 
			} else if ($(this).attr("data-type") == "closeRight") { //关闭右边所有
				//找到当前聚焦的li之后的所有li标签 然后遍历
				var tabtitle = $(".layui-tab-title li[lay-id=" + currentTabId + "]~li");
				$.each(tabtitle, function(i) {
					active.tabDelete($(this).attr("lay-id"))
				})
			}
 
			$('.rightmenu').hide();
		});
				
		//导航栏点击选中时关闭其他选项卡
		$('.layui-nav-item').click(function() {
			$(this).siblings('li').attr('class', 'layui-nav-item');
		});
 
		function FrameWH() {
			var h = $(window).height() - 41 - 10 - 60 - 10 - 44 - 10;
			$("iframe").css("height", h + "px");
		}
 
		$(window).resize(function() {
			FrameWH();
		})
 
		//打开默认页面
		active.tabAdd("userInfo.html", 11, "个人中心");
		active.tabChange(11);
	});
