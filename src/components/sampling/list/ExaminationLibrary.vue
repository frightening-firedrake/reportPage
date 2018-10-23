<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
      <!--alert-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表格上的时间选框以及 创建-->
      <list-header :listHeader="listHeader" v-on:dateChange="dateChange" v-on:statusChange="statusChange" v-on:createSampling="createSampling" v-on:createlib="createlib" ></list-header>
      <!--表格-->
      <sinograin-list class="list" :librarylist="librarylist" :tabledata="tabledatas" :list="list" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate" > 
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
	...mapGetters(["modal_id"]),
  },
  created(){
//  获取列表数据（第一页）
	this.getlibrarylist()
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
//		console.log(id)
		this.$router.push({path: '/index/sampling/examinationLibraryList',query:{libraryId:id}})
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
  		var params = {};
  		params.wpLibraryId = -1;
		params.wlibraryName = searching;
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
			   params:JSON.stringify(params)
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data;

		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取列表数据方法
  	getlistdata(page){
		var params = {};
		params.wpLibraryId = -1
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
				params:JSON.stringify(params)
			}
	    }).then(function (response) {
		  	this.tabledatas=response.data;
//	  		this.page.total=response.data.total;		  		
		  	this.loading=false;
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	//	获取库列表
  	getlibrarylist(){
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
				
			}
	    }).then(function (response) {
		  	this.librarylist = response.data.rows;
//			  console.log(this.librarylist)
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
	  librarylistURL: this.apiRoot + '/grain/library/data',//获取库列表
      datalistURL: this.apiRoot + '/grain/library/getFirst',
      searchURL:  this.apiRoot + '/grain/library/getFirst',
      deleteURL: this.apiRoot + '/grain/',
      searchText:'',
      checkedId:[],
      list:"safetyReport",
	  modalVisible:false,
      breadcrumb:{
      	search:true,   
      	searching:'',
      },
      loading:true,
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
        title: '温馨提示：此页面只展示本库信息!',
        type: 'info'
      }],
//    表格数据
      listHeader:{
      	createlib:false,
      	createSampling:false,
      	status:false,
      	date:true,
      },
      tabledatas:[],
      librarylist:[],
      items: [
//    {
//      id: 1,
//      prop:'unitName',
//      label: "单位名称",
////      sort:true
//    },
      {
        id: 2,
        prop:'pLibraryId',
        label: "被查直属库",
        status:true,
//      sort:true,
      },
      {
        id: 3,
        prop:'createTime',
        label:"最后检查日期",
        sort:true,
      },
      ],
      actions:{
      	selection:false,
      	number:false,
      	view:true,
      	edit:false,
      	dele:false,
      }
    }
  }
}
</script>