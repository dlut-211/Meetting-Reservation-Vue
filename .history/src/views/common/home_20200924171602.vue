

<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-date-picker v-model="datevalue" type="date" placeholder="选择日期">
        </el-date-picker>
        <el-table
          class="customer-table"
          :data="tableData"
          :cell-style="cellStyle"
          border
          @cell-click="clickhandle"
          style="width: 95%"
        >
          <el-table-column prop="date" min-width="110"> </el-table-column>
          <el-table-column
            v-for="(item, index) in room"
            :key="index"
            :label="item.roomName"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                style="
                  float: left;
                  font-size: 18px;
                  margin-left: 10%;
                  color: #686868;
                  font-weight: 800;
                  line-height: 25px;
                "
                >{{ item.capacity }}</el-button
              >
              <el-button
                type="text"
                class="iconfont icon-shexiangtou_guanbi"
                style="
                  float: right;
                  font-size: 25px;
                  margin-right: 10%;
                  color: #686868;
                "
              ></el-button>
            </template>
            <!-- <span style="float:left" class="iconfont icon-mic"></span>
            <span  style="float:right" class="iconfonticon-shexiangtou_guanbi"></span>-->
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="使用单位">
            <el-input v-model="form.department" readonly></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              type="number"
              readonly
              v-model="form.mobile"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item label="隶属单位">
            <el-input readonly v-model="form.belong"></el-input>
          </el-form-item>
          <el-form-item label="会议室">
            <el-input
              readonly
              v-model="form.room"
              placeholder="点击左侧进行选择"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动日期">
            <el-col :span="11">
              <el-input v-model="form.datechoose"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-input
                readonly
                placeholder="开始时间"
                v-model="form.date1"
                style="width: 100%"
              ></el-input>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-input
                readonly
                placeholder="结束时间"
                v-model="form.date2"
                style="width: 100%"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="参会人数">
            <el-col :span="11">
              <el-input
                type="number"
                min="2"
                max="100"
                v-model="form.sum"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="参会领导">
            <el-input v-model="form.leader"></el-input>
          </el-form-item>

          <el-form-item label="会议用途">
            <el-checkbox-group v-model="form.theme">
              <el-checkbox label="研讨会" name="type"></el-checkbox>
              <el-checkbox label="培训" name="type"></el-checkbox>
              <el-checkbox label="讲座" name="type"></el-checkbox>
              <el-checkbox
                label="其他（建议备注中说明）"
                name="type"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.note"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即预约</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

  <script>
export default {
  mounted() {
    this.$http({
      url: this.$http.adornUrl("/generator/servicemeeting/formuser"),
      method: "get",
      // 请求体重发送的数据
      // data: {

      // },
      // 设置请求头
      headers: {
        "Content-Type": "application/json",
      },
    }).then(({ data }) => {
      if (data && data.code === 0) {
        console.log(data);

        this.room = data.room;
        this.tableData = data.list;
        this.form = {
          department: data.room[1].roomArea,
          name: data.now_user.email,
          mobile: data.now_user.mobile,
          belong: data.now_user.department,
          date1: null,
          date2: null,
          room: null,
        };
        console.log(this.room);
      } else {
        this.$message.error(data.msg);
      }
    });
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    // 单元格的 style 的回调方法
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex != 0)
        return "border-radius: 15px;background-color:rgb(0, 215, 193);padding:0";
    },
    clickhandle(row, column, event, cell) {
      let a = row.date.split("-");
      console.log(a);
      if (this.timesign == false) {
        this.room = column.label;
        this.form.date1 = a[0];
        this.form.date2 = a[1];
        this.timesign=true;
      } else {
        if (this.room == column.label) {
       
          this.form.date2 = a[1];
        } else {
          this.$message.error("请选择同一会议室进行预约");
        }
      }
      console.log("行");

      console.log("列");
      console.log(column);
      console.log();
    },
    // addIconClass({ row, column, rowIndex, columnIndex }) {
    //  if (columnIndex != 0)
    //       return "iconfont icon-mic icon-shexiangtou_guanbi";

    // },

    // 表头行的 style 的回调方法
    // headCellStyle({ row, column, rowIndex, columnIndex }) {
    //     if (columnIndex != 0 && rowIndex === 0) {
    //         return `padding-left:40px;`;
    //     }
    // },
  },

  data() {
    return {
      room: [],
      tableData: [],
      form: {},
      datevalue: "",
      timesign: false,
      timestart: "",
    };
  },
};
</script>


<style>
.el-table--border,
.el-table--group {
  border: none;
}
/* // 表格最外层边框-底部边框 */
.el-table--border::after,
.el-table--group::after {
  width: 0;
}
.customer-table::before {
  width: 0;
}
.customer-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
</style>
<style>
/* inpu滚动条 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: textfield;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>