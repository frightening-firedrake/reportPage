<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <sinograin-prompt :alerts="alerts"></sinograin-prompt>
      <!--表单-->
      <sample-form :formdatas="formdatas"></sample-form> 
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SampleForm  from "@/components/common/action/SampleForm"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SampleForm
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
  },
  created(){
//	console.log(this.$route.params)
//  获取列表数据（第一页）
	this.getlistdata(1)

  },
  mounted(){

  	
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
//		  	取出路由参数
		  	if(this.$route.params){	  		
//		  		this.formdatas.form.position=this.$route.params.position;
		  		this.formdatas.form.sampleInSign=this.$route.params.sampleInSign;
		  		this.formdatas.form.yangpinshi=this.$route.params.yangpinshi;
    			this.formdatas.form.gui=this.$route.params.gui;
		  	}
//		  	this.tabledatas=response.data.rows;
//	  		this.page.total=response.data.total;
		  	
	  		setTimeout(()=>{			  		
		  		this.loading=false;
		  	},1000)
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
  },
  data() {
    return {
      datalistURL:'/liquid/role9/data',
      searchURL:'/liquid/role2/data/search',
      deleteURL:'/liquid/role2/data/delete',
      checkedId:[],
	  createlibVisible:false,
      breadcrumb:{
      	search:false,   
      	searching:'',
      },
      subtitle:{
      	btn:false,
      	btntext:'',
      },
//    弹窗数据
      alerts: [{
        title: '温馨提示：此页面灰色字为不可编辑状态!',
        type: 'info'
      }],
      formdatas: {
      	title:'中央储备粮襄垣直属库',
      	form:{
          ctime: '2017-12-12',//创建时间
          status: '未扦样',//状态
          nid: '',//迁样编号
          checkregion: '山西',//被查库点
          pnumber: '',//货位号
          varieties: '',//品种
          quality: '',//性质
          weight: '',//代表数量
          region: '山西',//产地
          harvestdate: '2017',//收货年度
          samplingdate: '',//扦样日期
          remarks: '',//备注
          storageStatus:'',
          sampleInTime: "",
          position:"",
          sampleInSign: "",
          code:''
      	},
      	submitText:'入库',
	  }
    }
  }
}
</script>

