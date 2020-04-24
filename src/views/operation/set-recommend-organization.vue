<template>
  <div class="content-container">
    <!-- 设置推荐机构 -->
    <el-row>
      <el-col :span="8">
        <h3>设置机构推荐<span style="color: red; margin-left: 20px; font-weight: normal; font-size: 14px;">最多展示2个机构</span></h3>
      </el-col>
      <el-col :span="8">
        <el-button
          type="primary"
          @click.native="addOrganaztion"
          v-permission="['operate:ad:save']"
        >添加推荐机构</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="24">
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="sort"
            label="排序"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="机构名称"
            width="250"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="businessCategory"
            label="主营类目"
            min-width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="totalShelfCount"
            label="课程数"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updatorName"
            label="最后修改人"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.updatorName">{{ scope.row.updatorName }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="最后修改时间"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.updateTime">{{ scope.row.updateTime }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="opration"
            label="操作"
            min-width="200"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.$index === 0"
                type="primary"
                @click.native="handleToUpDown(scope.row.id, 1)"
                v-permission="['operate:ad:save']"
              >
                上移
              </el-button>
              <el-button
                :disabled="scope.$index === tableData.length - 1"
                type="primary"
                plain
                @click.native="handleToUpDown(scope.row.id, 2)"
                v-permission="['operate:ad:save']"
              >
                下移
              </el-button>
              <el-button
                type="danger"
                @click.native="handleToDelete(scope.row.id)"
                v-permission="['operate:ad:delete']"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 添加推荐机构弹窗 -->
    <el-dialog
      title="选择机构"
      :visible.sync="centerDialogVisible"
      width="900px"
      center
    >
      <el-row>
        <el-col :span="8">
          <el-input
            v-model.trim="orgMsg.orgId"
            clearable
            placeholder="输入机构ID"
            style="width: 250px;margin-right: 10px"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model.trim="orgMsg.orgName"
            clearable
            placeholder="输入机构名称"
            style="width: 250px; margin-right: 10px"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            plain
            icon="el-icon-search"
            @click.native="searchOrgMsg"
          >搜索</el-button>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0px">
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :data="dialogData"
            :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
            row-key="orgId"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="orgId"
              label="机构ID"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="orgName"
              label="机构名称"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="businessCategory"
              label="主营类目"
              min-width="200"
              align="center"
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        class="row-bg"
        justify="center"
        tyle="margin-top: 30px;"
      >
        <el-col :span="6">
          <el-pagination
            :current-page.sync="orgMsg.pageNum"
            :page-size="orgMsg.pageSize"
            :total="orgMsg.totalCount"
            layout="prev, pager, next, jumper"
            background
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="selectedOrganization"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllOrgList } from '@/api/h5-private';
import {
  recommandOrgList,
  orgListToDelete,
  orgListUpOrDown,
  comfirmOrganization,
} from '@/api/operation';
import { getPassOrganization } from '@/api/settled';
export default {
  name: 'SetRecommendOrganization',
  data() {
    return {
      centerDialogVisible: false,
      tableData: [],
      dialogData: [],
      orgMsg: {
        orgId: null,
        orgName: null,
        contactName: null,
        mobile: null,
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
      },
      multipleSelection: [],
    };
  },
  created() {
    this.getModuleData();
    this.getOrgList();
  },
  methods: {
    // 获取APP版块列表
    async getModuleData() {
      const res = await recommandOrgList();
      if (res.code !== 200) return Promise.reject();
      this.tableData = res.result;
    },

    // 上下移
    handleToUpDown(item, sort) {
      if (sort === 1) {
        const options = {
          id: item,
          sort: 1,
        };
        orgListUpOrDown(options).then(res => {
          console.log('to up');
          this.$message.success('操作成功！');
          this.getModuleData();
        });
      } else {
        const options = {
          id: item,
          sort: 2,
        };
        orgListUpOrDown(options).then(res => {
          console.log('to down');
          this.$message.success('操作成功！');
          this.getModuleData();
        });
      }
    },

    // 删除
    handleToDelete(item) {
      orgListToDelete(item).then(res => {
        this.getModuleData();
        this.$message.success('操作成功！');
      });
    },

    // 添加推荐机构
    addOrganaztion() {
      if (this.tableData.length === 2) {
        this.$message.error('当前推荐机构位置已满，请删除部分数据后再操作！');
        return false;
      } else {
        this.orgMsg.orgId = '';
        this.orgMsg.orgName = '';
        this.getOrgList();
        this.centerDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection();
        });
      }
    },

    // 勾选机构
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const num = 2 - this.tableData.length;

      if (this.multipleSelection.length > num) {
        this.$message.error('只能展示2条数据！');
        return false;
      }
    },

    // 确定 -> 添加推荐机构
    selectedOrganization() {
      const num = 2 - this.tableData.length;
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择推荐机构！');
        return false;
      } else if (this.multipleSelection.length > num) {
        this.$message.error('只能展示2条数据！');
        return false;
      } else {
        comfirmOrganization(this.multipleSelection).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功！');
            this.centerDialogVisible = false;
            this.getModuleData();
          }
        });
      }
    },

    // 获取分页数据
    async getOrgListData(pageNum = 1) {
      const res = await getAllOrgList({
        pageNum,
        pageSize: this.orgMsg.pageSize,
      });
      if (res.code !== 200) return Promise.reject();
      this.orgMsg.pageNum = res.result.currPage;
      this.orgMsg.pageSize = res.result.pageSize;
      this.orgMsg.totalCount = res.result.totalCount;
      this.dialogData = res.result.list;
    },

    async getOrgList(pageNum = 1) {
      const options = {
        id: this.orgMsg.orgId,
        name: this.orgMsg.orgName,
        contactName: this.orgMsg.contactName,
        mobile: this.orgMsg.mobile,
        pageNum,
        pageSize: this.orgMsg.pageSize,
      };
      const res = await getPassOrganization(options);
      if (res.code !== 200) return Promise.error();
      this.dialogData = res.result.list.map(item => {
        if (item.businessCategory) {
          item.businessCategory = item.businessCategory
            .replace(/\"/g, '')
            .replace('[', '')
            .replace(']', '');
        }
        const options = {
          orgId: item.id,
          orgName: item.name,
          businessCategory: item.businessCategory,
        };
        return options;
      });
      this.orgMsg.totalCount = res.result.totalCount;
      this.orgMsg.totalPage = res.result.totalPage;
    },

    // 弹窗机构列表搜索
    searchOrgMsg() {
      this.getOrgList();
    },

    // 分页
    handleCurrentChange(pageNum = 1) {
      this.getOrgList(pageNum);
    },
  },
};
</script>
<style lang="less" scoped>
</style>