<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <sample-print-list :listdatas="listdatas" :checkAllList="checkAllList" :checkList="checkList" v-on:print="print"></sample-print-list> 
      <!--通知弹框-->
      <sinograin-message v-if="messageShow" :messages="messages" v-on:messageclick="messageclick" v-on:messageClose="messageClose"></sinograin-message>
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SamplePrintList  from "@/components/common/action/SamplePrintList.vue"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import SinograinMessage from "@/components/common/action/Message"


import "@/assets/style/common/SamplePrintList.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SamplePrintList,SinograinMessage
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
	checkList(){
		if(this.checkeds){
			var indexs=this.checkeds.split(',');
			indexs.sort((a,b)=>{return a-b});
			return indexs
		}
	},
  },
  created(){
  	console.log(this.$route.query)
//  获取列表数据（第一页）
//	this.getlistdata(1)

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
//		  	this.formdatas=response.data.formdatas;
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
  	print(number){
  		console.log('打印'+number+'检测条码')
  		this.messageShow=true;
  		this.messages.type="loading";
  		setTimeout(()=>{
  			this.messages.type="success";
  		},2000)
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
  	titleEvent(){
  		console.log('titleEvent');
  	},
  },
  data() {
    return {
      datalistURL:'/liquid/role9/data',
      searchURL:'/liquid/role2/data/search',
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
//    alerts: [{
//      title: '温馨提示：此页面灰色字为不可编辑状态!',
//      type: 'info'
//    }],
listdatas:{
		titleLabel:'检验编号',
		title:'监20170078',
		titleNumber:'12',
		subtitleLabel:'打印条数',
		subtitle:'8',
		printDate:'2018.01.25',
		label:'检验项目',
	},
	checkeds:'1,3,5',
	checkAllList:["不完善颗粒、杂质、生霉粒","水分","硬度","脂肪酸值","品尝评分","卫生指标","加工品质"],
	  messageShow:false,
	  messages:{
	  	type:'error',
	  	success:{
	  		icon:'el-icon-success',
	  		messageTittle:'打印完成',
	  		messageText:'请收好您的条形码并注意及时粘贴',
	  		buttonText:'完成',
	  	},
	  	error:{
	  		icon:'el-icon-error',
	  		messageTittle:'打印失败',
	  		messageText:'可能由于网络的原因，请检查您的网络',
	  		buttonText:'重新打印',
	  	},
	  	loading:{
	  		icon:'el-icon-printer',
	  		messageTittle:'正在打印中...',
	  		messageText:'请您耐心等待，正在打印中...',
	  	},
	  },
    }
  },
}
</script>

