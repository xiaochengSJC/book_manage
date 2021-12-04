<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>信息列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 用户列表区域 -->
          <el-table :data="userList" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="账号" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="phone"></el-table-column>
           <!-- <el-table-column label="角色" prop="role_name"></el-table-column> -->
           <!-- <el-table-column label="状态">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
              <!--  <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                </el-switch>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
          <el-form-item label="账号">
            <el-input v-model="editForm.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="editForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/
      if(regMobile.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb (new Error('请输入合法的手机号'))
    }
    return {
      userInfo:JSON.parse(this.global.getRedisInformation()),

      // 获取用户列表的参数对象
      userList: [],
      // 添加表单的验证规则对象
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
     getUserList() {
       var url = '/api/users/getUserInfo';
       console.log(this.userInfo)
         this.$axios.post(url,{userName:this.userInfo.userName,roleId:this.userInfo.roleId}
        ).then(res =>{
          if(res.data.code ==='0'){
              this.userList =res.data.result.list;
              this.total = res.data.result.total;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
  // 展示编辑用户的对话框
  showEditDialog(id) {
    this.editDialogVisible = true
    console.log(id)
    var url = '/api/users/getUserInfoById'
    this.$axios.post(url,{id:id}
    ).then(res =>{
      if(res.data.code ==='0'){
        this.editForm = res.data.result
      }else{
        this.$message.error(res.data.msg);
         return false;
      }
    });
  },
  // 监听修改用户对话框的关闭事件
  editDialogClosed() {
    this.$refs.editFormRef.resetFields()
  },
  // 修改用户信息并提交
  editUserInfo() {
    this.$refs.editFormRef.validate(valid => {
     if (!valid) return
     // 验证通过，则可以发起添加用户的网络请求
     var url = '/api/users/editUserInfo';
     this.$axios.post(url,JSON.stringify(this.editForm)
     ).then(res =>{
       if(res.data.code ==='0'){
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success(res.data.msg)
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
