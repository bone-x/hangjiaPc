<template>
  <div class="content-container">
    <!-- 系统文案配置 -->
    <el-row>
      <el-col :span="6">
        <el-input
          v-model.trim="systemMsg.name"
          placeholder="请输入配置名称"
          style="width: 300px"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          @click.native="checkSystemMsg"
        >查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          @click.native="resetSystemMsg"
        >重置</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
      tooltip-effect="dark"
      style="width: 100%;margin-top:40px"
      class="billtable"
      border
    >
      <el-table-column
        prop="id"
        label="配置ID"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="$type"
        label="配置名称"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="updator"
        label="最近修改人"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="最近修改时间"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        min-width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            v-permission="['web:copywriting:detail']"
            v-if="scope.row.type !== 5"
            :to="{ name: 'SystemOfficalCheck', params: { id: scope.row.id }, query: { name: scope.row.$type,} }"
          >
            <el-button type="primary">查看</el-button>
          </router-link>
          <el-button
            v-if="scope.row.type === 5"
            type="primary"
            @click.native="openOrgTemplate(scope.row)"
          >查看</el-button>
          <router-link
            v-permission="['web:copywriting:update']"
            v-if="scope.row.type !== 2 && scope.row.type !== 5"
            :to="{ name: 'SystemOfficalEdit', params: { id: scope.row.id }, query: { name: scope.row.$type,} }"
          >
            <el-button
              type="primary"
              plain
              style="margin-left: 0px"
            >修改</el-button>
          </router-link>
          <el-button
            v-if="scope.row.type === 2"
            type="primary"
            plain
            style="margin-left: 0px"
            @click.native="changeContantDetails(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.type === 5"
            type="primary"
            plain
            style="margin-left: 0px"
            @click.native="changeOrgDetails(scope.row)"
          >修改</el-button>
          <el-button
            v-permission="['web:history:list']"
            type="danger"
            style="margin-left: 0"
            @click.native="changeLogList(scope.row)"
          >修改日志</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-row style="margin-top: 30px;">
      <el-col
        :span="24"
        center
      >
        <el-pagination
          :current-page.sync="systemMsg.pageNum"
          :page-size="systemMsg.pageSize"
          :total="systemMsg.totalCount"
          background
          layout="prev, pager, next, jumper"
          @current-change="oncurrPageChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :title="dialogLogMsg.logTitle + ' - 修改日志'"
      :visible.sync="centerDialogVisible"
      width="700px"
    >
      <el-row align="center">
        <el-col :span="24">
          <el-table
            :data="dialogLogMsg.logList"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="id"
              label="序号"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="updatorName"
              label="修改账号"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="修改时间"
              min-width="200"
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col
          :span="24"
          center
        >
          <el-pagination
            :current-page.sync="dialogLogMsg.pageNum"
            :page-size="dialogLogMsg.pageSize"
            :total="dialogLogMsg.totalCount"
            background
            layout="prev, pager, next, jumper"
            @current-change="handleChangeCurrpage"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 通讯录邀请文案修改 -->
    <el-dialog
      title="修改通讯录邀请文案"
      :visible.sync="contantChangeDialogVisible"
      width="600px"
    >
      <el-input
        v-model="contantMsg.content"
        type="textarea"
        autosize
        placeholder="请输入内容"
      >
      </el-input>
      <el-row style="margin-top: 20px;">
        <el-col
          :span="24"
          center
        >
          <el-button @click="contantChangeDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click.native="comfirmChangeContant"
          >确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 机构承诺书模板 -->
    <el-dialog
      title="修改机构承诺书模板"
      :visible.sync="orgChangeDialogVisible"
      width="700px"
      style="padding: 30px"
      center
    >
      <div style="margin-bottom: 20px">
        <upload-file
          :maxFileSize="1"
          :accept="['.pdf']"
          @successCBK="UploadSuccess"
        >
          <el-button
            v-if="!changeBtn"
            size="medium"
            type="primary"
          >上传机构承诺书模板</el-button>
          <el-button
            v-else
            size="medium"
            type="primary"
          >重新上传</el-button>
        </upload-file>
      </div>
      <el-row align="center">
        <el-col :span="24"><span style="padding-right: 20px">{{this.orgMsg.content}}</span></el-col>
      </el-row>

      <el-row style="margin-top: 20px;">
        <el-col
          :span="24"
          center
        >
          <el-button @click="orgChangeDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click.native="comfirmChangeOrg"
          >保 存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  systemDocumentList,
  systemDocumentEdit,
  systemDocumentUpdate,
  systemDocumentCheck,
} from '@/api/siteinfo.js';
import uploadFile from '@/components/UploadPicture/uploadFile';

export default {
  name: 'SystemOfficalDocument',
  components: {
    uploadFile,
  },
  data() {
    return {
      tableData: [],
      systemMsg: {
        type: '',
        name: '',
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
        totalPage: 10,
        contantDetails: '',
      },
      contantMsg: {
        id: '',
        type: '',
        content: '',
        operateType: 2,
      },
      orgMsg: {
        id: '',
        type: '',
        content: '',
        operateType: 2,
      },
      dialogLogMsg: {
        currRowId: '',
        logTitle: '',
        logList: [],
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
        totalPage: 10,
      },
      fileList: [],
      changeBtn: false,
      centerDialogVisible: false,
      contantChangeDialogVisible: false,
      orgChangeDialogVisible: false,
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.getSystemList();
  },
  methods: {
    // 打开机构模板
    openOrgTemplate(items) {
      const params = {
        id: items.id,
      };
      systemDocumentCheck(params).then(res => {
        const url = res.result.content.replace(/<\/?[^>]*>/g, '');
        window.open(url);
      });
    },

    // 修改机构模板按钮
    changeOrgDetails(items) {
      this.changeBtn = false;
      const params = {
        id: items.id,
      };
      systemDocumentCheck(params).then(res => {
        this.orgMsg.id = res.result.id;
        this.orgMsg.type = res.result.type;
        if (res.result.content.indexOf('<p>') !== -1) {
          this.orgMsg.content = res.result.content.replace(/<\/?[^>]*>/g, '');
        } else {
          this.orgMsg.content = res.result.content;
        }
        this.orgChangeDialogVisible = true;
      });
    },

    // 成功上传到oss
    UploadSuccess(res, file) {
      if (res) {
        this.changeBtn = true;
        this.orgMsg.content = res;
        this.$message.success('上传成功！');
      }
    },

    // 保存上传的文件
    comfirmChangeOrg() {
      const data = {
        id: this.orgMsg.id,
        type: this.orgMsg.type,
        content: this.orgMsg.content,
        operateType: 2,
      };
      systemDocumentUpdate(data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
        });
        this.orgChangeDialogVisible = false;
      });
    },

    // 通讯录弹窗开关
    changeContantDetails(items) {
      const params = {
        id: items.id,
      };
      systemDocumentCheck(params).then(res => {
        this.contantMsg.content = res.result.content;
        this.contantMsg.id = res.result.id;
        this.contantMsg.type = res.result.type;
        this.contantChangeDialogVisible = true;
      });
    },

    // 确定修改通讯录
    comfirmChangeContant() {
      systemDocumentUpdate(this.contantMsg).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
        });
        this.getSystemList();
        this.contantChangeDialogVisible = false;
      });
    },

    onRouteChange(to) {
      if (to.name === 'SystemOfficalDocument') {
        this.getSystemList(this.systemMsg.pageNum);
      }
    },

    // 当前页改变
    oncurrPageChange(pageNum = 1) {
      this.getSystemList(pageNum);
    },

    // 获取文案配置列表
    async getSystemList(pageNum = 1) {
      const options = {
        typeName: this.systemMsg.name,
        pageNum,
        pageSize: this.systemMsg.pageSize,
      };
      const res = await systemDocumentList(options);
      if (res.code !== 200) return Promise.reject();
      this.tableData = res.result.list.map(item => {
        if (item.type === 0) item.$type = '服务协议';
        else if (item.type === 1) item.$type = '隐私保护协议';
        else if (item.type === 2) item.$type = '通讯录邀请文案';
        else if (item.type === 3) item.$type = '版权说明';
        else if (item.type === 4) item.$type = '机构协议书';
        else if (item.type === 5) item.$type = '机构承诺书模板';
        else item.$type = '--';
        if (item.createTime) {
          item.createTime = item.createTime.slice(0, 16);
        }
        if (item.updateTime) {
          item.updateTime = item.updateTime.slice(0, 16);
        }
        return item;
      });
      this.systemMsg.totalPage = res.result.totalPage;
      this.systemMsg.totalCount = res.result.totalCount;
    },

    // 查询
    checkSystemMsg() {
      this.getSystemList();
    },

    // 分页
    oncurrPageChange(pageNum = 1) {
      this.getSystemList(pageNum);
    },

    // 重置
    resetSystemMsg() {
      this.systemMsg.name = '';
      this.getSystemList();
    },

    // 查看修改日志
    changeLogList(items) {
      this.dialogLogMsg.logTitle = items.$type;
      this.dialogLogMsg.currRowId = items.id;
      this.getLogDataList();
    },

    handleChangeCurrpage(pageNum = 1) {
      this.getLogDataList(pageNum);
    },

    // 获取日志列表
    async getLogDataList(pageNum = 1) {
      const params = {
        copywriteId: this.dialogLogMsg.currRowId,
        pageNum,
        pageSize: this.dialogLogMsg.pageSize,
      };
      const res = await systemDocumentEdit(params);
      if (res.code !== 200) return Promise.reject();
      this.dialogLogMsg.logList = res.result.list;
      this.dialogLogMsg.totalCount = res.result.totalCount;
      this.dialogLogMsg.totalPage = res.result.totalPage;
      this.dialogLogMsg.pageNum = res.result.currPage;
      this.centerDialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
</style>