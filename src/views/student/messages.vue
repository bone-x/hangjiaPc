<template>
  <div class="content-container">
    <!-- 前面的拦截层 用于过滤筛选条件-->
    <el-row :gutter="24" type="flex" align="middle">
      <el-col :span="5" center>
        <el-input
          :clearable="true"
          v-model="filter.titleName"
          name="titleName"
          placeholder="输入标题名称"
          title="输入模板名称"
          type="text"
        ></el-input>
      </el-col>
      <el-col :span="5" center>
        <el-select v-model="filter.state" placeholder="状态">
          <el-option
            v-for="item in stateType"
            :key="item.id"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" center>
        <el-button type="primary" @click.native="getMessageContentList(1)">查询</el-button>
        <el-button style="margin-left: 30px;" @click.native="clearFormFilter">清除</el-button>
      </el-col>
      <el-col v-permission="['stu:mn:send']" :span="3" center>
        <router-link :to="{ name: 'StudentMessagesAdd' }">
          <el-button type="primary">发送消息</el-button>
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
      <el-table-column min-width="180" prop="id" label="序号" align="center"></el-table-column>
      <el-table-column min-width="200" prop="title" label="标题" align="center"></el-table-column>
      <el-table-column label="内容" min-width="180" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click.native="findContentById(scope.row.id)">点击显示</el-button>
        </template>
      </el-table-column>
      <el-table-column min-width="150" prop="$status" label="状态" align="center"></el-table-column>
      <el-table-column min-width="180" prop="sendTimeValue" label="推送时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sendTimeValue">{{ handleDate(scope.row.sendTimeValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" prop="$editor" label="更新人" align="center"></el-table-column>
      <el-table-column min-width="180" prop="updateTime" label="更新时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.updateTime">{{ handleDate(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-permission="['stu:mn:update']"
            :type="scope.row.status === 2 ? 'info':'primary'"
            :disabled="!scope.row.$isEdit"
            @click.native="goRoute(scope.row)"
          >修改</el-button>
          <el-button
            :disabled="!scope.row.$isCancel"
            v-permission="['stu:mn:update']"
            size="mini"
            :type="scope.row.status === 2 ? 'info':'danger'"
            @click.native="cancelSendNoticeById(scope.row)"
          >取消推送</el-button>
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
        layout="prev, pager, sizes, jumper"
        style="display: inline-block;"
        @size-change="handleSizeChange"
        @current-change="oncurrPageChange"
        :page-sizes="[10, 30, 50]"
      ></el-pagination>
      <el-button size="mini" style="margin-left: 20px;">跳转</el-button>
    </el-row>
    <!-- 用于点击显示详情-->
    <el-dialog :visible.sync="states.isShowDetailsWindow" center>
      <el-form ref="form">
        <div v-html="form.content" class="messageContent"></div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>现离推送时间不足10分钟，不允许修改。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMessageContentList,
  queryContentById,
  cancelSendNoticeContentById
} from "@/api/message";
import { formatDate } from "@/utils";

export default {
  name: "StudentMessages",
  components: {},
  data() {
    return {
      dialogVisible: false,
      dataUser: [],
      // 状态类型
      stateType: [
        {
          text: "取消推送",
          value: "0",
          id: 1
        },
        {
          text: "待推送",
          value: "1",
          id: 2
        },
        {
          text: "已推送",
          value: "2",
          id: 3
        }
      ],
      detailsData: [],
      tableData: [],
      filter: {
        titleName: "",
        currPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
        state: ""
      },
      states: {
        isShowDetailsWindow: false
      },

      // 内嵌form表达的数据
      form: {
        content: ""
      }
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    // 获取默认列表数据
    this.getMessageContentList();
  },

  methods: {
    handleDate(time) {
      return time.slice(0, 16);
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    // js路由跳轉
    goRoute(items) {
      console.log(items);
      //   return false;
      if (items.status === 0) {
        this.$router.push({
          name: "StudentMessagesEdit",
          params: {
            id: items.id
          }
        });
      } else if (items.sendTimeValue) {
        // 把时间转换成毫秒
        const handleTime = items.sendTimeValue.split(/[- : \/]/);
        const sendTime = Date.parse(
          new Date(
            handleTime[0],
            handleTime[1] - 1,
            handleTime[2],
            handleTime[3],
            handleTime[4],
            handleTime[5]
          )
        );
        const now = formatDate(new Date());
        const newNow = now.split(/[/ : \/]/);
        const justNow = Date.parse(
          new Date(
            newNow[0],
            newNow[1] - 1,
            newNow[2],
            newNow[3],
            newNow[4],
            newNow[5]
          )
        );
        // 最终运算
        const finalTime = sendTime - justNow;
        if (finalTime <= 600000) {
          this.$confirm("现离推送时间还差10分钟，不允许修改。", "修改提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "已退出修改!"
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消修改"
              });
            });
        } else {
          this.$router.push({
            name: "StudentMessagesEdit",
            params: {
              id: items.id
            }
          });
        }
      }
    },
    // 跳转组件加载
    onRouteChange(to) {
      if (to.name === "StudentMessages") {
        this.getMessageContentList(this.filter.currPage);
      }
    },
    // 根据参数获取消息列表
    async getMessageContentList(currPage = 1) {
      const params = {
        // 页码
        currPage,
        pageSize: this.filter.pageSize,
        title: this.filter.titleName,
        status: this.filter.state
      };

      // 发起请求
      const res = await getMessageContentList(params);
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
      this.getMessageContentList(pageNum);
    },

    // 每页条数
    handleSizeChange(val) {
      this.filter.pageSize = val;
      this.filter.pageNum = 1;
      this.getMessageContentList();
    },

    // 适配消息列表数据到UI
    adapterGoodsToUI(result = {}) {
      const {
        list = [],
        currPage = 1,
        pageSize = 10,
        totalPage = 1,
        totalCount = 0
      } = result.page;
      // 把内容放到本地内存中
      sessionStorage.setItem("content", result.page.list.content);
      const { userList = [], sendResult = [] } = result;
      this.dataUser = userList;
      this.filter.currPage = currPage;
      this.filter.pageSize = pageSize;
      this.filter.totalPage = totalPage;
      this.filter.totalCount = totalCount;
      this.tableData = list.map(item => {
        item.$isEdit = false;
        item.$isCancel = false;
        item.$editor = "-"; // 更新人
        item.$sendNum = "-"; // 发送量
        item.$endNum = "-"; // 达到率
        item.$status = "_";

        if (item.status === 0) {
          item.$status = " 取消推送";
          item.$isEdit = true;
        }
        if (item.status === 1) {
          item.$status = " 待推送";
          item.$isEdit = true;
          item.$isCancel = true;
        }
        if (item.status === 2) {
          item.$status = "已推送";
        }

        userList.some(item2 => {
          if (item.updateUser === item2.userId) {
            item.$editor = item2.userName;
            return true;
          }
          return false;
        });
        sendResult.some(item3 => {
          if (item.id === item3.id) {
            item.$sendNum = item3.totalSize; // 发送量
            item.$endNum = item3.successRate; // 达到率
            return true;
          }
          return false;
        });
        return item;
      });
    },
    // 清空筛选栏
    clearFormFilter() {
      this.filter.titleName = "";
      this.filter.state = "";
    },

    // 通过id查看消息内容
    findContentById(id) {
      queryContentById(id).then(res => {
        if (res.code === 200) {
          this.states.isShowDetailsWindow = true;
          this.form.content = res.data.message.content;
        } else {
          return Promise.reject();
        }
      });
    },
    // 通过id取消发送当前这条数据
    async cancelSendNoticeById(row) {
      const res = await cancelSendNoticeContentById(row.id);
      if (res.code !== 200) return Promise.reject();
      this.getMessageContentList(this.filter.currPage);
      this.$message.success("取消发送成功");
    }
  }
};
</script>

<style lang="less" scoped>
.messageContent {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
