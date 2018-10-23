<template>
  <div class='listpagewrap'>
    <!--面包屑-->
    <sinograin-breadcrumb :breadcrumb="breadcrumb" v-on:searchingfor="searchingfor"></sinograin-breadcrumb>
    <!--alert-->
    <!--<sinograin-prompt :alerts="alerts"></sinograin-prompt>-->
    <!--表格上的时间选框以及 创建-->
    <div class="listHeaderMoreonly">
      <div class="dataSelete libSelete">
        <p>选择品种:</p>
        <div>
          <el-select class="lib1" v-model="selectlib" placeholder="请选择品种" @change="_selectlib">
            <el-option label="小麦" value="小麦"></el-option>
            <el-option label="玉米" value="玉米"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <!--表格-->
    <sinograin-list class="list" :librarylist='librarylist' :tabledata="tabledatas" :items="items" :actions="actions" v-on:getchecked="getchecked" :loading="loading" v-on:emptyCreate="emptyCreate">
    </sinograin-list>
  </div>
</template>
<script>
import SinograinList from "@/components/common/action/List.vue";
import SinograinBreadcrumb from "@/components/common/action/Breadcrumb.vue";
import SinograinPagination from "@/components/common/action/Pagination.vue";
export default {
  components: {
    SinograinList,
    SinograinBreadcrumb,
    SinograinPagination
  },
  created() {
    //  获取列表数据（第一页）
    // this.getlibrarylist()
    //	移除监听事件
    this.$root.eventHub.$off("delelistitem");
    this.$root.eventHub.$off("viewlistitem");
    //	监听列表删除事件
    this.$root.eventHub.$on(
      "delelistitem",
      function(rowid, list) {
        this.tabledatas = this.tabledatas.filter(function(item) {
          return item.id !== rowid;
        });
        this.sendDeleteId(rowid);
        //  	console.log(rowid,list);
      }.bind(this)
    );
    //	监听列表点击查看事件
    this.$root.eventHub.$on(
      "viewlistitem",
      function(id, row) {
        //		console.log(row)
        this.$router.push({
          path: "/index/sampleDetection/examineList/sampleexamineList",
          query: { title: row }
        });
      }.bind(this)
    );
  },
  mounted() {
    this.init(this.selectlib);
  },
  data() {
    return {
      dataUrl: this.apiRoot + "/grain/summaryCheck/findCheckSum",
      loading: false,
      selectlib: "",
      breadcrumb: {
        search: false,
        searching: ""
      },
      actions: {
        selection: false,
        number: false,
        message: true,
        view: false,
        edit: false,
        dele: false
      },
      tabledatas: [],
      librarylist: [],
      items: [
        {
          id: 1,
          prop: "checkName",
          label: "检验单名称"
          //   status: true
          //      sort:true,
        },
        {
          id: 2,
          prop: "sort",
          label: "品种",
          sort: false
        },
        
      ]
    };
  },
  methods: {
    searchingfor() {},
    getchecked() {},
    emptyCreate() {},
    _selectlib() {
      this.init(this.selectlib);
    },
    init(page) {
      this.$http({
        method: "post",
        url: this.dataUrl,
        transformRequest: [
          function(data) {
            // 				// Do whatever you want to transform the data
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          }
        ],
        data: { sort: page ? page : "" },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
        .then(
          function(response) {
            this.tabledatas = response.data;
            this.loading = false;
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log(error);
          }.bind(this)
        );
    }
  }
};
</script>
<style>
div.listHeaderMoreonly {
  width: auto;
  height: 0.54rem;
  line-height: 0.54rem;
  border-radius: 0.1rem 0.1rem 0 0;
  border: solid 1px #eaeaea;
  position: relative;
  margin-top: 0.05rem;
}
/*标题*/
div.listHeaderMoreonly p {
  float: left;
  font-size: 0.18rem;
  color: #000000;
  padding-left: 0.35rem;
  position: relative;
  margin-right: 0.18rem;
}
div.listHeaderMoreonly p:before {
  content: "";
  position: absolute;
  top: 0.17rem;
  bottom: 0.17rem;
  left: 0.25rem;
  width: 3px;
  background: #1bb45f;
}
/*品种选择*/
div.listHeaderMoreonly div.dataSelete {
  float: left;
}
div.listHeaderMoreonly div.dataSelete > p:before {
  background: #1bb45f;
}
div.listHeaderMoreonly div.dataSelete.mission > p:before {
  background: #ff4c78;
}
div.listHeaderMoreonly div.dataSelete > div {
  float: left;
  width: 3rem;
  line-height: 0.54rem;
}
div.listHeaderMoreonly div.libSelete > div {
  float: left;
  width: 4rem;
  line-height: 0.54rem;
}
div.listHeaderMoreonly .libSelete .el-select.lib1 {
  height: 0.25rem;
  width: 1.8rem;
  line-height: 0.34rem;
}
div.listHeaderMoreonly .libSelete .el-select.lib1 .el-input {
  width: 100%;
  height: 100%;
}
div.listHeaderMoreonly .libSelete .el-select.lib1 .el-input input {
  height: 100%;
  width: 100%;
  line-height: 0.34rem;
  border: solid 0.01rem #dfdfdf;
  font-size: 0.16rem;
  background: #f2f2f2;
  border-radius: 0;
  text-align: center;
}
div.listHeaderMoreonly
  .libSelete
  .el-select.lib1
  .el-input
  .el-input__suffix
  .el-input__suffix-inner
  i {
  line-height: normal;
}
</style>
