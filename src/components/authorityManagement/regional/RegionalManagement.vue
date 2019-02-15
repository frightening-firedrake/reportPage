<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" @createAut="createAut"></list-header>
      <!--表格-->
      <regional-list :regional="regional"></regional-list>
      <!--分页-->
      <!--<sinograin-pagination :page="page" v-on:paginationEvent="paginationEvent" v-on:getCurrentPage="getCurrentPage"></sinograin-pagination>-->
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
import RegionalList from '@/components/common/action/RegionalList.vue';
import SinograinModal from '@/components/common/action/Modal.vue';
import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinList,SinograinPrompt,SinograinPagination,SinograinBreadcrumb,SinograinModal,ListHeader,RegionalList
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//  获取列表数据（第一页）
	this.getlistdata(1)
//	移除监听事件
    this.$root.eventHub.$off('delelistitem')
    this.$root.eventHub.$off("editlistitem")

//	监听列表删除事件
    this.$root.eventHub.$on('delelistitem',function(rowid,list){
    	this.tabledatas=this.tabledatas.filter(function(item){
    		return item.id!==rowid;
    	})
    	this.sendDeleteId(rowid);
//  	console.log(rowid,list);
    }.bind(this)); 	
//	监听列表点击编辑事件
  	this.$root.eventHub.$on("editlistitem",function(id){ 
		if(!this.$_ault_alert('resource:edit')){
			return
		}
//		console.log(id)
		this.$router.push({path: '/index/AuthorityManagement/ResourcesList/ResourcesEdit',query:{id:id}})
  	}.bind(this));

  },
  destroy(){
  	this.$root.eventHub.$off("editlistitem")

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
//	新建授权项目
	createAut(){
		this.modalVisible=true;
//		if(!this.$_ault_alert('resource:save')){
//			return
//		}
//		this.$router.push({path: '/index/AuthorityManagement/ResourcesList/ResourcesAdd'})		
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
  		var params = {};
		params.resourceNameLike = searching;
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
			    params:JSON.stringify(params),
			    page:page,
			    rows:this.page.size,
			}
	    }).then(function (response) {
			this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;

		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
//		this.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.datalistURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			data: {
			    page:page,
			    rows:this.page.size,
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data.rows;
	  		this.page.total=response.data.total;
		  	

		  		this.loading=false;

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

  },
  data() {
    return {
      datalistURL:this.apiRoot +'resource/data',
      searchURL:this.apiRoot +'resource/data',
      deleteURL:'/liquid/role/data/delete',
      checkedId:[],
      searchText:'',
      list:"librarylist",
	  modalVisible:false,
	  modal:{
	  	title:'新建地区',
		  	customClass:'blue',
			formdatas:[
//		  		{
//		  			label:"案件审核:",
//		  			Default:true,
//		  			type:'select',
//		  			model:"state",
//		  			defaultz:-1,
//					selectitems:[
//						{label:'未通过审核',value:-1,id:'1'},
//						{label:'通过审核',value:1,id:'2'},
//					],
//		  		},
				{
		  			label:"省级:",
		  			model:"sheng",
		  			type:'input',
		  		},
		  		{
		  			label:"市级:",
		  			model:"shi",
		  			type:'input',
		  		},
		  		{
		  			label:"县(区)级:",
		  			model:"xianqu",
		  			type:'input',
		  		},
//		  		{
//		  			label:"自动反馈信息",
//		  			type:'textarea',
//		  			rows:3,
//		  			model:"feedbackInformation",
//		  			value:'',
//		  		},
	  		],
	  		submitText:'提交',
	  },
      breadcrumb:{
//    	search:true,   
      	searching:'',
      },
//    loading:true,
      loading:false,
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
        title: '温馨提示：此页面展示的平台已开通地区列表，您在本页面可以对地区进行新建的操作，新建后不可修改请谨慎。单击右方x号，你可以关闭此条提示语！',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	status:false,
      	date:false,
      	autH:"新建地区",
      	class:'notop noborder',
      },
//    地区
	  regional:[
	  	{id:1,pId:0,name:'山西省'},
	  	{id:2,pId:0,name:'陕西省'},
	  	{id:3,pId:0,name:'河北省'},
	  	{id:4,pId:0,name:'河南省'},
	  	{id:5,pId:0,name:'甘肃省'},
	  	{id:6,pId:1,name:'太原市'},
	  	{id:7,pId:1,name:'临汾市'},
	  	{id:8,pId:1,name:'大同市'},
	  	{id:9,pId:1,name:'朔州市'},
	  	{id:10,pId:1,name:'阳泉市'},
	  	{id:11,pId:1,name:'吕梁市'},
	  	{id:12,pId:1,name:'忻州市'},
	  	{id:13,pId:1,name:'长治市'},
	  	{id:14,pId:1,name:'晋城市'},
	  	{id:15,pId:1,name:'运城市'},
	  	{id:16,pId:6,name:'晋源区'},
	  	{id:17,pId:6,name:'小店区'},
	  	{id:18,pId:6,name:'迎泽区'},
	  	{id:19,pId:6,name:'万柏林区'},
	  	{id:20,pId:6,name:'尖草坪区'},
	  	{id:21,pId:6,name:'杏花岭区'},
	  	{id:22,pId:2,name:'西安市'},
	  ]
      
    }
  }
}
</script>