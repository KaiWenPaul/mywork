<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限分配</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-breadcrum">
       <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
           <div  v-for="list in menuDatas">
            <el-col :span="24" class="warp-main" style="margin:10px;">
            <template>
            <el-checkbox :label="list.route_name" :key="list.route_name" :checked="list.is_authority==='1'" @change="ChangeRole(list,$event)">
                <div>{{list.route_name}}</div>
                <el-checkbox v-for="arr in list.children" :label="arr.route_name" :key="arr.route_name" :checked="arr.is_authority==='1'" @change="ChangeRole(arr,$event)" style="margin-top:15px;width:100%;float:left;margin-left:13px;">
                    <div>{{arr.route_name}}</div>
                    </el-checkbox>
                </el-checkbox>
            </template>
            </el-col>
            </div>
            <el-col :span="24">
                <el-button type="primary" @click.native.prevent="Save1()">点击保存</el-button>
            </el-col>
        </el-tab-pane>
           
        <el-tab-pane label="API权限">
            <div  v-for="list in routeRoleDatas">
            <el-col :span="24" class="warp-main" style="margin:10px;">
            <template>
                <div>
                    <span style="font-size:20px;">{{list.api_group_desc}}</span>
                    <div v-for="arr in list.apiBeans">
                       <span style="font-size:14px;padding-left:15px;line-height:40px;">{{arr.api_name}}</span>
                        <div style="width:100%;float:left;padding-left:20px;">
                        <el-checkbox v-for="brr in arr.apiBeans" :label="brr.api_name" :key="brr.api_name" :checked="brr.is_authority==='1'" @change="ChangeRole(brr,$event)" style="float:left;margin-left:13px;">
                            <div>{{brr.api_name}}</div>
                        </el-checkbox>
                    </div>
                    </div>
                </div>
            </template>
            </el-col>
            </div>
             <el-col :span="24">
          <el-button type="primary" @click.native.prevent="Save()">点击保存</el-button>
        </el-col>
        </el-tab-pane>
         <el-tab-pane label="字段权限">
            <div  v-for="list in routeRoleDatas">
            <el-col :span="24" class="warp-main">
            <template>
                <div>
                    <span style="font-size:20px;">{{list.api_group_name}}</span>
                    <div v-for="arr in list.apiBeans" style="margin-top:10px;">
                       <span style="font-size:14px;padding-left:5px;">{{arr.api_name}}</span>
                        <div style="width:100%;float:left;">
                        <el-checkbox v-for="brr in arr.fieldBeans" :label="brr.field_desc" :key="brr.field_desc" :checked="brr.is_authority==='1'" @change="ChangeRole(brr,$event)" style="float:left;margin-left:15px;margin:10px;">
                            <div>{{brr.field_desc}}</div>
                        </el-checkbox>
                    </div>
                    </div>
                </div>
            </template>
            </el-col>
            </div>
             <el-col :span="24">
          <el-button type="primary" @click.native.prevent="Save()">点击保存</el-button>
        </el-col>
            
        </el-tab-pane>
        </el-tabs>
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
        menuDatas:[],
        newMenuDatas:[],
        routeRoleDatas:[],
        newRouteRoleDatas:[],
      };
    },
    methods: {
      getRouteByRole(){
        let data={account_name:this.account_name,account_token:this.account_token,parent_id:'-1'};
        this.$ajax.post('/systemAction.api?getApiList',data).then((res)=>{
            if(res.status=="ok"){ 
                this.routeRoleDatas = res.data; 
            }else{
                console.log(res.error)
            }
        });   
      },
      getAllMenus(){
        let data={};
        this.$ajax.postu('/systemAction.api?getRoutePrivilegeByRole',data).then((res)=>{
            if(res.status=="ok"){ 
                this.menuDatas = res.data; 
            }else{
                console.log(res.error)
            }
        });   
      },
     ChangeAll(data,$event){
      var dom = $event.target.parentNode.parentNode.childNodes[1].childNodes[2].childNodes;
       if($event.target.checked===true){
           $event.target.parentNode.classList.add("is-checked")
           data.apiBeans.forEach(function(item){
               item.is_authority = 1;
               item.is_authority_token=1;
           });
           dom.forEach(function(item){
               item.childNodes[0].classList.add("is-checked")
           })
       }else{
          $event.target.parentNode.classList.remove("is-checked")
           data.apiBeans.forEach(function(item){
               item.is_authority = 0;
               item.is_authority_token=0;
       }); 
        dom.forEach(function(item){
                item.childNodes[0].classList.remove("is-checked")
           })
       }
     },
     ChangeRole(data,$event){
        if($event.target.checked===true){
           data.is_authority=1;
           data.is_authority_token=1;
           data.action_token = 'u';
        }else{
           data.is_authority=0;
           data.is_authority_token=0;
           data.action_token = 'u';
        }
        this.newMenuDatas = this.menuDatas;
        this.newRouteRoleDatas=this.routeRoleDatas;
        console.log(data)
      },
      Save(){
        if(this.newRouteRoleDatas=[]){
          this.newRouteRoleDatas=this.routeRoleDatas;
        }
        let data ={json:JSON.stringify(this.newRouteRoleDatas)};
        this.$ajax.postu('/systemAction.api?saveApiList',data).then((res)=>{
            if(res.status=="ok"){ 
               this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
            }else{
                this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
            }
        });   
      },
        Save1(){
        if(this.newMenuDatas=[]){
          this.newMenuDatas=this.menuDatas;
        }
        let data ={json:JSON.stringify(this.newMenuDatas)};
        this.$ajax.postu('/systemAction.api?saveRoutePrivilegeList',data).then((res)=>{
            if(res.status=="ok"){ 
               this.$message({
                    message: '操作成功',
                    type: 'success'
                  });
            }else{
                this.$message({
                    message: '操作失败',
                    type: 'error'
                  });
            }
        });   
      }
     
    },
    mounted() {
       this.getRouteByRole();
       this.getAllMenus();
    }
  }
</script>

<style>
  .el-checkbox__input{float:left;}
  .el-checkbox__label{float:left;}
</style>
