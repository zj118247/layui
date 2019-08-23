layui.use(["table", "form", "laydate", "layer"], function() {
	var table = layui.table,
		layer = layui.layer,
		laydate = layui.laydate,
		form = layui.form;

	/*
		> table.set(options); //设定全局默认参数。options即各项基础参数
		> table.on('event(filter)', callback); //事件监听。event为内置事件名（详见下文），filter为容器lay-filter设定的值
		> table.init(filter, options); //filter为容器lay-filter设定的值，options即各项基础参数。例子见：转换静态表格
		> table.checkStatus(id); //获取表格选中行（下文会有详细介绍）。id 即为 id 参数对应的值
		> table.render(options); //用于表格方法级渲染，核心方法。应该不用再过多解释了，详见：方法级渲染
		> table.reload(id, options); //表格重载
		> table.resize(id); //重置表格尺寸
		> table.exportFile(id, data, type); //导出数据
	  
	 * 
	 * */

	laydate.render({
		elem: '#date1' //指定元素
	});
	laydate.render({
		elem: '#date2' //指定元素
	});

	table.render({
		elem: '#demo',
		toolbar: '#toolbarDemo',
		defaultToolbar:['filter','exports'], // 自由配置头部工具栏右侧的图标，数组支持以下可选值： filter: 显示筛选图标  exports: 显示导出图标  print: 显示打印图标
		cols: [
			[{
				type: "checkbox"
				},

				{
					title: "编号",
					type: "numbers",
					align: "center",
					width: 80
				}, {
					title: "id",
					field: 'id',
					align: "center",
					width: 80
				},
				{
					title: '姓名',
					align: "center",
					field: 'name',
					edit: 'text',
				},
				{
					title: 'state',
					field: 'state',
					align: "center",
					width: 120,
					templet: '#switchTpl',

				},
				{
					title: '标题',
					field: 'title',
					align: "center",
//					edit: 'text',

				}, {
					title: '日期',
					field: 'time',
					align: "center",
					templet: function(d){
						var date2=new Date(d.time);
						var localeDateString = date2.toLocaleDateString();
						console.log(localeDateString)
						
				        return localeDateString
				     },
				}, {
					title: '操作',
					toolbar: '#barDemo',
					fixed:"right",
					width: 150,
				}

			]
		],
		url: "http://127.0.0.1:8081/table",
		//http://192.168.0.66:8080/tablejui/bb?mm=pagelist
		method:"post",
		request: {
			pageName: "page",
			limitName: "pageSize"
		},
		contentType:'application/x-www-form-urlencoded',
		page: true,
		limit: 10,
		limits: [10, 15, 20, 25],
		response: {
			statusCode: 0,
			countName: 'total',   //规定数据总数的字段名称，默认：count
			dataName: 'data'   //规定数据列表的字段名称，默认：data
		},
		loading:true,  //是否显示加载条（默认：true）。如果设置 false，则在切换分页时，不会出现加载条。该参数只适用于 url 参数开启的方式
		title:"记录表",  //
		cellMinWidth:60,   //全局定义所有常规单元格的最小宽度（默认：60），一般用于列宽自动分配的情况。其优先级低于表头参数中的 minWidth
		text:"数据异常了",  //自定义文本，如空数据时的异常提示等。注：layui 2.2.5 开始新增。
		autoSort:true,   //默认 true，即直接由 table 组件在前端自动处理排序。 若为 false，则需自主排序，通常由服务端直接返回排序好的数据。 注意：该参数为 layui 2.4.4 新增
		initSort:{
			  field: 'id',  //排序字段，对应 cols 设定的各字段名 
			  type: 'desc',  //排序方式  asc: 升序、desc: 降序、null: 默认排序
		},
		skin:"line",  //用于设定表格风格，若使用默认风格不设置该属性即可line （行边框风格） row （列边框风格） nob （无边框风格）
		even:true,   //若不开启隔行背景，不设置该参数即可
		size:"lg",   //用于设定表格尺寸，若使用默认尺寸不设置该属性即可
		parseData: function(res) {
			console.log(res);
			var ss = {
				data: res.rows,
				code: 0,
				total: res.total,
			}
			return ss
		},
		done:function(){
			console.log("数据渲染完了！")
		}

	});
	//编辑
	table.on('edit(test)', function(obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
		console.log(obj.value); //得到修改后的值
		console.log(obj.field); //当前编辑的字段名
		console.log(obj.data); //所在行的所有相关数据  
		edit(obj.data)
	});

	//监听行单击事件
	table.on('row(test)', function(obj) {
		console.log(obj.tr) //得到当前行元素对象
		console.log(obj.data) //得到当前行数据
		//obj.del(); //删除当前行
		//obj.update(fields) //修改当前行数据

	});

	//监听行工具事件
	table.on('tool(test)', function(obj) {
		var data = obj.data;
		console.log('data1', data)
		if(obj.event === 'del') { //删除
			layer.confirm('真的删除行么', function(index) {
				del(data)
				obj.del();
				layer.close(index);

			});
		} else if(obj.event === 'edit') { //编辑

			var index = layer.open({ //开启遮罩层
				type: 1,
				title: "编辑",
				area: ['500px'],
				offset: '150px',
				content: $('#Edit'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				success: function(layero, index) {

					//表单元素赋值
					form.val("formEdit", {
						"id": data.id, // "name": "value"
						"name": data.name,
						"hoby": data.title,
						"birthday": data.time
					})
					$("input[name=sex][value=0]").prop("checked", data.state == 0 ? true : false);
					$("input[name=sex][value=1]").prop("checked", data.state == 1 ? true : false);
					form.render('radio'); //更新单选框

					//表单所有元素赋值结束
				}
			});
			form.on('submit(formDemo)', function(data) { //表单提交事件
				edit(data.field); //编辑方法
				layer.close(index); //关闭弹出层
				table.reload('demo'); //表格重载
				return false
			})

		}
	});

	table.on("toolbar(test)", function(obj) {
		console.log(obj)
		switch(obj.event) {
			case 'Add':
				console.log('add');

				var index = layer.open({ //开启遮罩层
					type: 1,
					title: "添加",
					area: ['450px'],
					offset: '150px',
					content: $('#Add'),
					success:function(){
						form.val("formAdd", {
							"id": "", // "name": "value"
							"name": "",
							"hoby": "",
						})
						
						
					}
				})
				form.on('submit(formDemo)', function(data) { //表单提交事件
					console.log(data)
					add(data.field); //添加方法
					layer.close(index); //关闭弹出层
					table.reload('demo'); //表格重载
					return false
				})

				break;
			case 'getCheckLength':
				aa(obj.config.id)
				console.log('getCheckLength');

				break;
			case 'isAll':
				console.log('isAll');

				break;

		}
	});

	function add(data) {
		console.log("添加",data)
		/*$.ajax({
			type: "post",
			url: "http://192.168.0.66:8080/tablejui/bb?mm=add",
			async: true,
			dataType: "json",
			data: data,
			success(res) {
				layer.msg('添加成功！', {
					time: 2000, //20s后自动关闭
				});
			},
			error() {
				console.log("error")
			}

		});*/
	}

	function edit(data) { //修改函数
		console.log("编辑",data)
		/*$.ajax({
			type: "post",
			url: "http://192.168.0.66:8080/tablejui/bb?mm=update",
			async: true,
			dataType: "json",
			data: data,
			success(res) {
				//alert(55);
				layer.msg('修改成功喽！', {
					time: 2000, //20s后自动关闭
					//btn: ['明白了', '知道了', '哦']
				});
			},
			error() {
				console.log("error")
			}
		});*/
	}

	function del(data) {
		console.log("删除",data)
		/*$.ajax({
			type: "post",
			url: "http://192.168.0.66:8080/tablejui/bb?mm=del",
			async: true,
			dataType: "json",
			data: data,
			success(res) {
				layer.msg('修改成功喽！', {
					time: 2, //2s后自动关闭
					//	btn: ['明白了', '知道了', '哦']
				});

			},
			error() {
				console.log("error")
			}

		});*/
	}

	function aa(ID){
		var checkStatus = table.checkStatus(ID); //idTest 即为基础参数 id 对应的值
		 
		console.log(checkStatus.data) //获取选中行的数据
		console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
		console.log(checkStatus.isAll ) //表格是否全选
	}

	/*
	 //获取选中行
	  var s=table.checkStatus('demo')
	  console.log(s)*/

})