<template>
  <!-- fang's servicemeeting.vue
2020-9-27 15:50 -->
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.key"
          placeholder="预约人姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('generator:servicemeeting:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button
          v-if="isAuth('generator:servicemeeting:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="listwithphone"
      border
      stripe
      sortable
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
      height="550"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        label="唯一标识">
      </el-table-column> -->
      <el-table-column
        prop="item.department"
        header-align="center"
        align="center"
        label="使用单位"
      >
      </el-table-column>
      <el-table-column
        prop="item.roomName"
        header-align="center"
        align="center"
        label="会议室名称"
      >
      </el-table-column>
      <el-table-column
        prop="item.roomUser"
        header-align="center"
        align="center"
        label="预约人"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="联系方式"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="roomDate"
        header-align="center"
        align="center"
        label="会议日期"
        width="100">
      </el-table-column> -->
      <el-table-column
        prop="item.startTime"
        header-align="center"
        align="center"
        label="开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="item.endTime"
        header-align="center"
        align="center"
        label="结束时间"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="meetingTheme"
        header-align="center"
        align="center"
        label="会议主题"
        width="150">
      </el-table-column> -->
      <!-- <el-table-column
        prop="leader"
        header-align="center"
        align="center"
        label="参会人员"
        width="92">
      </el-table-column>
      <el-table-column
        prop="headCount"
        header-align="center"
        align="center"
        label="参会人数">
      </el-table-column> -->
      <!-- <el-table-column
        prop="equipment"
        header-align="center"
        align="center"
        label="设备状态"
        width="120">
         <template slot-scope="scope">
          <span v-if="scope.row.equipment==0">无设备</span>
          <span v-else-if="scope.row.equipment==1">麦克风</span>
          <span v-else-if="scope.row.equipment==2">投影仪</span>
          <span v-else>麦克风，投影仪</span>
         </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.remark==null">无</span>
          <span v-else>{{scope.row.remark}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="item.status"
        header-align="center"
        align="center"
        label="预约状态"
      >
         <template slot-scope="scope">
                    <span v-if="scope.row.item.status == 0">已成功</span>
                    <span v-else-if="scope.row.item.status == 1">已取消</span>
                   </template
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="120"
        label="操作"
      >
        <template slot-scope="scope">
          <el-popover placement="top-start" width="400" trigger="click">
            <el-table :data="details">
              <el-table-column
                prop="meetingTheme"
                label="会议主题"
              ></el-table-column>
              <el-table-column prop="leader" label="参会人员"></el-table-column>
              <el-table-column
                prop="headCount"
                label="参会人数"
              ></el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                            <span v-if="scope.row.remark == null">无</span>
                  <span v-else>{{ scope.row.remark }}</span>
                          </template
                >
              </el-table-column>
            </el-table>
            <el-button
              type="text"
              slot="reference"
              @click="detailsClick(scope.row.item.orderId)"
              >详情</el-button
            >
          </el-popover>
          <el-button
            type="text"
            size="small"
            @click="deleteHandle(scope.row.orderId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页处理 -->
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./servicemeeting-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: "",
      },
      dataList: [],
      listwithphone: [],
      // listwithphone: [],
      details: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/generator/servicemeeting/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          //key为查询字段
          key: this.dataForm.key,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.dataList = data.page.list;
          this.listwithphone = data.listwithphone;
          this.dataList.orderId = null;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    // addOrUpdateHandle (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },

    //详情信息
    detailsClick(id) {
      this.details = [];
      for (let item of this.dataList) {
        if (item.orderId == id) {
          this.details.push(item);
        }
      }
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.orderId;
          });
      this.$confirm(`确定进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/generator/servicemeeting/delete"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
  },
};
</script>