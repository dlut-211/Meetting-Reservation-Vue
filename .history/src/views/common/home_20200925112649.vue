

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
                  color: white;

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
            <el-button @click="reset">重置</el-button>
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
        this.choosetable = data.choosetable;
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
      } else {
        this.$message.error(data.msg);
      }
    });
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    context(){
    console.log("当前各项值");
      console.log("this.timesign");
         console.log(this.timesign);
      console.log("this.timestart");
       console.log(this.timestart);
      console.log("this.timeend");
        console.log(this.timeend);
        console.log("this.roomsign");
      console.log(this.roomsign);
            console.log("this.bechosed");
      console.log(this.bechosed);

    },
    resetchose() {
  
      this.timesign = false;
      this.timestart = "";
      this.timeend = "";
      this.roomsign = "";
      this.bechosed = false;
    },
    reset() {
      console.log("重置时间");
      this.$router.go(0);
    },
    // 单元格的 style 的回调方法
    cellStyle({ row, column, rowIndex, columnIndex }) {
      //初始渲染已选择
      for (let i = 0; i < this.choosetable.length; i++) {
        let a = this.choosetable[i].chose.split("_");
        if (column.label == a[0] && rowIndex >= a[1] - 7&&rowIndex <= a[2] - 8) {
          return "border-radius: 15px;background-color:#909399;color:white;padding:0";
        }
      }

      //点击选择
      console.log(this.timestart);
      //console.log(rowIndex);
      if (columnIndex != 0&&this.timesign == true) {
        this.context();
        if (
          this.timeend != "" &&
          column.label == this.roomsign &&
          rowIndex >= this.timestart - 7 &&
          rowIndex <= this.timeend - 8 &&
          this.bechosed == true
        ) {
          console.log("进入if");
            this.context();
          return "border-radius: 15px;background-color:#409EFF;color:white;padding:0";
        }

        if (column.label == this.roomsign && rowIndex == this.timestart - 7) {
           console.log("进入else");
            this.context();
          return "border-radius: 15px;background-color:#409EFF;color:white;padding:0";
        }
      }
      if (columnIndex != 0)
        return "border-radius: 15px;background-color:rgb(0, 215, 193);padding:0";
    },
    clickhandle(row, column, event, cell) {
      let a = row.date.split("-");
          console.log("点击事件");
           console.log(this.timesign);
      if (this.timesign == false) {
        this.form.room = column.label;
        this.roomsign = column.label;
        this.form.date1 = a[0];
        this.timestart = a[0].split(":")[0];
         this.timeend ="";
        this.form.date2 = a[1];
        this.timesign = true;
this.context();
        // console.log(this.timestart);
      } else {
        if (this.form.room == column.label) {
          for (let i = 0; i < this.choosetable.length; i++) {
            let c = this.choosetable[i].chose.split("_");
            if (c[0] == column.label) {
              console.log(c[1]);
              console.log(this.timestart);
              console.log(this.timeend);
              if (c[1] > this.timestart && c[1] < a[0]) {
                this.$message.error("当前时间段已有被预约时间段");
                console.log("before"+i);
                  this.context();
                this.resetchose();
                console.log("after"+i);
                  this.context();
                break;
              }
            }
          }

          if (a[0].split(":")[0] <= this.timestart) {
              console.log"请选择正确的时间段");
            console.log(a[0].split(":")[0]);
            console.log(this.timestart);
            this.$message.error("请选择正确的时间段");
            this.resetchose();
          
          } else {
            this.form.date2 = a[1];
            this.timeend = a[1].split(":")[0];
            this.bechosed = true;
          }
        } else {
          this.$message.error("请选择同一会议室进行预约");
          this.resetchose();
        }
      }
      // console.log("行");

      // console.log("列");
      // console.log(column);
      // console.log();
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
      timestart: "",
      datasign: [],
      choosetable: {},
      timesign: false,
      timestart: "",
      timeend: "",
      roomsign: "",
      bechosed: false,
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