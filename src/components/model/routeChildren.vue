<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:'/system_route_list'}">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>子模块</el-breadcrumb-item>
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
      <el-table :data="modelDatas" highlight-current-row v-loading="listLoading"
                style="width: 100%;">
        <el-table-column type="selection" width="5%"></el-table-column>
        <el-table-column type="index" width="5%"></el-table-column>
        <el-table-column type="expand" width="5%">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="Id: ">
                        <span>{{props.row.route_id}}</span>
              </el-form-item>
              <el-form-item label="名称: ">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="路由: ">
                        <span>{{ props.row.path }}</span>
              </el-form-item>
               <el-form-item label="权重: ">
                        <span>{{ props.row.sort }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="route_id" label="ID" width="5%"></el-table-column>
        <el-table-column prop="name" label="名称" width="15%" ></el-table-column>
        <el-table-column prop="path" label="路由" width="20%"></el-table-column>
        <el-table-column prop="sort" label="权重" width="15%"></el-table-column>
        <el-table-column label="操作" width="30%">
          <template slot-scope="scope">
             <!--<el-button size="small" type="info"><router-link :to="{path:'/set_ee_e',query:{parent_id:scope.row.route_id}}"><span style="color:#fff;">子分类</span></router-link></el-button>-->
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-col>
      <!--编辑页面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="ID" prop="route_id">
            <el-input v-model="editForm.route_id" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="路由" prop="path">
           <el-input v-model="editForm.path" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="权重" prop="sort">
           <el-input v-model="editForm.sort" auto-complete="off"></el-input>
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="路由" prop="path">
            <el-input v-model="addForm.path" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="权重" prop="sort">
            <el-input v-model="addForm.sort" auto-complete="off"></el-input>
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
        modelDatas:[],
        parent_id:this.$route.query.parent_id,
        listLoading: false,
        sels: [], //列表选中列
        jsonDatas:{//编辑和新增的时候用
          component:'Home',
          menuShow:'true',
          leaf:'false',
          iconCls:'',
          parent_id:this.$route.query.parent_id
        },
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          route_id: [
            {required: true, message: '请输入ID', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入模块名称', trigger: 'blur'}
          ],
          path: [
            {required: true, message: '请输入路由路径', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入权重值', trigger: 'blur'}
          ]
        },
        editForm: {
          route_id: '',
          name: '',
          path: '',
          sort:''
        },
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addFormRules: {
          name: [
            {required: true, message: '请输入模块名称', trigger: 'blur'}
          ],
          path: [
            {required: true, message: '请输入路由路径', trigger: 'blur'}
          ],
           sort: [
            {required: true, message: '请输入权重值', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          path: '',
          sort:''
        }

      }
    },
    methods: {
     getAllModels(){
          var data = {parent_id:this.parent_id};
          this.$ajax.postu('/systemAction.api?getRouteListByParentId',data).then((res)=>{
                if(res.status=="ok"){
                  this.modelDatas = res.data
                }else{
                  console.log(res.error)
                }
        });   
        
      },
      //模块通用接口
      saveRoute(arr,brr){
        this.$ajax.postu('/systemAction.api?saveRoute',brr).then((res)=>{
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
                  this.getAllModels();
                }else{
                   this.$message({
                      message: res.error,
                      type: 'error'
                     });
                }
        }); 
      
      },
      //删除
      delBook: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          let para = {route_id: row.route_id,action_token:'d'};
          this.saveRoute('d',para)
         });    
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign(this.jsonDatas,{route_id:row.route_id,name:row.name,path:row.path,sort:row.sort,action_token:'u'});
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              let para = this.editForm;
              this.saveRoute('u',para)
              this.editFormVisible = false;
            });
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          path: '',
          sort:'',
          action_token:'c'
        };
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let para = Object.assign(this.jsonDatas, this.addForm);
            this.saveRoute('c',para)
            this.addFormVisible = false;
          }
        });
      }
    },
    mounted() {
       this.getAllModels();
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
