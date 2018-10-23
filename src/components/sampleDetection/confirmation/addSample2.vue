<template>
    <div class='listpagewrap'>
        <!--面包屑-->
        <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
        <!--标题-->
        <sinograin-option-title :title="subtitle"></sinograin-option-title>
        <div class="SelectChecklist">
            <el-form ref="form" :model="form" :label-width="labelWidth" label-position="left">
                <el-form-item label="任务名称" style="border-bottom:none;">
                    <!--<el-input class="searching" v-model="searching" @keyup.native.enter='searchingfor'></el-input>-->
                    <!--<input type="text" v-model="searching" @keyup.enter='searchingfor' />-->
                    <el-select v-model="searching" placeholder="请选择任务名称" @change="searchingfor">
                        <el-option v-for="item in taskList" :label="item.taskName" :value="item.taskName" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!--<el-form-item label="检测状态" class="full" style="border-top:none;">
    			    <el-select v-model="isChecked" placeholder="请选择检测状态" @change="changeIsChecked">
    			        <el-option label="未检测" :value="2"></el-option>
    			        <el-option label="已检测" :value="3"></el-option>
    			        <el-option label="全部" :value="0"></el-option>
    			    </el-select>
    			</el-form-item>-->

            </el-form>
            <!--全选中处理-->
            <p>
                选择样品
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange" style="margin-left:0.35rem;">全部选中</el-checkbox>
            </p>
            <div class="checkboxwrap">

                <!--序号-->
                <el-row class="order">
                    <el-col :span="6" class="">
                        <div class='pull-left1'>
                            检验编号
                        </div>
                    </el-col>
                    <el-col :span="6" class="">
                        <div class='pull-left1'>
                            检验编号
                        </div>
                    </el-col>
                    <el-col :span="6" class="">
                        <div class='pull-left1'>
                            检验编号
                        </div>
                    </el-col>
                    <el-col :span="6" class="">
                        <div class='pull-left1'>
                            检验编号
                        </div>
                    </el-col>
                </el-row>

                <div v-if="!checkedListFilter.length" class="checklistemit">
                    <!--请重新选择检索范围！！！-->
                    请重新选择检索范围！！！
                </div>
                <template>

                    <el-checkbox-group v-model="checkedList" @change="checkedListChange">

                        <el-checkbox :label="item" v-for="(item,index) in checkedListFilter" :key="item.id">监{{item.sampleNum}}</el-checkbox>

                    </el-checkbox-group>
                </template>
                <div class="clear"></div>
            </div>
            <div class="btns">
                <el-button class="yes" type="primary" @click="onSubmit('form')" v-bind:disabled="!checkedList.length">确认</el-button>
                <el-button class="no" @click="cancel('form')">取消</el-button>
                <!--<div>{{listready}}</div>-->
            </div>
        </div>
    </div>
</template>
<style>
.SelectChecklist>p{
    border-top:1px solid #dfdfdf;
}
.SelectChecklist .el-form>.el-form-item{
    width:100%;
}
</style>

<script>
import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";

export default {
    components: { SinograinBreadcrumb, SinograinOptionTitle },
    created() {
        //	console.log(this.$route.params)
        this.getTaskList()
        this.getSampleList()
        //  获取列表数据（第一页）
        //	this.getlistdata(1)
        //	this.getsampledata();

    },
    computed: {
        checkedListFilter() {
            return this.checkList.filter((item, index) => {
                //				return (this.remSelect?item.remark.indexOf(this.remSelect)>-1:true)&&((this.sampleNumRange[0]?this.sampleNumRange[0]-0:0)<(item.sampleNum.slice(1)-0)&&((item.sampleNum.slice(1)-0)<(this.sampleNumRange[1]?(this.sampleNumRange[1]-0):100000000000000000)))
                // return (item.detectionState == 2) && (item.sort == this.sort) && (this.remSelect ? item.remark.indexOf(this.remSelect) > -1 : true) && ((this.sampleNumRange[0] ? this.sampleNumRange[0] - 0 : 0) < (item.sampleNum - 0) && ((item.sampleNum - 0) < (this.sampleNumRange[1] ? (this.sampleNumRange[1] - 0) : 100000000000000000)))
                return   (this.remSelect ? item.remark.indexOf(this.remSelect) > -1 : true) && ((this.sampleNumRange[0] ? this.sampleNumRange[0] - 0 : 0) < (item.sampleNum - 0) && ((item.sampleNum - 0) < (this.sampleNumRange[1] ? (this.sampleNumRange[1] - 0) : 100000000000000000)))
                //				return (this.isChecked?item.sampleState==this.isChecked:true)&&(item.sort==this.sort)&&(this.remSelect?item.remark.indexOf(this.remSelect)>-1:true)&&((this.sampleNumRange[0]?this.sampleNumRange[0]-0:0)<(item.sampleNum-0)&&((item.sampleNum-0)<(this.sampleNumRange[1]?(this.sampleNumRange[1]-0):100000000000000000)))
            })
        },
        listready() {
            if (this.checkList.length && this.$route.params.formdatas) {
                var checkNums = this.$route.params.tabledatas.map((val) => {
                    return val.sampleNum ? val.sampleNum : val;
                })
                this.sort = this.checkList[0].sort
                this.checkedList = this.checkList.filter((item) => {
                    return checkNums.includes(item.sampleNum)
                })
            } else {

            }
        },
    },
    data() {
        return {
            sampleListURL:this.apiRoot + '/grain/handover/getSampleByCheckPoint',
            checkAll: "",
            breadcrumb: {
                search: true,
                searching: '',
            },
            subtitle: {
                btn: false,
                btntext: '',
            },
            taskList: [],
            checkList: [],
            //      	表单数据
            form: {

            },
            searching: "",
            labelWidth: '1rem',
            remSelect: '',
            sampleNumRange: [],
            checkedList: [],
        }
    },
    methods: {
        searchingfor() {

        },
        checkedListChange(val) {
            console.log(val)
        },
        handleCheckAllChange(val) {
            if (val) {
                this.checkedList = this.checkedListFilter
            } else {
                this.checkedList = [];
            }
        },
        getCheckedList(checkedList) {
            var path = this.$route.name
            var end = path.lastIndexOf('/');
            path = path.slice(0, end);

            this.$router.push({ name: path, params: { formdatas: this.$route.params.formdatas, tabledatas: checkedList, searching: this.searching } })
        },
        // 获取任务列表
        getTaskList() {
            //		var params = {};
            //		params.pLibraryId = -1
            // 获取列表数据（第？页）
            this.$http({
                method: 'post',
                url: this.taskListURL,
                transformRequest: [function(data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    //			    params: JSON.stringify(params)
                    checkPoint: this.$route.query.checkPoint
                }
            }).then(function(response) {
                this.taskList = response.data;
            }.bind(this)).catch(function(error) {
                console.log(error);
            }.bind(this));
        },
        // 获取样品列表
        getSampleList() {
            //		var params = {};
            //		params.pLibraryId = -1
            // 获取列表数据（第？页）
            this.$http({
                method: 'post',
                url: this.sampleListURL,
                transformRequest: [function(data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    //			    params: JSON.stringify(params)
                    checkPoint: this.$route.query.checkPoint
                }
            }).then(function(response) {
              this.checkList = response.data;
            }.bind(this)).catch(function(error) {
                console.log(error);
            }.bind(this));
        },
        // 获取搜索数据
        searchingfor(searching) {
            //		console.log(searching)
            this.searching = searching;
            var params = {};
            params.taskName = searching;
            params.detectionState = 2;
            this.loading = false;
            // 获取列表数据（第？页）
            this.$http({
                method: 'post',
                url: this.sampleURL,
                transformRequest: [function(data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    //				params:JSON.stringify(params)
                    taskName: searching
                }
            }).then(function(response) {
                //			console.log(response)
                this.checkList = response.data;
                if (this.$route.params.formdatas) {
                    this.checkedList = this.$route.params.tabledatas;
                }
                //		  	this.checkedList=response.data.rows;
                //	  		this.page.total=response.data.total;
            }.bind(this)).catch(function(error) {
                console.log(error);
            }.bind(this));
        },
        onSubmit(form) {

        }
    }
}
</script>