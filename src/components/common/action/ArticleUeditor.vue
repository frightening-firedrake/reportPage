<template>
    <el-form ref="form" :inline-message="errorinline" class="sampling ueditorBox" :rules="rules"  :model="formdatas.form" :label-width="labelWidth" style="position:relative;">
        <template>
            <p class="tableName">
            	{{formdatas.title}}
            </p>
        	<!--<div class="newbtns">							
				<div class="create" @click="addsafety" style="background-image:url('static/images/sys/create.png');">
					新增安全问题报告
				</div>
			</div>-->
        </template>      
		<el-form-item :inline-message="true" class="full title borderInput" label="标题名称：" prop="title"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.title" :disabled="disabled" placeholder="请输入标题名称"></el-input>
		    <span style="color:#4c90db; font-size:0.16rem;">还可输入{{titlelimit}}个字符</span>
		</el-form-item>
		<!--<el-form-item :inline-message="true" class="full summarize borderInput" label="摘要：" prop="summarize"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.summarize" :disabled="disabled" placeholder="请输入摘要"></el-input>
		</el-form-item>

		<el-form-item :inline-message="true" class="full articleSource borderInput" label="来源：" prop="articleSource"  v-bind:class="{disabled:disabledshow}">
		    <el-input v-model="formdatas.form.articleSource" :disabled="disabled" placeholder="请输入来源"></el-input>
		</el-form-item>-->
		<el-form-item class="full ueditorWrap" label="内容：" prop="pnumber"  v-bind:class="{disabled:disabledshow}">
		    <UEditor :config="config" ref="ueditor" :content="formdatas.form.content" @ready="getready"></UEditor>
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
	form.sampling .el-form-item.uploadedit .el-form-item__content .el-upload--picture-card{
		display:none;
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
	.ueditorBox .el-textarea.is-disabled .el-textarea__inner{
		background-color:white;
		color:inherit;
	}
	form.sampling.ueditorBox .el-form-item .el-form-item__content>.el-textarea.row2{
		line-height:0.43rem;
	}
	form.sampling.ueditorBox .el-form-item .el-form-item__content>.el-textarea.row2 textarea{
		display: inline-block;
		vertical-align: middle;
		line-height:0.19rem;
		padding-right:3em;
		cursor:default;
	}
	form.sampling.ueditorBox .el-input.is-disabled .el-input__inner{
		cursor:default;
	}
	form.sampling.ueditorBox .el-form-item.autoheight{
		height:auto;
	}
	form.sampling.ueditorBox .el-form-item.autoheight .el-form-item__content{
		height:auto;
		line-height: normal;
	}
	form.sampling.ueditorBox .el-form-item.autoheight.problem .el-form-item__content{
		line-height:0.9rem;
		padding-top:0.05rem;
		padding-bottom:0.05rem;
	}
	form.sampling.ueditorBox .el-form-item.autoheight.images .el-form-item__content{
		padding-right:7em;
	}
	form.sampling.ueditorBox .el-form-item.autoheight .el-form-item__content .el-textarea textarea{

		padding-top:0;
		padding-bottom:0;
		height:auto;
		min-height: auto;
	}
	form.sampling .el-form-item.ueditorWrap{
		height:auto;
	}
	form.sampling .el-form-item.ueditorWrap .el-form-item__content{
		height:auto;
	}
	form.sampling .el-form-item.ueditorWrap .edui-default .edui-editor.edui-default{
		border:none;
		line-height:normal;
	}
	form.sampling .el-form-item.title .el-form-item__content>.el-input input{
		width:40em;
		padding: 0 15px;
	}
	form.sampling .el-form-item.summarize .el-form-item__content>.el-input input{
		width:60em;
		padding: 0 15px;
	}
	form.sampling .el-form-item.articleSource .el-form-item__content>.el-input input{
		width:20em;
		padding: 0 15px;
	}
</style>
<script>
import "@/assets/style/common/Form.css";
import UEditor from '@/components/common/Ueditor/Ueditor.vue'
import { mapState,mapMutations,mapGetters,mapActions} from 'vuex';
export default {
	components: {
	    UEditor
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
			var num=this.titlelength-this.formdatas.form.title.length
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
//	        播放器测试
			config: {
	            //可以在此处定义工具栏的内容
	            // toolbars: [
	            //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
	            //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
	            //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
	            // ],
	            toolbars: [ 
					[ 
//					'anchor', //锚点 
					'undo', //撤销 
					'redo', //重做 
					'bold', //加粗 
					'indent', //首行缩进 
//					'snapscreen', //截图 
					'italic', //斜体 
					'underline', //下划线 
					'strikethrough', //删除线 
					'subscript', //下标 
					'fontborder', //字符边框 
					'superscript', //上标 
					'formatmatch', //格式刷 
					'source', //源代码 
					'blockquote', //引用 
					'pasteplain', //纯文本粘贴模式 
					'selectall', //全选 
					'print', //打印 
					'preview', //预览 
					'horizontal', //分隔线 
					'removeformat', //清除格式 
					'time', //时间 
					'date', //日期 
					'unlink', //取消链接 
					'insertrow', //前插入行 
					'insertcol', //前插入列 
					'mergeright', //右合并单元格 
					'mergedown', //下合并单元格 
					'deleterow', //删除行 
					'deletecol', //删除列 
					'splittorows', //拆分成行 
					'splittocols', //拆分成列 
					'splittocells', //完全拆分单元格 
					'deletecaption', //删除表格标题 
					'inserttitle', //插入标题 
					'mergecells', //合并多个单元格 
					'deletetable', //删除表格 
					'cleardoc', //清空文档 
					'insertparagraphbeforetable', //”表格前插入行” 
					'insertcode', //代码语言 
					'fontfamily', //字体 
					'fontsize', //字号 
					'paragraph', //段落格式 
					'simpleupload', //单图上传 
					'insertimage', //多图上传 
					'edittable', //表格属性 
					'edittd', //单元格属性 
					'link', //超链接 
					'emotion', //表情 
					'spechars', //特殊字符 
					'searchreplace', //查询替换 
					'map', //Baidu地图 
//					'gmap', //Google地图 
					'insertvideo', //视频 
					'help', //帮助 
					'justifyleft', //居左对齐 
					'justifyright', //居右对齐 
					'justifycenter', //居中对齐 
					'justifyjustify', //两端对齐 
					'forecolor', //字体颜色 
					'backcolor', //背景色 
					'insertorderedlist', //有序列表 
					'insertunorderedlist', //无序列表 
					'fullscreen', //全屏 
					'directionalityltr', //从左向右输入 
					'directionalityrtl', //从右向左输入 
					'rowspacingtop', //段前距 
					'rowspacingbottom', //段后距 
					'pagebreak', //分页 
					'insertframe', //插入Iframe 
					'imagenone', //默认 
					'imageleft', //左浮动 
					'imageright', //右浮动 
					'attachment', //附件 
					'imagecenter', //居中 
					'wordimage', //图片转存 
					'lineheight', //行间距 
					'edittip ', //编辑提示 
//					'customstyle', //自定义标题 
					'autotypeset', //自动排版 
//					'webapp', //百度应用 
					'touppercase', //字母大写 
					'tolowercase', //字母小写 
//					'background', //背景 
					'template', //模板 
					'scrawl', //涂鸦 
//					'music', //音乐 
					'inserttable', //插入表格 
//					'drafts', // 从草稿箱加载 
					'charts', // 图表 
					] 
				],
	            autoHeightEnabled: true,
	            autoFloatEnabled: true,
	            initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
	            autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
	            initialFrameWidth: null,
	            initialFrameHeight: 200,
	//          BaseUrl: '',//代码我搬来的不知道他是什么鬼
	            UEDITOR_HOME_URL: 'static/ueditor/',//别改会报错
	
	       },
	        rules: {
		        title: [
		            { required: true, message: '请输入标题名称', trigger: 'blur' },
		            { max: 36, message: '标题名称长度不能超过36个字符', trigger: ['blur', 'change'] }
		        ],
	         	summarize: [
		            { required: true, message: '请输入摘要名称', trigger: 'blur' },
		            { max: 56, message: '摘要长度不能超过56个字符', trigger: ['blur', 'change'] }
		        ],
		        articleSource: [
		            { required: true, message: '请输入来源名称', trigger: 'blur' },
		            { max: 17, message: '来源长度不能超过17个字符', trigger: ['blur', 'change'] }
		        ],

	          
	        }

        }
    },
    methods: {  
		//获取文档内容
	    getContent(){
	      	let content = this.$refs.ueditor.getUEContent();
	      	this.formdatas.form.content=content
//	      	console.log(content);
	    },
	    setContent(content, isAppendTo){
	      	this.$refs.ueditor.setUEContent(content, isAppendTo);
	    },
		//设置文档
		addsafety(){
	    	this.$emit("addsafety")		
		},
		fujian1(url){
//			alert(url)
			var loadiframe=document.getElementById('fordownload');
//			console.log(this.apiRoot+'information/fileDownload?id='+url+'&sessionid='+this.Token)
			loadiframe.src=this.apiRoot+'information/fileDownload?id='+url+'&sessionid='+this.Token;
		},
		getready(){
			this.ready=true;
		},
		onSubmit(formname) {
            this.$refs[formname].validate((valid) => {
                if (valid) {
//                  alert('submit!');
                    this.getContent()
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

