<template>
  <div class="content-container">
    <!-- 前面的拦截层 用于过滤筛选条件-->
    <el-row :gutter="24" type="flex" align="middle">
      <el-col :span="4" center>
        <el-input
          :clearable="true"
          v-model="filter.templateName"
          name="templateName"
          placeholder="输入模板名称"
          title="输入模板名称"
          type="text"
        ></el-input>
      </el-col>
      <el-col :span="5" center>
        <el-select v-model="notice" placeholder="请选择通知类型" >
          <el-option
            v-for="item in filter.noticeType"
            :key="item.id"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" center>
        <el-select v-model="template" placeholder="请选择模板类型">
          <el-option
            v-for="item in filter.templateType"
            :key="item.id"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col >
      <el-col :span="4" center>
        <el-select v-model="state" placeholder="请选择状态" >
          <el-option
            v-for="item in filter.stateType"
            :key="item.id"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" center>
        <el-button type="primary" @click.native="getMessageList(1)">查询</el-button>
        <el-button style="margin-left: 30px;" @click.native="clearFormFilter">清空</el-button>
      </el-col>
      <el-col v-permission="['stu:mt:save']" :span="3" center>
        <router-link :to="{ name: 'StudentMessageTemplatesAdd' }">
          <el-button type="primary">创建</el-button>
        </router-link>
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
      <el-table-column
        min-width="180"
        prop="id"
        label="序号"
        align="center"></el-table-column>
      <el-table-column
        min-width="150"
        prop="name"
        label="模板名称"
        align="center"></el-table-column>
      <el-table-column
        min-width="150"
        prop="tempType"
        label="模板类型"
        align="center">
        <template slot-scope="props">
          <span v-if="props.row.tempType.toString() === '10'">平台通知</span>
          <span v-else-if="props.row.tempType.toString() === '20'">课程通知</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="msgType"
        label="通知类型"
        align="center">
        <template slot-scope="props">
          <span v-if="props.row.msgType === 10">短信</span>
          <span else="props.row.msgType === 20">系统消息</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="status"
        label="状态"
        align="center">
        <template slot-scope="props">
          <span v-if="props.row.status === 0">下架</span>
          <span v-else-if="props.row.status === 1">上架</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        min-width="150"
        label="创建人"
        align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in dataUser" :key="index">
            <span v-if="scope.row.createUser === item.userId">{{ item.userName }}</span>
          </span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        min-width="180"
        prop="updateTime"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column
        min-width="150"
        prop="updateUser"
        label="更新人"
        align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in dataUser" :key="index">
            <span v-if="scope.row.updateUser === item.userId">{{ item.userName }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        min-width="180"
        fixed="right"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['stu:mt:select']"
            size="mini"
            @click.native="queryListById(scope.row.id)"
          >查看
          </el-button>
            <el-button size="mini"
                       :disabled="scope.row.contentFormat===2?true: false"
                       @click.native="goRoute(scope.row.id)"
            >修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row
      style="margin-top: 20px;"
      type="flex"
      justify="center"
      align="middle">
      <el-pagination
        :current-page.sync="filter.currPage"
        :page-size="filter.pageSize"
        :total="filter.totalCount"
        background
        layout="prev, pager, next, jumper"
        style="display: inline-block;"
        @current-change="oncurrPageChange"
      ></el-pagination>
      <el-button
        size="mini"
        style="margin-left: 20px;">跳转</el-button>
    </el-row>

    <!-- 用于点击详情查看具体信息-->
    <el-dialog
      :visible.sync="states.isShowDetailsWindow">
      <section style="width: 900px;">
        <el-row :gutter="20" type="flex" align="top" style="margin-bottom: 20px;">
          <el-col :span="3" style="font-size: 14px; font-weight: bold;">通知类型：</el-col>
          <el-col :span="8">{{ form.noticeType }}</el-col>
        </el-row>

        <el-row :gutter="20" type="flex" align="top" style="margin-bottom: 20px;">
          <el-col :span="3" style="font-size: 14px; font-weight: bold;">模板类型：</el-col>
          <el-col :span="8">{{ form.templateType }}</el-col>
        </el-row>

        <el-row :gutter="20" type="flex" align="top" style="margin-bottom: 20px;">
          <el-col :span="3" style="font-size: 14px; font-weight: bold;">模本名称：</el-col>
          <el-col :span="8">{{ form.templateName }}</el-col>
        </el-row>

        <el-row :gutter="20" type="flex" align="top" style="margin-bottom: 20px;">
          <el-col :span="3" style="font-size: 14px; font-weight: bold;">通知内容：</el-col>
          <el-col :span="12">
            <div style="max-height: 100px; overflow: auto;" v-html="form.content"></div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="3">
            <el-radio :value="radio" label="上架">上架</el-radio>
          </el-col>

          <el-col :span="3">
            <el-radio :value="radio" label="下架">下架</el-radio>
          </el-col>
        </el-row>
      </section>


      <!-- 详情表格 -->
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="states.isShowDetailsWindow = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MultiCascader from '@/components/MultiCascader';
import {
  getMessageList,
  queryById,
} from '@/api/message';

export default {
  name: 'StudentMessageTemplates',
  components: {
    MultiCascader,
  },
  data() {
    return {
      radio: "",
      id: 0,
      dataUser: [],
      detailsData: [],
      tableData: [
      ],
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
        isShowDetailsWindow: false,
      },

      // 内嵌form表达的数据
      form: {
        noticeType: '',
        templateType: '',
        templateName: "",
        content: "",
      }

    };
  },

  watch: {
    $route: 'onRouteChange',
  },

  created() {
    // 获取默认列表数据
    this.getMessageList();
  },

  methods: {

    // js路由跳轉
    goRoute(id) {
      console.log(id);
      //   return false;
        this.$router.push({
          name: "StudentMessageTemplatesEdit",
          params: {
            id: id
          }
        });
    },

    // 跳转组件加载
    onRouteChange(to) {
      if (to.name === 'StudentMessageTemplates') {
        this.getMessageList(this.filter.currPage);
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.templateName = '';
      this.notice = "";
      this.template = "";
      this.state = "";
    },
    // 根据参数获取消息列表
    async getMessageList(currPage = 1) {
      const params = {
        // 页码
        currPage,
        pageSize: this.filter.pageSize,
        templateName: this.filter.templateName,
        templateType: this.template,
        msgType: this.notice,
        status: this.state,
      };

      // 发起请求
      const res = await getMessageList(params);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.data);

      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },
    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getMessageList(pageNum);
    },

    // 适配消息列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
      } = result.page;
      const {
        userList = [],
      } = result;
      this.dataUser = userList;
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
        this.form.templateType = '课程通知';
      } else if (res.template.tempType === 10) {
        this.form.templateType = '平台通知';
      }

      if (res.template.msgType === 20) {
        this.form.noticeType = '系统消息';
      }


      this.form.templateName = res.template.name;
      this.form.content = res.template.content;
      if (res.template.status === 1) {
        this.radio = '上架';
      } else if (res.template.status === 0) {
        this.radio = '下架';
      }

      this.states.isShowDetailsWindow = true;
    },
  },
};
</script>

<style lang="less">

</style>
