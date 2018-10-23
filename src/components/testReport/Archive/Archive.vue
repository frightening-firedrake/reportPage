<template>
    <div class='listpagewrap'>
        <!--面包屑-->
        <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
        <!--alert-->
        <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
    	<!--标题-->
    	<sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
        <!--筛选 -->
	  	<archive-header :listHeader="listHeader" @getSearchParams="getSearchParams"></archive-header>
        <!--表格-->
	  	<archive-table :tabledatas="tabledatasFilter" :currentPage="currentPage" ></archive-table>
        <!--分页-->
        <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import ArchiveHeader from '@/components/common/action/ArchiveHeader.vue';
import ArchiveTable from '@/components/common/action/ArchiveTable.vue';
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
// import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinOptionTitle,ArchiveHeader,ArchiveTable
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id","Token"]),
	tabledatasFilter(){
		if(!this.datalist.length){
			return this.tabledatas
		}
  		return this.datalist[this.currentPage-1];
  	},
  },
  created(){
//  获取列表数据（第一页）
//	this.getlistdata(1)
	this.getlibrarylist()
//	this.getTaskList()
  },
  destroy(){
  	this.$root.eventHub.$off("viewlistitem")
  	this.$root.eventHub.$off('delelistitem')
  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	列表头触发的事件
	titleEvent(){
		console.log('titleEvent')
	},

//	获取搜索数据
  	searchingfor(searching,page){
  		page?page:1;
  		this.searchText=searching;
  		this.getlistdata(page)
  	},
  	getSearchParams(SearchParams){
  		this.libraryId=SearchParams.libraryId;
		this.barnTime=SearchParams.barnTime;
		this.position=SearchParams.position;
  		this.$http({
		    method: 'post',
			url: this.datalistURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
//				libraryId:SearchParams.libraryId,
//				barnTime:SearchParams.barnTime,
//				position:SearchParams.position,
				params:JSON.stringify(SearchParams),
			},
	    }).then(function (response) {

	    	if(!response.data.length){
	    		this.$notify.error({
		          	title: '查询失败',
		          	message: '请核对相关信息！！！',
		        });
		        return      
	    	}
		  	this.datalist=response.data;
	  		this.page.total=response.data.length;		  		
//		  	this.loading=false;
	  		this.page.currentPage=1;
	  		this.currentPage=1;
		}.bind(this)).catch(function (error) {
		    this.$notify.error({
	          	title: '查询失败',
	          	message: '请核对相关信息！！！',
	        });
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
		var params = {};
//		console.log(this.libtype,this.selectLibraryId)
		if(this.selectLibraryId!=='全部'){
			params[this.libtype]=this.selectLibraryId
		}
		if(this.searchText){
			params.position=this.searchText
		}
		if(this.taskId!=='全部'){
			params.taskId=this.taskId
		}
//		var data={};
//		data.page=page;
//		data.rows=this.page.size;
  		this.loading=false;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.datalistURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
			    page:page,
			    rows:this.page.size,
				params:JSON.stringify(params)
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;		  		
		  	this.loading=false;
	  		this.page.currentPage=page;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	getlibrarylist(){
		var params = {};
		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.librarylistURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
//			    params: JSON.stringify(params)
			}
	   }).then(function (response) {
		  	this.listHeader.libraryList = response.data;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取任务列表
  	getTaskList(){
//		var params = {};
//		params.pLibraryId = -1
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.taskListURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
//			    params: JSON.stringify(params)
			}
	   }).then(function (response) {
		  	this.listHeader.taskList = response.data.rows;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	//	发送删除id
  	sendDeleteId(id){
		this.$http({
		    method: 'post',
			url: this.deleteURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: {
			    listName: this.list,
			    id:id,
			}
	    }).then(function (response) {
		  	
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取分页点击事件中及当前页码
    getCurrentPage(currentPage){
    	this.currentPage=currentPage
//		if(this.searchText){			
//			this.searchingfor(this.searchText,currentPage)
//		}else{			
//			this.getlistdata(currentPage)
//		}
	},
//	映射分页触发的事件
  	paginationEvent(actiontype){
  		if(actiontype=='PrintCheck'){//历史原因名字一下改不了
  			
//			console.log('exportExcel')
  			this.exportExcel();
  		}else if(actiontype=='refresh'){
  			// 获取列表数据（第一页）
			this.getlistdata(1)			
  		}
  	},
//	导出事件
	exportExcel(){
//		做个拦截筛选结果为空时不执行
		if(!this.$_ault_alert('ExportJDJCDA:ExportJiandujianchaXM')){
			return
		}
		if(!this.datalist.length){
			this.$notify.error({
	          	title: '错误提示',
	          	message: '未找到相关样品！！！',
	        });
	        return;
		}
		if(this.datalist[0].sort=='小麦'){
			this.exportURL=this.apiRoot + '/grain/ExportJDJCDA/ExportJiandujianchaXM';
		}else if(this.datalist[0].sort=='玉米'){			
			this.exportURL=this.apiRoot + '/grain/ExportJDJCDA/ExportJiandujianchaYM';
		}
//		打开新窗口
//		设置参数
		var params = {};
		params.libraryId=this.libraryId;
		params.barnTime=this.barnTime;
		params.position=this.position;
		params = JSON.stringify(params);
//		console.log(params,this.exportURL+'/'+params)
		var loadiframe=document.getElementById('fordownload');
		loadiframe.src=this.exportURL+'/'+params+'?sessionid='+this.Token;
//		loadiframe.src=this.exportURL+'?libraryId='+this.libraryId+'&barnTime='+this.barnTime+'&position='+this.position+'&sessionid='+this.Token;
//		window.open(this.exportURL+'/'+params+'?sessionid='+this.Token,"_blank");
	},
//	获取多选框选中数据的id(这是一个数组)
  	getchecked(checkedId){
  		this.checkedId=checkedId;
  	},
//	筛选库
	selectlibChange(libtype,selectLibraryId){
		this.selectLibraryId=selectLibraryId;
		this.libtype=libtype;
//		console.log(this.libtype,this.selectLibraryId)
//		this.filterlib=lib
//		console.log(this.filterlib)
		this.getlistdata(1)
	},
//	筛选任务
	selectTaskChange(taskId){
		this.taskId=taskId;
		this.getlistdata(1)
	}
  },
  data() {
    return {
        datalistURL: this.apiRoot + '/grain/sample/findRecord',
//      exportURL:this.apiRoot + '/grain/ExportJDJCDA/ExportJiandujianchaXM',
        exportURL:'',
	    librarylistURL: this.apiRoot + '/grain/library/getAll',
//	    taskListURL:this.apiRoot + '/grain/task/data',
	    searchURL: this.apiRoot + '/grain/safetyReport/data',
        deleteURL: this.apiRoot + '/grain/',
        searchText:'',
        taskId:'全部',
        checkedId:[],
        libtype:'pLibrary',
        selectLibraryId:'全部',
        filterlib:'全部',
		libraryId:'',
		barnTime:'',
		position:'',
        breadcrumb:{
	      	search:false,   
	      	searching:'',
	      	searchPlaceholder:'请输入货位号进行搜索',
	    },
        loading:true,
//    分页数据
	    page: {
	        size: 1,
	        total: 1,
	        currentPage: 1,
	        show:true,
	        tfootbtns:{
	        	btns:true,//是否添加按钮组
	        	leading_out:false,//导出按钮
	        	refresh:false,//刷新按钮
	        	delete:false, //删除按钮     
	        	checkPrint:true,//历史原因名字不改了
	        	btnText:'导出中央事权粮检查（验）档案',//按钮文字checkPrint为true时生效
        	}
      	},
      	subtitle:{	
//		    btn:true,
//	    	btntext:'导出word文档',
	    },
//    弹窗数据
      	alerts: [{
        	title: '温馨提示：此页面只展示本库信息!',
        	type: 'info'
      	}],
//    表格数据
      	listHeader:{
//	      	createlib:false,
//	      	createSampling:false,
//	      	status:false,
//	      	date:true,
//	      	selectlib:true,
	      	libraryList:[],
//	      	task:true,
//	      	taskList:[],      	
      	},
      	datalist:[],
      	tabledatas:{
      		quality:'',			//性质
      		pLibraryName:'',	//直属库
			libraryName:'', 	//库点
			position:'',   //货位号（申请扦样）
			sort:'',	//分类(品种)
			barnType:'',    //仓型
			cangrong:'',    //仓容
			amount:'',    //数量
			gainTime:'',  //收获年度
			barnTime:'',   //入库时间（仓库的时间）
			shape:'',     //形状
			length:'',     //长度
			wide:'',       //宽度
			high:'',       //高度
			measuredVolume:'',   //测算体积（测量体积）
			deductVolume:'',   //扣除体积
			realVolume:'',     //测算净体积（粮堆实际体积）
			realCapacity:'',    //容重
			correctioFactor:'',   //修正系数
			aveDensity:'',   //平均密度
			unQuality:'',   //测量计算数
			grainQuality:'',  //保管账数量
			slip:'',         //差率		
			qualityGrade:'',    //等级
			rongzhong:'',    //容重
			shuifen:'',      //水分
			zazhi:'',        //杂质
			kuangwuzhi:'',    //矿物质
			buwanshanli:'',   //不完善粒
			shengmeili:'',    //生霉粒
			sezeqiwei1:'',    //色泽气味（质量指标）
			yingduzhishu:'',   //硬度指数
			mianjinxishuiliang:'',  //面筋吸水量
			zhifangsuanzhi:'',  //脂肪酸酯
			pinchangpingfen:'',  //品尝评分
			sezeqiwei2:'',      //色泽气味（储存品质指标）
			sampleId:'',          //样品id
			problem:[],       //监督报告中的问题列表
			rummager:'',    //监督检查报告的检查人
			jianduTime:'',    //监督检查时间（监督检查创建时间）
			gzdgRummager:'',  //工作底稿检查人
			gzdgTime:'',   //工作底稿时间（工作底稿创建时间）
			jianyanyuan:'',   //检验员
			jianceTime:'',      //检测时间（取检测最后的时间）
      	},
      	currentPage:1,
    }
  }
}
</script>