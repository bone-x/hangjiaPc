<template>
  <div class="content-container">
    <!-- app首页管理 -->
    <el-row align="left">
      <el-col :span="24">
        <h3>APP首页版块管理</h3>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-col :span="24">
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
          border
          style="width: 90%"
        >
          <el-table-column
            prop="name"
            label="板块名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="rank"
            label="排序"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="displayStatus"
            label="板块状态"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.displayStatus === 1">
                显示
              </span>
              <span v-else>隐藏</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updatorName"
            label="最后修改人"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="最后修改时间"
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
              <el-button
                v-if="scope.row.displayStatus === 0"
                type="primary"
                @click.native="handleToShow(scope.row)"
                v-permission="['operate:ad:save']"
              >
                显示
              </el-button>
              <el-button
                v-if="scope.row.displayStatus === 1"
                type="primary"
                plain
                @click.native="handleToShow(scope.row)"
                v-permission="['operate:ad:save']"
              >隐藏</el-button>
              <router-link :to="scope.row.id === 3 ? { name: 'SetCenterAdvertising' } : { name: 'SetRecommendOrganization' }">
                <el-button
                  v-if="scope.row.id === 3 || scope.row.id === 4"
                  type="info"
                  v-permission="['operate:ad:save']"
                >设置</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { appTemplateManage, showOrHide } from '@/api/operation';

export default {
  name: 'AppHomePageManage',
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getAppTemplates();
  },
  methods: {
    // 获取板块列表
    async getAppTemplates() {
      const res = await appTemplateManage();
      if (res.code !== 200) return Promise.reject();
      this.tableData = res.result.map(item => {
        if (item.updateTime) {
          item.updateTime = item.updateTime.slice(0, 16);
        }
        return item;
      });
    },

    // 显示/隐藏
    handleToShow(items) {
      if (items.displayStatus === 1) {
        const options = {
          id: items.id,
          displayStatus: 0,
        };
        showOrHide(options).then(res => {
          this.$message.success('操作成功！');
          this.getAppTemplates();
        });
      } else {
        const options = {
          id: items.id,
          displayStatus: 1,
        };
        showOrHide(options).then(res => {
          this.$message.success('操作成功！');
          this.getAppTemplates();
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>