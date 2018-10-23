<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" @selectlibChange="selectlibChange" @selectTaskChange='selectTaskChange'></list-header>
      <!--表格-->
      <sinograin-list class="list" :tabledata="tabledatasFilter" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
      <!--输入弹框-->
      <sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>      	
    </div>
</template>

<style>
	
</style>

<script>
import SinograinList from '@/components/common/action/List.vue';
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinPagination from '@/components/common/action/Pagination.vue';
import ListHeader from '@/components/common/action/ListHeader.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
// import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id","Token"]),
	tabledatasFilter(){
  		if(this.filterlib=="全部"){
			return this.tabledatas;
		}else{
			return this.tabledatas.filter((value,index)=>{
				return value.libraryName==this.filterlib
			})
		}
  	},
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata(1)
	this.getlibrarylist()
	this.getTaskList()
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	this.tabledatas=this.tabledatas.filter(function(item){
    		return item.id!==rowid;
    	})
    	this.sendDeleteId(rowid);
//  	console.log(rowid,list);
    }.bind(this)); 	
//	监听列表点击查看事件
  	this.$root.eventHub.$on("viewlistitem",function(row){  
//		console.log(id)
		this.$router.push({path: '/index/TestReportManagement/SuperviseList/SuperviseShow',query:{id:row.id,libraryName:row.libraryName,position:row.position}})
//		this.$router.push({path: '/index/sampling/SRLibraryList/SafetyReportList/SafetyProblem',query:{id:row.id,libraryName:row.libraryName,position:row.position}})
  	}.bind(this));
  },
  destroy(){
  	this.$root.eventHub.$off("viewlistitem")
  	this.$root.eventHub.$off('delelistitem')
  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	列表头触发的事件
	dateChange(data){
		console.log(data);
	},
	statusChange(data){
		console.log(data)
	},
	createSampling(){
//		console.log('createSampling');
		this.$router.push({path: '/index/sampling/libraryList/samplingList/samplingListCreate'})
	},
	emptyCreate(){
//		this.createlib();
	},
//	打开新建弹框
	createlib(){
		this.modalVisible=true;
	},
//	填入新建数据
	createlibitem(data){
		console.log(data);
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
//	获取搜索数据
  	searchingfor(searching,page){
  		page?page:1;
  		this.searchText=searching;
  		this.getlistdata(page)
//		var params = {};
//		params.pLibraryId = this.$route.query.libraryId;
//		params.libraryNameLike = searching;
////		console.log(this.breadcrumb.searching);
//		// 获取列表数据（第？页）
//		this.$http({
//		    method: 'post',
//			url: this.searchURL,
//			transformRequest: [function (data) {
//				// Do whatever you want to transform the data
//				let ret = ''
//				for (let it in data) {
//				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//				}
//				return ret
//			}],
//			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//			   params:JSON.stringify(params)
//			}
//	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
//	  		this.page.total=response.data.total;		  		
//		  	this.loading=false;
//
//		}.bind(this)).catch(function (error) {
//		    console.log(error);
//		}.bind(this));
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
//		if(this.searchText){			
//			this.searchingfor(this.searchText,currentPage)
//		}else{			
			this.getlistdata(currentPage)
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
		if(!this.$_ault_alert('safety:export')){
			return
		}
		if(!this.tabledatas.length){
			this.$notify.error({
	          	title: '导出失败',
	          	message: '请重新选择筛选信息！！！',
	        });
	        return;
		}
//		打开新窗口
//		设置参数
		var params = {};
		if(this.selectLibraryId!=='全部'){
			params[this.libtype]=this.selectLibraryId
		}
		if(this.searchText){
			params.position=this.searchText
		}
		if(this.taskId!=='全部'){
			params.taskId=this.taskId
		}
		params = JSON.stringify(params);
//		console.log(params,this.exportURL+'/'+params)
		var loadiframe=document.getElementById('fordownload');
		loadiframe.src=this.exportURL+'/'+params+'?sessionid='+this.Token;
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
      datalistURL: this.apiRoot + '/grain/safetyReport/data',
      exportURL:this.apiRoot + '/grain/safetyReport/export',
	  librarylistURL: this.apiRoot + '/grain/library/getAll',
	  taskListURL:this.apiRoot + '/grain/task/data',
	  searchURL: this.apiRoot + '/grain/safetyReport/data',
      deleteURL: this.apiRoot + '/grain/',
      searchText:'',
      taskId:'全部',
      checkedId:[],
      libtype:'pLibrary',
      selectLibraryId:'全部',
      filterlib:'全部',
      list:"librarylist",
	  modalVisible:false,
	  modal:{
	  	title:'新建库点',
		formdatas:[
	  		{
	  			label:"单位名称",
	  			model:"unit",
	  		},
	  		{
	  			label:"库点名称",
	  			model:"lib",
	  		},
	  	],
	  	submitText:'确定',
	  },
      breadcrumb:{
      	search:true,   
      	searching:'',
      	searchPlaceholder:'请输入货位号进行搜索',
      },
      loading:true,
//    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:true,
        tfootbtns:{
        	btns:true,//是否添加按钮组
        	leading_out:false,//导出按钮
        	refresh:false,//刷新按钮
        	delete:false, //删除按钮     
        	checkPrint:true,//历史原因名字不改了
        	btnText:'导出监督检查报告',//按钮文字checkPrint为true时生效
        }
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：此页面只展示本库信息!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	status:false,
      	date:true,
      	selectlib:true,
      	libraryList:[],
      	task:true,
      	taskList:[],      	
      },
      tabledatas:[],
      items: [
      {
        id: 1,
        prop:'libraryFullName',
        label: "被查库点",
        status:'true',
        
//      sort:true,
      },
      {
        id: 2,
        prop:'problem',
        label:"问题描述",
//      sort:true,
      },
      {
        id: 3,
        prop:'position',
        label: "货位号",
//      sort:true,
      },
      {
        id: 4,
        prop:'isDeal',
        label:"整改情况",
        status:true,
//      sort:true,
      },
      {
        id: 5,
        prop:'rummager',
        label: "检查人员",
//      sort:true,
      },
      {
        id: 6,
        prop:'createTime',
        label: "创建时间",
//      sort:true,
      },
      ],
      actions:{
//    	noview:true,
      	selection:false,
      	number:true,
      	view:true,
      	edit:false,
      	dele:false,
      }
    }
  }
}
</script>