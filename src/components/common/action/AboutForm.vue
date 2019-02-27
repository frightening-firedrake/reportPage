<template>
    <el-form ref="form" :inline-message="errorinline" class="sampling aboutForm" :rules="rules"  :model="formdatas.form" :label-width="labelWidth" style="position:relative;">
        <template>
            <p class="tableName">
            	{{formdatas.title}}
            </p>
        </template>      
		<el-form-item :inline-message="true" class="full organizationName borderInput" label="机构名称：" prop="organizationName"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.organizationName" :disabled="disabled" placeholder="请输入您的机构名称"></el-input>
		    <!--<span style="color:#4c90db; font-size:0.16rem;">还可输入{{titlelimit}}个字符</span>-->
		</el-form-item>
		
		<el-form-item 
			label="机构简介：" 
			class="problem autoheight intro" 
			prop="intro"
			>
			<el-input
			  type="textarea"
			  :autosize="{ minRows: 3}"
			  placeholder="请简单介绍您的机构"
			  v-model="formdatas.form.intro">
			</el-input>
		</el-form-item>
		
		<el-form-item :inline-message="true" class="full phoneNum borderInput" label="联系电话：" prop="phoneNum"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.phoneNum" :disabled="disabled" placeholder="请输入您的联系电话"></el-input>
		</el-form-item>

		<el-form-item :inline-message="true" class="full serviceAddress borderInput" label="服务地址：" prop="serviceAddress"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.serviceAddress" :disabled="disabled" placeholder="请输入您的服务地址"></el-input>
		</el-form-item>
		
		
		<div class="btns doubleColor">
		    <!--<el-button class="lbtn no" :loading="formdatas.loading"  type="primary" @click="cancel('form')">返回上一页</el-button>-->
		    <el-button class="rbtn yes" :loading="formdatas.loading" type="primary" @click="onSubmit('form')" >提交发布</el-button>
        </div>
        <div class="clear"></div>
    </el-form>
</template>
<style>
	.sampling div.status >div{
		float:left;
		/*width:2.85rem;*/
		line-height:0.48rem;
	}
	.sampling div.status >div .el-radio-group{
		float:left;
		margin-top:0.11rem;
	}
	.sampling div.status .el-radio-button{
		height:0.26rem;
		line-height:0.26rem;
		border-radius:0.04rem;
		margin-right:0.15rem;
	}
	.sampling div.status .el-radio-button__inner{
		height:0.26rem;
		line-height:0.24rem;
		border-radius:0.04rem;
		padding:0 0.14rem;
		border: solid 0.01rem #d5d5d5;
		font-size:0.14rem;
		color: #999999;
	}
	form.sampling .el-form-item.select .el-form-item__content .el-radio-group{
		margin-left:0.2rem;
	}
	form.sampling .el-form-item.images .hege{
		position:absolute;
		right:0.4rem;
		top:10%;
		height:80%;
	}
	form.sampling .button{
		height:0.78rem;
		line-height:0.78rem;
	}
	form.sampling .el-form-item.button .el-form-item__content{
		height:0.78rem;
		line-height:0.76rem;
		border-left:none;
	}
	form.sampling .btn{
		clear:both;
		padding:0;
		text-align: center;
		position:relative;
		background:#ffffff;
	}	
	form.sampling .btn button {
	    font-size: 0.18rem;
	    padding: 0rem;
	    line-height: 0.5rem;
	    border-radius: 0.1rem;
	    width:1.3rem;
	    height:0.5rem;
	    text-align: center;
	}
	form.sampling .btn button.yes {
		background-color: rgb(88,180,129);
		border-color:rgb(88,180,129);
	}
	form.sampling .btn button.yes:hover {
		background-color: rgba(88,180,129,0.8);
		border-color:#58b481;
	}
	form.sampling .btn button.is-disabled {
		background-color: #b9b9b9;
		border-color:#cccccc;
	}
	form.sampling .btn button.is-disabled:hover {
		background-color: #b9b9b9;
		border-color:#cccccc;
	}
	form.sampling .el-form-item.empty{
		height:2rem;
		line-height:2rem;
		/*border-bottom:1px solid #cccccc;*/
	}
	form.sampling .el-form-item.empty .el-form-item__content{
		height:2rem;
		line-height:2rem;
		text-align: center;
	}

	/*按钮*/
	div.newbtns{
		position:absolute;
		right:0.1rem;
		top:0.14rem;
	}
	div.newbtns div.create{
		height:0.32rem;
		line-height:0.3rem;
		/*width:1.07rem;*/
		padding-left:0.34rem;
		box-sizing: border-box;
		border-radius:0.05rem;
		border:1px solid #58b481;
		color: #58b481;
		font-size:0.2rem;
		text-align:right;
		background-repeat: no-repeat;
		background-position:0.04rem center;
		background-size:0.3rem 0.3rem;
		padding-right:0.07rem;
		cursor:pointer;
	}
	.emptymargin{
		float:left;
		height:0.2rem;
		width:100%;
		position:relative;
		left:-1px;
		border-top:1px solid #d7d7d7;
		background-color:white;
	}
	.aboutForm .el-textarea.is-disabled .el-textarea__inner{
		background-color:white;
		color:inherit;
	}
	form.sampling.aboutForm .el-form-item .el-form-item__content>.el-textarea.row2{
		line-height:0.43rem;
	}
	form.sampling.aboutForm .el-form-item .el-form-item__content>.el-textarea.row2 textarea{
		display: inline-block;
		vertical-align: middle;
		line-height:0.19rem;
		padding-right:3em;
		cursor:default;
	}
	form.sampling.aboutForm .el-input.is-disabled .el-input__inner{
		cursor:default;
	}
	form.sampling.aboutForm .el-form-item.autoheight{
		height:auto;
	}
	form.sampling.aboutForm .el-form-item.autoheight .el-form-item__content{
		height:auto;
		line-height: normal;
	}
	form.sampling.aboutForm .el-form-item.autoheight.problem .el-form-item__content{
		line-height:0.9rem;
		padding-top:0.05rem;
		padding-bottom:0.05rem;
	}
	form.sampling.aboutForm .el-form-item.autoheight.images .el-form-item__content{
		padding-right:7em;
	}
	form.sampling.aboutForm .el-form-item.autoheight .el-form-item__content .el-textarea textarea{

		padding-top:0;
		padding-bottom:0;
		height:auto;
		min-height: auto;
	}
	/*自定义输入框长度*/
	form.sampling.aboutForm .el-form-item.borderInput .el-form-item__content .el-form-item__error{
		position:absolute;
		margin:-7px 0 0 0;
	}
	form.sampling.aboutForm .el-form-item .el-form-item__content>.el-input{
		width:100%;
		padding: 0 0.12rem;
	}
	form.sampling.aboutForm .el-form-item.organizationName .el-form-item__content>.el-input input{
		/*width:40em;*/
		padding: 0 7em 0 15px;
	}
	form.sampling.aboutForm .el-form-item.phoneNum .el-form-item__content>.el-input input{
		/*width:60em;*/
		padding: 0 7em 0 15px;
	}
	form.sampling.aboutForm .el-form-item.serviceAddress .el-form-item__content>.el-input input{
		/*width:20em;*/
		padding: 0 7em 0 15px;
	}
	form.sampling.aboutForm .el-form-item.intro>.el-form-item__content{
		padding:0 0.12rem;
	}
	form.sampling.aboutForm .el-form-item.intro .el-form-item__content .el-textarea{
		border: 1px solid #d2d2d2;
	    border-radius: 0;
	}
	form.sampling.aboutForm .el-form-item.intro .el-form-item__content .el-textarea textarea{
		line-height: 0.27rem;
	}
</style>
<script>
import "@/assets/style/common/Form.css";

import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
export default {
	components: {

	},
    props: ["formdatas"],
    created(){

    },
    mounted: function() {
		
    },
    computed:{
		...mapState([]),
		...mapGetters(["Token"]),
		titlelimit(){
			var num=this.titlelength-this.formdatas.form.organizationName.length
			if(num>=0){
				return num
			}else{
				return 0
			}
		}
    },
    
    data() {
    	
        return {
        	titlelength:36,
        	ready:false,
        	limit:5,
			problemStatic:'all',
	        labelWidth:'2rem',
	        errorinline:false,
	        disabledshow:false,    
	        disabled:false,    

	        rules: {
		        organizationName: [
		            { required: true, message: '请填写机构名称', trigger: 'blur' },
//		            { max: 36, message: '标题名称长度不能超过36个字符', trigger: ['blur', 'change'] }
		        ],
	         	phoneNum: [
		            { required: true, message: '请填写联系电话', trigger: 'blur' },
//		            { max: 56, message: '摘要长度不能超过56个字符', trigger: ['blur', 'change'] }
		        ],
		        serviceAddress: [
		            { required: true, message: '请填写服务地址', trigger: 'blur' },
//		            { max: 17, message: '来源长度不能超过17个字符', trigger: ['blur', 'change'] }
		        ],
				intro: [
		            { required: true, message: '请填写机构简介', trigger: 'blur' },
//		            { max: 17, message: '来源长度不能超过17个字符', trigger: ['blur', 'change'] }
		        ],
	          
	        }

        }
    },
    methods: {  

		fujian1(url){
//			alert(url)
			var loadiframe=document.getElementById('fordownload');
//			console.log(this.apiRoot+'information/fileDownload?id='+url+'&sessionid='+this.Token)
			loadiframe.src=this.apiRoot+'information/fileDownload?id='+url+'&sessionid='+this.Token;
		},

		onSubmit(formname) {
            this.$refs[formname].validate((valid) => {
                if (valid) {
//                  alert('submit!');

//                  console.log(this.formdatas.form)
                    this.$emit('submit',this.formdatas.form)
//					window.history.go(-1)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(formname) {
            console.log('取消!');
			this.$refs[formname].resetFields();
//          this.$emit('btn_close')
			window.history.go(-1)
        },
    }

}
</script>

