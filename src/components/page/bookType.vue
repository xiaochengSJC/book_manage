<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>书籍分类管理</el-breadcrumb-item>
          <el-breadcrumb-item>书籍分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 搜索与添加区域 -->
          <el-row :gutter="20">
              <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getBookTypeList">
                  <el-button slot="append" icon="el-icon-search" @click="getBookTypeList"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
              </el-col>
          </el-row>
          <!-- 分类列表区域 -->
          <el-table :data="typeList" border stripe class="table">
             <el-table-column label="#" type="index"></el-table-column>
             <el-table-column label="分类名称" prop="typeName"></el-table-column>
             <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBookById(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="70px">
            <el-form-item label="分类名称" prop="typeName">
              <el-input v-model="addForm.typeName"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addBookType">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改分类的对话框 -->
        <el-dialog title="修改分类信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
           <el-form-item label="分类名称" prop="typeName">
             <el-input v-model="editForm.typeName"></el-input>
           </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editBookType">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name:'book_type',
  data () {

    return {
      // 获取分类列表的参数对象
      queryInfo: {
          query: '',
          // 当前的页数
          pageNum: 1,
          // 当前每页显示多少条数据
          pageSize: 10
      },
      typeList:[],
      total: 0,
      // 控制添加分类对话框的显示和隐藏
      addDialogVisible: false,
      // 添加分类的表单数据
      addForm: {
        typeName:''
      },
      // 添加表单的验证规则对象
      rules: {

      },
      // 控制修改分类对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的分类信息对象
      editForm: {},
    }
  },
  created() {
    this.getBookTypeList()
  },
  methods: {
     getBookTypeList() {
        var url = '/api/book/getBookType';
        this.$axios.post(url,{typeName: this.queryInfo.query,pageNum:this.queryInfo.pageNum,pageSize:this.queryInfo.pageSize }
        ).then(res =>{
          if(res.data.code ==='0'){
              this.typeList =res.data.result.list;
              this.total = res.data.result.total;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      // 页面显示的数据条数发生变化，需要重新渲染数据列表
      this.getBookTypeList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pageNum = newPage
      // 页面显示的数据条数发生变化，需要重新渲染数据列表
      this.getBookTypeList()
    },
    // 监听添加分类对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮，添加新分类
    addBookType() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // 验证通过，则可以发起添加分类的网络请求
        var url = '/api/book/addBookType';
        this.$axios.post(url,JSON.stringify(this.addForm)
        ).then(res =>{
          if(res.data.code ==='0'){
             this.$message.success('添加分类成功！')
             // 添加分类成功后隐藏对话框
             this.addDialogVisible = false
             // 添加分类后需要重新渲染分类列表
             this.typeName = '';
             this.getBookTypeList()
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
      })
    },
    // 展示编辑分类的对话框
    showEditDialog(id) {
      this.editDialogVisible = true
      console.log(id)
      var url = '/api/book/getBookTypeById'
      this.$axios.post(url,{id:id}
      ).then(res =>{
        if(res.data.code ==='0'){
          this.editForm = res.data.result;
        }else{
          this.$message.error(res.data.msg);
           return false;
        }
      });
    },
    // 监听修改分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改分类信息并提交
    editBookType() {
      this.$refs.editFormRef.validate(valid => {
       if (!valid) return
       // 验证通过，则可以发起添加分类的网络请求
       var url = '/api/book/editBookType';
       this.$axios.post(url,JSON.stringify(this.editForm)
       ).then(res =>{
         if(res.data.code ==='0'){
          // 关闭对话框
          this.editDialogVisible = false
          this.typeName = '';
          // 刷新数据列表
          this.getBookTypeList()
          // 提示修改成功
          this.$message.success(res.data.msg)
         }else{
           this.$message.error(res.data.msg);
            return false;
         }
        });
      })
    },
    // 根据id删除对应的分类信息
    removeBookById(id) {
      // 弹框询问分类是否删除数据
      var _seif = this;
      _seif.$confirm("此操作将永久删除该分类, 是否继续?","提示",{
             // iconClass: "el-icon-question",//自定义图标样式
               confirmButtonText: "确认",//确认按钮文字更换
                cancelButtonText: "取消",//取消按钮文字更换
                showClose: true,//是否显示右上角关闭按钮
                type: "warning",//提示类型  success/info/warning/error
            }).then((data) => {
             var url = '/api/book/deleteBookType'
              this.$axios.post(url,{id:id}
              ).then(res =>{
                if(res.data.code ==='0'){
                  this.$message.success(res.data.msg);
                  // 重新渲染列表
                    this.typeName = '';
                  this.getBookTypeList()
                }else{
                  _seif.$message.error(res.data.msg);
                   return false;
                }
              });
            })
            .catch(function (err) {
              //取消操作
              _seif.$message.error("已取消删除");
            });
    },
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    margin-top: 10px;

  }
  /deep/.el-select {
      display: block;
  }
  .table {
    margin-top: 10px;
     height: 400px;
  }
</style>
