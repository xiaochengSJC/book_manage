<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>修改密码</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 用户列表区域 -->
           <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
            <el-form-item label="原始密码">
              <el-input v-model="editForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="editForm.password1" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="editForm.password2" type="password"></el-input>
            </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <div>
                <el-button type="primary" @click="editPassword">确 定</el-button>
            </div>
        </el-card>
        <!-- 修改用户的对话框 -->
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加表单的验证规则对象
      rules: {
       password: [
         { required: true, message: '请输入原始密码', trigger: 'blur' },
         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
       ],
       password1: [
         { required: true, message: '请输入新密码', trigger: 'blur' },
         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
       ],
       password2: [
         { required: true, message: '请再次输入密码', trigger: 'blur' },
         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
       ],
      },
      // 查询到的用户信息对象
      editForm: {
        password:'',
        password1:'',
        password2:''
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
  // 修改密码并提交
  editPassword() {
    this.$refs.editFormRef.validate(valid => {
     if (!valid) return
     // 验证通过，则可以发起添加用户的网络请求
     if(this.editForm.password2 != this.editForm.password1){
         this.$message.error("两次输入的密码不一致，请重新输入！");
        return false;
     }
     if(this.editForm.password == this.editForm.password1){
         this.$message.error("输入的新密码与原始密码一样，请更换！");
        return false;
     }
     var url = '/api/users/updatePassword';
     this.$axios.post(url,JSON.stringify(this.editForm)
     ).then(res =>{
       if(res.data.code ==='0'){
        // 提示修改成功
        this.$message.success(res.data.msg+",请重新登录！")
        window.sessionStorage.clear()
        // 重定向到登录页面
        this.$router.push('/')
       }else{
         this.$message.error(res.data.msg);
          return false;
       }
      });
    })
   }
  }
}
</script>

<style lang="less" scoped>
</style>
