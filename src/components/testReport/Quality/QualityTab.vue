<template>
    <div>
        

        <el-table  :show-header="showheader"  ref="TableHeader" tooltip-effect="dark" style="width: 100%" :data='tabledata'   :default-sort="{prop: 'slip', order: 'ascending'}" v-loading="loading" element-loading-customClass="table_loading" element-loading-text="loading..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255, 0.8)">
            <!--循环数据-->
            <template v-for="item in items" v-if="item.pid==0">
                <el-table-column show-overflow-tooltip :width="item.width?item.width:'auto'"  align="center" :key="item.id" :label="item.label" :sortable="item.sort" :prop="item.prop" :class-name="item.class">
                    <template v-for="item1 in items" v-if="item1.pid==item.id">
                        <el-table-column show-overflow-tooltip :width="item1.width?item1.width:'auto'"  align="center" :key="item1.id" :label="item1.label" :sortable="item1.sort" :prop="item1.prop" :class-name="item1.class">
                            <template v-for="item2 in items" v-if="item2.pid==item1.id">
                                <el-table-column show-overflow-tooltip :width="item2.width?item2.width:'auto'" align="center" :key="item2.id" :label="item2.label" :sortable="item2.sort" :prop="item2.prop" :class-name="item2.class">
                                    <template v-for="item3 in items" v-if="item3.pid==item2.id">
                                        <el-table-column show-overflow-tooltip :width="item3.width?item3.width:'auto'"  align="center" :key="item3.id" :label="item3.label" :sortable="item3.sort" :prop="item3.prop" :class-name="item3.class">
                                        </el-table-column>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table-column>
                    </template>
                </el-table-column>
            </template>
            <!--<template slot="empty">
                <i class="iconfont icon-xinjian" @click=emptyCreate></i>
                <br /> 页面空空如也 快去新建吧！
            </template>-->
        </el-table>
    </div>
</template>
<style lang="scss">
    .complex{

        div{
            .cell{
                white-space:normal;
            }
        }
    }
</style>

<script>
export default {
     props: ['items', 'tabledata','loading','title',"showheader"],
    data() {
        return {
            
        }
    }
}
</script>