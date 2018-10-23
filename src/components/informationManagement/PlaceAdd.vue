<template>
	<div class='listpagewrap'>
		<!--面包屑-->
		<sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
		<!--alert-->
		<!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
		<!--表单-->
		<information-set :informations="informations" @addinformation="addinformationLib" :title="title"></information-set>
		<!--<information-set :informations="informations[1]" @addinformation="addinformationVarieties"></information-set> -->
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
import InformationSet from "@/components/common/action/InformationSet";
import SinograinModal from '@/components/common/action/Modal.vue';

import "@/assets/style/information/InformationSet.css"
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
//本地测试要用下面import代码
//import data from '@/util/mock';

export default {
	components: {
		SinograinBreadcrumb, SinograinOptionTitle, InformationSet, SinograinPrompt, SinograinModal
	},
	computed: {

	},
	created() {
		this.getlistdata(1);
	},
	destroy() {

	},
	methods: {
		//	获取列表数据方法
		getlistdata(page) {
			let params = {
				pLibraryId: "-1"
			}
			this.loading = true;
			// 获取列表数据（第？页）
			this.$http({
				method: 'post',
				url: this.datalistURL,
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
					params: JSON.stringify(params)
				}
			}).then(function(response) {
				this.informations = response.data.filter((item)=>{
					return item.pLibraryId==-1;
				});
				//		  	this.formdatas=response.data.formdatas;		  
				//		  	this.tabledatas=response.data.rows;
				//	  		this.page.total=response.data.total;

				setTimeout(() => {
					this.loading = false;
				}, 1000)
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
		titleEvent() {
			console.log('titleEvent');
		},
		//	打开新建弹框
		//	新建库
		addinformationLib(type) {
			if(!this.$_ault_alert('library:save')){
				return
			}
			this.informationType = type;
			this.modal = {
				title: '新建直属库',
				formdatas: [
					{
						label: "直属库名称",
						model: "unit",
						type:'input',
					},
					// {
					// 	label:"添加库点",
					// 	model:"lib",
					// },
				],
				submitText: '确定',
			},
				this.modalVisible = true;
		},
		//	新建品种
		addinformationVarieties(type) {
			this.informationType = type;
			this.modal = {
				title: '新建品种',
				formdatas: [
					{
						label: "添加名称",
						model: "unit",
						type:'input',
					},
				],
				submitText: '确定',
			},
				this.modalVisible = true;
		},
		//	填入新建数据
		createlibitem(data) {
			var params = {
				id: this.informations.length,
				libraryName: data.unit
			}
			this.informations.push({ id: this.informations.length, libraryName: data.unit })
			this.$http({
				method: 'post',
				url: this.apiRoot + "/grain/library/save",
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

					libraryName: data.unit,
					pLibraryId: -1,
				}
			}).then(function(response) {
				//		  	this.tabledatas=response.data.rows;
				this.getlistdata(1);
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this));
			// this.getlistdata(1)
			// }else if(this.informationType=="品种"){
			// 	console.log(data);
			// 	this.informations[1].items.push({id:'',sampleNumber:data.unit})
			// }
		},
		//	关闭新建弹框
		dialogClose() {
			this.modalVisible = false;
		},
	},
	data() {
		return {
			title: "直属库",
			datalistURL: this.apiRoot + '/grain/library/getAll',
			searchURL: this.apiRoot + '/liquid/role2/data/search',
			deleteURL: this.apiRoot + '/liquid/role2/data/delete',
			checkedId: [],
			createlibVisible: false,
			modalVisible: false,
			modal: {
				title: '新建直属库',
				formdatas: [
					{
						label: "单位名称",
						model: "unit",
						type:'input',
					},
					{
						label: "直属库名称",
						model: "lib",
						type:'input',
					},
				],
				submitText: '确定',
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
			informations: [
				{
					title: '库',
					items: [
						{},
					],
				},
				{
					title: '品种',
					items: [
						{},
					],
				},
			],
		}
	}
}
</script>
