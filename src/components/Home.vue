<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/logonewtxt.png" style="padding-left:8px;"></a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <a href="/"><img src="../assets/logonew.png"></a>
      </div>
      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner"><i class="iconfont icon-morentouxiang" style="font-size:20px;"></i> {{sysUserName}}  <i
            class="iconfont icon-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/ee"><span style="color: #555;font-size: 14px;">个人信息</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="'/eee'"><span style="color: #555;font-size: 14px;">修改密码</span></router-link>
            </el-dropdown-item>
           <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              <!--<router-link :to="'/login'"><span style="color: #555;font-size: 14px;">退出登录</span></router-link>-->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main" style="top:50px;">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-xianghujiaohuan" v-show="!collapsed"></i>
          <i class="iconfont icon-xianghujiaohuan" v-show="collapsed"></i>
        </div>
        <!--导航菜单-->
        <el-menu default-active="0" router :collapse="collapsed">
          <template v-for="(item,index) in nodes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path"  v-if="term.menuShow"
                            :class="$route.path==term.path?'is-active':''">
                <i :class="term.iconCls"></i><span slot="title" ref="act">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                          :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
  import {bus} from '../bus.js'
  export default {
    name: 'home',

    data () {
      return {
        nodes: this.$router.options.routes,
        sysUserName: '',
        sysUserAvatar: '',
        collapsed: false,
      }
    },
     created(){
      bus.$on('setUserName', (text) => {
        this.sysUserName = text;
      })
    //这里没有直接使用this.$router.options.routes，是因为addRoute的路由规则，在这里this.$router.options.routes获取不到
		//另外在开发的时候，可能由于是热部署，也会不断重复的给nodes添加元素，造成导航条有重复的，简单解决，可以设置一个开关
    let isLoadNodes = sessionStorage.getItem('isLoadNodes')
		if (!isLoadNodes) {
			let data = JSON.parse(window.sessionStorage.getItem('user'))
			this.nodes.push(...data)
			console.log(this.nodes)
			sessionStorage.setItem('isLoadNodes', 'true')
    }
    },
    methods: {
      handleOpen() {
        //console.log('handleopen');
      },
      handleClose() {
        //console.log('handleclose');
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      showTest(){
        let arr=[];
        for(var i=0;i<this.$refs.act.length;i++){
         arr.push(this.$refs.act[i].parentNode)
        }
        for(var i=0;i<arr.length;i++){
          if(arr[i].className!='el-menu-item'){
            console.log(arr[i].parentNode)
           arr[i].parentNode.setAttribute('style', 'display:block');
          }
        }
      },
      showMenu(i, status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      },
      logout(){
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('access-user');
          _this.$router.push({name:'登录'});
          // window.location.href="http://192.168.1.177/sw/erp/index.html#/login";
        }).catch(() => {

        });
      }
    },
    mounted() {
      var user = sessionStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user.name || '';
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-row{
    box-sizing: border-box;
    padding:0px !important;
  }
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      /*.topbar-btn:hover {*/
      /*background-color: #4A5064;*/
      /*}*/
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
      }
      .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }

    aside {
      min-width: 50px;
      background: #333744;
      &::-webkit-scrollbar {
        display: none;
      }

      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #333744;
        .iconfont{
          margin-right:8px !important;
        }
        .icon-home{
          padding-left:5px !important;
        }
      }

      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }

      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }

      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #7ed2df;
      }
    }

    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
