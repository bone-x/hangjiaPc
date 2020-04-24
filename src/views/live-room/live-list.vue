<!--
 * @Description: In User Settings Edit
 * @Author: linsihua
 * @Date: 2019-08-19 09:27:44
 * @LastEditTime: 2019-08-20 16:46:26
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-container">
    <!-- 直播间管理列表 -->
    <el-row style="margin-bottom: 20px">
      <el-col :span="6">
        <el-input
          v-model.trim="searchData.name"
          placeholder="请输入直播间名称"
          style="width:300px"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          @click.native="handleClearName"
        >清空</el-button>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          @click.native="handleSearchRoom"
          v-permission='["live:room:select"]'
        >查询</el-button>
      </el-col>
      <!-- <el-col :span="4" v-permission='["live:room:insert"]'>
          <router-link :to="{ name: 'LiveRoomListAdd' }">
            <el-button type="primary">新增直播间</el-button>
          </router-link>
        </el-col> -->
    </el-row>
    <el-row :gutter="24">
      <el-col center>
        <el-table
          :data="roomData"
          :header-cell-style="{background:'#eef1f6',color:'#606266',width:'100%'}"
          style="margin-top: 40px"
          border
        >
          <el-table-column
            prop="index"
            width="50"
            label="序号"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{(searchData.pageNum - 1) * searchData.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="直播间ID"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="直播间名称"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="courseName"
            label="所属课程"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="siteDomain"
            label="站点"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="liveId"
            label="展视互动直播ID"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="liveNumber"
            label="展视互动直播房间号"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="description"
            label="直播间描述"
            width="250"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.description === ''">--</span>
              <span v-else>{{scope.row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="updator"
            label="修改人"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.updator === '' || scope.row.updator === null">--</span>
              <span v-else>{{scope.row.updator}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            width="100"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.updateTime === '' || scope.row.updateTime === null">--</span>
              <span v-else>{{scope.row.updateTime}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
          prop="enable"
          label="使用状态"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.enable === true">正常</span>
            <span v-if="scope.row.enable === false">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'LiveRoomListEdit', params: { id: scope.row.id } }"
              v-permission='["live:room:edit"]'
            >
              <el-button
                size="mini"
                type="primary"
                plain
              >修改</el-button>
            </router-link>
            <el-button
              v-if="scope.row.enable === false"
              type="primary"
              size="mini"
              @click="handleUse(scope.row)"
            >启用</el-button>
            <el-button
              v-if="scope.row.enable === true"
              size="mini"
              type="danger"
              @click="handleStop(scope.row)"
            >禁用</el-button>
          </template>
        </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>

    <el-row
      :gutter="24"
      style="margin-top: 30px"
    >
      <el-col center>
        <el-pagination
          :current-page.sync="searchData.pageNum"
          :page-size="searchData.pageSize"
          :total="totalCount"
          layout="prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLiveList, changeLiveStatus } from '@/api/live-room.js';

export default {
  name: 'LiveRoomList',
  components: {},
  data() {
    return {
      searchData: {
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
      totalCount: 10,
      totalPage: 10,
      roomData: [],
    };
  },
  created() {
    this.getLiveRoomList();
  },
  watch: {
    $route: 'onRouteChange',
  },
  methods: {
    onRouteChange(to) {
      if (to.name === 'LiveRoomList') {
        this.getLiveRoomList();
      }
    },

    // 获取列表数据
    getLiveRoomList() {
      getLiveList(this.searchData).then(res => {
        this.roomData = res.result.list;
        this.totalCount = res.result.totalCount;
        this.totalPage = res.result.totalPage;
      });
    },

    // 查询
    handleSearchRoom() {
      this.getLiveRoomList();
    },

    // 启用
    handleUse(items) {
      const data = {
        id: items.id,
        enable: true,
      };
      this.$confirm('是否确认启用直播间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          changeLiveStatus(data).then(res => {
            this.$message({
              type: 'success',
              message: '启用成功!',
            });
            this.getLiveRoomList();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消启用',
          });
        });
    },

    // 禁用
    handleStop(rows) {
      const data = {
        id: rows.id,
        enable: false,
      };
      this.$confirm('是否确认禁用直播间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          changeLiveStatus(data).then(res => {
            this.$message({
              type: 'success',
              message: '禁用成功!',
            });
            this.getLiveRoomList();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消禁用',
          });
        });
    },

    // 清空
    handleClearName() {
      this.searchData.name = '';
      this.getLiveRoomList();
    },

    // 分页
    handleSizeChange(val) {
      this.searchData.pageSize = val;
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getLiveRoomList();
    },
  },
};
</script>

<style lang="less" scoped>
.content-container {
  padding: 30px;
}
</style>
