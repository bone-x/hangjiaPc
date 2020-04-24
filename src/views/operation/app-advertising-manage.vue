<template>
  <div class="content-container">
    <!-- APP广告管理 -->
    <el-row align="left">
      <el-col :span="24">
        <h3>APP广告管理</h3>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="5">
        <el-input
          v-model.trim="filterParams.name"
          placeholder="请输入广告名称"
          style="width:300px"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="filterParams.position"
          placeholder="请选择广告位置"
          style="width:300px"
        >
          <el-option
            v-for="item in positionList"
            :label="item.label"
            :key="item.index"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="filterParams.status"
          placeholder="请选择状态"
          style="width:300px"
        >
          <el-option
            v-for="item in statusList"
            :label="item.label"
            :key="item.index"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          style="margin-left: 35px"
          @click.native="onSearchFilterParams"
        >查询</el-button>
      </el-col>
      <el-col :span="3">
        <el-button
          type="danger"
          @click.native="resetFilterParams"
        >重置</el-button>
      </el-col>
    </el-row>
    <el-row
      align="left"
      style="margin-top: 30px"
    >
      <el-col :span="24">
        <router-link :to="{name: 'AddAdvertising'}">
          <el-button type="primary" v-permission="['operate:homePage:insert']">新建广告</el-button>
        </router-link>
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
            prop="id"
            label="广告ID"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="广告名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="image"
            label="图片"
            width="90"
            align="center"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.image"
                style="width: 100%; height: 100%"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="position"
            label="广告位置"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.position === 1">APP启动大图</span>
              <span v-else>APP弹窗广告</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="showStartTime"
            label="投放时间"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <div>{{scope.row.showStartTime}}-</div>
              <div>{{scope.row.showEndTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">上架</span>
              <span v-else>下架</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creatorName"
            label="创建人"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="updatorName"
            label="最后修改人"
            width="150"
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
              <router-link :to="{name: 'CheckAdvertising', params: { id: scope.row.id }}">
                <el-button
                  type="primary"
                  size="mini"
                  v-permission="['operate:homePage:select']"
                >
                  查看
                </el-button>
              </router-link>
              <router-link :to="{name: 'EditAdvertising', params: { id: scope.row.id }}">
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  v-permission="['operate:homePage:update']"
                >编辑</el-button>
              </router-link>
              <el-button
                type="danger"
                size="mini"
                @click.native="handleDelete(scope.row.id)"
                v-permission="['operate:homePage:delete']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row
      type="flex"
      justify="center"
      style="margin-top: 30px"
    >
      <el-pagination
        :current-page.sync="filterParams.pageNum"
        :page-size="filterParams.pageSize"
        :total="filterParams.totalCount"
        layout="prev, pager, next, jumper"
        background
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
import { getAppManageList, deleteAppData } from '@/api/operation';

export default {
  name: 'AppAdvertisingManage',
  data() {
    return {
      tableData: [],
      filterParams: {
        name: null,
        position: null,
        status: null,
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
        totalPage: 10,
      },
      positionList: [
        {
          label: 'APP启动大图',
          value: 1,
        },
        {
          label: 'APP弹窗广告',
          value: 0,
        },
      ],
      statusList: [
        {
          label: '已上架',
          value: 1,
        },
        {
          label: '已下架',
          value: 0,
        },
      ],
    };
  },
  watch: {
    $route: 'onRouteChange',
  },
  created() {
    this.appAdvertismentList();
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'AppAdvertisingManage') {
        this.appAdvertismentList(this.filterParams.pageNum);
      }
    },

    // 获取广告列表
    async appAdvertismentList(pageNum = 1) {
      const params = {
        position: this.filterParams.position,
        status: this.filterParams.status,
        name: this.filterParams.name,
        pageNum,
        pageSize: this.filterParams.pageSize,
      };
      const res = await getAppManageList(params);
      if (res.code !== 200) return Promise.reject();
      this.tableData = res.result.list.map(item => {
        if (item.image) {
          item.image = decodeURIComponent(item.image);
        }
        if (item.updateTime) {
          item.updateTime = item.updateTime.slice(0, 16);
        }
        return item;
      });
      this.filterParams.totalCount = res.result.totalCount;
      this.filterParams.totalPage = res.result.totalPage;
    },

    // 查询
    onSearchFilterParams() {
      this.appAdvertismentList();
    },

    // 分页
    handleCurrentChange(pageNum = 1) {
      this.appAdvertismentList(pageNum);
    },

    // 重置
    resetFilterParams() {
      this.filterParams.name = null;
      this.filterParams.position = null;
      this.filterParams.status = null;
      this.appAdvertismentList();
    },

    // 删除
    handleDelete(item) {
      this.$confirm('删除广告后不可恢复，确认删除广告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const params = {
            id: item,
          };
          deleteAppData(params).then(res => {
            if (res.code === 200) {
              this.appAdvertismentList();
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
</style>