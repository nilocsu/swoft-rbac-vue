<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.realName ? `你好 ${info.realName}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="profile">
        <d2-icon name="address-card-o" class="d2-mr-5" />
        个人中心
      </el-dropdown-item>
      <el-dropdown-item @click.native="dialogFormVisible = !dialogFormVisible">
        <d2-icon name="address-card-o" class="d2-mr-5" />
        密码修改
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
    <el-dialog title="密码修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        size="small"
        :rules="rules"
      >
        <el-form-item
          label="原密码"
          prop="oldPassword"
        >
          <el-input v-model="form.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
         >
          <el-input v-model="form.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input v-model="form.confirmPassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePassword" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import * as userService from '@/api/sys/user'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    const validatePassword = (rule, value, callback) => {
      if (this.form.confirmPassword) {
        if (!value) {
          callback(new Error('请确认您的密码'))
        } else if (!(value === this.form.confirmPassword)) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (value.length > 15 || value.length < 6) {
          callback(new Error('密码必须是6-15位数字和字母组合'))
        } else {
          callback()
        }
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (this.form.newPassword) {
        if (!value) {
          callback(new Error('请确认您的密码'))
        } else if (!(value === this.form.newPassword)) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('密码不能为空'))
        } else if (value.length > 15 || value.length < 6) {
          callback(new Error('密码必须是6-15位数字和字母组合'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogFormVisible: false,
      loading: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '不能为空' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePassword, trigger: ['blur', 'change'] }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        vm: this,
        confirm: true
      })
    },
    profile () {
      this.$router.push('/profile')
    },
    savePassword () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          userService
            .updatePassword({ ...this.form })
            .then(data => {
              this.loading = false
              this.dialogFormVisible = false
              this.$message({
                showClose: true,
                message: '密码修改成功',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
