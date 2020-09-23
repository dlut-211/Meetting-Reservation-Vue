<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="使用单位（例:软件学院）" prop="department">
      <el-input v-model="dataForm.department" placeholder="使用单位（例:软件学院）"></el-input>
    </el-form-item>
    <el-form-item label="会议室预约人" prop="roomUser">
      <el-input v-model="dataForm.roomUser" placeholder="会议室预约人"></el-input>
    </el-form-item>
    <el-form-item label="会议室名称" prop="roomName">
      <el-input v-model="dataForm.roomName" placeholder="会议室名称"></el-input>
    </el-form-item>
    <el-form-item label="会议开始时间" prop="startTime">
      <el-input v-model="dataForm.startTime" placeholder="会议开始时间"></el-input>
    </el-form-item>
    <el-form-item label="会议结束时间" prop="endTime">
      <el-input v-model="dataForm.endTime" placeholder="会议结束时间"></el-input>
    </el-form-item>
    <el-form-item label="参数人数" prop="headCount">
      <el-input v-model="dataForm.headCount" placeholder="参数人数"></el-input>
    </el-form-item>
    <el-form-item label="参会领导" prop="leader">
      <el-input v-model="dataForm.leader" placeholder="参会领导"></el-input>
    </el-form-item>
    <el-form-item label="会议主题" prop="meetingTheme">
      <el-input v-model="dataForm.meetingTheme" placeholder="会议主题"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="预约状态（0:审核中 1，通过，2：未通过，3:已取消）" prop="status">
      <el-input v-model="dataForm.status" placeholder="预约状态（0:审核中 1，通过，2：未通过，3:已取消）"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          orderId: 0,
          department: '',
          roomUser: '',
          roomName: '',
          startTime: '',
          endTime: '',
          headCount: '',
          leader: '',
          meetingTheme: '',
          remark: '',
          status: ''
        },
        dataRule: {
          department: [
            { required: true, message: '使用单位（例:软件学院）不能为空', trigger: 'blur' }
          ],
          roomUser: [
            { required: true, message: '会议室预约人不能为空', trigger: 'blur' }
          ],
          roomName: [
            { required: true, message: '会议室名称不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '会议开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '会议结束时间不能为空', trigger: 'blur' }
          ],
          headCount: [
            { required: true, message: '参数人数不能为空', trigger: 'blur' }
          ],
          leader: [
            { required: true, message: '参会领导不能为空', trigger: 'blur' }
          ],
          meetingTheme: [
            { required: true, message: '会议主题不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '预约状态（0:审核中 1，通过，2：未通过，3:已取消）不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.orderId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/servicemeeting/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.department = data.serviceMeeting.department
                this.dataForm.roomUser = data.serviceMeeting.roomUser
                this.dataForm.roomName = data.serviceMeeting.roomName
                this.dataForm.startTime = data.serviceMeeting.startTime
                this.dataForm.endTime = data.serviceMeeting.endTime
                this.dataForm.headCount = data.serviceMeeting.headCount
                this.dataForm.leader = data.serviceMeeting.leader
                this.dataForm.meetingTheme = data.serviceMeeting.meetingTheme
                this.dataForm.remark = data.serviceMeeting.remark
                this.dataForm.status = data.serviceMeeting.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/servicemeeting/${!this.dataForm.orderId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.dataForm.orderId || undefined,
                'department': this.dataForm.department,
                'roomUser': this.dataForm.roomUser,
                'roomName': this.dataForm.roomName,
                'startTime': this.dataForm.startTime,
                'endTime': this.dataForm.endTime,
                'headCount': this.dataForm.headCount,
                'leader': this.dataForm.leader,
                'meetingTheme': this.dataForm.meetingTheme,
                'remark': this.dataForm.remark,
                'status': this.dataForm.status
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
