<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" @addbtn="addbtn"></list-header>
      <!--表格-->
      <sinograin-list class="list" :tabledata="tabledatasFilter" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" :rowType="rowType"> 
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
//import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
	tabledatasFilter(){

//		if(this.filterStatus=="all"){
			return this.tabledatas;
//		}else{
//			return this.tabledatas.filter((value,index)=>{
//				return value.regState==this.filterStatus
//			})
//		}
	}
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata(1)
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("viewlistitem")
    this.$root.eventHub.$off("repeat")
//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	if(!this.$_ault_alert('register:remove')){
			return
		}
    	this.sendDeleteId(rowid);
//  	console.log(rowid,list);
    }.bind(this)); 	
//	监听列表点击查看事件
  	this.$root.eventHub.$on("viewlistitem",function(id,state){  
//		console.log(id)
		if(state==3){			
			this.$router.push({path: '/index/grainDepot/sampleRegListlc/sampleDraft',query:{pId:id,state:state}})
		}else{
			this.$router.push({path: '/index/grainDepot/sampleRegListlc/sampleReglc',query:{pId:id,state:state}})
		}
  	}.bind(this));
//	监听重复申请事件
  	this.$root.eventHub.$on("repeat",function(id,state){  
  		if(!this.$_ault_alert('sample:saveAll')){
			return
		}
//		console.log(id)
//		if(state==3){			
//			this.$router.push({path: '/index/grainDepot/sampleRegListlc/sampleDraft',query:{pId:id,state:state}})
//		}else{
//			this.$router.push({path: '/index/grainDepot/sampleRegListlc/sampleReglc',query:{pId:id,state:state}})
//		}
		this.$router.push({path: '/index/grainDepot/sampleRegListlc/createSampleReglc',query:{pId:id,state:state}})
  	}.bind(this));
  },
  destroy(){
  	this.$root.eventHub.$off("viewlistitem")
  	this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("repeat")
  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	列表头触发的事件
	dateChange(date){
		console.log(date);
		this.dateStart=date[0];
		this.dateEnd=date[1];
		this.getlistdata(1)
	},
	statusChange(data){		
		if(data=="全部"){
			this.filterStatus='';
		}else{
			this.filterStatus=data;
		}
//		console.log(this.filterStatus)
		this.getlistdata(1)
//	  	this.page.currentPage=1;		
	},
	createSampling(){
//		console.log('createSampling');
		this.$router.push({path: '/index/sampling/libraryList/samplingList/samplingListCreate'})
	},
	//新建扦样登记表按钮
	addbtn(){
		if(!this.$_ault_alert('sample:saveAll')){
			return
		}
		this.$router.push({path: '/index/grainDepot/sampleRegListlc/createSampleReglc'})
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
//		console.log(searching,page);
  		// 获取列表数据（第？页）
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
//			    listName: this.list,
//			    page:page,
//			    pageSize:this.page.size,
//			    name_like:searching,
//			}
//	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
//	  		this.loading=false;
//		}.bind(this)).catch(function (error) {
//		    console.log(error);
//		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
  		var params={};
		params.regState=this.filterStatus;
		params.formNameLike=this.searchText;
		if(this.dateStart){
			params.dateStart=this.dateStart
			params.dateEnd=this.dateEnd
		}
		params.type=-1;
  		this.loading=true;
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
			    params:JSON.stringify(params)
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;
	  		this.page.currentPage=page;			  		
		  	this.loading=false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	//	发送删除id
  	sendDeleteId(id){
//		console.log("-------------------")
//		console.log(id)
		this.$http({
		    method: 'post',
			url: this.deleteURL,
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
			    id:id,
			}
	    }).then(function (response) {
		  	if(response.data.success){
			  	this.tabledatas=this.tabledatas.filter(function(item){
	    			return item.id!==id;
    			})
			  	this.$message({
			        type: 'success',
			        message: '删除成功!'
			    });
		  	}else{
		  		this.$message({
			        type: 'info',
	        		message: '删除失败!'
			    });
		  	}
		}.bind(this)).catch(function (error) {
		    this.$message({
		        type: 'info',
        		message: '删除失败!'
		    });
		}.bind(this));
  	},
//	获取分页点击事件中及当前页码
    getCurrentPage(currentPage){
//		console.log(currentPage)
		this.getlistdata(currentPage)
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

  },
  data() {
    return {
      datalistURL: this.apiRoot + '/grain/register/data',
      searchURL:this.apiRoot + '/grain/register/data',
      deleteURL:this.apiRoot + '/grain/register/remove',
      checkedId:[],
  	  searchText:'',
  	  dateStart:0,//开始时间
      dateEnd:9999999999999999999999999,//结束时间
	  list:"librarylist",
	  modalVisible:false,
	  rowType:'扦样登记表',
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
      },
      loading:true,
//    filterStatus:'all',
      filterStatus:'',
//    分页数据
      page: {
        size: 10,
        total: 0,
        currentPage: 1,
        show:true,
        tfootbtns:{
        	btns:false,//是否添加按钮组
        	leading_out:true,//导出按钮
        	refresh:true,//刷新按钮
        	delete:true, //删除按钮            	
        }
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：可输入扦样登记表名称搜索相关信息!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	status:true,
      	date1:true,
      	addbtn:'新建扦样登记表',
      	date1Title:'创建日期:',
      	statusitems:[
      		{label:'全部',text:'全部'},
      		{label:-1,text:'待审核'},
      		{label:1,text:'未同意'},
      		{label:2,text:'已同意'},
      		{label:3,text:'草稿'},
      	],
      },
      tabledatas:[],
      items: [
      {
        id: 1,
        prop:'formName',
        label: "表格名称",
//      sort:true
      },
      {
        id: 2,
        prop:'regState',
        label: "状态",
        status:true,
//      sort:true,
      },
      {
        id: 3,
        prop:'reason',
        label: "审批结果备注",
        status:true,
//      sort:true,
      },
      {
        id: 4,
        prop:'proposer',
        label: "申请人",
//      status:true,
//      sort:true,
      },
      {
        id: 5,
        prop:'createTime',
        label:"创建日期",
        sort:true,
      },
      ],
      actions:{
      	editModel:true,
      	selection:false,
      	number:false,
      	view:true,
      	edit:false,
      	dele:false,
      	deleCaogao:true,
      	show:true,
      	repeat:true,
      }
    }
  }
}
</script>