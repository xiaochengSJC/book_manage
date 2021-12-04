<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/logo.jpg" widhth="100px" height="60px"  />
        <span>图书管理系统</span>
      </div>

      <el-button type="info" plain @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
                 unique-opened :collapse="isCollapse" :collapse-transition="false"
                 :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
         <el-menu-item :index="'/main'" @click="saveNavState('/main')">
            <i class="el-icon-s-home"></i>
            <span slot="title">主页</span>
         </el-menu-item>
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.menuName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.menuPath" v-for="subItem in item.list"
                          :key="subItem.id" @click="saveNavState('/' + subItem.menuPath)">
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import el from 'element-ui'
import axios from 'axios'
export default {
  name:'index',
  data() {
    return {
      roleId : JSON.parse(this.global.getRedisInformation()).roleId,
      // 左侧菜单数据
      menuList:[],
     iconsObj: {
            125: 'el-icon-user-solid',
            103: 'iconfont icon-tijikongjian',
            101: 'iconfont icon-shangpin',
            102: 'iconfont icon-danju',
            145: 'iconfont icon-baobiao'
          },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 生命周期函数：整个页面刚一加载的时候就立即获取左侧菜单
    this.getMenuList()
    // 整个Home组件一被创建的时候，立即从sessionStorage中把activePath取出来
    this.activePath = window.sessionStorage.getItem('activePath')

  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/')
    },
    // 获取所有的菜单
    getMenuList() {
      // 通过解构赋值将异步获取的结果赋值给res
      var url = '/api/user/getMenu';
      var param = {roleId:this.roleId}
      this.$axios.post(url,param
      ).then(res =>{
        if(res.data.code ==='0'){
           this.menuList = res.data.result;
        }
      }).catch((error)=> {
               var key = Object.keys(error.response.data.details)[0]
                 this.$message.error(error.response.data.details[key][0]);
            });

    },
   // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  /* 使内容区域占满全屏 */
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  /* 使退出按钮的高度不与header对齐，而是居中显示 */
  align-items: center;
  color: #fff;
  font-size: 20px;
  /* 使文字居中对齐，注意，这里就不能使用line-height了，
     因为是弹性布局，高度都是按百分比设定的，并没有固定的高度 */
  /* 给左侧的div再加一个嵌套 */
  > div {
    display: flex;
    /* 纵向上居中对齐 */
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
