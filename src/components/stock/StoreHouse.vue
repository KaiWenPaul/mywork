<template>
  <el-row class="warp">
    <!--面包屑-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: breadUrls[0] }">{{breadNames[0]}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{breadNames[1]}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具栏-->
    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <div style="width:100%;">
            <el-col v-for="search_filter in search_filter_list" :key="search_filter.field_name">
              <el-form-item :label="search_filter.field_name" v-if="search_filter.field_type == 'number'" :key="search_filter.field_name">
                <el-input type="number" v-model="filters[search_filter.field_prop]" size="small"></el-input>
              </el-form-item>
              <el-form-item :label="search_filter.field_name" v-else-if="search_filter.field_type == 'date'" :key="search_filter.field_name">
                <el-date-picker v-model="filters[search_filter.field_prop]" size="small" align="right" type="date"></el-date-picker>
              </el-form-item>
              <el-form-item :label="search_filter.field_name" v-else-if="search_filter.field_type == 'datetime'" :key="search_filter.field_name">
                <el-date-picker v-model="filters[search_filter.field_prop]" size="small" align="right" type="datetime"></el-date-picker>
              </el-form-item>
              <el-form-item :label="search_filter.field_name" v-else-if="search_filter.field_type=='chooselist'" :prop="search_filter.field_name">
                <el-col :span="16"><el-input v-model="filters[search_filter.field_prop]" size="small"></el-input></el-col>
                <el-col :span="1">&nbsp</el-col>
                <el-col :span="3"><el-button type="success" size="small" @click="chooselist(search_filter.field_prop, search_filter.field_name)">选择</el-button></el-col>
              </el-form-item>
              <el-form-item :label="search_filter.field_name" v-else :key="search_filter.field_name">
                <el-input auto-complete="off" v-model="filters[search_filter.field_prop]" size="small" ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-for="search_enums in search_enums_list" :key="search_enums.field_name">
              <el-form-item :label="search_enums.field_name">
                <el-select v-model="filters[search_enums.field_desc]" size="small" >
                  <el-option v-for="item in search_enums.field_options" :label="item.label" :value="item.value" :key="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- vv自定义搜索条件 -->
          </div>
          <div style="width:100%;text-align:right;">
            <!-- vv自定义表头按钮 -->
            <el-form-item>
              <el-button class="filter-item" style="margin-left: 10px;" @click="showAddDialog" type="primary" icon="edit">添加</el-button>
            </el-form-item>
            <el-form-item v-if="search_filters.length > 0">
              <el-button class="filter-item" type="primary" icon="search" v-on:click="getAllModels">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-col>
    <!--vv自定义列表-->
    <el-table :data="modelDatas" highlight-current-row v-loading="listLoading" style="width: 100%;" >
      <el-table-column type="selection"></el-table-column>
      <el-table-column v-for="field in fieldDatas" :label="field.field_desc" width="200" v-if="field.field_type != 'arr' && field.field_type != 'hidden'" :key="field.field_desc">
        <template slot-scope="scope">
          <span v-if="field.field_type=='select'">{{selectenums[field.field_name][scope.row[field.field_name]]}}</span>
          <span v-else-if="field.field_type=='enum'">{{enums[field.field_name][scope.row[field.field_name]]}}</span>
          <span v-else-if="field.field_type=='datetime'">{{typeof(scope.row[field.field_name])=='object'?scope.row[field.field_name].format('yyyy-MM-dd hh:mm:ss'):(scope.row[field.field_name]?scope.row[field.field_name].substring(0,19):'')}}</span>
          <span v-else-if="field.field_type=='date'">{{typeof(scope.row[field.field_name])=='object'?scope.row[field.field_name].format('yyyy-MM-dd'):(scope.row[field.field_name]?scope.row[field.field_name].substring(0,10):'')}}</span>
          <span v-else>{{scope.row[field.field_name]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190" fixed="right">
        <template slot-scope="scope">
          <!-- vv自定义操作按钮 -->
          <el-button size="small" @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" @click="delBook(scope.$index, scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <br/>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="currentPageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑页 -->
    <el-dialog :title="edititle" size="large" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-row v-if="refuseChange">
          <el-col v-for="(editor,index) in editArr" :span="edit_span" :key="editor.field_desc">
            <el-form-item :label="editor.field_desc" v-if="editor.field_type!='hidden' && editor.field_type!='arr'" :prop="editor.field_name">
              <el-input size="small" v-model="selectenums[editor.field_name][editForm[editor.field_name]]" readonly v-if="editor.field_type=='select'"></el-input>
              <el-input size="small" v-model="enums[editor.field_name][editForm[editor.field_name]]" readonly v-else-if="editor.field_type=='enum'"></el-input>
              <el-date-picker size="small" type="date" v-model="editForm[editor.field_name]" readonly v-else-if="editor.field_type=='date'"></el-date-picker>
              <el-date-picker size="small" type="datetime" v-model="editForm[editor.field_name]" readonly v-else-if="editor.field_type=='datetime'"></el-date-picker>
              <el-input size="small" v-model="editForm[editor.field_name].toString()" readonly v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col v-for="(editor,index) in editArr" :span="edit_span" :key="editor.field_desc">
            <el-form-item :label="editor.field_desc" v-if="editor.field_type=='list'" :prop="editor.field_name">
              <el-input v-model="editForm[editor.field_name]" size="small" auto-complete="off" :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-input>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='int'" :prop="editor.field_name">
              <el-input-number v-model="editForm[editor.field_name]" size="small" :min="0" :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-input-number>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='number'" :prop="editor.field_name">
              <el-input type="number" v-model.number="editForm[editor.field_name]" size="small" auto-complete="off" :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-input>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='select'" :prop="editor.field_name">
              <el-select v-model="editForm[editor.field_name]" size="small" @blur="form_blur(editForm[editor.field_name],editor.field_name)">
                <el-option v-for="item in selectoptions[editor.field_name]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='date'" :prop="editor.field_name">
              <el-date-picker v-model="editForm[editor.field_name]" size="small" align="right" type="date" placeholder="选择日期" :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-date-picker>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='datetime'" :prop="editor.field_name">
              <el-date-picker v-model="editForm[editor.field_name]" size="small" align="right" type="datetime" placeholder="选择日期" :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-date-picker>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='enum'" :prop="editor.field_name">
              <el-input v-model="enums[editor.field_name][editForm[editor.field_name]]" size="small" auto-complete="off" readonly :disabled="editor.couldwrite" :key="index" @blur="form_blur(editForm[editor.field_name],editor.field_name)"></el-input>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='address'" :prop="editor.field_name">
              <v-distpicker :province="editor.data.address.d1" :city="editor.data.address.d2" :area="editor.data.address.d3" @province="address1change" @city="address2change" @area="address3change" :disabled="editor.couldwrite"></v-distpicker>
            </el-form-item>
            <el-form-item :label="editor.field_desc" v-else-if="editor.field_type=='chooselist'" :prop="editor.field_name">
              <el-col :span="19"><el-input v-model="editForm[editor.field_name]" size="small" auto-complete="off" readonly :disabled="editor.couldwrite" :key="index"></el-input></el-col>
              <el-col :span="1">&nbsp</el-col>
              <el-col :span="3"><el-button type="success" size="small" @click="chooselist(editor.field_name, editor.field_desc)">选择</el-button></el-col>
            </el-form-item>
            <!-- vv此处自定义主表输入类型 -->
          </el-col>
        </el-row>
      </el-form>
      <!-- 编辑页子表 -->
      <el-row class="warp" v-if="edittype == 'details' && !refuseChange">
        <el-button type="success" class="el-icon-plus" @click="addNewLine"></el-button>
      </el-row>
      <el-row class="warp" v-if="edittype == 'details'">
        <el-table :data="detailData" class="tb-edit" v-loading="detaillistLoading" highlight-current-row @current-change="ChangeCurrentRow">
          <el-table-column :label="detailFieldData.field_desc" width="212" v-for="detailFieldData in detailFieldDatas" v-if="detailFieldData.field_type!='hidden'" :key="detailFieldData.field_desc">
            <template slot-scope="scope">
              <el-input class="ms_input" size="small" v-model="scope.row[detailFieldData.field_name]" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='list' &&!refuseChange"></el-input>
              <el-input-number class="ms_input" size="small" v-model="scope.row[detailFieldData.field_name]" :min="0" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='int' &&!refuseChange"></el-input-number>
              <el-input class="ms_input" size="small" type="number" v-model.number="scope.row[detailFieldData.field_name]" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='number' &&!refuseChange"></el-input>
              <el-select class="ms_input" size="small" v-model="scope.row[detailFieldData.field_name]" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='select' &&!refuseChange">
                <el-option v-for="item in selectoptions[detailFieldData.field_name]" v-if="item.value != 'id_name' && item.value != ''" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-date-picker class="ms_input" size="small" v-model="scope.row[detailFieldData.field_name]" align="center" type="date" placeholder="选择日期" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='date' &&!refuseChange"></el-date-picker>
              <el-date-picker class="ms_input" size="small" v-model="scope.row[detailFieldData.field_name]" align="center" type="datetime" placeholder="选择日期" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='datetime' &&!refuseChange"></el-date-picker>
              <div class="ms_input" v-else-if="detailFieldData.couldwrite == 0 && detailFieldData.field_type=='chooselist' &&!refuseChange">
                <el-col :span="19"><el-input size="small" readonly placeholder="请选择" v-model="scope.row[detailFieldData.field_name]" v-bind:value="scope.row[detailFieldData.field_name]" @change="handleEdit(scope.$index, scope.row)" @blur="handleInputBlur(scope.$index, scope.row, detailFieldData.field_name)"></el-input></el-col>
                <el-col :span="1">&nbsp</el-col>
                <el-col :span="4"><el-button size="small" type="success" @click="chooselist(detailFieldData.field_name, detailFieldData.field_desc, scope.row)">选择</el-button></el-col>
              </div>
              <!-- vv此处自定义子表输入类型 -->
              <span v-if="detailFieldData.field_type=='select'">{{selectenums[detailFieldData.field_name][scope.row[selectenums[detailFieldData.field_name].id_name]]?selectenums[detailFieldData.field_name][scope.row[selectenums[detailFieldData.field_name].id_name]][scope.row[detailFieldData.field_name]]:scope.row[detailFieldData.field_name]}}</span>
              <span v-else-if="detailFieldData.field_type=='enum'">{{enums[detailFieldData.field_name][scope.row[detailFieldData.field_name]]}}</span>
              <span v-else-if="detailFieldData.field_type=='datetime'">{{typeof(scope.row[detailFieldData.field_name])=='object'?scope.row[detailFieldData.field_name].format('yyyy-MM-dd hh:mm:ss'):(scope.row[detailFieldData.field_name].length>0?scope.row[detailFieldData.field_name].substring(0,19):'')}}</span>
              <span v-else-if="detailFieldData.field_type=='date'">{{typeof(scope.row[detailFieldData.field_name])=='object'?scope.row[detailFieldData.field_name].format('yyyy-MM-dd'):(scope.row[detailFieldData.field_name].length>0?scope.row[detailFieldData.field_name].substring(0,10):'')}}</span>
              <span v-else>{{scope.row[detailFieldData.field_name]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" v-if="!refuseChange">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelSubmit">取消</el-button>
        <!-- vv其他详情按钮 -->
        <el-button type="primary" @click.native="editSubmit" v-loading="saveLoading" v-if="!refuseChange">保存</el-button>
      </div>
    </el-dialog>
    <!-- 导出弹框 -->
    <el-dialog title="导出" size="tiny" v-model="exportVisible" :close-on-click-modal="false">
      <el-form label-width="120px" :rules="editFormRules" ref="editForm">
        <el-col :span="21">
          <el-form-item label="起始页">
            <el-input v-model="exportPage" type="number" size="small" auto-complete="off" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="21">
          <el-form-item label="导出行数">
            <el-input v-model="exportLimit" type="number" size="small" auto-complete="off" ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="exportloading" @click.native="exportXls">确认导出</el-button>
      </div>
    </el-dialog>
    <!-- 带出表 -->
    <el-dialog :title="choosetitle" size="large" v-model="chooseDlgVisible" :close-on-click-modal="false">
      <el-col :span="24" class="warp-main" v-if="chooseDlgDataNow.popPros">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="chooseDlgDataNow.popPros.search_filter_list">
          <el-form :inline="true" :model="filters">
            <div style="width:100%;">
              <el-form-item :label="search_filter.field_desc" v-for="search_filter in chooseDlgDataNow.popPros.search_filter_list" :key="search_filter.field_name">
                <el-input auto-complete="off" size="small" v-model="chooseDlgfilters[search_filter.field_name]"></el-input>
              </el-form-item>
              <!-- vv自定义搜索条件 -->
              <el-form-item>
                <el-button class="filter-item" size="small" type="primary" icon="search" v-on:click="getChooseDlgModels">搜索</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-col>
      <el-table :data="chooseDlgDataNow.chooseDlgDatas" class="tb-edit" v-loading="chooseDlglistLoading" highlight-current-row ref="chooseTable" @current-change="chooseCurrent">
        <el-table-column :label="chooseFieldData.field_desc" width="150" v-for="chooseFieldData in chooseDlgDataNow.chooseFieldDatas" v-if="chooseFieldData.field_type != 'arr' && chooseFieldData.field_type!='hidden'" :key="chooseFieldData.field_desc">
          <template slot-scope="scope">
            <span v-if="chooseFieldData.field_type == 'enum'">{{chooseDlgDataNow.popPros.enums[chooseFieldData.field_name][scope.row[chooseFieldData.field_name]]}}</span>
            <span v-else-if="chooseFieldData.field_type != 'arr' && chooseFieldData.field_type != 'hidden'">{{scope.row[chooseFieldData.field_name]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <br/>
      <el-pagination
        @current-change="handleChooseCurrentChange"
        :current-page="chooseDlgDataNow.chooseCurrentPage"
        layout="->,total, prev, pager, next, jumper"
        :total="chooseDlgDataNow.chooseTotal">
      </el-pagination>
    </el-dialog>
    <!-- vv自定义其他组件 -->
  </el-row>
</template>

<script>
  import util from '../../common/util'
  import VDistpicker from 'v-distpicker'
  import acc from '../../common/acc'

  /* vv模板配置 */
  let breadNames = ["库存管理","仓库管理"];
  let breadUrls = [""];
  let modelName = "仓库";
  let detailModelName = '库位';
  let key_name = 'storehouse_id'; // 主键名
  let search_filters = []; // 直接搜索键名
  let search_filters_other = []; // 自定义搜索条件,形如{name:"start_time",type:"date",desc:"起始出库时间"}
  let edit_type = "details"; // 单表结构："normal" / 主子表结构："details"
  let getListAPI = 'stockAction.api?getStorehouseList'; // 查找获取列表API
  let getDetailAPI = 'stockAction.api?getStorehouse'; // 获取编辑页子表信息API
  let saveAPI = 'stockAction.api?saveStorehouse'; // 保存API
  let columns = 2;
  let defaultValues = {}; // 默认值,形如state:'0',time:new Date()
  let enums = {}; // 枚举,形如merchants_id: {1:'one', 2:'two'}
  let selectoptions = {}; // 选项,形如is_devi: [ {value:'0',label: '未交付'}, {value:'1',label: '已交付'} ]
  let popselect = {}; // 选择框信息
  let rules = {
    storehouse_name: [
      { required: true, message: '仓库名称必填', trigger: 'blur' },
      { min: 3, max: 250, message: '长度不符合要求', trigger: 'blur' }
    ]
  }; // 保存约束
  let detailRules = {
    place_name : [{ rule: 'required', message: '未填写库位名称'}]
  }; // 子表保存约束
  /* 模板配置结束 */

  export default{
    components: { VDistpicker },
    data(){
      return {
        options: [],
        breadNames: breadNames,
        breadUrls: breadUrls,
        filters: {},//搜索条件
        modelDatas: [], // 列表数据
        fieldDatas: [], // 字段数据
        readonlyDatas: [], // 隐藏主表数据
        detailData: [], // 子表数据
        detailFieldDatas: [],  // 子表字段数据
        detailDataBeansName: "", // 子表表头名
        removedDetailData: [], // 原有但被删除的子表数据
        editArr: [], // 主表编辑数组
        editForm: {}, // 主表编辑对象
        editidnow: "", // 当前编辑id
        search_filters:search_filters,
        search_filters_other:search_filters_other, // 自定义查询条件
        search_filter_list: [],
        editForm_address: {}, // 用于记录地址
        editForm_datefield: [], // 用于记录主表日期时间字段
        editForm_detail_datefield: [], // 用于记录子表日期时间字段
        editFormRules: rules, // 编辑约束
        editFormDetailRules: detailRules, // 编辑约束
        refuseChange: false, // 全局禁止修改
        defaultValues: defaultValues,
        enums: enums, // 枚举
        search_enums_list: [],
        edit_span:24 / columns,
        selectoptions: selectoptions, // 选择器选项
        selectenums : {}, // 选择器显示枚举
        sels: [], //列表选中列
        saveLoading: false, // 保存中标记
        listLoading: false, // 加载中标记
        exportloading: false, // 导出中
        exportVisible: false, // 导出界面是否显示
        exportPage:1, // 默认导出页
        exportLimit:1000, // 默认导出行数
        detaillistLoading: false, // 子表加载中标记
        currentPage: 1, // 当前页
        total: 0, // 总数量
        currentPageSize: 10, // 每页显示数量
        edititle: "", // 编辑页标题
        edittype: edit_type, // 编辑页面样式
        editFormVisible: false,//编辑界面是否显示
        choosetitle: '', // 选择弹框标题
        chooseDlgDataInfos: {}, // 选择弹框信息
        chooseDlgDataNow: {}, // 选择弹框当前信息
        chooseDlgfilters: {},// 搜索条件
        chooseDlgVisible: false, // 选择弹框是否显示
        chooseDlglistLoading: false, // 选择弹框加载中标记
        temp_scoperow: "", // 当前子表row数据
        /* vv此处自定义数据 */
      };
    },
    methods: {
      // 获取列表数据
      getAllModels(){
        this.filters.page  = this.currentPage;
        this.filters.limit = this.currentPageSize;
        this.listLoading = true;
        for(var d = 0;d < this.search_filter_list.length; ++d){
          var filter  = this.search_filter_list[d];
          // 时间格式化
          if(filter.field_type == "date" || filter.field_type == "datetime"){
            var val = eval("this.filters." + filter.field_prop);
            if(val){
              if(typeof(val) == typeof({})){
                eval("this.filters." + filter.field_prop + " = '" + val.format('yyyy-MM-dd hh:mm:ss') + "'");
              }
            }
          }
        }
        this.$ajax.postu(getListAPI, this.filters).then((res) => {
          if (res.status == "ok") {
            this.modelDatas = res.data;
            this.fieldDatas = res.fields;
            this.total = res.total;
            this.editForm_detail_datefield.length = 0;
            // 获取搜索及子表字段，最多执行一次
            if (this.detailFieldDatas.length > 0){
                this.listLoading = false;
                return;
            }
            for(let i = 0; i < this.fieldDatas.length; ++i){
              var field = this.fieldDatas[i];
              if (this.search_filters.indexOf(field.field_name) > -1){
                var search_filter = {
                  field_prop : field.field_name,
                  field_name : field.field_desc,
                  field_type : field.field_type
                };
                this.search_filter_list.push(search_filter);
              }
              // 设置子表字段
              if (field.field_type == 'arr') {
                var data = {related_bean:field.related_bean1};
                this.detailDataBeansName = field.field_name; // 在多子表时需要考虑多个
                this.$ajax.postu('systemAction.api?getAllFieldsByRelated', data).then((res) => {
                  if (res.status == "ok") {
                    this.detailFieldDatas = res.data;
                    // 设置置灰
                    for(var i = 0;i < this.detailFieldDatas.length; ++i) {
                      var field = this.detailFieldDatas[i];
                      field.couldwrite = field.is_gray;
                      var type_str = field.field_type;
                      if(type_str == 'date' || type_str == 'datetime'){
                        this.editForm_detail_datefield.push(field.field_name);
                      }
                    }
                  } else {
                    this.$message({
                      message: '请求失败，请重试！（' + res.error + "）",
                      type: 'error'
                    });
                  }
                  this.listLoading = false;
                });
              }
            }
            for (var c = 0;c < this.search_filters_other.length; ++c){
              var search_filters_c = this.search_filters_other[c];
              var search_filter = {
                field_prop : search_filters_c.name,
                field_name : search_filters_c.desc,
                field_type : search_filters_c.type
              };
              this.search_filter_list.push(search_filter);
            }
            // 根据枚举设置搜索框
            this.search_enums_list = [];
            for(var key in this.enums){
              var temp_opt_search = {field_name:'',field_desc:key,field_options:[{value:'',label:''}]};
              var enums_values = this.enums[key];
              for(var i = 0;i < this.fieldDatas.length; ++i){
                if(this.fieldDatas[i].field_name == key){
                  temp_opt_search.field_name = this.fieldDatas[i].field_desc;
                  break;
                }
              }
              for(var key2 in enums_values){
                temp_opt_search.field_options.push({
                  value : key2,
                  label : enums_values[key2]
                });
              }
              this.search_enums_list.push(temp_opt_search);
            }
            if (this.edittype == 'normal'){
              this.detailFieldDatas.push(1);
            }
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.listLoading = false;
        });
      },
      // 每页条数变化
      handleSizeChange(val) {
        this.currentPageSize = val;
        this.filters.limit = val;
        this.refreshChange();
      },
      // 当前页变化
      handleCurrentChange(val) {
        this.currentPage = val;
        this.filters.page = val;
        this.refreshChange();
      },
      // 页面刷新
      refreshChange() {
        this.listLoading = true;
        this.$ajax.postu(getListAPI, this.filters).then((res) => {
          if (res.status == "ok") {
            this.modelDatas = res.data;
            this.total = res.total;
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.listLoading = false;
        });
      },
      // 初始化显示变更
      initSelectoptions: function () {
        for(var selectoption in this.selectoptions) {
          var temp_enum = {}
          for(let i = 0; i < this.selectoptions[selectoption].length; ++i){
            var zc = this.selectoptions[selectoption][i]
            eval("temp_enum['" + zc.value + "']='" + zc.label + "'")
          }
          eval("this.selectenums['" + selectoption + "']=temp_enum");
        }
      },
      // 字段值变化
      form_blur:function (val,field_name) {
        if(this.form_change){
          this.form_change(val,field_name);
        }
      },
      // 新建model
      showAddDialog: function(){
        this.editArr = new Array(this.fieldDatas.length);
        this.edititle = "添加新" + modelName;
        this.removedDetailData.length = 0;
        this.detailData.length = 0;
        this.editFormVisible = true;
        this.editForm = {};
        this.editForm_address = {};
        this.editForm_datefield.length = 0;
        this.editidnow = '';
        // 处理主表数据
        this.editArr.length = 0;
        this.readonlyDatas = [];
        var temp_row = {};
        for(let i = 0; i < this.fieldDatas.length; ++i){
          var field = this.fieldDatas[i];
          eval("temp_row." + field.field_name + "=''");
          var type_str = field.field_type;
          if(type_str == 'number'){
            // 数字默认值
            eval('temp_row.' + field.field_name + "=0");
            this.editArr.push({
              data: '',
              field_name:field.field_name,
              field_desc:field.field_desc,
              couldwrite:field.is_gray == '1',
              field_type:type_str
            })
          }else if(type_str == 'date' || type_str == 'datetime'){
            // 时间日期选择字段
            this.editForm_datefield.push(field.field_name);
            this.editArr.push({
              data: '',
              field_name:field.field_name,
              field_desc:field.field_desc,
              couldwrite:field.is_gray == '1',
              field_type:type_str
            })
          }else if (type_str.indexOf("address") == 0){
            // 三级地址选择框
            var indexsu = type_str.search(/\d/);
            var l_field_type = type_str.slice(0,indexsu);
            var r_field_type = type_str.slice(indexsu, type_str.length);
            eval('this.editForm_address.'+ l_field_type + '={}')
            if(type_str.indexOf("1")>0){
              this.editArr.push({
                data: this.editForm_address,
                field_desc:"所在地区",
                couldwrite:field.is_gray == '1',
                field_type:l_field_type
              })
            }
          }else{
            // 通用输入框
            this.editArr.push({
              data: '',
              field_name:field.field_name,
              field_desc:field.field_desc,
              couldwrite:field.is_gray == '1',
              field_type:type_str
            })
          }
          // 设置默认值
          var default_val = eval("this.defaultValues." + field.field_name);
          if(default_val){
            if(field.field_type == 'date' || field.field_type == 'datetime'){
              eval("temp_row." + field.field_name + "= new Date('" + default_val + "')");
            }else{
              eval("temp_row." + field.field_name + "= '" + default_val + "'");
            }
          }
          this.refuseChange = false;
        }
        this.editForm = temp_row;
      },
      // 编辑model
      showEditDialog: function(index, row, isView = 0){
        if (isView == 1){
          this.edititle = "查看" + modelName;
          this.refuseChange = true;
        }else{
          this.edititle = "编辑" + modelName;
          this.refuseChange = false;
        }
        this.removedDetailData.length = 0;
        this.detailData.length = 0;
        this.editFormVisible = true;
        this.detaillistLoading = true;
        this.editForm = row;
        this.editForm_address = {};
        this.editForm_datefield.length = 0;
        eval('this.editidnow = row.' + key_name);
        var data = {};
        eval("data." + key_name + "=row." + key_name);
        if(this.changeRefuseChange){
          this.changeRefuseChange();
        }
        // 获取子表数据
        if(edit_type == "details") {
          this.$ajax.postu(getDetailAPI, data).then((res) => {
            if (res.status == "ok") {
              var detaildatas = res.data;
              for (var detaildata in detaildatas) {
                if (/.*Beans$/.exec(detaildata) != undefined) {
                  this.detailData = detaildatas[detaildata];
                  break;
                }
              }
            } else {
              this.$message({
                message: '请求失败，请重试！（' + res.error + "）",
                type: 'error'
              });
            }
            this.detaillistLoading = false;
          });
        }
        // 处理主表数据
        var edit_data_arr = this.modelDatas[index];
        this.editArr.length = 0;
        this.readonlyDatas = [];
        for(var i = 0; i < this.fieldDatas.length; ++i){
          var field = this.fieldDatas[i];
          var type_str = field.field_type;
          if(type_str == 'readonly') {
            // 隐藏字段
            this.readonlyDatas.push({
              index: field.field_name,
              data: eval('edit_data_arr.' + field.field_name)
            })
          }else if(type_str == 'date' || type_str == 'datetime'){
            // 时间日期选择字段
            this.editForm_datefield.push(field.field_name);
            // 时间字符串转换为时间
            if(eval("edit_data_arr." + field.field_name)){
              eval("this.editForm." + field.field_name + "=new Date(edit_data_arr." + field.field_name + ")");
            }
            this.editArr.push({
              data: '',
              field_name:field.field_name,
              field_desc:field.field_desc,
              couldwrite:field.is_gray == '1',
              field_type:type_str
            })
          }else if (type_str.indexOf("address") == 0){
            // 三级地址选择框
            var indexsu = type_str.search(/\d/);
            var l_field_type = type_str.slice(0,indexsu);
            var r_field_type = type_str.slice(indexsu, type_str.length);
            eval('this.editForm_address.'+ l_field_type + '==undefined?this.editForm_address.'+ l_field_type + '={}:1;')
            eval('this.editForm_address.'+ l_field_type + "['d" + r_field_type + "']=edit_data_arr." + field.field_name)
            if(type_str.indexOf("1")>0){
              this.editArr.push({
                data: this.editForm_address,
                field_desc:"所在地区",
                couldwrite:field.is_gray == '1',
                field_type:l_field_type
              })
            }
          }else{
            // 通用输入框
            this.editArr.push({
              data: eval('edit_data_arr.' + field.field_name),
              field_name:field.field_name,
              field_desc:field.field_desc,
              couldwrite:field.is_gray == '1',
              field_type:type_str
            })
          }
        }
      },
      // 展示导出框
      showExport:function(){
        this.exportVisible = true;
      },
      // 导出
      exportXls: function(){
        this.exportloading = true;
        let exportEp = {};
        for(let iff in this.filters){
          eval("exportEp." + iff + "=this.filters." + iff)
        }
        exportEp.page = this.exportPage;
        exportEp.limit = this.exportLimit;
        this.$ajax.postu(exportAPI, exportEp).then((res) => {
          if (res.status == "ok") {
            try{
              window.open(res.data);
            }
            catch (e){
              this.$message({
                message: '下载失败，请重试！（' + e + "）",
                type: 'error'
              });
            }
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.exportloading = false;
        });
      },
      // 提交编辑
      editSubmit: function () {
        this.saveLoading = true;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (this.detailData.length == 0 && edit_type == "details"){
              this.$message({
                type: 'info',
                message: detailModelName + '不能为空！'
              });
              this.saveLoading = false;
            }else{
              // 提交数据
              let pros = this.editForm;
              if (edit_type == 'details'){
                // 子表验证
                var detail_warning_num = '';
                var detail_warning_message = '';
                for(var k = 0;k < this.detailData.length; ++k) {
                  var detailData_row = this.detailData[k];
                  for(var key in this.editFormDetailRules){
                    if(detail_warning_message != ''){
                      break;
                    }
                    var check_arr = this.editFormDetailRules[key];
                    for(var ls = 0;ls < check_arr.length ; ++ls){
                      var check_info = check_arr[ls];
                      if(check_info.rule == 'required'){
                        if(eval("detailData_row." + key + "== ''|| detailData_row." + key + "== undefined")){
                          detail_warning_num = k + 1;
                          detail_warning_message = check_info.message;
                          break;
                        }
                      }else if(check_info.rule == 'max'){
                        var check_fs = 0;
                        eval("check_fs = detailData_row." + key);
                        if(check_fs){
                          if(check_fs >= parseFloat(check_info.value)){
                            detail_warning_num = k + 1;
                            detail_warning_message = check_info.message;
                            break;
                          }
                        }
                      }else if(check_info.rule == 'min'){
                        var check_fs = 0;
                        eval("check_fs = detailData_row." + key);
                        if(check_fs){
                          if(check_fs < parseFloat(check_info.value)){
                            detail_warning_num = k + 1;
                            detail_warning_message = check_info.message;
                            break;
                          }
                        }
                      }else if(check_info.rule == 'func'){
                        if(check_info.value(eval("detailData_row." + key)) != 0){
                          detail_warning_num = k + 1;
                          detail_warning_message = check_info.message;
                          break;
                        }
                      }
                    }
                  }
                  if (detail_warning_message != ''){
                    this.$message({
                      message: '第 ' + detail_warning_num + ' 条' + detailModelName + '错误 : ' + check_info.message,
                      type: 'warning'
                    });
                    return;
                  }
                }
                // 格式化日期
                for(var i = 0;i < this.editForm_detail_datefield.length; ++i){
                  var field_name = this.editForm_detail_datefield[i];
                  for(var j = 0;j < this.detailData.length; ++j) {
                    var detailData_row = this.detailData[j];
                    if(eval("typeof(detailData_row." + field_name + ") == 'object'")){
                      eval("detailData_row." + field_name + "=detailData_row." + field_name + ".format('yyyy-MM-dd hh:mm:ss')")
                    }
                  }
                }
                let stdatas = this.detailData.concat(this.removedDetailData);
                eval("pros." + this.detailDataBeansName +" = stdatas");
              }
              // 主表处理
              this.readonlyDatas.forEach(function (hiddendata) {
                if(hiddendata.data){
                  eval('pros.' + hiddendata.index + "='" + hiddendata.data + "'");
                }else{
                  eval('pros.' + hiddendata.index + "=" + "''");
                }
              });
              if(this.editForm_datefield){
                for(var i = 0;i < this.editForm_datefield.length ; ++i) {
                  let field_name = this.editForm_datefield[i]
                  var aa = eval("pros." + field_name);
                  if (typeof(aa) == 'object') {
                    eval("pros." + field_name + "= pros." + field_name + ".format('yyyy-MM-dd hh:mm:ss')");
                  }
                }
              }
              if(this.editForm_address.address){
                // TODO 三级字段名称自动带出
                pros.province = this.editForm_address.address.d1;
                pros.city = this.editForm_address.address.d2;
                pros.country = this.editForm_address.address.d3;
              }
              // 设置提交方式
              pros.action_token = "u";
              if (this.edititle == "添加新" + modelName){
                pros.action_token = "c";
              }
              if (edit_type == "details"){
                pros = {"json":JSON.stringify(pros)}
              }
              this.$ajax.postu(saveAPI, pros).then((res) => {
                if (res.status == "ok") {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.editFormVisible = false;
                  this.refreshChange();
                  this.temp_scoperow == "";
                } else {
                  this.$message({
                    message: '请求失败，请重试！（' + res.error + "）",
                    type: 'error'
                  });
                }
              });
              this.saveLoading = false;
            }
          }
        });
      },
      // 提交删除
      delBook: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          var para = { action_token: 'd'};
          eval("para." + key_name + "=row." + key_name);
          this.$ajax.postu(saveAPI,para).then((res)=>{
            if(res.status=="ok"){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.refreshChange();
            }else{
              this.$message({
                message: '请求失败，请重试！（' + res.error + "）",
                type: 'error'
              });
            }
          });
        });
      },
      // 取消提交
      cancelSubmit: function () {
        this.editFormVisible = false;
        this.temp_scoperow == "";
        // TODO 字段复原
      },
      // 新建行
      addNewLine() {
        var newline = {
            action_token:"c"
        };
        for(var i = 0;i < this.detailFieldDatas.length; ++i){
          var field = this.detailFieldDatas[i];
          if(this.defaultValues[field.field_name]){
            eval("newline." + field.field_name + "=" + this.defaultValues[field.field_name]);
          }else{
            var type_field = field.field_type;
            if(type_field == 'number' || type_field == 'int'){
              eval("newline." + field.field_name + "=0");
            }else{
              eval("newline." + field.field_name + "=''");
            }
          }
        }
        eval("newline." + key_name + "=this.editidnow");
        this.detailData.push(newline);
      },
      // 行值改变
      handleEdit(index, row){
        if(this.detailData[index].action_token != 'c'){
          this.detailData[index].action_token = "u";
        }
      },
      // 行值失去焦点
      handleInputBlur(index, row, field_name){
        if(this.row_change){
          this.row_change(index, row, field_name);
        }
      },
      // 旧行删除
      handleDelete(index, row) {
        if(this.detailData[index].action_token != 'c'){
          this.detailData[index].action_token = "d";
          this.removedDetailData.push(this.detailData[index]);
        }
        this.detailData.splice(index,1);
      },
      // 选择行变更
      ChangeCurrentRow(currentRow, oldCurrentRow){
        this.temp_scoperow = currentRow;
        // 根据保存的枚举值，更新下拉列表选项
        for (var select_name in this.selectoptions){
          if(currentRow != undefined){
            if(currentRow[select_name] != undefined){
              this.selectoptions[select_name].length = 0;
              var currentCr = eval("currentRow." + this.selectenums[select_name].id_name);
              if (currentCr){
                var currentDe = eval("this.selectenums[select_name]['" + currentCr + "']");
                for (var key in currentDe){
                  this.selectoptions[select_name].push({value:key,label:currentDe[key]});
                }
              }else{
                this.selectoptions[select_name].push({value:"",label:""});
              }
            }
          }
        }
      },
      // 一级地址变化
      address1change(data){
        this.editForm_address.address.d1 = data.value;
        this.editForm_address.address.d2 = '';
        this.editForm_address.address.d3 = '';
      },
      // 二级地址变化
      address2change(data){
        this.editForm_address.address.d2 = data.value;
        this.editForm_address.address.d3 = '';
      },
      // 三级地址变化
      address3change(data){
        this.editForm_address.address.d3 = data.value;
      },
      // 选择弹框展示
      chooselist(type_name,type_desc,scope=""){
        this.temp_scoperow = scope;
        if(eval("this.chooseDlgDataInfos." + type_name)){
          // 已有的弹框
          this.chooseDlgDataNow = eval("this.chooseDlgDataInfos." + type_name);
          this.chooseDlgVisible = true;
          // 子表默认约束
          let limit_d = this.chooseDlgDataNow.popPros.detail_limit_searches;
          if(limit_d){
            for(let i = 0; i < limit_d.length; ++i) {
              eval('this.chooseDlgfilters.' + limit_d[i] + ' = this.temp_scoperow.' + limit_d[i])
            }
            this.getChooseDlgModels(this.chooseDlgDataNow.popPros.default_select);
          }
        }else{
          // 新的弹框
          eval("this.chooseDlgDataInfos." + type_name + "={}");
          eval("this.chooseDlgDataNow = this.chooseDlgDataInfos." + type_name);
          this.chooseDlgDataNow.chooseCurrentPage = 1;
          this.choosetitle = '选择' + type_desc;
          this.chooseDlgVisible = true;
          this.chooseDlgDataNow.popPros = popselect[type_name];
          let limit_d = this.chooseDlgDataNow.popPros.detail_limit_searches;
          if(limit_d){
            for(let i = 0; i < limit_d.length; ++i) {
              eval('this.chooseDlgfilters.' + limit_d[i] + ' = this.temp_scoperow.' + limit_d[i])
            }
          }
          this.getChooseDlgModels(this.chooseDlgDataNow.popPros.default_select);
        }
      },
      // 选择弹框取值
      getChooseDlgModels(default_select){
        this.chooseDlglistLoading = true;
        // 基础筛选
        if(default_select){
          for(let i = 0;i < default_select.length; ++i){
            eval('this.chooseDlgfilters.' + default_select[i].field_name + ' = "' + default_select[i].field_value + '"');
          }
        }
        this.$ajax.postu(this.chooseDlgDataNow.popPros.getlistAPI, this.chooseDlgfilters).then((res) => {
          if (res.status == "ok") {
            this.chooseDlgDataNow.chooseDlgDatas = res.data;
            this.chooseDlgDataNow.chooseFieldDatas = res.fields;
            this.chooseDlgDataNow.chooseTotal = res.total;
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.chooseDlglistLoading = false;
        });
      },
      // 选中选择弹框表的信息
      chooseCurrent(newrow){
        if (this.editFormVisible){
          // 编辑框中的选择弹框
          if(newrow){
            // 主/子表选择框回带
            let returnstr = eval("newrow." + this.chooseDlgDataNow.popPros.key_name);
            if(this.temp_scoperow == ""){
              eval("this.editForm." + this.chooseDlgDataNow.popPros.modelname + "= '" + returnstr + "'");
            }else{
              eval("this.temp_scoperow." + this.chooseDlgDataNow.popPros.modelname + "= '" + returnstr + "'");
              if(this.temp_scoperow.action_token != 'c'){
                this.temp_scoperow.action_token = "u";
              }
            }
            // 执行回调函数
            if (this.chooseDlgDataNow.popPros.cbname){
              eval("this." + this.chooseDlgDataNow.popPros.cbname + "(newrow)");
            }
            this.$refs.chooseTable.setCurrentRow();
            this.chooseDlgVisible = false;
          }
        }else{
          // 搜索框中的选择弹框
          for(let i=0;i<this.search_filter_list.length;++i){
            // 主/子表选择框回带
            let search_filter = this.search_filter_list[i];
            if(eval("search_filter.field_prop == '" + this.chooseDlgDataNow.popPros.key_name + "'")){
              this.filters[search_filter.field_prop] = eval("newrow." + this.chooseDlgDataNow.popPros.key_name);
              this.chooseDlgVisible = false;
              break;
            }
          }
        }
      },
      // 选择弹框表当前页变化
      handleChooseCurrentChange(val) {
        this.chooseDlgfilters.page = val;
        this.chooseDlgfilters.limit = 10;
        this.chooseDlglistLoading = true;
        this.$ajax.postu(this.chooseDlgDataNow.popPros.getlistAPI, this.chooseDlgfilters).then((res) => {
          if (res.status == "ok") {
            this.chooseDlgDataNow.chooseDlgDatas = res.data;
            this.chooseDlgDataNow.chooseCurrentPage = val;
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.chooseDlglistLoading = false;
        });
      },
      /* vv此处添加自定义方法 */
    },
    mounted() {
      this.initSelectoptions();
      this.getAllModels();
    }
  }
  Date.prototype.format = function(fmt) {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }

  .el-row {
    padding: 10px;
  }

  .el-table__header {
    width: 100% !important;
  }

  .el-table__body {
    width: 100% !important;
  }

  .el-table th > .cell, .el-table__body td > .cell {
    text-align: center;
  }

  .tb-edit .ms_input {
    display: none
  }
  .tb-edit .current-row .ms_input {
    display: block
  }
  .tb-edit .current-row .ms_input+span {
    display: none
  }

  .el-form .address option {
    font-size: 14px
  }
</style>
