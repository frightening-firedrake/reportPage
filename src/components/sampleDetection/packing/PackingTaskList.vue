<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createPackling="createPackling" ></list-header>
      <!--表格-->
      <sinograin-list class="list" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
      </sinograin-list>
      <!--分页-->
      <sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>
      <!--新建库典弹框-->
      <sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>      	
      <sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose" @getScanCode="getScanCode"></sinograin-message>
    
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
import SinograinMessage from "@/components/common/action/Message"
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,SinograinMessage
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
	tabledatasFilter(){

		if(this.filterStatus=="全部"){
			return this.tabledatas;
		}else{
			return this.tabledatas.filter((value,index)=>{
				return value.status==this.filterStatus
			})
		}
	}
  },
  created(){
//	console.log(this.$route.query)
//  获取列表数据（第一页）
	this.getlistdata(1)
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
  	this.$root.eventHub.$on("viewlistitem",function(id){  
  		if(!this.$_ault_alert('sample:putIntoTask')){
			return
		}
//		console.log(id)
		this.$router.push({path: '/index/sampleDetection/packingTaskList/packingList',query:{id:id}})
		
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
//		console.log(data)
		this.filterStatus=data
	},
	createPackling(){
		if(!this.$_ault_alert('task:save')){
			return
		}
		this.modalVisible=true;

	},
	emptyCreate(){
//		this.scanCode();
	},
//	打开新建弹框
	createlib(){
		this.modalVisible=true;
	},

//	填入新建数据
	createlibitem(form){
		console.log(form);
		this.createTask(form.taskName)
	},
//	关闭新建弹框
	dialogClose(){
		this.modalVisible=false;
	},
//	新建任务
	createTask(taskName){
		this.$http({
		    method: 'post',
			url: this.createTaskURL,
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
			    taskName: taskName,
			}
	    }).then(function (response) {
			if(response.data.success){
				this.getlistdata(1)
				
			}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
	},
//	获取搜索数据
  	searchingfor(searching,page){
  		page?page:1;
  		this.searchText=searching;
  		var params = {};
		params.taskNameLike = searching;
//		console.log(this.breadcrumb.searching);
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.searchURL,
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
	  		this.tabledatas = response.data.rows;
			this.page.total = response.data.total;
	  		this.page.currentPage=page;
			this.loading = false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	
//	获取列表数据方法
  	getlistdata(page){
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
			    listName: this.list,
			    page:page,
			    rows:this.page.size,
			}
	   }).then(function (response) {
			this.tabledatas = response.data.rows;
			this.page.total = response.data.total;
	  		this.page.currentPage=page;
			this.loading = false;
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
		if(this.searchText){			
			this.searchingfor(this.searchText,currentPage)
		}else{			
			this.getlistdata(currentPage)
		}
	},
//	映射分页触发的事件
  	paginationEvent(actiontype){
  		if(actiontype=='leading_out'){
  			console.log('leading_out')
  		}else if(actiontype=='refresh'){
  			// 获取列表数据（第一页）
			this.getlistdata(1)			
  		}
  	},
//	获取多选框选中数据的id(这是一个数组)
  	getchecked(checkedId){
  		this.checkedId=checkedId;
  	},
	messageclick(type){
  		if(type=="success"){
			console.log(type)
  		}else if(type=="error"){
  			console.log(type)  			
  		}
  	},
  	messageClose(){
  		this.messageShow=false;
  	},
  	getScanCode(code){
  		if(!code){
  			this.messageShow=false;
  		}else{  			
			this.messageShow=false;
			this.checkcode(code);			
		}
  	},

  },
  data() {
    return {
      datalistURL: this.apiRoot +  '/grain/task/data',
      createTaskURL: this.apiRoot +  '/grain/task/save',
      checkURL:this.apiRoot +'/grain/sample/getBySampleNum',
      searchURL:this.apiRoot +  '/grain/task/data',
      deleteURL:'/liquid/role2/data/delete',
      searchText:'',
      checkedId:[],
      list:"samplinglist",
	  modalVisible:false,
	  modal:{
	  	title:'新建任务',
		formdatas:[
	  		{
	  			label:"任务名称",
	  			model:"taskName",
	  			type:'input',
	  		},
	  	],
	  	submitText:'确定',
	  },
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      loading:true,
      filterStatus:'全部',
//    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:true,       
        tfootbtns:{
        	btns:false,//是否添加按钮组
        	leading_out:false,//导出按钮
        	refresh:false,//刷新按钮
        	delete:false, //删除按钮            	
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
      	createPackling:true,
      },
      tabledatas:[],
      items: [
      {
        id: 1,
        prop:'taskName',
        label: "任务名称",
//		status:true,
      },
      {
        id: 2,
        prop:'createTime',
        label: "创建时间",
//		status:true,
      },
//    {
//      id: 4,
//      prop:'printTimes',
//      label: "打印条码数",
//
//    },
//    {
//      id: 5,
//      prop:'printDate',
//      label:"打印时间",
//      sort:true,
//    },
      ],
      actions:{
//    	noview:true,
      	selection:false,
      	number:false,
      	view:true,
      	edit:false,
      	dele:false,
//    	show:true,
      	manuscript:false,
      	safetyReport:false,
      },
      messageShow:false,
	  messages:{
	  	type:'scaning',
	  	scaning:{
	  		icon:'iconfont icon-iconset0255',
	  		messageTittle:'开始扫描',
	  		messageText:'不要点击键盘和鼠标请将扫码枪对准条形码，然后按下扫码枪按钮！',
	  	},
	  	success:{
	  		icon:'el-icon-success',
	  		messageTittle:'该样品已入库',
	  		messageText:'可点击编辑按钮修改入库信息！',
	  		buttonText:'编辑',
	  	},
	  	loading:{
	  		icon:'el-icon-printer',
	  		messageTittle:'正在打印中...',
	  		messageText:'请您耐心等待，正在打印中...',
	  	},
	  },
    }
  }
}
</script>

