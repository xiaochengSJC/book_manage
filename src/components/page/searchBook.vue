<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>书籍查询</el-breadcrumb-item>
          <el-breadcrumb-item>查询书籍</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 搜索与添加区域 -->
          <el-form ref="queryInfo" label-position="right" :model="queryInfo" label-width="100px">
             <el-row>
               <el-col :span="8">
                 <!-- <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getBookTypeList">
                   <el-button slot="append" icon="el-icon-search" @click="getBookTypeList"></el-button>
                 </el-input> -->
                 <el-form-item label="书号" prop="card">
                   <el-input placeholder="请输入书名" v-model="queryInfo.card" />
                 </el-form-item>
               </el-col>
               <el-col :span="8">
                   <el-form-item label="书名" prop="bookName">
                     <el-input placeholder="请输入书名" v-model="queryInfo.bookName" />
                 </el-form-item>
               </el-col>
               <el-col :span="8">
                   <el-form-item label="作者" prop="authName">
                     <el-input placeholder="请输入出版社" v-model="queryInfo.authName" />
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row>
               <el-col :span="8">
                 <!-- <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getBookTypeList">
                   <el-button slot="append" icon="el-icon-search" @click="getBookTypeList"></el-button>
                 </el-input> -->
                 <el-form-item label="分类" prop="typeId">
                  <el-select v-model="queryInfo.typeId" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id">
                    </el-option>
                  </el-select>
                 </el-form-item>
               </el-col>
               <el-col :span="8">
                   <el-form-item label="出版社" prop="press">
                     <el-input placeholder="请输入出版社" v-model="queryInfo.press" />
                 </el-form-item>
               </el-col>
             </el-row>
          </el-form>
          <div style="text-align: center;">
             <el-button type="primary" @click="getBookList()" >查询</el-button>
             <el-button type="primary" @click="resetForm()" >重置</el-button>
          </div>

          <!-- 书籍列表区域 -->
          <el-table :data="bookList" border stripe class="table">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="书号" prop="card">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="text" size="small" @click="showBookInfo(scope.row.id)">{{scope.row.card}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="书名" prop="bookName"></el-table-column>
            <el-table-column label="分类" prop="typeId"></el-table-column>
            <el-table-column label="作者" prop="authName"></el-table-column>
            <el-table-column label="出版社" prop="press"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope" >
                <!-- 修改按钮 -->
                <el-button type="primary"  size="mini" @click="showEditDialog(scope.row.id,scope.row.status)">借阅</el-button>
                 <!-- <el-button type="primary"  size="mini" @click="showBackDialog(scope.row.id,scope.row.status)">归还</el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
        <!-- 查看书籍详情 -->
        <el-dialog title="书籍详情" :visible.sync="viewDialogVisible" width="50%" @close="viewDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="viewForm" ref="viewFormRef" label-width="100px">
           <el-form-item label="封面" prop="bookPic">
             <img :src="src" width="300px" height="150px" />
           </el-form-item>
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="viewForm.bookName" readonly></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="authName">
              <el-input v-model="viewForm.authName" readonly></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="viewForm.description" readonly></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="press">
              <el-input v-model="viewForm.press" readonly></el-input>
            </el-form-item>
        </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="viewDialogVisible = false">返 回</el-button>
          </span>
        </el-dialog>
        <!-- 借书页面 -->
        <el-dialog title="借书" :visible.sync="borrowDialogVisible" width="50%" @close="borrowDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" ref="editFormRef" label-width="100px">
           <el-form-item label="书号" prop="card">
             <el-input v-model="editForm.card" readonly></el-input>
           </el-form-item>
           <el-form-item label="书名" prop="bookName">
             <el-input v-model="editForm.bookName" readonly></el-input>
           </el-form-item>
           <el-form-item label="分类" prop="typeId">
            <el-select v-model="editForm.typeId" placeholder="请选择"  disabled>
              <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
           </el-form-item>
           <el-form-item label="计划还书日期" prop="backTime">
            <el-date-picker
                v-model="editForm.backTime"
                type="date"
                value-format=yyyy-MM-dd
                placeholder="选择日期">
              </el-date-picker>
           </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="borrowDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="borrowBook">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name:'search_record',
  data () {

    return {
      // 获取书籍列表的参数对象
      userInfo : this.$root.userInfo,
      queryInfo: {
          card: '',
          bookName:'',
          authName:'',
          typeId:'',
          press:''
      },
      src:'',
       // 当前的页数
      pageNum: 1,
      // 当前每页显示多少条数据
      pageSize: 10,
      options:[],
      fileList:[],
      bookList:[],
      total: 0,
      // 控制添加书籍对话框的显示和隐藏
      viewDialogVisible: false,
      // 添加书籍的表单数据
      viewForm: {},
      // 控制修改书籍对话框的显示和隐藏
      borrowDialogVisible: false,
      // 查询到的书籍信息对象
      editForm: {

      },
    }
  },
  created() {
    this.getBookList()
    this.getBookTypeList()
  },
  methods: {
     getBookList() {
        var url = '/api/book/getBookInfo';
        this.$axios.post(url,{
            typeId: this.queryInfo.typeId,
            bookName: this.queryInfo.bookName,
            card: this.queryInfo.card,
            authName:this.queryInfo.authName,
            press:this.queryInfo.press,
            pageNum:this.pageNum,
            pageSize:this.pageSize ,
        }).then(res =>{
          if(res.data.code ==='0'){
              this.bookList =res.data.result.list;
              this.total = res.data.result.total;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    getBookTypeList() {
        var url = '/api/book/getBookType';
        this.$axios.post(url,{typeName: this.queryInfo.query,pageNum:this.queryInfo.pageNum,pageSize:this.queryInfo.pageSize }
        ).then(res =>{
          if(res.data.code ==='0'){
              this.options =res.data.result.list;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pageSize = newSize
      // 页面显示的数据条数发生变化，需要重新渲染数据列表
      this.getBookList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
      // 页面显示的数据条数发生变化，需要重新渲染数据列表
      this.getBookList()
    },
    // 监听添加书籍对话框的关闭事件
    viewDialogClosed() {
      this.$refs.viewFormRef.resetFields()
    },
    // 点击查看详情
    showBookInfo(bookId) {
      this.viewDialogVisible = true;
      var url = '/api/book/getBookInfoById';
      this.$axios.post(url,{id:bookId}).then(res =>{
        if(res.data.code ==='0'){
            console.log(res.data.result);
            this.viewForm =res.data.result;
             this.$axios.post('/api/book/showImg',{typeId:this.viewForm.typeId,fileName:this.viewForm.bookPic}, {responseType:'blob'}).then(response =>{
                 console.log(response)
                 let blob = new Blob([response.data]);   // 返回的文件流数据
                 let url = window.URL.createObjectURL(blob);  // 将他转化为路径
                 this.src = url
              })
        }else{
          this.$message.error(res.data.msg);
           return false;
        }
      });
    },
    // 显示借书操作的对话框
    showEditDialog(id,status) {
      if(status=='已借出'){
        this.$message.error("已借出，请选择其他书籍！");
         return false;
      }else{
        this.borrowDialogVisible = true
        var url = '/api/book/getBookInfoById'
        this.$axios.post(url,{id:id}
        ).then(res =>{
          if(res.data.code ==='0'){
            this.editForm = res.data.result
            this.editForm.typeId = Number(this.editForm.typeId)
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
      }
    },
    // 监听修改书籍对话框的关闭事件
    borrowDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 借书页面
    borrowBook() {
      this.$refs.editFormRef.validate(valid => {
       if (!valid) return
       // 验证通过，则可以发起添加书籍的网络请求
       var url = '/api/borrow/borrowBook';
       console.log(this.userInfo.id)
       this.editForm.userId = this.userInfo.id
       this.$axios.post(url,JSON.stringify(this.editForm)
       ).then(res =>{
         if(res.data.code ==='0'){
          // 关闭对话框
          this.borrowDialogVisible = false
          // 刷新数据列表
          this.getBookList()
          // 提示借书成功
          this.$message.success(res.data.msg)
         }else{
           this.$message.error(res.data.msg);
            return false;
         }
        });
      })
    },
    // 根据id删除对应的书籍信息
    removeBookById(id) {
      // 弹框询问书籍是否删除数据
      this.$confirm("此操作将永久删除该书籍, 是否继续?","提示",{
             // iconClass: "el-icon-question",//自定义图标样式
               confirmButtonText: "确认",//确认按钮文字更换
                cancelButtonText: "取消",//取消按钮文字更换
                showClose: true,//是否显示右上角关闭按钮
                type: "warning",//提示类型  success/info/warning/error
            }).then((data) => {
             var url = '/api/book/deleteBookInfo'
              this.$axios.post(url,{id:id}
              ).then(res =>{
                if(res.data.code ==='0'){
                  this.$message.success(res.data.msg);
                  // 重新渲染列表
                  this.getBookList()
                }else{
                  this.$message.error(res.data.msg);
                   return false;
                }
              });
            })
            .catch(function (err) {
              //取消操作
              this.$message.error("已取消删除");
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
  /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 620px;
}
  .table {
    margin-top: 10px;
     height: 400px;
  }
</style>
