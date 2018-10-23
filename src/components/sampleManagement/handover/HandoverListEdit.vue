<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--表单-->
      <handover-list-connect :formdatas="formdatas" @createlib="createlib" @new_sample="new_sample"></handover-list-connect> 
	  <!--新建库典弹框-->
      <sinograin-modal :modal="modal" v-if="modalVisible" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import HandoverListConnect  from "@/components/common/action/HandoverListConnect"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import SinograinModal from '@/components/common/action/Modal.vue';

import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';


export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,HandoverListConnect,SinograinModal
  },
  computed:{
	...mapState([]),
	...mapGetters(["libraryId","libraryName","userName","userId"]),
  },
  created(){
//	console.log(this.$route.query)
//	console.log(this.userName,this.userId)
	this.formdatas.form.manager=this.userName;
//  获取列表数据（第一页）
	// this.getlistdata(1)
//	console.log(this.$route.params)
	
//	console.log(this.$route.params.formdatas)
	if(this.$route.params.formdatas){
		this.formdatas=this.$route.params.formdatas
	}else{

		this.$router.push({ path: '/index/sampleManagement/handover'})
	}
  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
//	获取列表数据方法
  	getlistdata(page){
  		this.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.datalistURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//
//			}
	    }).then(function (response) {
		  	this.formdatas=response.data.formdatas;		  
//		  	this.tabledatas=response.data.rows;
//	  		this.page.total=response.data.total;
		  	
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	领取方法
  	handover(){
  		if(!this.$_ault_alert('handover:save')){
			return
		}
		var params = {};
//		params.checkeds = this.formdatas.checkList.sort().join(',');
		params.checkeds = this.formdatas.checkList.join(',');
		params.name = this.formdatas.form.name;
		params.id = this.formdatas.id;
		params.remark = this.formdatas.form.remarks;
		params.receiptor =this.receiptor;
		params.userId = this.userId;
		params.sampleAdmin = this.formdatas.form.manager;
		params.sampleNums = []
		params.sampleIds = [];
		this.formdatas.items.forEach((val)=>{
//			params.sampleNums.push(val.sampleNo)
			params.sampleNums.push(val.sampleNum)
			params.sampleIds.push(val.id)
		})
		
  		this.loading=false;
  		this.formdatas.loading=true;
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.handoverURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: params,
	    }).then(function (response) {
	    	if(response.data.success){	    		
	    		this.$router.push({ path: this.viewPath,query:{id:params.id} })
	    	}
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	获取搜索数据
  	searchingfor(searching){
  		console.log(searching);
  		// 获取列表数据（第？页）
		this.$http({
		    method: 'post',
			url: this.searchURL,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//			data: {
//			   
//			}
	    }).then(function (response) {
//		  	this.tabledatas=response.data.rows;
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
	titleEvent(){
  		console.log('titleEvent');
    },
  	//	打开新建弹框
    createlib() {
    	//额外验证检查样品组和检查项目组
    	if(!this.formdatas.checkList.length){
    		this.$alert('请添检查项目!!!','提示信息',{});
    		return false;
    	}
    	if(!this.formdatas.items.length){
    		this.$alert('请添加样品!!!','提示信息',{});
    		return false;
    	}
        this.modalVisible = true;
    },
    //	获取填入的新建数据
    createlibitem(form) {
        this.receiptor=form.receiptor;
		this.handover();
    },
    //	关闭新建弹框
    dialogClose() {
        this.modalVisible = false;
    },
    new_sample(){
    	var path=this.$route.name+'/选择样品编号'
		this.$router.push({name: path,params: {formdatas:this.formdatas}})
    },
  },
  data() {
    return {
//    handoverURL:this.apiRoot +'/grain/handover/save',
      handoverURL:this.apiRoot +'/grain/handover/editHandover',
      datalistURL:'/liquid/role11/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
	  createlibVisible:false,
	  modalVisible: false,
      breadcrumb:{
      	search:false,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
	  viewPath:this.$route.path+'/handoverListPrint',
	  
	  modal: {
	      title: '新建样品领取交接单',
	      formdatas: [
	          {
	              label: "领取人",
	              model: "receiptor",
	              value:'',
	              type:'input',
	          },
	      ],
	      submitText: '提交',
	  },
	  receiptor:'',
      formdatas: {
  		title:'样品领取交接单',//标题
  		loading:false,
        form:{            	
        	name:'',//交接单名称
        	manager:this.userName,//管理员名
        	remarks:'',//备注信息
        	sort:'小麦',//品种
        },
        checkList:[],//检验项目数组
//      检验样品数组
        items:[
        	
        ],
	  }
    }
  }
}
</script>

