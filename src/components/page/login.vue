<template>
  <div id="login-wrap">
    <div class="ms-login" v-if="two">
     <div class="ms-title">图书管理平台</div>
     <el-form :model="loginParam" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
       <el-form-item prop="userName">
          <el-input v-model="loginParam.userName" placeholder="账号" prefix-icon="el-icon-user" />
       </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginParam.password" placeholder="密码" prefix-icon="el-icon-user" />
       </el-form-item>
       <div class="login-btn">
        <el-button type="primary" @click="submitLoginForm('loginForm')">登录</el-button>
       </div>
       <el-link type="primary" @click="two = false" style="text-align: center;">去注册 ></el-link>
      <!-- <el-link type="primary" @click="goFindPwd()" style="text-align:center;float:right">找回密码？</el-link> -->
     </el-form>
    </div>
    <div class="ms-login" v-else>
       <div class="ms-title">t图书管理平台</div>
      <el-form :model="registerParam" :rules="rules" ref="registerForm" label-width="0px" class="ms-content">
       <el-form-item prop="userName">
          <el-input v-model="registerParam.userName" placeholder="账号" prefix-icon="el-icon-user" />
       </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerParam.password" placeholder="密码" prefix-icon="el-icon-user" />
       </el-form-item>
       <el-form-item prop="name">
          <el-input v-model="registerParam.name" placeholder="用户名" prefix-icon="el-icon-user" />
       </el-form-item>
        <el-form-item prop="email">
          <el-input  v-model="registerParam.email" placeholder="邮箱" prefix-icon="el-icon-user" />
        </el-form-item>
         <el-form-item prop="phone">
          <el-input  v-model="registerParam.phone" placeholder="电话" prefix-icon="el-icon-user" />
        </el-form-item>

       <div class="login-btn">
        <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
       </div>
       <el-link type="primary" @click="two = true" style="text-align: center;">去登陆 ></el-link>
     </el-form>
    </div>
  </div>
</template>

<script>
import el from 'element-ui'
import axios from 'axios'
export default {
    name:'login',
    data  () {
       return {
           two:true,
           loginParam:{


           },
           registerParam:{
             res: {
                     userName: '',
                     name:'',
                     password: '',
                     email:'',
                     phone:''
                   }
           },
           rules:{
                userName: [{ required: true, message: '请输入账号', trigger: 'blur' },
                            { min: 2, max: 32, message: '请输入2-20位字符', trigger: 'blur'}],
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' },
                              { min: 6, max: 32, message: '请输入6-32位字符', trigger: 'blur'}],
                email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
                          { type: "email", message: '请输入正确电子邮件地址', trigger: 'blur'}],
                phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' },
                          { message: '请输入11位数字', trigger: 'blur'}],
           },
       }
    },
    create () {

    },
    methods : {
       submitLoginForm(formName) {
         this.$refs[formName].validate((valid)=>{
            if(valid){
              var url = '/api/user/login';
              this.$axios.post(url,JSON.stringify(this.loginParam)
              ).then(res =>{
                if(res.data.code ==='0'){
                    var roleId =res.data.result.roleId;
                    var userName = res.data.result.userName;
                    this.global.setRedisInformation(JSON.stringify(res.data.result))
                    this.$router.push({path:'/index'});
                }else{
                  this.$message.error(res.data.msg);
                   return false;
                }
              });
            }else {
               console.log("error submit!!");
               return false;
            }
            // this.$refs[formName].validate((valid)=>{
            //        if(valid){
            //          let _this = this;
            //         alert(this.loginParam.userName)
            //         this.$axios.post('/login',{
            //            userName: this.loginParam.userName,
            //            password:this.loginParam.password
            //          },{emulateJSON:true}).then(result =>{
            //            console.log(result);
            //            if(result.bodyText ==='index'){
            //              this.$router.push({path:'home'});
            //            }else{
            //              console.log("登录失败");
            //              return false;
            //            }
            //          });
            //        }else{
            //          this.$message.error('请根据提示输入必填项');
            //          return false;
            //        }
            //      });
          });
       },
       submitRegisterForm(formName) {
         this.$refs[formName].validate((valid)=>{
            if(valid){
              var url = '/api/user/register';
              this.$axios.post(url,JSON.stringify(this.registerParam)
              ).then(res =>{
                if(res.data.code ==='0'){
                   this.$message.success('注册成功');
                   this.loginParam.username = this.registerParam.username;
                   this.loginParam.password = this.registerParam.password;
                   this.two = true;
                }
              }).catch((error)=> {
                       var key = Object.keys(error.response.data.details)[0]
                         this.$message.error(error.response.data.details[key][0]);
                    });
              } else {
                 this.$message.error('请根据提示输入必填项');
                    return false;
              }
            });
          },
       goFindPwd(){
           alert("待开发！")
       }
    }

}
</script>

<style lang="less" scoped>

#login-wrap {
        background: url("../../assets/img/background.jpg") no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
 }

.ms-title {
     width: 100%;
     line-height: 50px;
    text-align: center;
     font-size: 20px;
     color: #2d333f;
     border-bottom: 1px solid #ddd;
}
.ms-login {
     position: absolute;
     left: 50%;
     top: 50%;
     width: 350px;
     margin: -190px 0 0 -175px;
     border-radius: 5px;
     background: rgba(255, 255, 255, 0.897);
     overflow: hidden;
}
.ms-content {
     padding: 30px 30px;
}
.login-btn {
     text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
 }

</style>
