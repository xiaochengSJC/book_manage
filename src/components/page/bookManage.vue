<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
          <el-breadcrumb-item>书籍信息</el-breadcrumb-item>
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
                    <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"   :disabled="item.disabled">
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
          <div style="text-align: right;">
             <el-button type="primary" @click="addDialogVisible = true" >添加书籍</el-button>
          </div>

          <!-- 书籍列表区域 -->
          <el-table :data="BookList" border stripe class="table">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="书号" prop="card"></el-table-column>
            <el-table-column label="书名" prop="bookName"></el-table-column>
            <el-table-column label="分类" prop="typeId"></el-table-column>
            <el-table-column label="作者" prop="authName"></el-table-column>
            <el-table-column label="出版社" prop="press"></el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
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
          :current-page="pageNum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        </el-card>
        <!-- 添加书籍的对话框 -->
        <el-dialog title="添加书籍" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="70px">
            <el-form-item label="书号" prop="card">
              <el-input v-model="addForm.card"></el-input>
            </el-form-item>
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="addForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="typeId">
              <el-select v-model="addForm.typeId" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"       :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作者" prop="authName">
              <el-input v-model="addForm.authName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="addForm.description"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="press">
              <el-input v-model="addForm.press"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="bookPic">
              <el-input v-model="addForm.bookPic"></el-input>
              <el-upload
                  class="upload-facepic"
                  action="#"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :multiple="false"
                  ref="upload"
                  :http-request="uploadFile"
                  :limit="1"
                  :auto-upload="true"
                  :on-change="handleChange"
                  :on-success="handleSuccess"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
               </el-upload>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addBook">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改书籍的对话框 -->
        <el-dialog title="修改书籍信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
           <el-form-item label="书号" prop="card">
             <el-input v-model="editForm.card"></el-input>
           </el-form-item>
           <el-form-item label="书名" prop="bookName">
             <el-input v-model="editForm.bookName"></el-input>
           </el-form-item>
           <el-form-item label="分类" prop="typeId">
             <el-select v-model="editForm.typeId" placeholder="请选择">
               <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"       :disabled="item.disabled">
               </el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="作者" prop="authName">
             <el-input v-model="editForm.authName"></el-input>
           </el-form-item>
           <el-form-item label="描述" prop="description">
             <el-input v-model="editForm.description"></el-input>
           </el-form-item>
           <el-form-item label="出版社" prop="press">
             <el-input v-model="editForm.press"></el-input>
           </el-form-item>
           <el-form-item label="封面" prop="bookPic">
             <el-input v-model="editForm.bookPic"></el-input>
             <el-upload
                 class="upload-facepic"
                 action="#"
                 :on-preview="handlePreview"
                 :on-remove="handleRemove"
                 :before-remove="beforeRemove"
                 :multiple="false"
                 ref="upload"
                 :http-request="uploadFile1"
                 :limit="1"
                 :auto-upload="true"
                 :on-change="edithandleChange"
                 :on-success="handleSuccess"
                 :on-exceed="handleExceed"
                 :file-list="fileList">
                 <el-button size="small" type="primary">点击上传</el-button>
             <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过500kb</div>
              </el-upload>

           </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editBookInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name:'book_manage',
  data () {

    return {
      // 获取书籍列表的参数对象
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
      BookList: [],
      fileList:[],
      total: 0,
      // 控制添加书籍对话框的显示和隐藏
      addDialogVisible: false,
      // 添加书籍的表单数据
      addForm: {
        card:'',
        bookName: '',
        typeId:'',
        authName: '',
        press: '',
        bookPic:'',
        description:''
      },
      // 添加表单的验证规则对象
      rules: {

      },
      // 控制修改书籍对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的书籍信息对象
      editForm: {},
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
              console.log(res.data.result);
              this.BookList =res.data.result.list;
              this.total = res.data.result.total;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    getBookTypeList() {
        var url = '/api/book/getBookType';

        this.$axios.post(url,{}
        ).then(res =>{
          if(res.data.code ==='0'){
              console.log(res.data.result.list)
              this.options =res.data.result.list;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    resetForm(){
       this.queryInfo = {}
    },
    handlePreview(){

    },
    handleRemove(file,fileList) {

    },
    beforeRemove() {

    },
    handleChange (file,fileList) {
      this.fileList.push(file)
    },
    handleSuccess() {

    },
    handleExceed () {

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
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    handleChange:function (file, fileList) {
        this.addForm.bookPic = file.name;
    },
    edithandleChange:function(file, fileList){
        this.editForm.bookPic = file.name;
    },
    uploadFile(param){
       let _self = this;
       let file = param.file;
       let formData = new FormData();

       //formData.append("card",JSON.stringify(this.addForm.card));
       formData.append("typeId",JSON.stringify(this.addForm.typeId));
       formData.append("file",file);
       let url = '/api/book/uploadFile';
       let config = {
                 headers:{'Content-Type':'multipart/form-data'} //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
               };
       this.$axios.post(url,formData,config
       ).then(res =>{
         if(res.data.code ==='0'){
            this.$message({
              message:'文件上传成功',
              type:'success'
            })
         }else{
           this.$message.error(res.data.msg);
            return false;
         }
       });
    },
    uploadFile1(param){
       let _self = this;
       let file = param.file;
       let formData = new FormData();
       formData.append("typeId",JSON.stringify(this.editForm.typeId));
       formData.append("file",file);
       let url = '/api/book/uploadFile';
       let config = {
                 headers:{'Content-Type':'multipart/form-data'} //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
               };
       this.$axios.post(url,formData,config
       ).then(res =>{
         if(res.data.code ==='0'){
            this.$message({
              message:'文件上传成功',
              type:'success'
            })
            this.src = res.data.result;
         }else{
           this.$message.error(res.data.msg);
            return false;
         }
       });
    },
    // 点击确定按钮，添加新书籍
    addBook() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        // 验证通过，则可以发起添加书籍的网络请求
        var url = '/api/book/addBookInfo';
        this.$axios.post(url,JSON.stringify(this.addForm)
        ).then(res =>{
          if(res.data.code ==='0'){
             this.$message.success('添加书籍成功！')
             // 添加书籍成功后隐藏对话框
             this.addDialogVisible = false
             // 添加书籍后需要重新渲染书籍列表
             this.getBookList()
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
      })
    },
    // 展示编辑书籍的对话框
    showEditDialog(id) {
      this.editDialogVisible = true
      console.log(id)
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
    },
    // 监听修改书籍对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改书籍信息并提交
    editBookInfo() {
      this.$refs.editFormRef.validate(valid => {
       if (!valid) return
       // 验证通过，则可以发起添加书籍的网络请求
       var url = '/api/book/editBookInfo';
       this.$axios.post(url,JSON.stringify(this.editForm)
       ).then(res =>{
         if(res.data.code ==='0'){
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getBookList()
          // 提示修改成功
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
  .table {
    margin-top: 10px;
     height: 400px;
  }
</style>
