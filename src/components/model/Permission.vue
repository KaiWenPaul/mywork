<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
     <el-col :span="24" class="warp-main">
        <!--列表-->
      <el-table :data="roleDatas" highlight-current-row border v-loading="listLoading"
                style="width: 100%;">
        <el-table-column prop="role_id" label="ID" width="33%"></el-table-column>
        <el-table-column prop="role_name" label="名称" width="33%" ></el-table-column>
        <el-table-column label="操作" width="33%">
          <template slot-scope="scope">
            <el-button size="small" type="info"><router-link :to="{path:'/system_role_editor',query:{role_id:scope.row.role_id}}"><span style="color:#fff;">查看权限</span></router-link></el-button>
              <!--<el-button size="small" type="info"><router-link :to="{path:'/TestEditor'}"><span style="color:#fff;">测试权限</span></router-link></el-button>-->
          </template>
        </el-table-column>
      </el-table>
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
        listLoading: false,//正在加载
        roleDatas:[]
      }
    },
    methods: {
      getRoleList(){
        let data={account_name:this.account_name,account_token:this.account_token};
        this.$ajax.post('/systemAction.api?getRoleList',data).then((res)=>{
                if(res.status=="ok"){    
                  this.roleDatas = res.data;
                }else{
                  console.log(res.error)
                }
        });   
      },
      getRouteByRole(){
        let data={account_name:this.account_name,account_token:this.account_token};
        this.$ajax.post('/systemAction.api?getRoutePrivilegeByRole',data).then((res)=>{
            if(res.status=="ok"){    
                console.log(res.data);
            }else{
                console.log(res.error)
            }
        });   
      },
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
