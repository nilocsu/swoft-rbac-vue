<template>
  <el-dialog title="角色信息" :visible.sync="dialogVisible" @opened="dialogOpen" @closed="dialogClose">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item prop="name" label="角色名称" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="perms" label="角色标识" :rules="[{ required: true, message: '不能为空'}]">
        <el-input v-model="form.perms"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="saveRole">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import * as roleService from '@/api/sys/role'
export default {
  name: 'roleEditForm',
  props: {
    role: Object,
    value: Boolean
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        name: '',
        perms: '',
        remark: ''
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    dialogOpen () {
      this.$refs.form.resetFields()
      if (this.role.id) {
        roleService.getRole(this.role.id).then(data => {
          let form = {}
          form.name = data.name
          form.perms = data.perms
          form.remark = data.remark
          this.form = form
        })
      } else {
        this.form = {}
      }
    },
    saveRole () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.role.id) {
            roleService
              .saveRole(this.role.id, this.form)
              .then(data => {
                this.$emit('submit')
                this.loading = false
                this.dialogVisible = false
              })
          } else {
            roleService
              .addRole({ ...this.form })
              .then(data => {
                this.loading = false
                this.dialogVisible = false
                this.$emit('submit')
              })
          }
        } else {
          return false
        }
      })
    },
    close () {
      this.dialogClose()
    },
    dialogClose () {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
