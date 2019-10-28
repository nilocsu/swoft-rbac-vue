<template>
  <el-dialog
    title="用户信息"
    :visible.sync="dialogVisible"
    @opened="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      size="small"
    >
      <el-form-item
        prop="username"
        label="账号"
        :rules="[{ required: true, message: '不能为空'}]"
      >
      <template>
        <div v-if="user.id">
          <el-input
            v-model="form.username"
            :disabled="true"
            v-hasPermission="['user:add']"
          ></el-input>
          <el-input
            v-model="form.username"
            :disabled="true"
            v-hasNoPermission="['user:add']"
          ></el-input>
        </div>
        <div v-else>
          <el-input
            v-model="form.username"
            v-hasPermission="['user:add']"
          ></el-input>
        </div>
      </template>
      </el-form-item>
      <el-form-item
        prop="realName"
        label="用户名称"
        :rules="[{ required: true, message: '不能为空'}]"
      >
        <el-input v-model="form.realName"></el-input>
      </el-form-item>
      <template>
      <el-form-item
        prop="password"
        label="密码"
        v-if="!user.id"
        :rules="[{ required: true, message: '不能为空'}]"
         v-hasPermission="['user:add']"
      >
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      </template>
      <el-form-item
        prop="description"
        label="说明"
      >
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="邮箱"
      >
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item
        prop="mobile"
        label="电话号码"
      >
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item
        prop="sex"
        label="性别"
      >
      <el-select v-model="form.sex" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item
        prop="sex"
        label="状态"
      >
      <el-switch
        v-model="form.status"
        active-text="有效"
        inactive-text="锁定"
        active-value="1"
        inactive-value="0">
      </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="saveUser"
        >保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</template>
<script>
import * as userService from '@/api/sys/user'
export default {
  name: 'userEditForm',
  props: {
    user: Object,
    value: Boolean
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      form: {
        username: '',
        realName: '',
        deptId: 0,
        email: '',
        mobile: '',
        status: '0',
        sex: '2',
        description: ''
      },
      options: [
        {
          value: '0',
          label: '男'
        },
        {
          value: '1',
          label: '女'
        },
        {
          value: '2',
          label: '保密'
        }
      ]
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
      if (this.user.id) {
        userService.getUser(this.user.id).then(data => {
          let form = {
            username: data.username,
            realName: data.realName,
            deptId: data.deptId,
            email: data.email,
            mobile: data.mobile,
            status: data.status,
            sex: data.sex,
            description: data.description
          }
          this.form = form
        })
      } else {
        this.form = {}
      }
    },
    saveUser () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.user.id) {
            userService
              .updateUser(this.user.id, { ...this.form })
              .then(data => {
                this.loading = false
                this.dialogVisible = false
                this.$emit('submit')
              })
          } else {
            userService
              .addUser({ ...this.form })
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
      this.$refs['form'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
