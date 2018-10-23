<template>
    <div class='listpagewrap'>
      <!--面包屑-->
      <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
  	  <!--标题-->
  	  <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>		
      <!--提示-->
      <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
      <!--表单-->
      <manuscript-form :formdatas="formdatas" @pjmdff="pjmdff" @submit="submit"></manuscript-form> 
    </div>
</template>

<style>
	
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import ManuscriptForm  from "@/components/common/action/ManuscriptForm"
import SinograinOptionTitle from "@/components/common/action/OptionTitle"


import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt,SinograinBreadcrumb,SinograinOptionTitle,ManuscriptForm
  },
  computed:{
	...mapState(["modal_id_number","viewdata","editdata","aultdata","messions","mask"]),
	...mapGetters(["modal_id","Token"]),
  },
  created(){
//	console.log(this.$route.query)
//  获取列表数据（第一页）
	this.getSample();
	this.getManuscript()

  },
  destroy(){

  },
  methods: {
  	...mapMutations(['create_modal_id','is_mask','create_modal','close_modal']),
  	...mapActions(['addAction']),
    submit(jsdjg,type){
    	if(!this.$_ault_alert('manuscript:edit')){
			return
		}
       var params = {
            id: this.formdatas.form.id,
            sampleId: this.$route.query.id,//样品id
//          enterprise: this.formdatas.form.enterprise,//被查企业
            // libraryName: this.formdatas.form.libraryName,//被查企业
//          checkedTime: this.formdatas.form.checkedTime,//被查时点
//          realCheckedTime: this.formdatas.form.realCheckedTime,//实际查库日
            realCheckedTime: new Date(this.formdatas.form.realCheckedTime),//实际查库日
            storge: this.formdatas.form.storge,//存储形式
            grainQuality: this.formdatas.form.amount*1000,//保管账数量
            qualityGrade: this.formdatas.form.qualityGrade,//质量等级
            putWay: this.formdatas.form.putWay,//入仓方式
            storageCapacity: this.formdatas.form.storageCapacity,//入库容重
            storageWater: this.formdatas.form.storageWater,//入库水分
            storageImpurity: this.formdatas.form.storageImpurity,//入库杂质
            realCapacity: this.formdatas.form.realCapacity,//实测容重
            realWater: this.formdatas.form.realWater,//实测水分
            realImpurity: this.formdatas.form.realImpurity,//实测杂质
            measuredVolume: jsdjg.measuredVolume,//粮堆测量体积
            deductVolume: this.formdatas.form.deductVolume,//扣除体积
            realVolume: jsdjg.realVolume,//粮堆实际体积
            correctioFactor: this.formdatas.form.correctioFactor,//校正后修正系数
            aveDensity: jsdjg.aveDensity,//粮堆平均密度
            length: this.formdatas.form.length,//长
            wide: this.formdatas.form.wide,//宽
            high: this.formdatas.form.high,//高
            unQuality: jsdjg.unQuality,//测量计算数
            lossWater: this.formdatas.form.lossWater,//水分减量
            lossNature: this.formdatas.form.lossNature,//自然损耗
            loss: jsdjg.loss,//合计
            checkNum: jsdjg.checkNum,//检查计算数
            difference: jsdjg.difference,//差数
            slip: jsdjg.slip,//差率
            isMatch: this.formdatas.form.isMatch,//是否相符
            result: this.formdatas.form.result,//不符原因
            remark: this.formdatas.form.remark,//备注
            rummager: this.formdatas.form.rummager,//检查人
            custodian: this.formdatas.form.custodian,//保管责任人
            leader: this.formdatas.form.leader,//被检查企业负责人
            barnType: this.formdatas.form.barnType,//仓房类型
//          新加形状等
			shape: this.formdatas.form.shape,//形状
			topS:this.formdatas.form.topS,//上底面积
			bottomS:this.formdatas.form.bottomS,//下底面积
			diameter:this.formdatas.form.diameter,//直径
			length_2:this.formdatas.form.length_2,//长度2
			high_2:this.formdatas.form.high_2,//宽度
            
          }
  		this.loading=true;
      //保存数据
      this.$http({
        method: 'post',
        url: this.editURL,
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data:  params,
         
        }).then(function (response) {
        	if(response.data){
        		if(type=="save"){
        			this.$router.go(-1)        			
        		}else if(type=="exportexcel"){
        			this.exportExcel(this.formdatas.form.id)
        		}
        	}
        }.bind(this)).catch(function (error) {
            console.log(error);
        }.bind(this));
  	},
//	获取列表数据方法
  	getManuscript(){
  		this.loading=false;
       var params = {
            sampleId: this.$route.query.id,//样品id
       }
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
        params: JSON.stringify(params)
			}
	    }).then(function (response) {
        for (var key in response.data.rows[0]){
        		if(key=='storageWater'||key=='storageImpurity'||key=='realWater'||key=='realImpurity'){
//      		if(key=='storageCapacity'||key=='storageWater'||key=='storageImpurity'||key=='realCapacity'||key=='realWater'||key=='realImpurity'){
        			if(response.data.rows[0][key]){
        				this.formdatas.form[key]=(response.data.rows[0][key]).toFixed(1);				
        			}else{        				
        				this.formdatas.form[key]=response.data.rows[0][key];
        			}
        		}else if(key=='length'||key=='wide'||key=='high'){
        			this.formdatas.form[key]=(response.data.rows[0][key]).toFixed(2);
        		}else{        			
        			this.formdatas.form[key]=response.data.rows[0][key];
        		}
	    	}
        this.formdatas.form.realCheckedTime= new Date(this.formdatas.form.realCheckedTime);//实际查库日处理
        if(!response.data.rows[0].storge){
        	this.formdatas.form.storge='';
        }
		}.bind(this)).catch(function (error) {
		    console.log(error);
		}.bind(this));
  	},
    //	获取样品
  	getSample(){
  		this.loading=false;
		this.$http({
      method: 'post',
      url: this.sampleURL,
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
        // params: JSON.stringify(params)
        id:this.$route.query.id
			}
	    }).then(function (response) {
       for (var key in response.data){
       			if(key=='id'){
       				console.log('id')
       			}else{       				
       				this.formdatas.form[key]=response.data[key];
       			}
	    	}
        this.formdatas.form.libraryName = this.$route.query.libraryName
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
	pjmdff(type){
		if(type==1){
			//          标准容重器法
			this.formdatas.form.unit_volume_weight_tz="";
			this.formdatas.form.correction_factor_tz="";
			this.formdatas.form.average_density_tz="";
		}else if(type==2){
			//          特制大容器法
			this.formdatas.form.volume_weigh_bz="";
			this.formdatas.form.correction_factor_bz="";
			this.formdatas.form.verageDensity="";			
		}
	},
	titleEvent(){
  		console.log('titleEvent');
    },
  	exportExcel(id){
  		if(!this.$_ault_alert('manuscript:export')){
			return
		}
  		var loadiframe=document.getElementById('fordownload');
  		var shape=this.formdatas.form.shape;
  		if(shape=='长方体'){
			this.exportExcelURL=this.exportExcelURL1
    	}else if(shape=='圆柱体'){
			this.exportExcelURL=this.exportExcelURL2
    	}else if(shape=='长方截锥体'){
			this.exportExcelURL=this.exportExcelURL3
    	}else if(shape=='其他'){
			this.exportExcelURL=this.exportExcelURL4
    	}
		loadiframe.src=this.exportExcelURL+'?id='+id+'&sessionid='+this.Token;
//		window.open(this.exportExcelURL+'?id='+id+'&sessionid='+this.Token,"_blank");
		
//		console.log(pId)
//		// 获取列表数据（第？页）
//		this.$http({
//		    method: 'post',
//			url: this.exportExcelURL,
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
//			    id: id,
//			}
//	    }).then(function (response) {
//		  	if(response.data.success) {
//				  window.open(this.exportExcelURL+'?id='+id,"_blank");
//				  alert("导出Excel成功")

//			  } else {
//				  alert("导出Excel失败")
//			  }
//		}.bind(this)).catch(function (error) {
//		    console.log(error);
//		}.bind(this));
	},
  },
  data() {
    return {
      exportExcelURL: '',//导出接口
      exportExcelURL1: this.apiRoot + '/grain/manuscript/exportExcelCFT',//长方体
      exportExcelURL2: this.apiRoot + '/grain/manuscript/exportExcelYZT',//圆柱体
      exportExcelURL3: this.apiRoot + '/grain/manuscript/exportExcelCFJZT',//长方截锥体
      exportExcelURL4: this.apiRoot + '/grain/manuscript/exportExcelQT',//其他
      datalistURL: this.apiRoot + '/grain/manuscript/data',
      editURL:  this.apiRoot + '/grain/manuscript/edit',
      sampleURL: this.apiRoot + '/grain/sample/get',
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
      	title:'中央储备粮实物检查工作底稿',
      	form:{
      	  shape:'长方体',
		  topS:'0.00',//上底面积
		  bottomS:'0.00',//下底面积
		  diameter:'0.00',//直径
		  length_2:'0.00',//长度2
		  high_2:'0.00',//宽度
		  
      	  amount:'',
          enterprise: '',//被检查企业
          checkedTime: '',//被查时点
          realCheckedTime: '',//实际查库日
          position: '',//货位号
          sort: '',//品种
          quality: '',//性质
          libraryName:'',//所在库区
          barnType:'',//仓房类型
          gainTime: '',//收货年度
          storge:'',//储存形式
          grainQuality:'',//保管帐数量（kg）
          qualityGrade:'',//质量等级
          //stored_way:['人工入仓'],//入仓方式
          putWay:'',//入仓方式
          //粮食入库质量
          storageCapacity:'',//容重（g/l）  
          storageWater:'',//水分（%）
          storageImpurity:'',//杂质（%）  
          //实测粮食质量
          realCapacity:'',//容重（g/l）  
          realWater:'',//水分（%）
          realImpurity:'',//杂质（%） 
          //粮堆形状及基本尺寸
          length:'0.00',//长（m）：
          wide:'0.00',//宽（m）：
          high:'0.00',//高（m）：
          //1.计算粮堆体积
          measuredVolume:'',//粮堆测量体积(m3)	
          deductVolume:'',//需要扣除体积(m3)	
          realVolume:'',//粮堆实际体积(m3)	
          //2.计算粮堆平均密度	
//          标准容重器法
          // volume_weigh_bz:'',//粮食容重（g/l）
          correctioFactor:'0.00',//校正后修正系数
          aveDensity:'',//粮堆平均密度（kg/m³）
//          特制大容器法
          // unit_volume_weight_tz:'',//单位体积粮食重量（kg/m³）
          correction_factor_tz:'0.00',//校正后修正系数
          // average_density_tz:'',//粮堆平均密度（kg/m³）
          //3.计算粮食数量
            unQuality:'',//测量计算数（kg）	
//          应记粮食损耗(kg)	
          lossWater:0,//水分减量
          lossNature:0,//保管自然损耗
          loss:'',//合计
          checkNum:'',//检查计算数（kg）	
          //4.认定粮食实际数量	
//          检查计算数与保管账数量比较
          difference:'',//差数（kg）
          slip:'',//差率（％）
             isMatch:'',//账实是否相符
          // weight_r:'',//粮食实际数量（kg）
          result:'',//账实不符原因   
          remark: '无',//备注
          rummager:'',//检查人：
          custodian:'',//保管责任人：
          leader:'',//被检查企业负责人：    
      	}
	  }
    }
  }
}
</script>





