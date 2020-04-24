<template>
  <div class="content-container">

    <!-- 用于手动补充邀请关系 -->
    <el-form
      ref="formInline"
      :inline="true"
      :model="formInline"
      :rules="rules"
      onvolumechange
      class="demo-form-inline">
      <el-form-item
        label="被邀请人号码"
        prop="mobile">
        <el-input
          v-model="formInline.mobile"
          placeholder="被邀请人号码"></el-input>
      </el-form-item>
      <el-form-item
        label="邀请人号码"
        prop="recommentMobile">
        <el-input
          v-model="formInline.recommentMobile"
          placeholder="邀请人号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.native="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>


    <!-- 过滤栏 -->
    <el-row :gutter="20">
      <el-col
        :span="4"
        :offset="16">
        <el-input
          v-model="filter.phoneNum"
          placeholder="请输入查询的号码"></el-input>
      </el-col>

      <el-col
        :span="2"
        style="text-align: center;">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click.native="getActivityInvitationList(1)">查询</el-button>
      </el-col>

      <el-col
        :span="2"
        style="text-align: center;">
        <el-button @click.native="clearFormFilter">清除</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="650"
      tooltip-effect="dark"
      border
      style="width: 100%; margin-top: 30px;"
    >
      <el-table-column
        min-width="50"
        prop="id"
        label="用户ID"
        align="center"></el-table-column>
      <el-table-column
        min-width="150"
        prop="name"
        label="用户名"
        align="center"></el-table-column>
      <el-table-column
        min-width="150"
        prop="phoneNum"
        label="电话"
        align="center"></el-table-column>
      <el-table-column
        min-width="150"
        prop="pullCount"
        label="邀请人数"
        align="center"></el-table-column>
      <el-table-column
        label="操作"
        min-width="180"
        fixed="right"
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native="findList(scope.row.id)"
          >查看邀请详情
          </el-button>
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
    <!-- 用于点击详情查看数据-->
    <el-dialog
      :visible.sync="state.isShowDetailsWindow">
      <el-table :data="detailsData " border max-height="500">
        <el-table-column  label="电话号码" width="1200px" prop="mobile" align="center" ></el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <div style="width:100%;display:flex;justify-content:center;">
        <el-pagination
          :current-page.sync="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          type="primary"
          @click="state.isShowDetailsWindow = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MultiCascader from '@/components/MultiCascader';
import {
  getActivityInvitationList,
  getPersonInvitation,
  setPersonInvitation,
} from '@/api/operation';
import { formatDate } from '@/utils';

export default {
  name: 'OperationActivityInvitationManage',
  components: {
    MultiCascader,
  },
  data() {
    return {
      id:'',
      pageNum: 1,
      pageSize: 10,
      totalPage: 1,
      total: 0,
      phoneNum: '',
      formInline: {
        mobile: '',
        recommentMobile: '',
      },
      rules: {
        mobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (String(value).length > 11) {
                callback(new Error('不能超过11个字'));
              } else if (String(value) === '') {
                callback(new Error('请输入电话号码'));
              } else {
                callback();
              }
            },
          },
        ],
        recommentMobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (String(value).length > 11) {
                callback(new Error('不能超过11个字'));
              } else if (String(value) === '') {
                callback(new Error('请输入电话号码'));
              } else {
                callback();
              }
            },
          },
        ],
      },

      state: {
        isShowDetailsWindow: false,
      },
      filter: {
        activityName: '',
        pageNum: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        phoneNum: '',
      },
      tableData: [],
      detailsData: [],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    // 获取默认列表数据
    this.getActivityInvitationList();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'OperationActivityInvitationManage') {
        this.getActivityInvitationList(this.filter.currPage);
      }
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.phoneNum = '';
    },

    // 适配邀请人列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0,
      } = result;

      this.filter.currPage = currPage;
      this.filter.pageSize = 10;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;

      this.tableData = list;
    },

    // 根据参数获取邀请人列表
    async getActivityInvitationList(pageNum = 1) {
      const params = {
        // 页码
        pageNum,
        pageSize: this.filter.pageSize,
        phoneNum: this.filter.phoneNum,
      };

        // 发起请求
      const res = await getActivityInvitationList(params);
      if (res.code !== 200) return Promise.reject();
      this.adapterGoodsToUI(res.result);

      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.bodyWrapper.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      });
    },

    // 被邀请人弹窗当前页改变
    handleCurrentChange(pageNumber) {
      this.pageNum = pageNumber;
      this.findList(this.id);
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getActivityInvitationList(pageNum);
    },

    // 确定提交表单
    onSubmit(e) {
      this.$refs.formInline.validate((valid) => {
        if (valid) {
          const options = {
            mobile: this.formInline.mobile,
            recommentMobile: this.formInline.recommentMobile,
          };
          setPersonInvitation(options)
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg);
                // 重新获取列表
                this.getActivityInvitationList(1);
              }
            });
        }
      });
    },

    // 查看邀请的人数
    findList(id) {
      this.id = id;
      const params = {
        id:this.id,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      getPersonInvitation(params)
        .then(res => {
          this.state.isShowDetailsWindow = true;
          this.detailsData = res.result.list;
          this.pageNum = res.result.currPage;
          this.pageSize = 10;
          this.totalPage = res.result.totalPage;
          this.total = res.result.totalCount;
          console.log(this.detailsData);
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .table-goods-cover {
    display: inline-block;
    width: 100px;
    height: 60px;
  }
</style>
