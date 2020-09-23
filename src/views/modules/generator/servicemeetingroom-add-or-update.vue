<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="会议室" prop="roomName">
      <el-input v-model="dataForm.roomName" placeholder="会议室"></el-input>
    </el-form-item>
    <el-form-item label="会议室地点" prop="location">
      <el-input v-model="dataForm.location" placeholder="会议室地点"></el-input>
    </el-form-item>
    <el-form-item label="状态（0:无设备，1:麦克风，2:投影仪，3:都有）" prop="equipment">
      <el-input v-model="dataForm.equipment" placeholder="状态（0:无设备，1:麦克风，2:投影仪，3:都有）"></el-input>
    </el-form-item>
    <el-form-item label="容纳人数" prop="capacity">
      <el-input v-model="dataForm.capacity" placeholder="容纳人数"></el-input>
    </el-form-item>
    <el-form-item label="所属校区" prop="roomArea">
      <el-input v-model="dataForm.roomArea" placeholder="所属校区"></el-input>
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
          roomId: 0,
          roomName: '',
          location: '',
          equipment: '',
          capacity: '',
          roomArea: ''
        },
        dataRule: {
          roomName: [
            { required: true, message: '会议室不能为空', trigger: 'blur' }
          ],
          location: [
            { required: true, message: '会议室地点不能为空', trigger: 'blur' }
          ],
          equipment: [
            { required: true, message: '状态（0:无设备，1:麦克风，2:投影仪，3:都有）不能为空', trigger: 'blur' }
          ],
          capacity: [
            { required: true, message: '容纳人数不能为空', trigger: 'blur' }
          ],
          roomArea: [
            { required: true, message: '所属校区不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.roomId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.roomId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/servicemeetingroom/info/${this.dataForm.roomId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roomName = data.serviceMeetingRoom.roomName
                this.dataForm.location = data.serviceMeetingRoom.location
                this.dataForm.equipment = data.serviceMeetingRoom.equipment
                this.dataForm.capacity = data.serviceMeetingRoom.capacity
                this.dataForm.roomArea = data.serviceMeetingRoom.roomArea
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
              url: this.$http.adornUrl(`/generator/servicemeetingroom/${!this.dataForm.roomId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roomId': this.dataForm.roomId || undefined,
                'roomName': this.dataForm.roomName,
                'location': this.dataForm.location,
                'equipment': this.dataForm.equipment,
                'capacity': this.dataForm.capacity,
                'roomArea': this.dataForm.roomArea
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
