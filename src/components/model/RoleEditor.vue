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
           <div class="col-sm-3"> 
               <div class="relatedInstance"> 
                   <ul style="padding-left:25px;"> 
                       <li  v-for="list in menuDatas"> 
                            <h3><b :class="{'checked':list.is_authority==='1'}" @click="childHandle(list,$event)" style=""></b>{{list.route_name}}</h3> 
                           <ul style="padding-left:15px;"> 
                               <li v-for="arr in list.children" style="margin-top:0px;float:left;"> 
                                <b :class="{'checked':arr.is_authority==='1'}" @click="childHandle(arr,$event)"></b><span style="line-height:20px;">{{arr.route_name}}</span>
                               </li> 
                           </ul> 
                       </li> 
                   </ul> 
                    <el-col :span="24" style="padding-left:25px;">
                        <el-button type="primary" @click.native.prevent="Save(2,'saveRoutePrivilegeList')">点击保存</el-button>
                    </el-col>
               </div> 
           </div> 
       </el-tab-pane>
        <el-tab-pane label="API权限">
           <div class="col-sm-3"> 
               <div class="relatedInstance"> 
                   <ul> 
                       <li v-for="(arr,index) in routeRoleDatas" @click="handleTit(index)"> 
                           <h3>{{arr.api_group_desc}}</h3> 
                           <ul v-show="entitiesState[index]" @click.stop class="ul"> 
                               <li v-for="(list,listIndex) in arr.apiBeans" style="margin-top:0px;"> 
                                   <span style="line-height:30px;padding-left:15px;">{{list.api_name}}</span>
                                   <ul v-show="entitiesState[index]" @click.stop style="padding-left:25px;"> 
                                        <li v-for="brr in list.apiBeans" style="float:left;list-style:none;margin-left:5px;"> 
                                            <b :class="{'checked':brr.is_authority==='1'}" @click="childHandleAPI(list,brr,$event)"></b><span style="margin-left:30px;">{{brr.api_name}}</span>
                                        </li> 
                                   </ul> 
                               </li> 
                           </ul> 
                       </li> 
                   </ul> 
                    <el-col :span="24" style="padding-left:25px;">
                        <el-button type="primary" @click.native.prevent="Save(1,'saveApiList')">点击保存</el-button>
                    </el-col>
               </div> 
           </div> 
       </el-tab-pane>
       <el-tab-pane label="字段权限">
           <div class="col-sm-3"> 
               <div class="relatedInstance"> 
                   <ul> 
                       <li v-for="(arr,index) in routeRoleDatas" @click="handleTit(index)"> 
                           <h3>{{arr.api_group_desc}}字段</h3> 
                           <ul v-show="entitiesState[index]" @click.stop class="ul" :id="'ul'+index"> 
                               <li v-for="(list,listIndex) in arr.apiBeans" style="margin-top:0px;" :id="'mid'+listIndex"> 
                                   <span style="line-height:30px;padding-left:15px;">{{list.api_name}}</span><span  id="all" @click="handleTitAll(index,list,listIndex,arr)" style="margin-left:10px;line-height:30px;">[全选]</span>
                                   <ul v-show="entitiesState[index]" @click.stop style="padding-left:25px;"> 
                                        <li v-for="brr in list.fieldBeans" style="float:left;list-style:none;margin-left:5px;line-height:30px;;"> 
                                             <!--  <b :class="{'checked':brr.is_authority==='1'}" @click="childHandleAPI(arr,brr,$event)" style="top:5px;"></b><span style="margin-left:30px;">{{brr.field_desc}}</span>-->
                                          <input type="checkbox"  v-model="brr.is_authority" @click="childHandleAPI1(arr,brr,$event)" style="top:5px;" /><span style="margin-left:30px;">{{brr.field_desc}}</span>
                                        </li> 
                                   </ul> 
                               </li> 
                           </ul> 
                       </li> 
                   </ul> 
                    <el-col :span="24" style="padding-left:25px;">
                        <el-button type="primary" @click.native.prevent="Save(1,'saveApiList')">点击保存</el-button>
                    </el-col>
               </div> 
           </div> 
       </el-tab-pane>
        </el-tabs>
    </el-col>
 </el-row>
</template>
<script>
  import util from '../../common/util'
  export default{
    data(){
        return{
        entitiesState:[], 
        childState:[], 
        allState:[], 
        listLen:0,
        menuDatas:[],
        newMenuDatas:[],
        routeRoleDatas:[],
        newRouteRoleDatas:[],
        role_id:this.$route.query.role_id,
        }
    },
    methods: {
    getRouteByRole(){
            let data={parent_id:'-1',role_id:this.role_id};
            this.$ajax.postu('/systemAction.api?getApiList',data).then((res)=>{
                if(res.status=="ok"){ 
                     this.routeRoleDatas = res.data;
                     for(var i=0;i<this.routeRoleDatas.length;i++){
                         for(var j=0;j<this.routeRoleDatas[i]['apiBeans'].length;j++){
                             for(var k=0;k<this.routeRoleDatas[i]['apiBeans'][j]['fieldBeans'].length;k++){
                                if(this.routeRoleDatas[i]['apiBeans'][j]['fieldBeans'][k]['is_authority']=='1'){
                                    this.routeRoleDatas[i]['apiBeans'][j]['fieldBeans'][k]['is_authority']=true;
                                }else{
                                    this.routeRoleDatas[i]['apiBeans'][j]['fieldBeans'][k]['is_authority']=false
                                }
                             }
                         }
                     }
                }else{
                    console.log(res.error)
                }
            });   
          },
     getAllMenus(){
            let data={role_id:this.role_id};
            this.$ajax.postu('/systemAction.api?getRoutePrivilegeByRole',data).then((res)=>{
                if(res.status=="ok"){ 
                    this.menuDatas = res.data; 
                }else{
                    console.log(res.error)
                }
            });   
        },
     handleTit(i){//点击父级展开
            let state=this.entitiesState; 
            this.$set(state,i,!state[i]); 
            for(let a in this.entitiesState){ 
            //  if(a!=i){ 
            //      this.$set(state,a,false); 
            //  } 其它兄弟层级折叠，暂时不要
            }
          }, 
    childHandle(data,$event){//单选 
        if($event.target.className=="checked"){
            data.is_authority=0;
            data.action_token = 'u'
            data.is_authority_token = 0;
            $event.target.classList.remove("checked");
        }else{
            data.is_authority=1;
            data.action_token = 'u'
            data.is_authority_token = 1;
            $event.target.classList.add("checked");
        }
            this.newMenuDatas = this.menuDatas;
        }, 
    childHandleAPI(arr,data,$event){//单选 
        if($event.target.className=="checked"){
            data.is_authority=0;
            data.action_token = 'u'
            arr.action_token = 'u'
            data.is_authority_token = 0;
            $event.target.classList.remove("checked");
        }else{
            data.is_authority=1;
            data.action_token = 'u'
            arr.action_token = 'u'
            data.is_authority_token = 1;
            $event.target.classList.add("checked");
        }
            console.log(data)
            this.newRouteRoleDatas=this.routeRoleDatas;
        }, 
    childHandleAPI1(arr,data,$event){//单选 
        console.log($event.target)
        if($event.target.checked){
            data.is_authority=0;
            data.action_token = 'u'
            arr.action_token = 'u'
            data.is_authority_token = 1;
            console.log(456)
        }else{
            data.is_authority=1;
            data.action_token = 'u'
            arr.action_token = 'u'
            data.is_authority_token = 0;
           console.log(789)
        }
            console.log(data)
            this.newRouteRoleDatas=this.routeRoleDatas;
        }, 
    handleTitAll(brr,data,arr,crr){//全选 
        crr.action_token='u';
        data.fieldBeans.forEach(function(item){
            item.is_authority=1;
            item.action_token = 'u'
            item.is_authority_token = 1;
        });
        this.newRouteRoleDatas=this.routeRoleDatas;
    }, 
    Save(arr,brr){
        if(this.newRouteRoleDatas=[]){
            this.newRouteRoleDatas=this.routeRoleDatas;
        }
        if(this.newMenuDatas=[]){
            this.newMenuDatas=this.menuDatas;
        }
        let data={role_id:this.role_id};
        if(arr==1){
         var testData = this.newRouteRoleDatas;
         for(var i=0;i<testData.length;i++){
                for(var k=0;k<testData[i]['apiBeans'].length;k++){
                    for(var j=0;j<testData[i]['apiBeans'][k]['fieldBeans'].length;j++){
                        if(testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=='false'){
                            testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=0;
                        }else if(testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=='true'){
                            testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=1;
                        }else if(testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=='0'){
                            testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=0;
                        }else if(testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=='1'){
                            testData[i]['apiBeans'][k]['fieldBeans'][j]['is_authority']=1;
                        }
                    }
                }
            }
          console.log(testData);
          data.json =JSON.stringify(testData);
        }else{
          data.json =JSON.stringify(this.newMenuDatas); 
        }
        this.$ajax.postu('/systemAction.api?'+brr,data).then((res)=>{
            if(res.status=="ok"){ 
            this.$message({
                    message: '操作成功',
                    type: 'success'
                });
             this.getRouteByRole();
             this.getAllMenus();
            }else{
                this.$message({
                    message: '操作失败',
                    type: 'error'
                });
            }
        });   
     },
    }, 
    created(){ 
    this.getRouteByRole();
    this.getAllMenus();
    console.log(this.role_id)
    } 
  }
  
</script>

<style>
   .relatedInstance>h2{
        margin-top: 0;
        font-size: 20px;
        color: #999;
        text-align: center;
    }
    .display{
            display: none;
        }
    .relatedInstance ul {
    padding: 0;
    list-style:none;
    }
    .relatedInstance  .ul{
        margin-top:-10px;
    }
    .relatedInstance>ul>li>h3 {
    color: #6bacdf;
    font-size: 14px;
    text-align: left;
    line-height: 26px;
    padding-left:30px;
    }
    .relatedInstance>ul>li>h5 {
        font-size: 14px;
        text-align: center;
        line-height: 20px;
        display:none;
        cursor: pointer;
    }
    .relatedInstance>ul>li>ul>li {
        padding-left:28px;
        overflow: hidden;
        font-size: 14px;
        color: #999;
        line-height: 20px;
        min-height: 20px;
        cursor:pointer;
        margin:5px 3px;
    }
    .relatedInstance>ul>li>ul>li {
        word-wrap: break-word;
    }

    .relatedInstance li h3{
        cursor:pointer;
    }
    .relatedInstance li h3 span{
        float:right;
        line-height:26px;
        margin-right:5px;
    }
    .relatedInstance li li:hover{
        color:#333;
    }

    .relatedInstance li ul{
        overflow:hidden;
    }
    .relatedInstance li h3{
        position:relative;
    }
    .relatedInstance li li{
        position: relative;
    }
    .relatedInstance li h3 b, .relatedInstance li li b {
        position: absolute;
        top: 1px;
        left: 5px;
        vertical-align: middle;
        margin: 0;
        padding: 0;
        width: 18px;
        height: 18px;
        background: url(../../assets/images/blue.png);
        border: none;
        cursor: pointer;
        background-position: 0 0;
        margin-right: 5px;
    }
    .relatedInstance li h3 b {
        position: absolute;
        top: 4px;
    }
    .relatedInstance li h3 b:hover, .relatedInstance li li b:hover {
        background-position: -20px 0;
    }

    .relatedInstance li h3 b.checked, .relatedInstance li li b.checked {
        background-position: -40px 0;
    }
    .relatedInstance li h3 b:hover, .relatedInstance li li b:hover {
        background-position: -20px 0;
    }

    .relatedInstance li h3 b.checked, .relatedInstance li li b.checked {
        background-position: -40px 0;
    }
</style>
