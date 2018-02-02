<template>
  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {requestLogin} from '../api/api';
  import NProgress from 'nprogress'
  import MenuUtils from '../utils/MenuUtils'
  var routers = []
  export default {
    data() {
      return {
        logining: false,
        account: {
          username:'',
          pwd:''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
       login(data){
        window.sessionStorage.setItem('user',JSON.stringify(data))
        MenuUtils(routers,data)

      },
      getAllRoutes(arr,brr){
          var data = {parent_id:"-1",role:"1",account_name:arr,account_token:brr};
          this.$ajax.post('/systemAction.api?getAllRoutes',data).then((res)=>{
                if(res.status=="ok"){
                  this.login(res.data)
                  this.$router.addRoutes(routers)
                  this.$router.push({ path: '/' });
                }else{
                  console.log(res.error)
                }
        });
      },
      handleLogin() {
        this.$refs.AccountFrom.validate((valid) => {
          if (valid) {
            this.logining = true;
            NProgress.start();
            var loginParams = {account_name:this.account.username,account_password:this.account.pwd};
            this.$ajax.post('/systemAction.api?accountLogin',loginParams).then((res)=>{
              this.logining = false;
              if(res.status=="ok"){
                // 设置偏好
                window.sessionStorage.setItem("account_name",res.data.account_name);
                window.sessionStorage.setItem("account_token",res.data.account_token);
                window.sessionStorage.setItem("account_id",res.data.account_id);
                window.sessionStorage.setItem("storehouse_id",res.data.storehouse_id);
                window.sessionStorage.setItem("storehouse_name",res.data.storehouse_name);
                this.getAllRoutes(res.data.account_name,res.data.account_token);
              }else{
                console.log(res.error)
              }
              NProgress.done();
              // console.log(res)
              // // this.login(res.menus)
              // this.$router.addRoutes(routers)
              // this.$router.push({ path: '/dashboard' });
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>
<style>
  body{
    background: #DFE9FB;
  }
</style>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #fff, #6495ed);        /* IE 10 */
    background:-moz-linear-gradient(top,#b8c4cb,#f6f6f8);/*火狐*/
    background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#b8c4cb), to(#f6f6f8));/*谷歌*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#6495ed));      /* Safari 4-5, Chrome 1-9*/
    background: -webkit-linear-gradient(top, #fff, #6495ed,#fff);   /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #fff, #6495ed);  /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
