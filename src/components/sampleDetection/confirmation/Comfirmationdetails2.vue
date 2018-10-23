<template>
    <div class="listpagewrap">
        <!--面包屑-->
        <sinograin-breadcrumb :breadcrumb="breadcrumb"></sinograin-breadcrumb>
        <!--标题-->
        <sinograin-option-title :title="subtitle" v-on:titleEvent="titleEvent"></sinograin-option-title>
        <div id="print" class="details">
            <div class="handover_view" style="width:100%;">
                <div class="hand_view_title" style="width:100%;height:0.45rem;text-align:center;line-height:0.45rem;font-size:0.24rem;color:#333333;">
                    <span>样品确认单</span>
                </div>
                <div class="hand_view_tab" style="">
                    <!--<div class="hand_view_tab_num" style="">
                        <p style="">编号:{{formdatas.nid>=10?formdatas.nid:'0'+formdatas.nid}}</p>
                    </div>-->
                    <el-row style="" class="hand_view_tab_content">
                        <el-col style="" :span="24" class="hand_view_tab_content_font">
                            <el-col style="" :span="3">
                                <span>检验项目:</span>
                            </el-col>
                            <el-col style="" :span="20">
                                <span>{{formdatas.testList}}</span>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row style="background-color:#fbfbfb;" class="hand_view_tabbody">
                        <el-col style="" :span="8" class="hand_view_tabbody_8">
                            <el-col style="" :span="8">
                                <span>检验项目</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>检测结果</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>负责人</span>
                            </el-col>
                        </el-col>
                        <el-col style="" :span="8">
                            <el-col style="" :span="8">
                                <span>检验项目</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>检测结果</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>负责人</span>
                            </el-col>
                        </el-col>
                        <el-col style="" :span="8">
                            <el-col style="" :span="8">
                                <span>检验项目</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>检测结果</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>负责人</span>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row class="hand_view_tabbody" style="border-top:none;">
                        <el-col :span="8"  class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
                            <el-col style="" :span="8">
                                <span>不完善粒</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>24</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>admin</span>
                            </el-col>
                        </el-col>
                        <el-col :span="8"  class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
                            <el-col style="" :span="8">
                                <span>不完善粒</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>24</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>admin</span>
                            </el-col>
                        </el-col>
                        <el-col :span="8"  class='loopBorder' :key="index" style="border-top:1px solid #dfdfdf;">
                           <el-col style="" :span="8">
                                <span>不完善粒</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>24</span>
                            </el-col>
                            <el-col style="" :span="8">
                                <span>admin</span>
                            </el-col>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div id='printbuttom' class="leading_out details_out" >
     <!--<div class="leading_out" @click="lodopPrint()">-->
        <!--<span>打印样品领取交接单</span>-->
        <span>导出Excel表格</span>
      </div>
    </div>
</template>
<style>
.listpagewrap .details .hand_view_title{
    background-color:#EEEEEE;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.hand_view_tabbody_8{
    border-left:none;
}
.listpagewrap .details .handover_view .hand_view_tab .hand_view_tab_content .hand_view_tab_content_font .el-col-3 {
    padding-right: 0.19rem;
    border-left:1px solid #dfdfdf;
}

.listpagewrap .details .handover_view .hand_view_tab .hand_view_tab_content .hand_view_tab_content_font .el-col-20 {
    border-left: none;
    padding-left:0.2rem;
}

.listpagewrap .details .handover_view .hand_view_tab .hand_view_tab_content .hand_view_tab_content_font .el-col-3 span {
    height: 100%;
    width: 100%;
    display: inline-block;
    border-right: 1px solid #dfdfdf;
    text-align: center;
}
.listpagewrap .details_out{
    float:right;
}
</style>
<script>

import SinograinBreadcrumb from '@/components/common/action/Breadcrumb.vue';
import SinograinOptionTitle from "@/components/common/action/OptionTitle";
import ListHeader from '@/components/common/action/ListHeader.vue';
export default {
    components: {
        SinograinBreadcrumb, SinograinOptionTitle,ListHeader
    },
    data() {
        return {
            breadcrumb: {
                search: false,
                searching: '',
            },
            subtitle: {
                btn: false,
                btntext: '样品确认单详情页',
            },
            formdatas: {
                name: "样品确认单",
                testList: "监20180133"
            }
        }
    },
    methods: {
        titleEvent() {
            console.log("fsdaf")
        }
    }
}
</script>