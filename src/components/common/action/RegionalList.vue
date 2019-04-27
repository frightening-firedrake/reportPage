<template>
	<div class="regionalWrap">
		<div class="regionalListWrap">
			<div class="regionalList">
				<div class="regionalTitle">
					省级举报中心
				</div>
				<ul>
					<template  v-for="(item, index) in list1" >						
						<li v-if="item.id==shengId" class="current" :key="index" @click="shengChange(item.id)">
							{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}
							<span class="el-icon-arrow-right"></span>
						</li>
						<li v-if="item.id!=shengId" class="" :key="index" @click="shengChange(item.id)">{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}</li>
					</template>
					<li class="addRegionalLi">
						<span class="addRegional" @click="addRegional('sheng')">+新建省级地区</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="regionalListWrap">
			<div class="regionalList">
				<div class="regionalTitle">
					市级举报中心
				</div>
				<ul>
					<template  v-for="(item, index) in list2" >						
						<li v-if="item.id==shiId" class="current" :key="index" @click="shiChange(item.id)">
							{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}
							<span class="el-icon-arrow-right"></span>
						</li>
						<li v-if="item.id!=shiId" class="" :key="index" @click="shiChange(item.id)">{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}</li>
					</template>
					<li class="addRegionalLi" v-if="shengId">
						<span class="addRegional" @click="addRegional('shi')">+新建市级地区</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="regionalListWrap">
			<div class="regionalList">
				<div class="regionalTitle">
					县(区)级举报中心
				</div>
				<ul>
					<template  v-for="(item, index) in list3" >						
						<li v-if="item.id==xianquId" class="current" :key="index" @click="xianquChange(item.id)">{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}</li>
						<li v-if="item.id!=xianquId" class="" :key="index" @click="xianquChange(item.id)">{{item.name}}&nbsp;&nbsp;&nbsp;{{item.reportNum}}</li>
					</template>
					<li class="addRegionalLi" v-if="shiId">
						<span class="addRegional" @click="addRegional('qu')">+新建县(区)级地区</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="clear"></div>
	</div>
</template>
<style>
	.addRegionalLi{
		cursor: default!important;
	}
	.addRegional{
		border:1px solid #4c90db;
		padding:0.06rem 0.2rem;
		border-radius:0.3rem;
		color:#4c90db;
		cursor: pointer;
	}
	.regionalWrap{
		/*left:0rem;
		right:0rem;
		position:absolute;
		bottom:0.1rem;
		top:2.05rem;*/
		/*min-height:6.44rem;*/
		position:relative;
	}
	.regionalListWrap{
		width:33.3%;
		float:left;
		padding:0 0.15rem;
		/*height:100%;*/
		/*min-height:6.44rem;*/
	}
	.regionalList{
		min-height:6.44rem;
		/*height:100%;*/
		width:100%;
		text-align: center;
		border:1px solid #d7d7d7;
		position:relative;
	}
	.regionalTitle{
		height:0.68rem;
		line-height:0.68rem;
		background:#dff0f9;
		font-size:0.18rem;
		border-bottom:1px solid #d7d7d7;
		color:#666666;
	}
	.regionalList ul{

	}
	.regionalList ul li{
		height:0.48rem;
		line-height:0.48rem;
		background:#f5fafd;
		border-bottom:1px solid #d7d7d7;
		font-size:0.16rem;
		color:#666666;
		cursor:pointer;
		position:relative;
	}
	.regionalList ul li.current{
		background:#bfdff3;
	}
	.regionalList ul li .el-icon-arrow-right{
		position:absolute;
		line-height:0.48rem;
		top:0;
		bottom:0;
		right:0.6rem;
		color:#666666;
		font-size:0.2rem;
	}

	
</style>
<script>
//import "@/assets/style/common/list.css"
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';

export default {
    props: ['regional'],
    data() {
        return {
        	shengId:'',
        	shiId:'',
        	xianquId:''
        };
    },
    created(){

    },
    methods:{
//  	...mapMutations(['route_click']),
    	shengChange(id){
    		this.shengId=id
    		this.shiId="";
//  		this.$emit('dateChange',this.date_select);
    	},
    	shiChange(id){
    		this.shiId=id
    		this.xianquId="";
//  		this.$emit('dateChange',this.date_select);
    	},
    	xianquChange(id){
    		this.xianquId=id
//  		this.$emit('dateChange',this.date_select);
    	},
    	addRegional(type){
//  		console.log(type,this.shengId,this.shiId,this.xianquId)
    		this.$emit('addRegional',type,this.shengId,this.shiId);
    	},
    },
    computed: {
  		...mapGetters(["remarkses"]),
       	list1(){
    		return	this.regional.filter((item)=>{
    			return item.pId===-1
    		})
	    },
	    list2(){
	    	return	this.regional.filter((item)=>{
    			return item.pId===this.shengId
    		})
	    },
	    list3(){
	    	return	this.regional.filter((item)=>{
    			return item.pId===this.shiId
    		})
	    },
	},

}
</script>