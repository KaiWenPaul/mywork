<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item style="width:5%;">
            <el-button class="filter-item" style="margin-left: 10px;" @click="showAddDialog" type="primary" icon="edit">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="roleDatas" highlight-current-row border v-loading="listLoading"
                style="width: 100%;">
        <el-table-column v-for="list in fieldsDatas" :prop="list.field_name" :label="list.field_desc" :key="list.field_desc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-col>
       <!-- 编辑页面-->
      <el-col>
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="名称" prop="role_name">
            <el-input v-model="editForm.role_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="addForm.role_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  export default{
    data(){
      return {
        account_name: window.sessionStorage.getItem('account_name'),
        account_token:window.sessionStorage.getItem('account_token'),
        roleDatas:[],
        fieldsDatas:[],//列表字段
        listLoading: false,
        sels: [], //列表选中列
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          role_name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ]
        },
        editForm: {
          role_id: '',
          role_name: ''
        },
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addFormRules: {
          role_name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
        },
        addForm: {
          role_name: '',
        }

      }
    },
    methods: {
     getRoleList(){
        let data={};
        this.$ajax.postu('/systemAction.api?getRoleList',data).then((res)=>{
                if(res.status=="ok"){    
                  this.roleDatas = res.data;
                  this.fieldsDatas = res.fields;
                }else{
                  console.log(res.error)
                }
        });   
      },
      // 角色通用接口
      saveRole(arr,brr){
        this.$ajax.postu('/systemAction.api?saveRole',brr).then((res)=>{
                if(res.status=="ok"){
                   if(arr=="c"){
                     this.$message({
                      message: '添加成功',
                      type: 'success'
                     });
                   }else if(arr=="u"){
                      this.$message({
                      message: '修改成功',
                      type: 'success'
                     });
                   }else if(arr=="d"){
                      this.$message({
                      message: '删除成功',
                      type: 'success'
                     });
                   }
                  this.getRoleList();
                }else{
                   this.$message({
                      message: res.error,
                      type: 'error'
                     });
                     console.log(res.error)
                }
        }); 
      
      },
      //删除
      delBook: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          let para = {role_id: row.role_id,action_token:'d'};
          this.saveRole('d',para)
         });    
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({role_id:row.role_id,role_name:row.role_name, action_token:'u'});
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              let para = Object.assign({merchants_id:'2'},this.editForm);
              this.saveRole('u',para);
              this.editFormVisible = false;
            });
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          role_name: '',
        };
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let para = Object.assign({merchants_id:"2",action_token:'c'}, this.addForm);
            this.saveRole('c',para);
            this.addFormVisible = false;
          }
        });
      }
    },
    mounted() {
       this.getRoleList();
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
  .el-row{
      padding:10px;
  }
  .el-table__header{
    width:100% !important;
  }
  .el-table__body{
    width:100% !important;
  }
  .el-table th>.cell,.el-table__body td>.cell{
    text-align:center;
  }
</style>
