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
	  <!--底部按钮-->
      <tfoot-buttons :tfbtns="tfbtns" @tfootEvent="tfootEvent" ></tfoot-buttons>
      <div style="display: none;">{{Suffix}}</div>
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
import TfootButtons from '@/components/common/action/TfootButtons.vue';
//这里是打印控件
import {getLodop} from 'static/lodop/LodopFuncs'
let LODOP

import "@/assets/style/common/SamplePrintList.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,SamplePrintList,SinograinMessage,TfootButtons
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id"]),
//	计算检测项目并排序
	checkList(){
		if(this.checkeds){
			var indexs=this.checkeds.split(',');
			indexs.sort((a,b)=>{return a-b});
			return indexs
		}
	},
//	计算后缀名
	Suffix(){
		var Suffix=[];
		var arr=[
//				{label:'' ,show:false,Suffix:['小1','小2']},
//				{label:'水分',show:false,Suffix:['水']},
//				{label:'硬度指数',show:false,Suffix:['硬']},
//				{label:'面筋吸水量',show:false,Suffix:['面']},
//				{label:'脂肪酸值',show:false,Suffix:['脂']},
//				{label:'品尝评分值',show:false,Suffix:['品']},
//				{label:'',show:false,Suffix:['卫'],class:'full'},
				{label:'' ,show:false,Suffix:['-01小1','-02小2']},
				{label:'水分',show:false,Suffix:['-03水']},
				{label:'硬度指数',show:false,Suffix:['-04硬']},
				{label:'面筋吸水量',show:false,Suffix:['-05面']},
				{label:'脂肪酸值',show:false,Suffix:['-08脂']},
				{label:'品尝评分值',show:false,Suffix:['-06品']},
				{label:'',show:false,Suffix:['-07卫'],class:'full'},
			];
			if(this.checkList){
				this.checkList.forEach((value,index)=>{
					if([1,3,4,5,6].includes(value-0)){
						arr[0].show=true;
						arr[0].label+=this.checkAllList[value-1]+'、';
					}else if([2].includes(value-0)){
						arr[1].show=true;
					}else if([8].includes(value-0)){
						arr[2].show=true;
					}else if([9].includes(value-0)){
						arr[3].show=true;
					}else if([10].includes(value-0)){
						arr[4].show=true;
					}else if([11].includes(value-0)){
						arr[5].show=true;
					}else if([13,14,15,16,17,18,19].includes(value-0)){
						arr[6].show=true;
						arr[6].label+=this.checkAllList[value-1]+'、';
					}
				})
				if(arr[0].label){
					arr[0].label=arr[0].label.slice(0,-1)
				}
				if(arr[6].label){
					arr[6].label=arr[6].label.slice(0,-1)
				}
				var res=arr.filter((value)=>{
					return value.show
				})	
				res.forEach((value)=>{
					Suffix=Suffix.concat(value.Suffix)
				})
				return Suffix
			}
	}
  },
  created(){
//	console.log(this.$route.params.code)//这就是扫到的条码
//  获取列表数据（第一页）
//	this.getlistdata(1)
	if(!this.$route.params.code){
		this.$router.push({name:"样品检测/分装小样管理"})		
//	}else{
//		if(this.$route.params.sort=='玉米'){
//			this.checkAllList=["不完善颗粒","杂质","生霉粒","水分","硬度","脂肪酸值","品尝评分","卫生指标","加工品质"];
//		}else if(this.$route.params.sort=='小麦'){
//			this.checkAllList=["不完善颗粒","杂质","生霉粒","水分","硬度","面筋吸水量","品尝评分","卫生指标","加工品质"];
//		}
	}else{
		if(this.$route.params.sampleState!==5){
			this.listdatas.buttonText=false
		}
		
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
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:{
    			sampleNum:this.$route.params.code,				
			},
	   }).then(function (response) {	    	
	    	this.checkeds=response.data.checkeds
			console.log(this.checkeds)
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
  	print(Suffix){
//		console.log('打印'+checked+'检测条码')
  		this.messageShow=true;
  		this.messages.type="loading";
		this.printBarSuffix(Suffix);		
  	},
  	printAll(){
//		console.log('打印'+checked+'检测条码')
  		this.messageShow=true;
  		this.messages.type="loading";
  		if(this.$route.params.sampleState!==5){
			this.getPrintCodeAll();	//后台获取条码信息打印用
		}else{			
			this.printBarSuffix(this.Suffix);	//前台自主打印用	
		}
  	},
  	getPrintCode(checked){
  		var wind = window.open("",'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'); 		
  		this.$http({
		    method: 'post',
			url: this.getPrintCodeURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:{
//  			checked:checked,				
    			sampleNum:this.$route.params.code,				
			},
	   }).then(function (response) {	    	
		//    console.log(response)
//	    	返回打印需要的条码格式待定
//			假设是图片吧临时的
//			this.imgsrc=response.data
			this.printBar(wind);
			
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
//	目前执行的打印方法
  	getPrintCodeAll(){
//		var wind = window.open("",'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'); 		
  		var params = {};
		params.sampleId = this.$route.params.id
		this.$http({
		    method: 'post',
			url: this.getPrintCodeAllURL,
			transformRequest: [function (data) {
				// Do whatever you want to transform the data
				let ret = ''
				for (let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
				}
				return ret
			}],
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data:{
//  			checked:checked,		
				checkPoint:0,
      			sampleNum:this.$route.params.code,
//				id:this.$route.params.id,
//				taskId:this.$route.params.taskId,
//				isPrint:this.isPrint,
//				params:JSON.stringify(params)				
			},
	   }).then(function (response) {
	   		if(response.data.length) {
	   			this.printBarSuffix(this.Suffix);	//前台自主打印用	
			}else{
				console.log('分小样失败了哦！！T_T')
			}
	   	
//			if(response.success) {
//				this.isPrint=3;				
//			}
//			var barcodeAll=response.data.map((value)=>{
//				return value.smallSampleWord
//			})
//		   	console.log("111111111111111111")
//		   	console.log(response,this.isPrint)
//			console.log(barcodeAll)
//			this.printBarAll(response.data);
//	    	返回打印需要的条码格式待定
//			假设是图片吧临时的
//			this.imgsrc=response.data
			
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
  	printBar(wind){
		wind.location.href = this.imgsrc;
		wind.onload=function(){
			wind.print();
			wind.close();			
		};
  	},
  	printBarSuffix(Suffix){
//		console.log(Suffix)
		LODOP = getLodop();
		Suffix.forEach((val)=>{  
//			ADD_PRINT_BARCODE(Top,Left,Width,Height,BarCodeType,BarCodeValue);
//			console.log(this.$route.params.code+val)
			LODOP.PRINT_INIT("打印条码");
			LODOP.SET_PRINTER_INDEX("Godex G530");  
			LODOP.SET_PRINT_PAGESIZE(1, 700, 400, "USER");
			LODOP.ADD_PRINT_BARCODE(3,30,232,115,'128B',this.$route.params.code+val);
//			LODOP.SET_PRINT_PAGESIZE(1, 400, 200, "USER");
//			LODOP.ADD_PRINT_BARCODE(1,25,232,115,'128B',this.$route.params.code+val);
//  		LODOP.PREVIEW(); 
			LODOP.PRINT(); 
		})
  	},
  	printBarAll(str){
  		var arr=str.split(',');
		arr.sort()
     		LODOP = getLodop();
     		arr.forEach((val)=>{  
//   			val.str.slice(-2)
     			LODOP.PRINT_INIT("打印条码");
     			LODOP.SET_PRINTER_INDEX("Godex G530");  
     			LODOP.SET_PRINT_PAGESIZE(1, 700, 400, "USER");
     			LODOP.ADD_PRINT_BARCODE(3,30,232,115,'128B',val);
//     			LODOP.PREVIEW(); 
   				LODOP.PRINT(); 
     		})
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
    //	表单底部触发事件btnCenterNo btnCenterYes btnLeft btnRight btnOne
	tfootEvent(date){
		console.log(date);
		if(date=='btnCenterL'){

//			this.$router.go(-1)
		}else if(date=='btnCenterR'){

//			this.$router.go(-1)
//			window.history.go(-1)
		}else if(date=='btnLeft'){

		}else if(date=='btnRight'){
			this.printAll()
		}else if(date=='btnOne'){

		}
	},
  },
  data() {
    return {
      datalistURL:this.apiRoot +'/grain/sample/getBySampleNum',
      getPrintCodeURL:this.apiRoot +'/grain/sample/getBySampleNum',
      getPrintCodeAllURL:this.apiRoot +'/grain/sample/split',
//    getPrintCodeAllURL:'/huoqudayintiaoma',
      searchURL:'/liquid/role2/data/search',
      imgsrc:'static/images/test/code.jpg',
      printBarOver:false,
	  isPrint:this.$route.params.sampleState,
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
		title:'监'+this.$route.params.code,
		label:'检验项目',
		buttonText:'打印',
	},
	checkeds:this.$route.params.checkeds,
	checkAllList:["容重","水分","杂质","矿物质","不完善粒","生霉粒","色泽气味(质量指标)","硬度指数","面筋吸水量","脂肪酸值","品尝评分值","色泽气味(储存品质指标)","真菌毒素(黄曲霉毒素B1)","真菌毒素(脱氧雪腐镰刀菌烯醇)","真菌毒素(玉米赤霉烯酮)","重金属(铅)","重金属(镉)","重金属(汞)","重金属(砷)"],	
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
	  tfbtns:{
//    	btnCenter:{
//			btnTextL:'不同意',
//			btnTextR:'同意',
//			doubleColor:true,
//		},
//		btnLeft:{
//			btnText:'打印检验项目条形码',
//		},
		btnRight:{
			btnText:'打印全部条形码',
		},
//		btnOne:{
//			btnText:'导出Excel表格',
//		},     	
      },
    }
  },
}
</script>

