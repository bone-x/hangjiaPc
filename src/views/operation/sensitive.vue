<template>
  <div class="content-container">
    <!-- 运营管理 - 过滤敏感词首页 -->
    <div class="sensitive">
      <!-- select选框部分 -->
      <div class="pageheard">
        <el-form
          :inline="true"
          :model="formInline"
          class="flex-center"
        >
          <el-form-item
            label
            class="selectbox magin-left"
          >
            <el-select
              v-model="sensitiveTarget.type"
              placeholder="所有类型"
            >
              <el-option
                v-for="(item, index) in sensitiveType"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-input
              :loading="loading"
              v-model="sensitiveTarget.word"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="敏感词关键字"
            ></el-input>
          </el-form-item>
          <el-form-item class="magin-left">
            <el-button
              icon="el-icon-search"
              @click.native="onSearch"
              type="primary"
            >搜索</el-button>
          </el-form-item>
          <el-button
            type="primary"
            class="addnew"
            @click.native="goSensitiveAdd"
          >新建敏感词</el-button>
        </el-form>
      </div>

      <!-- 表格部分 -->
      <div class="tables">
        <el-table
          :data="sensitiveData"
          :loading="loading"
          border
          style="width: 100%"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            prop="word"
            label="敏感词名称"
            min-width="200"
          ></el-table-column>
          <el-table-column
            prop="frequency"
            label="屏蔽/禁用次数"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="updateName"
            label="修改人"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="添加时间"
            min-width="120"
          >
            <template slot-scope="scope">{{ timeFormat(scope.row.createTime) }}</template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            min-width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type === 1 ? '禁用':'屏蔽' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="300"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['operate:sensitive:delete']"
                type="danger"
                size="mini"
                @click.native="onSensitiveDetele(scope.row.id)"
              >删除</el-button>
              <el-button
                v-permission="['operate:sensitive:update']"
                size="mini"
                @click.native="onSensitiveChange(scope.row)"
              >更改类型</el-button>
              <el-button
                v-permission="['operate:sensitive:select']"
                size="mini"
                @click.native="checkSensitiveData(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page.sync="sensitiveTarget.pageNum"
          :page-size="sensitiveTarget.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          class="simplepage"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <!-- 点击详情出现的弹窗 -->
      <el-dialog
        :visible.sync="centerDialogVisible"
        title="查看详情"
        width="900px"
        left
      >
        <el-form
          :inline="true"
          :model="goodDetail"
          class="flex-center"
        >
          <span>选择范围：</span>

          <el-date-picker
            v-model="date"
            :picker-options="pickerOptions"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="年/月/"
            end-placeholder="年/月/"
            style="width:300px"
          ></el-date-picker>
          <el-form-item class="magin-left">
            <el-input
              v-model="formData.creatorName"
              placeholder="用户昵称"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click.native="searchMsg"
          >搜索</el-button>
          <el-button
            v-permission="['operate:sensitive:export']"
            class="alldata"
            @click.native="exportData"
          >导出全部数据</el-button>
        </el-form>

        <!-- 弹窗表格 -->
        <el-table
          :data="sensitiveDetails"
          class="fastdialogtable"
          border
        >
          <el-table-column
            property="creatorName"
            label="用户昵称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            property="createTime"
            label="屏蔽/禁用时间"
            min-width="100"
          >
            <template slot-scope="scope">{{ timeFormat(scope.row.createTime) }}</template>
          </el-table-column>
          <el-table-column
            property="ip"
            label="IP地址"
            min-width="100"
          ></el-table-column>
        </el-table>
        <span
          slot="footer"
          class="dialog-footer fastdialogbtn"
        >
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            class="fastdialogyes"
            @click="centerDialogVisible = false"
          >确 定</el-button>
        </span>

        <!-- 弹窗分页 -->
        <div class="block">
          <el-pagination
            :current-page.sync="formData.pageNum"
            :page-size="formData.PageSize"
            :total="dialogTotal"
            background
            layout="prev, pager, next, jumper"
            @size-change="dialogHandleSizeChange"
            @current-change="dialogCurrentChange"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  sensitiveCheckList,
  sensitiveDelete,
  sensitiveChangeType,
  sensitiveChoose,
  exportSensitive,
} from '@/api/operation';
import { formatDate } from '@/utils/index';

export default {
  name: 'OperationManagesensitive',
  components: {},
  data() {
    return {
      // 导出的提示框
      visible: false,
      // 点击导出返回链接存放
      downloadUrl: '',
      date: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = '';
          }
        },
        disabledDate: time => {
          if (this.pickerMinDate !== '') {
            const day90 = (90 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day90;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return time.getTime() > maxTime;
          }
          return time.getTime() > Date.now();
        },
      },
      loading: false,
      sensitiveData: [],
      // 搜索敏感词存放选中和填写好的值
      sensitiveTarget: {
        type: 0,
        word: '',
        pageNum: 1,
        pageSize: 6,
      },
      // 敏感词类型
      sensitiveType: [
        {
          label: '所有类型',
          value: 0,
        },
        {
          label: '禁用',
          value: 1,
        },
        {
          label: '屏蔽',
          value: 2,
        },
      ],
      totalCount: 10,
      totalPage: 10,
      // 存放主表格单条数据
      userData: {},
      // 主表格初始页
      currentPage: 1,
      // 主表格总页数
      input: '',
      value: '',
      total: 0,
      // 弹窗数据&分页
      sensitiveDetails: [],
      dialogCurrentPage: 1,
      dialogPageSize: 6,
      dialogPageNum: 1,
      // 弹窗select选框内容
      checkMessage: {
        dateTime: '',
        nickName: '',
      },
      nickName: '',
      // 时间
      timer: {
        timeStart: '',
        timeEnd: '',
      },
      // 这里放的是表单提交的数据
      formInline: {
        status: '全部活动状态',
        push: '全部类型',
        search: '', // 搜索框输入的内容
      },
      gridData: [],
      centerDialogVisible: false,
      // 弹窗select选框部分
      goodDetail: {
        status: '全部状态',
        push: '全部状态',
        search: '', // 搜索框输入的内容
      },
      formData: {
        pageNum: 1,
        pageSize: 10,
        sensitiveWordId: '',
        creatorName: '',
        timeStart: '',
        timeEnd: '',
      },
      dialogTotalPage: 10,
      dialogTotal: 10,
    };
  },
  created() {
    // 渲染主表格数据
    this.getAllSensitive();
  },
  mounted() {},
  methods: {
    timeFormat: formatDate, // 时间戳转化
    // 获取所有敏感词数据
    getAllSensitive() {
      sensitiveCheckList(this.sensitiveTarget).then(res => {
        this.sensitiveData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 搜索敏感词
    onSearch() {
      this.sensitiveTarget.pageNum = 1;
      this.getAllSensitive();
    },

    // 删除敏感词
    onSensitiveDetele(id) {
      sensitiveDelete(id)
        .then(res => {
          if (res.code === 200) {
            this.getAllSensitive();
            this.$message.success('删除成功!');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 更改类型
    onSensitiveChange(item) {
      const params = {
        id: item.id,
        type: item.type === 1 ? 2 : 1,
      };
      sensitiveChangeType(params)
        .then(res => {
          if (res.code === 200) {
            this.getAllSensitive();
            this.$$message.success('更改成功!');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击详情获取弹窗数据
    checkSensitiveData(item) {
      // 储存单条数据
      this.centerDialogVisible = true;
      this.userData = item;
      this.getSensitiveData();
    },

    // 获取弹窗数据
    getSensitiveData() {
      if (this.date.length !== 0) {
        this.formData.timeStart = this.date[0];
        this.formData.timeEnd = this.date[1];
      }
      this.formData.sensitiveWordId = this.userData.id;
      sensitiveChoose(this.formData)
        .then(res => {
          this.sensitiveDetails = res.result.list;
          this.dialogTotal = res.result.totalCount;
          this.dialogTotalPage = res.result.totalPage;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 弹窗里面点击搜索
    searchMsg() {
      this.getSensitiveData();
    },

    // 弹窗点击导出文件
    exportData() {
      exportSensitive(this.userData.id)
        .then(res => {
          if (res.code !== 200) return false;
          const { url } = res.result;
          if (url) {
            window.open(url);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 点击新建活动跳转页面
    goSensitiveAdd() {
      this.$router.push('sensitive-filter/add');
    },

    // 主页面表格的分页
    handleSizeChange(val) {
      this.sensitiveTarget.pageSize = val;
    },

    handleCurrentChange(val) {
      this.sensitiveTarget.pageNum = val;
      this.getAllSensitive();
    },

    // 弹窗分页
    dialogHandleSizeChange(val) {
      this.formData.pageSize = val;
    },

    // 弹窗当前页码
    dialogCurrentChange(val) {
      this.formData.pageNum = val;
      this.getSensitiveData();
    },
  },
};
</script>

<style scoped lang="scss">
.content-container {
  .sensitive {
    padding: 20px;
    padding-top: 0px;
    .kill-top {
      display: flex;
      justify-content: flex-end;
      .ss {
        margin-right: 20px;
      }
      .goodname {
        width: 200px !important;
        margin-right: 20px;
      }
    }
    .tables {
      margin: 20px 0px;
    }
    .block {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  // select选框部分样式
  .pageheard {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    // background-color: #eee;
    flex-direction: row-reverse;
    .selectbox {
      width: 180px;
    }
    .flex-center {
      display: flex;
      margin-right: 12px;
      align-items: center;
    }
    .magin-left {
      margin: 0;
      margin-left: 20px;
    }
    .addnew {
      margin-left: 20px;
    }
    .alldata {
      float: left;
    }
  }
  .fastdialogtable {
    margin-bottom: 30px;
  }
  .fastdialogbtn {
    display: flex;
    justify-content: center;
    .fastdialogyes {
      margin-left: 100px;
    }
  }
}
</style>