<template>
	<div class='listpagewrap'>
		<!--面包屑-->
		<sinograin-breadcrumb :breadcrumb="breadcrumb" ></sinograin-breadcrumb>
		<!--alert-->
		<!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
        <div class="common_select">
          <label>
            <span class="title_select">选择样品室:</span>
            <el-select v-model="point" placeholder="选择样品室" @change="_select">
                <el-option v-for="item in pointList" :key="item.id" :label="item.depot" :value="item.id">
                </el-option>
            </el-select>
        </label>
        </div>
		<!--表单-->
		<!--<information-set :informations="informations" @addinformation="addinformationLib" :title="title" :inforSelect="inforselect"></information-set>-->
		<information-set3 :informations="counterInformationsguizi" :title="informationTitle[0]" @addinformation="addinformation0"></information-set3> 
		<information-set3 :informations="counterInformationshuojia" :title="informationTitle[1]" @addinformation="addinformation1"></information-set3> 
		<!--输入弹框-->
		<sinograin-modal v-if="modalVisible" :modal="modal" v-on:createlibitem="createlibitem" v-on:dialogClose="dialogClose"></sinograin-modal>
	</div>
</template>

<style>

</style>

<script>

import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import SinograinPrompt from '@/components/common/prompt/Prompt.vue';
import InformationSet3 from "@/components/common/action/InformationSet3";
import SinograinModal from '@/components/common/action/Modal.vue';

import "@/assets/style/information/InformationSet.css"
import "@/assets/style/common/Select.scss";
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
	components: {
		SinograinBreadcrumb, SinograinOptionTitle, InformationSet3, SinograinPrompt, SinograinModal
	},
	computed: {
		counterInformationsguizi(){

			if(this.point){					
				return this.informations0.filter((value,index)=>{
							return value.pId==this.point&&value.type==1
						})
			}else{
				return [];
			}
		},
		counterInformationshuojia(){
			if(this.point){	
				return this.informations1.filter((value,index)=>{
							return value.pId==this.point&&value.type==2
						})
			}else{
				return [];
			}
		},
		findDepot(){
			var sample;
			sample=this.pointList.filter((value,index)=>{
				return value.id==this.point
			})
			if(sample.length){				
				return sample[0].depot
			}
			return '';
		},
	},
	created() {
		this.depotlist(1);
		this.counterlist(1);
	},
	destroy() {

	},
	methods: {
        // 下拉框选择直属库
        _select(){
			this.isinformations = true;
        },
		//	获取列表数据方法
		depotlist(page) {
//			let params = {
//				pLibraryId: -1
//			}
			this.loading = true;
			// 获取列表数据（第？页）
			this.$http({
				method: 'post',
				url: this.depotlistURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				 transformRequest: [function(data) {
					// Do whatever you want to transform the data
					let ret = ''
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				data: {				
//					params:JSON.stringify(params)
				}
			}).then(function(response) {
				this.pointList = response.data
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
		},
		counterlist(page) {
//			let params = {
//				pLibraryId: -1
//			}
			this.loading = true;
			// 获取列表数据（第？页）
			this.$http({
				method: 'post',
				url: this.counterlistURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				 transformRequest: [function(data) {
					// Do whatever you want to transform the data
					let ret = ''
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				data: {				
//					params:JSON.stringify(params)
				}
			}).then(function(response) {
//				this.pointList = response.data
//				this.informations[0]=response.data.filter((value,index)=>{
//					return 
//				})

//					this.informations0=response.data.filter((value,index)=>{
//						return value.pId==this.point
//					})
					this.informations0=response.data
					this.informations1=response.data

//				console.log(this.informations)
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
		},
		
		titleEvent() {
			console.log('titleEvent');
		},
		//	打开新建弹框
		//	新建库
		addinformation0(type) {		
			if(!this.$_ault_alert('library:save')){
				return
			}
			if(this.isinformations){
				this.informationType = type;
				this.modal = {
					title: '新建柜子',
					formdatas: [
						{
							label: "样品室",
							model: "depot",
							type:'input',
							value:this.findDepot,
							disabled:true,
						},
						{
							label: "柜子名称",
							model: "counter",
							type:'input',
							value:'',
						},
						{
							label: "位置数量",
							model: "warehouseTotal",
							type:'input',
							value:'',
						},
					],
					submitText: '确定',
				},
				this.modalVisible = true;
			}else{
				// alert("请先选择直属库")
				this.$notify.error({
					title:"提示",
					message:"请先选择样品室"
				})
			}
			
		},
		addinformation1(type) {		
			if(!this.$_ault_alert('library:save')){
				return
			}
			if(this.isinformations){
				this.informationType = type;
				this.modal = {
					title: '新建货架',
					formdatas: [
						{
							label: "样品室",
							model: "depot",
							type:'input',
							value:this.findDepot,
							disabled:true,
						},
						{
							label: "货架名称",
							model: "counter",
							type:'input',
							value:'',
						},
						{
							label: "位置数量",
							model: "warehouseTotal",
							type:'input',
							value:'',
						},
					],
					submitText: '确定',
				},
				this.modalVisible = true;
			}else{
				// alert("请先选择直属库")
				this.$notify.error({
					title:"提示",
					message:"请先选择样品室"
				})
			}
			
		},
		//	填入新建数据
		createlibitem(data,title) {		
			if(!this.$_ault_alert('warehouseCounter:save')){
				return
			}
			var type='';
			if(title=='新建柜子'){
				type=1
			}else if(title=='新建货架'){
				type=2
			}
			this.$http({
				method: 'post',
				url: this.addURL,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: [function(data) {
					// Do whatever you want to transform the data
					let ret = ''
					for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
				data: {
                    pId:this.point,
                    counter: data.counter,
                    type:type,
                    warehouseTotal:data.warehouseTotal,
				}
			}).then(function(response) {
				//		  	this.tabledatas=response.data.rows;
				this.counterlist(1);
//				this._select();
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
		},
		//	关闭新建弹框
		dialogClose() {
			this.modalVisible = false;
		},
		
	},
	data() {
		return {
            inforselect:"1",
			title: "库点",
			isinformations:false,
            pointList:[],
            point:"",
//			datalistURL: this.apiRoot + '/grain/warehouse/getAll',
			depotlistURL: this.apiRoot + '/grain/warehouse/getAll',
	  		counterlistURL: this.apiRoot + '/grain/warehouseCounter/getAll',
	  		placelistURL: this.apiRoot + '/grain/warehouseCounterPlace/getAll',
			addURL: this.apiRoot + '/grain/warehouseCounter/save',
			searchURL: this.apiRoot + '/liquid/role2/data/search',
			deleteURL: this.apiRoot + '/liquid/role2/data/delete',
			checkedId: [],
			createlibVisible: false,
			modalVisible: false,
			modal: {
		
			},
			breadcrumb: {
				search: false,
				searching: '',
			},
			alerts: [{
				title: '温馨提示：可在此页面更改库点与品种项目!',
				type: 'info'
			}],
			informationType: '',
			informationTitle:['柜子','货架'],
			informations0: [],
			informations1: [],
		}
	}
}
</script>
