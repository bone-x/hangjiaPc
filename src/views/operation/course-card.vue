<template>
  <div class="content-container">
    <!-- 运营管理 - 听课卡列表 -->
    <el-tabs v-model="activeName" style="margin-bottom:50px;" @tab-click="handleClick">
      <!-- 列表部分 -->
      <el-tab-pane name="first">
        <span slot="label">列表</span>
        <el-row :gutter="20" style="margin-bottom:50px;">
          <el-col :span="3">
            <el-select v-model="valueType" placeholder="请选择发布状态">
              <el-option
                v-for="item in optiontype"
                :key="item.valueType"
                :label="item.label"
                :value="item.valueType"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="content" placeholder="听课卡名称" maxlength="10"></el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="danger" @click="clearAll">清空</el-button>
          </el-col>
          <el-col :span="3" style="margin-left:20px;">
            <el-button type="primary" @click="queryData">搜索</el-button>
          </el-col>
          <el-col :span="2" :offset="7" style="float:right">
            <el-button
              type="primary"
              @click="newCourseCard"
              v-permission="['operate:group:save']"
            >新建听课卡</el-button>
          </el-col>
        </el-row>
        <!-- 列表 表格 -->
        <el-table :data="tableList" border style="width: 100%;margin-bottom:50px;">
          <el-table-column :show-overflow-tooltip="true" prop="id" label="听课卡ID" width="100"></el-table-column>
          <el-table-column prop="cardName" label="听课卡名称" min-width="150"></el-table-column>
          <el-table-column prop="publishTime" label="上架时间" min-width="180"></el-table-column>
          <el-table-column label="有效时间" min-width="180">
            <template slot-scope="scope">
              <span style="display:block;">{{ timeFormat(scope.row.effectiveTimeStart) }}</span>
              <span style="display:block;">{{ timeFormat(scope.row.effectiveTimeEnd) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用时长" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.avaibilePeriod}}天</span>
            </template>
          </el-table-column>
          <el-table-column label="价格范围" min-width="120">
            <template slot-scope="scope">
              <span>{{ (scope.row.priceRangeLow) }}</span>-
              <span>{{ (scope.row.priceRangeHigh) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">待审核</span>
              <span v-if="scope.row.status === 2">已上架</span>
              <span v-if="scope.row.status === 3">已生效</span>
              <span v-if="scope.row.status === 4">已下架</span>
              <span v-if="scope.row.status === 5">已过期</span>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" min-width="100"></el-table-column>
          <el-table-column prop="modifierName" label="修改人" min-width="100"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="180"></el-table-column>
          <el-table-column label="操作" min-width="280" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-permission="['operate:group:delete']"
                size="mini"
                :disabled="(scope.row.status === 2 || scope.row.status === 3)?true:false"
                type="danger"
                @click="killDetele(scope.row.id)"
              >删除</el-button>

              <router-link
                :to="{ name: ((scope.row.status === 2 || scope.row.status === 3)?'OperationCourseCard':'OperationCourseCardEdit'), params: { id: scope.row.id } }"
              >
                <el-button
                  v-permission="['operate:group:update']"
                  size="mini"
                  type="primary"
                  plain
                  :disabled="(scope.row.status === 2 || scope.row.status === 3)?true:false"
                >编辑</el-button>
              </router-link>

              <router-link
                :to="{ name: ((scope.row.status === 3)?'OperationCourseCardUse':'OperationCourseCard'), params: { id:scope.row.id } }"
              >
                <el-button
                  v-permission="['operate:course:sent']"
                  size="mini"
                  :disabled="(scope.row.status===3) ? false:true"
                  type="primary"
                >发放</el-button>
              </router-link>

              <el-button
                v-permission="['operate:course:ud']"
                size="mini"
                v-if="scope.row.status===1?true:false"
                type="primary"
                @click="onSale(scope.row.id,scope.row.status,scope.row.effectiveTimeStart)"
              >上架</el-button>

              <el-button
                v-permission="['operate:course:ud']"
                size="mini"
                v-else
                :disabled="(scope.row.status===4 || scope.row.status === 5) ? true:false"
                type="danger"
                @click="saleOut(scope.row.id,scope.row.status)"
              >下架</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 列表分页 -->
        <div class="block">
          <el-pagination
            :current-page.sync="pageNum"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <!-- 数据部分 -->
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label">数据</span>
        <el-row :gutter="20" style="margin-bottom:50px;">
          <el-col :span="3">
            <el-select v-model="valueDataType" placeholder="请选择发布状态">
              <el-option
                v-for="item in optionData"
                :key="item.valueDataType"
                :label="item.label"
                :value="item.valueDataType"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="contentData" placeholder="听课卡名称" maxlength="10"></el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="danger" @click="clearAllData">清空</el-button>
          </el-col>
          <el-col :span="3" style="margin-left:20px;">
            <el-button type="primary" @click="queryDataList">搜索</el-button>
          </el-col>
          <el-col :span="2" :offset="7" style="float:right">
            <el-button
              type="primary"
              @click="newCourseCard"
              v-permission="['operate:group:save']"
            >新建听课卡</el-button>
          </el-col>
        </el-row>
        <!-- 数据表格 -->
        <el-table :data="tableDataList" border style="width: 100%;margin-bottom:50px;">
          <el-table-column prop="id" label="听课卡ID" width="120"></el-table-column>
          <el-table-column prop="cardName" label="听课卡名称" min-width="120"></el-table-column>
          <el-table-column prop="publishTime" label="上架时间" min-width="180"></el-table-column>
          <el-table-column prop="goodTime" label="有效时间" min-width="180">
            <template slot-scope="scope">
              <span style="display:block;">{{ timeFormat(scope.row.effectiveTimeStart) }}</span>
              <span style="display:block;">{{ timeFormat(scope.row.effectiveTimeEnd) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useTime" label="可用时长" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.avaibilePeriod}}天</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">待审核</span>
              <span v-if="scope.row.status === 2">已上架</span>
              <span v-if="scope.row.status === 3">已生效</span>
              <span v-if="scope.row.status === 4">已下架</span>
              <span v-if="scope.row.status === 5">已过期</span>
            </template>
          </el-table-column>
          <el-table-column prop="sendSum" label="已发放数量" min-width="180"></el-table-column>
          <el-table-column prop="holdSum" label="持有人数" min-width="180"></el-table-column>
          <el-table-column prop="activeSum" label="已激活数量" min-width="180"></el-table-column>
          <el-table-column label="操作" min-width="250" fixed="right">
            <template slot-scope="scope">
              <router-link
                :to="{ name: 'OperationCourseCardDetails', params: { id: scope.row.id } }"
              >
                <el-button type="primary" @click="Details(scope.row)" size="mini">详情</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据分页 -->
        <div class="block">
          <el-pagination
            :current-page.sync="pageDataNum"
            :page-size="pageDataSize"
            :total="totalData"
            layout="prev, pager, next, jumper"
            background
            @size-change="handleSizeDataChange"
            @current-change="handleCurrentDataChange"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getGiftCardDetailsList,
  getGiftCardDataList,
  getGiftCardDetailsPutaway,
  DetailsListDelete
} from "@/api/operation";
import { formatDate } from "@/utils/index";

export default {
  name: "OperationCourseCard",
  components: {},
  data() {
    return {
      timeFormat: formatDate,
      activeName: "first",
      optiontype: [
        {
          label: "全部状态",
          valueType: 0
        },
        {
          label: "待审核",
          valueType: 1
        },
        {
          label: "已上架",
          valueType: 2
        },
        {
          label: "已生效",
          valueType: 3
        },
        {
          label: "已下架",
          valueType: 4
        },
        {
          label: "已过期",
          valueType: 5
        }
      ],
      optionData: [
        {
          label: "全部状态",
          valueDataType: 0
        },
        {
          label: "待审核",
          valueDataType: 1
        },
        {
          label: "已上架",
          valueDataType: 2
        },
        {
          label: "已生效",
          valueDataType: 3
        },
        {
          label: "已下架",
          valueDataType: 4
        },
        {
          label: "已过期",
          valueDataType: 5
        }
      ],
      valueType: 0,
      valueDataType: 0,
      content: "",
      contentData: "",
      tableList: [
        {
          courseCardId: "1",
          courseCardName: "1",
          pushtime: "1",
          goodTime: "2",
          useTime: "4",
          priceLimit: "6",
          status: "4"
        }
      ],
      tableDataList: [
        {
          courseCardId: "111",
          courseCardName: "123",
          pushtime: "123",
          goodTime: "123",
          useTime: "123",
          status: "123",
          priceLimit: "123",
          popleNum: "123",
          activeNumber: "123"
        }
      ],
      pageNum: 1,
      pageSize: 10,
      total: 10,
      pageDataNum: 1,
      pageDataSize: 10,
      totalData: 10
    };
  },
  watch: {
    $route: "onRouteChange"
  },
  created() {
    this.getListDetails();
    this.getListData();
  },
  methods: {
    // 监听路由的变化
    onRouteChange(to) {
      if (to.name === "OperationCourseCard") {
        this.getListDetails();
        this.getListData();
      }
    },

    // 列表 - 详情
    getListDetails() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        courseCardName: this.content,
        status: this.valueType === 0 ? "" : this.valueType
      };
      getGiftCardDetailsList(params).then(res => {
        console.log(res, "列表");
        this.tableList = res.result.list;
        this.total = res.result.totalCount;
      });
    },

    // 列表 - 数据
    getListData() {
      const params = {
        pageNum: this.pageDataNum,
        pageSize: this.pageDataSize,
        cardName: this.contentData,
        status: this.valueDataType === 0 ? "" : this.valueDataType
      };
      getGiftCardDataList(params).then(res => {
        console.log(res, "听课卡 - 数据");
        this.tableDataList = res.result.list;
        this.totalData = res.result.totalCount;
      });
    },

    // 上架
    onSale(id, status, time) {
      console.log(id, status, time, "参数");
      this.$confirm("是否确认上架，上架后不可再次编辑", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (
            new Date(time.replace(/-/g, "/")) >
            new Date(this.timeFormat(Math.round(new Date())).replace(/-/g, "/"))
          ) {
            const params = {
              operateType: 1,
              courseCardId: id,
              status: 2
            };
            getGiftCardDetailsPutaway(params).then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "上架成功!"
                });
                this.getListDetails();
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "上架时间已超过有效时间，请重新编辑后再提交上架"
            });
          }
        })
        .catch(() => {
          console.log("取消上架");
        });
    },

    // 下架
    saleOut(id, status) {
      this.$confirm(
        "是否确认下架，下架后听课卡将无法再使用，已激活的听课卡可以继续使用",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const params = {
            operateType: 2,
            courseCardId: id,
            status: 4
          };
          getGiftCardDetailsPutaway(params).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "下架成功!"
              });
              this.getListDetails();
            }
          });
        })
        .catch(() => {
          console.log("取消下架");
        });
    },

    // 删除
    killDetele(id) {
      this.$confirm("是否确认删除，删除后该记录不可找回", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const option = {
            courseCardIdQUERY: id
          };
          DetailsListDelete(option).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getListDetails();
            }
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },

    queryData() {
      this.pageNum = 1;
      this.getListDetails();
    },
    queryDataList() {
      this.pageDataNum = 1;
      this.getListData();
    },
    clearAll() {
      this.valueType = 0;
      this.content = "";
    },
    clearAllData() {
      this.valueDataType = 0;
      this.contentData = "";
    },
    // 列表分页
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.getListDetails();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getListDetails();
      console.log(`当前页: ${val}`);
    },
    // 数据分页
    handleSizeDataChange(val) {
      this.pageDataSize = val;
      console.log(`每页 ${val} 条`);
      this.getListData();
    },
    handleCurrentDataChange(val) {
      this.pageDataNum = val;
      console.log(`当前页: ${val}`);
      this.getListData();
    },
    newCourseCard() {
      this.$router.push({ name: "OperationCourseCardAdd" });
    },
    Details(row) {
      sessionStorage.setItem("DetailsRow", JSON.stringify(row));
    },

    handleClick(tab) {
      console.log(tab.name, 1111111111111);
      if (tab.name === "first") {
        this.getListDetails();
      } else {
        this.getListData();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.block {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>