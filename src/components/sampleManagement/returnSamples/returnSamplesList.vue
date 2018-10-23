<template>
  <div class='listpagewrap' id="listpagewrap">
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--标题-->
    <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
    <div id="print" >
      <div class="handover_view" style="width:100%;">
        <!--<div class="hand_view_title" style="width:100%;height:0.45rem;text-align:center;line-height:0.45rem;font-size:0.24rem;color:#333333;">
          <span>山西中储粮粮油质监中心</span>
        </div>-->
        <div class="hand_view_tab" style="">
          <div class="hand_view_tab_title" style="">
            <!--<p>{{formdatas.sort}}样品领取交接单</p>-->
            <p style="">{{formdatas.name?formdatas.name:'样品归还单'}}</p>
          </div>
          <div class="hand_view_tab_num" style="" v-if="formdatas.nid">
            <p style="">编号:{{formdatas.nid>=10?formdatas.nid:'0'+formdatas.nid}}</p>
          </div>
          <!--<el-row style="" class="hand_view_tab_content">
            <el-col style="" :span="24" class="hand_view_tab_content_font">
              <el-col style="" :span="2">
                <span>检验项目:</span>
              </el-col>
              <el-col style="" :span="20">
                <span>{{formdatas.testList}}</span>
              </el-col>
            </el-col>
          </el-row>-->
          <el-row style="background-color:#fbfbfb;" class="hand_view_tabbody">
            
            <el-col style="" :span="12">
              <el-col style="" :span="2">
                <span>序号</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>检验编号</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>存放位置</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>归还人</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="4">
                <span>操作</span>
              </el-col>
            </el-col>
            <el-col style="" :span="12">
              <el-col style="" :span="2">
                <span>序号</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>检验编号</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>存放位置</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>归还人</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="4">
                <span>操作</span>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="hand_view_tabbody" style="border-top:none;">
            <el-col :span="12" v-for="(item,index) in formdatas.items" class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="2">
                <span>{{index+1}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>{{item.sampleNum}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>{{item.storage}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>{{formdatas.returnPerson}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;background:white;" :span="4" >
                <!--<span class="delbtn" @click=delSample(item.id)>删除</span>-->
                <span class="delbtn" v-if="isreturn" @click=delSample(item.id)>删除</span>
                <span class="delbtn2" v-if="!isreturn">删除</span>
              </el-col>
            </el-col>
            <el-col style="" :span="12" v-if="formdatas.items.length%2" class='loopBorder' style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="2">
                <span>{{formdatas.items.length+1}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <!--<span class="addbtn" @click=addSample>+检验编号</span>-->
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;background:white;" :span="4">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <!--<el-col style="" :span="12" v-if="!formdatas.items.length%2" class='loopBorder' style="border-top:1px solid #dfdfdf;">
              <el-col style="" :span="2">
                <span>{{formdatas.items.length+2}}</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;" :span="6">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="border-left:1px solid #dfdfdf;text-align: center;background:white;" :span="4">
                <span>&nbsp;</span>
              </el-col>
            </el-col>-->
            
          </el-row>

          <!--<el-row style="" class="hand_view_tabbody">
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>领取人</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>归还人</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="12">
              <el-col style="" :span="4">
                <span>备注</span>
              </el-col>
              <el-col style="" :span="20">
                <span>{{formdatas.remarks}}</span>
              </el-col>
            </el-col>
          </el-row>

          <el-row style="" class="hand_view_tabbody date">
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>领取日期</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col style="" :span="6">
              <el-col style="" :span="8">
                <span>归还日期</span>
              </el-col>
              <el-col style="" :span="16">
                <span>&nbsp;</span>
              </el-col>
            </el-col>
            <el-col :span="12" class="loopBorder" style="border-left:1px solid #dfdfdf;">
              <el-col style="" :span="4">
                <span>&nbsp;</span>
              </el-col>
              <el-col style="" :span="20">
              	<el-col style="" :span="2">
              	
              	</el-col>
              	<el-col style="" :span="10">
              			样品管理员：{{userName}}
              	</el-col>
              	<el-col style="" :span="2">
              	
              	</el-col>
              	<el-col style="" :span="10">
              			时间：{{new Date()|data}}
              	</el-col>

              </el-col>
            </el-col>
          </el-row>-->
        </div>
      </div>
      </div>
     	<div class="hoverReturn">
		    <el-button v-if="isreturn" class="hoverReturnBtn" type="primary" @click="hoverReturn">确认归还</el-button>
      </div>
      <sinograin-modal v-if="modalVisible"  :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose" @modelSelectChange="modelSelectChange"></sinograin-modal>      	
    	
  </div>
</template>

<style>
.hoverReturn{
	text-align: center;
} 
.hoverReturn button {
    font-size: 0.18rem;
    padding: 0 0.15rem;
    line-height: 0.5rem;
    border-radius: 0.1rem;
    min-width:1.3rem;
    width:auto;
    height:0.5rem;
    text-align: center;
    margin-top:0.7rem;
}
.hoverReturn .el-button+.el-button{
	margin-left:0.3rem;
}
.hoverReturn button.hoverReturnBtn {
	background-color: rgb(88,180,129);
	border-color:rgb(88,180,129);
}
.hoverReturn button.hoverReturnBtn.is-disabled,.hoverReturn button.hoverReturnBtn.is-disabled:hover  {
	background-color: #999999;
	border-color:#999999;
}
.hoverReturn button.hoverReturnBtn:hover {
	background-color: rgba(88,180,129,0.8);
	border-color:rgb(88,180,129);
}
</style>

<script>

import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle"
import SinograinModal from '@/components/common/action/Modal.vue';
//这里是打印控件
import {getLodop} from 'static/lodop/LodopFuncs'
let LODOP

import "static/jqprint/jquery.jqprint.js"
import "@/assets/style/common/handoverView.css"
import "@/assets/style/common/list.css"
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';



export default {
  components: {
    SinograinPrompt, SinograinBreadcrumb, SinograinOptionTitle, SinograinModal
  },
  computed: {
    ...mapState(["modal_id_number", "viewdata", "editdata", "aultdata", "messions", "mask"]),
    ...mapGetters(["userName"]),
    itemsadd(){
    	var length=2;
    	if(this.formdatas.items.length%2){    		
    		length=1;
    	}else{
    		length=2;    		
    	}
    	var item={checkNum:undefined}
    	var arr=[]
		    for (var i=0;i<length;i++){
					arr.push(item)
				}
			  return arr
    }
  },
  created() {
    console.log(this.$route.query)
    //  获取列表数据（第一页）
    this.getlistdata(1)
		if(this.$route.params.formdatas){
			this.formdatas=this.$route.params.formdatas
		}
  },
  destroy() {

  },
  methods: {
    ...mapMutations(['create_modal_id', 'is_mask', 'create_modal', 'close_modal']),
    ...mapActions(['addAction']),
    print() {
      // $("#print").jqprint({
      // 		 debug: false, 
      // 		 importCSS: true, 
      // 		 printContainer: true, 
      // 		 operaSupport: false
      // 		 });
      // alert(0)
//    let subOutputRankPrint = document.getElementById('print');
//    console.log(subOutputRankPrint.innerHTML);
//    let newContent = subOutputRankPrint.innerHTML;
//    let oldContent = document.body.innerHTML;
//    document.body.innerHTML = newContent;
//    print.portrait   =  false  
//    window.print();
//    window.location.reload();
//    document.body.innerHTML = oldContent;
//    return false;
      
      let subOutputRankPrint = document.getElementById('print');
			let father = document.getElementById('father');
			let listpagewrap = document.getElementById('listpagewrap');
			let printbuttom = document.getElementById('printbuttom');
			document.body.insertBefore(subOutputRankPrint,father)
			subOutputRankPrint.classList.add('blackBorder')
			father.style.display="none";
      print.portrait   =  true;  
      window.print();
      subOutputRankPrint.classList.remove('blackBorder')
      listpagewrap.insertBefore(subOutputRankPrint,printbuttom)
			father.style.display="block";
     	return false;
    },
    lodopPrint() {
    	LODOP = getLodop();

  			LODOP.PRINT_INIT("打印交接单");
//			LODOP.SET_PRINTER_INDEX("Godex G530");  
  			LODOP.SET_PRINT_PAGESIZE(2, 210, 297, "A4");
				LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("print").innerHTML);
    		LODOP.PREVIEW(); 
//			  LODOP.PRINT(); 

    },
    //	获取列表数据方法
    getlistdata(page) {
      this.loading = true;
      // 获取列表数据（第？页）
      this.$http({
        method: 'post',
        url: this.datalistURL,
        transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  			data: {
  					id:this.$route.query.id
  			}
      }).then(function(response) {
        this.isreturn=response.data.returnState==-1?true:false;
//    	console.log(response.data)
//    	this.formdatas.remarks=response.data.remark;//备注
//    	this.formdatas.gly="管理员"
//    	this.formdatas.time=response.data.updateTime;//领取时间
//    	this.formdatas.testList=this.findCheckeds(response.data.checkeds);//检测项目
      	this.formdatas.nid=response.data.id;//编号
//    	this.formdatas.sort='麦子';//品种
//    	this.formdatas.name=response.data.name;//品种
      	this.formdatas.items=response.data.samples;//检测样品
        this.formdatas.returnPerson=response.data.returnPerson;
      	this.sampleNums=response.data.sampleNums;//检测样品
      	// this.formdatas.items=response.data.sampleNums.split(',');//检测样品
      	this.formdatas.items.sort();//检测样品排序
      	this.returnState=response.data.returnState;
//      this.formdatas = response.data;
        //		  	this.tabledatas=response.data.rows;
        //	  		this.page.total=response.data.total;
          this.loading = false;
      }.bind(this)).catch(function(error) {
        console.log(error);
      }.bind(this));
    },
    //	获取搜索数据
    searchingfor(searching) {
      console.log(searching);
      // 获取列表数据（第？页）
      this.$http({
        method: 'post',
        url: this.searchURL,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //			data: {
        //			   
        //			}
      }).then(function(response) {
        //		  	this.tabledatas=response.data.rows;
        setTimeout(() => {
          this.loading = false;
        }, 1000)
      }.bind(this)).catch(function(error) {
        console.log(error);
      }.bind(this));
    },
    delSample(id){
    	var msg='此操作将删除该样品, 是否继续?';
    	if(this.formdatas.items.length==1){
    			msg='删除此样品归还单将一并删除, 是否继续?';
    	}
    	this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.delReturnSample(id)
//				this.formdatas.items=this.formdatas.items.filter((value,index)=>{
//	    		return value.id!==id
//	    	})
//		      	this.$message({
//		        	type: 'success',
//		        	message: '删除成功!'
//		      	});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
    	
    },
    delReturnSample(id){
    		this.$http({
          	method: 'post',
          	url:this.deleteURL,
          	transformRequest: [function (data) {
								let ret = ''
								for (let it in data) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
								}
							return ret
						}],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
              sampleId: id,
  						id:this.$route.query.id
          },
        }).then(function(response) {
          	if(response.data.success){
          			this.formdatas.items=this.formdatas.items.filter((value,index)=>{
					    			return value.id!==id
					    	})
				      	this.$message({
				        		type: 'success',
				        		message: '删除成功!'
				      	});
				      	if(!this.formdatas.items.length){
          					this.$router.push({path:'/index/sampleManagement/returnSamples'});
				      	}
          	}         
        }.bind(this)).catch(function(error) {
          	console.log(error);
        }.bind(this));
    },
    addSample(){
    	var path=this.$route.name+'/添加检验编号'
			this.$router.push({name: path,params: {formdatas:this.formdatas}})
    },
		titleEvent(){
  		console.log('titleEvent');
  	},
//	findCheckeds(str){
//	  	var indexs=str.split(',');
//	  	indexs.sort((a,b)=>{return a-b;});
//	  	var checkList=["不完善颗粒","杂质","生霉粒","水分","硬度","脂肪酸值(面筋吸水量)","品尝评分","卫生","加工品质"]
//	  	var res=[];
//	  	indexs.forEach((item)=>{
//	  		res.push(checkList[item-1])
//	  	})
//	  	return res.join('，')
//	  },
	  //	填入新建数据
		createlibitem(form) {
			console.log(form);
    // this.guihuanadd(form);
      // this.$router.push({path:'/index/sampleManagement/returnSamples'});
		},
    getDateNow(){
  		var date1=new Date()
  		return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDate()
  	},
    guihuanadd() {
        // var returnTime = new Date();
        this.$http({
          method: 'post',
          url:this.guihuanaddURL,
          transformRequest: [function (data) {
					let ret = ''
					for (let it in data) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
              id: this.$route.query.id,
              returnState: 1,
              // returnTime: returnTime,
          },
        }).then(function(response) {

          	if(response.data.success){
          		this.$router.push({path:'/index/sampleManagement/returnSamples'});
          	}
          
        }.bind(this)).catch(function(error) {

          console.log(error);
        }.bind(this));
    },
		modelSelectChange(val,model){
		
		},
		//	关闭新建弹框
		dialogClose() {
			this.modalVisible = false;
		},
		hoverReturn(){
			if(!this.$_ault_alert('returnSingle:guihuan')){
				return
			}
      this.guihuanadd();
//			if(!this.formdatas.items.length){
//				this.$alert('请添加检验编号','提示信息',{type: 'warning'});
//				return
//			}
//			this.modalVisible = true;
		},
  },
  filters: {
   data:function (input) {
       var d = new Date(input);
       var year = d.getFullYear();
       var month = d.getMonth() + 1;
       var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
       var hour = d.getHours();
       var minutes = d.getMinutes();
       var seconds = d.getSeconds();
       return  year+ '-' + month + '-' + day;
//     return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
   }
  },
  data() {
    return {
      datalistURL: this.apiRoot +'/grain/returnSingle/getStorage',
      guihuanaddURL: this.apiRoot+'/grain/returnSingle/guihuan',
      searchURL: '/liquid/role2/data/search',
      deleteURL:  this.apiRoot+'/grain/returnSingle/removeSampleId',
      isreturn:true,
      checkedId: [],
      createlibVisible: false,
      returnState:-1,
      sampleNums:'',
      breadcrumb: {
        search: false,
        searching: '',
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
//    	name:'',
//      sort:'',//品种
        nid:'',//编号
//      testList:'',//检测项目
        returnPerson:'',
        //检测样品
        items:[
   
        ],
//      remarks:'',
//      gly:'',
//      time:'',
      },
      modalVisible:false,
			modal:{
			  title:'填写归还人',
				formdatas:[
					{
			  			label:"填写归还人:",
			  			model:"returnPerson",
//			  			disabled:true,
			  			value:'',
			  			type:'input',
			  		},					
			  	],		
			  	submitText:'确认',
			},
    }
  }
}
</script>

