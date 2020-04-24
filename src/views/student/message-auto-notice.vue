<template>
  <div class="content-container">
    <!-- 前面的拦截层 用于过滤筛选条件-->
    <el-row :gutter="24" type="flex" align="middle">
      <el-col :span="4" center>
        <el-select v-model="filter.templateName" placeholder="请选择通知类型" >
          <el-option
            v-for="item in templateName"
            :key="item.id"
            :label="item.sysAutoMsgType"
            :value="item.sysAutoMsgType"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" center>
        <el-button type="primary" @click.native="getTableData(1)">查询</el-button>
        <el-button style="margin-left: 30px;" @click.native="clearFormFilter">清空</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="800"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column width="80" type="index" label="序号" align="center"></el-table-column>
      <el-table-column min-width="150" prop="sysAutoMsgType" label="通知类型" align="center"></el-table-column>
      <el-table-column min-width="150" label="发送模块" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sendPosition === 10">平台消息</span>
          <span v-else-if="scope.row.sendPosition === 20">课程消息</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" prop="sendTime" label="发送时间" align="center"></el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-col>
            <el-button type="primary" @click.native="sendParam(scope.row)">查看</el-button>
          </el-col>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 20px;" type="flex" justify="center" align="middle">
      <el-pagination
        :current-page.sync="filter.currPage"
        :page-size="filter.pageSize"
        :total="filter.totalCount"
        background
        layout="prev, pager, next, jumper"
        style="display: inline-block;"
        @current-change="oncurrPageChange"
      ></el-pagination>
      <el-button size="mini" style="margin-left: 20px;">跳转</el-button>
    </el-row>

    <!-- 用于点击详情查看具体信息-->
    <el-dialog :visible.sync="dialogVisible" width="800px">
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="4">通知类型：</el-col>
        <el-col :span="20">{{ row.sysAutoMsgType }}</el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="4">发送模块：</el-col>
        <el-col :span="20">
          <span v-if="row.sendPosition === 10">平台消息</span>
          <span v-else-if="row.sendPosition === 20">课程消息</span>
          <span v-else>--</span>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="4">系统通知：</el-col>
        <el-col :span="20">
          <div class="msg-content" v-html="row.content"></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = false">返回</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getAutoPushMsgList, queryById ,getAllTempType} from "@/api/message";

export default {
  name: "StudentMessageTemplates",
  data() {
    return {
      templateName: [],
      row: {},
      dialogVisible: false,
      radio: "",
      id: 0,
      dataUser: [],
      detailsData: [],
      tableData: [],
      notice: "",
      template: "",
      state: "",
      filter: {
        templateName: "",
        // 通知类型
        noticeType: [
          {
            text: "系统消息",
            value: "20",
            id: 1
          }
        ],
        // 模板类型
        templateType: [
          {
            text: "平台通知",
            value: "10",
            id: 1
          },
          {
            text: "课程通知",
            value: "20",
            id: 2
          }
        ],
        // 状态类型
        stateType: [
          {
            text: "上架",
            value: "1",
            id: 1
          },
          {
            text: "下架",
            value: "0",
            id: 2
          }
        ],
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0
      },
      states: {
        isShowDetailsWindow: false
      },

      // 内嵌form表达的数据
      form: {
        noticeType: "",
        templateType: "",
        templateName: "",
        content: ""
      }
    };
  },

  watch: {
    $route: "onRouteChange"
  },

  created() {
    // 获取默认列表数据
    this.getTableData();
    this.init();
  },

  methods: {
    //初始化数据 拉取消息模板的列表
    async init(){
      const res = await  getAllTempType();
    this.templateName=res.result;

    },

    sendParam(param) {
      this.dialogVisible = true;
      this.row = param;
    },
    // 跳转组件加载
    onRouteChange(to) {
      if (to.name === "StudentMessageTemplates") {
        this.getTableData(this.filter.currPage);
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.templateName = "";
      this.notice = "";
      this.template = "";
      this.state = "";
    },
    // 根据参数获取消息列表
    async getTableData(currPage = 1) {
      const params = {
        // 页码
        page: currPage,
        limit: this.filter.pageSize,
        sysAutoMsgType: this.filter.templateName
      };

      // 发起请求
      const res = await getAutoPushMsgList(params);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.result);

      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },
    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getTableData(pageNum);
    },

    // 适配消息列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = result;
      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.tableData = list;
    },

    // 通过id查看消息详情
    async queryListById(id) {
      // 发起请求
      const res = await queryById(id);
      if (res.code !== 200) return Promise.reject();
      this.states.isShowDetailsWindow = true;
      // 渲染表格
      if (res.template.tempType === 20) {
        this.form.templateType = "课程通知";
      } else if (res.template.tempType === 10) {
        this.form.templateType = "平台通知";
      }

      if (res.template.msgType === 20) {
        this.form.noticeType = "系统消息";
      }

      this.form.templateName = res.template.name;
      this.form.content = res.template.content;
      if (res.template.status === 1) {
        this.radio = "上架";
      } else if (res.template.status === 0) {
        this.radio = "下架";
      }

      this.states.isShowDetailsWindow = true;
    }
  }
};
</script>

<style lang="less" scoped>
.msg-content {
  height: 100px;
  overflow: hidden;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid #ccc;
}
</style>
