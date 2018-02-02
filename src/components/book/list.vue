<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>图书管理</el-breadcrumb-item>
        <el-breadcrumb-item>图书列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <!--搜索条件-->
          <div style="width:100%">
            <el-form-item label="作者">
              <el-input v-model="filters.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="filters.date"></el-date-picker>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="filters.value" clearable placeholder="请选择">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="三级分类">
                  <el-cascader
                  expand-trigger="hover"
                  :options="options"
                  v-model="filters.models"
                  :show-all-levels="false"
                  >
                  </el-cascader>
            </el-form-item>
            <el-form-item  label="单选条件">
               <el-radio-group v-model="filters.radio">
                <el-radio :label="3">备选项</el-radio>
                <el-radio :label="6">备选项</el-radio>
                <el-radio :label="9">备选项</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item  label="多选条件">
               <el-checkbox-group v-model="filters.checkList">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!--执行按钮-->
          <div style="width:100%;text-align:right;">
              <el-form-item>
                <el-button class="filter-item" type="primary" icon="search" v-on:click="getBooks">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item"  type="primary" icon="edit">新增</el-button>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary" icon="document">导出excel</el-button>
                </el-form-item>
                <el-form-item>
                <el-button  type="primary" icon="document">导入excel</el-button>
              </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  export default{
    data(){
      return {
        filters: {
          name: '',
          date:'',
          value:'',
          radio:3,
          checkList:[],
          models:[]
        },
      //  级联选择器数据
       options:[{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }],
         options1: [{
          value: '黄金糕',
          label: '黄金糕'
        }, {
          value: '双皮奶',
          label: '双皮奶'
        }, {
          value: '蚵仔煎',
          label: '蚵仔煎'
        }, {
          value: '龙须面',
          label: '龙须面'
        }, {
          value: '北京烤鸭',
          label: '北京烤鸭'
        }],
      }
    },
    methods: {
      getBooks() {
        let para = {
          name: this.filters.name,
          date:(!this.filters.date || this.filters.date == '') ? '' :util.formatDate.format(new Date(this.filters.date), 'yyyy-MM-dd'),
          value:this.filters.value,
          radio:this.filters.radio,
          checkList:this.filters.checkList,
          models:this.filters.models
        };
        console.log(para)
      },
      handleChange(value) {
        console.log(value);
      }
  }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
  .el-checkbox__inner{margin-top:8px;}
  .el-row{
      padding:10px;
  }
</style>
