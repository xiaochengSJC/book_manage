<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>借阅记录</el-breadcrumb-item>
          <el-breadcrumb-item>记录查询</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
          <!-- 搜索与添加区域 -->
          <el-form ref="queryInfo" label-position="right" :model="queryInfo" label-width="100px">
             <el-row>
               <el-col :span="8">
                   <el-form-item label="书名" prop="bookName">
                     <el-input placeholder="请输入书名" v-model="queryInfo.bookName" />
                 </el-form-item>
               </el-col>
               <el-col :span="8">
                 <el-form-item label="分类" prop="typeId">
                  <el-select v-model="queryInfo.typeId" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id">
                    </el-option>
                  </el-select>
                 </el-form-item>
               </el-col>
               <el-col :span="8">
                   <el-form-item label="借阅日期" prop="borrowTime">
                    <el-date-picker
                        v-model="queryInfo.borrowTime"
                        type="date"
                         value-format=yyyy-MM-dd
                        placeholder="选择日期">
                      </el-date-picker>
                 </el-form-item>
               </el-col>
             </el-row>
          </el-form>
          <div style="text-align: center;">
             <el-button type="primary" @click="getRecordList()" >查询</el-button>
             <el-button type="primary" @click="resetForm('queryInfo')" >重置</el-button>
          </div>

          <!-- 书籍列表区域 -->
          <el-table :data="recordList" border stripe class="table">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="书名" prop="bookName"></el-table-column>
            <el-table-column label="借阅人" prop="userName"></el-table-column>
            <el-table-column label="借阅日期" prop="borrowTime"></el-table-column>
            <el-table-column label="计划归还日期" prop="backTime"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope" >
                  <!-- 归还按钮-->
                 <el-button type="primary"  size="mini" @click="showBackDialog(scope.row)">归还</el-button>
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
        <el-dialog title="归还" :visible.sync="backDialogVisible" width="50%" @close="backDialogClosed">
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
             <el-input v-model="editForm.backTime" readonly></el-input>
           </el-form-item>
           <el-form-item label="还书日期" prop="realTime">
            <el-date-picker
                v-model="editForm.realTime"
                type="date"
                value-format=yyyy-MM-dd
                placeholder="选择日期">
              </el-date-picker>
           </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="backDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="backBook">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name:'borrow_search',
  data () {

    return {
      // 获取书籍列表的参数对象
      userInfo : JSON.parse(this.global.getRedisInformation()),
      queryInfo : {
          bookName: '',
          typeId:'',
          borrowTime:''
      },
      editForm:{},
       // 当前的页数
      pageNum: 1,
      // 当前每页显示多少条数据
      pageSize: 10,
      backDialogVisible:false,
      options:[],
      recordList:[],
      total: 0,
    }
  },
  created() {
    this.getRecordList()
    this.getBookTypeList()
  },
  methods: {
    resetForm(formName){
       this.$refs[formName].resetFields()
    },
     getRecordList() {
        var url = '/api/borrow/getBorrowList';
        this.$axios.post(url,{
            typeId: this.queryInfo.typeId,
            bookName: this.queryInfo.bookName,
            userName: this.userInfo.userName,
            borrowTime:this.queryInfo.borrowTime,
            pageNum:this.pageNum,
            pageSize:this.pageSize ,
        }).then(res =>{
          if(res.data.code ==='0'){
              this.recordList =res.data.result.list;
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
      this.getRecordList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.pageNum = newPage
      // 页面显示的数据条数发生变化，需要重新渲染数据列表
      this.getRecordList()
    },
    showBackDialog(record){
        this.backDialogVisible = true
        var url = '/api/borrow/showBorrow';
        this.$axios.post(url,{id:record.id}
        ).then(res =>{
          if(res.data.code ==='0'){
              this.editForm =res.data.result;
              console.log(res.data.result)
              this.editForm.card = record.card;
              this.editForm.bookName = record.bookName;
              this.editForm.typeId = record.typeId;
          }else{
            this.$message.error(res.data.msg);
             return false;
          }
        });
    },
    backDialogClosed(){
       this.$refs.editFormRef.resetFields()
    },
    backBook(){
      this.$refs.editFormRef.validate(valid => {
       if (!valid) return
       // 验证通过，则可以发起添加书籍的网络请求
       var url = '/api/borrow/backBook';
       this.$axios.post(url,JSON.stringify(this.editForm)
       ).then(res =>{
         if(res.data.code ==='0'){
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getRecordList()
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
  .box-card {
    margin-top: 10px;

  }
  /deep/.el-select {
      display: block;
  }
  /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
}
  .table {
    margin-top: 10px;
     height: 400px;
  }
</style>
