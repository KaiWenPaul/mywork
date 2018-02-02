<template>
  <el-row class="warp">
    <el-col :span="card_span" v-if="puBlockBean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">采购提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="0-1" v-if="puBlockBean.length > 0">
            <template slot="title">未完成采购订单 <font color="red">（{{blockbeannums.puBlockBean}}）</font></template>
            <el-table :data="puBlockBean" highlight-current-row  style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'puBlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="card_span" v-if="outbound3RecordBean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">客户回款提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="1-1" v-if="outbound3RecordBean.length > 0">
            <template slot="title">客户未回款出库单 <font color="red">（{{ blockbeannums.outbound3RecordBean}}）</font></template>
            <el-table :data="outbound3RecordBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'outbound3RecordBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="card_span" v-if="inBlock1Bean.length > 0 || inBlock2Bean.length > 0 || inBlock3Bean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">采购付款提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="2-1" v-if="inBlock1Bean.length > 0">
            <template slot="title">入库未付款临近 <font color="red">（{{ blockbeannums.inBlock1Bean}}）</font></template>
            <el-table :data="inBlock1Bean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'inBlock1Bean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="2-2" v-if="inBlock2Bean.length > 0">
            <template slot="title">入库未付款到期 <font color="red">（{{ blockbeannums.inBlock2Bean}}）</font></template>
            <el-table :data="inBlock2Bean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'inBlock2Bean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="2-3" v-if="inBlock3Bean.length > 0">
            <template slot="title">入库表10日内未付款 <font color="red">（{{ blockbeannums.inBlock3Bean}}）</font></template>
            <el-table :data="inBlock3Bean" highlight-current-row  style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'inBlock3Bean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="card_span" v-if="outbound1RecordBean.length > 0 || outbound2RecordBean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">开票提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="3-1" v-if="outbound1RecordBean.length > 0">
            <template slot="title">待开发票出库单 <font color="red">（{{ blockbeannums.outbound1RecordBean}}）</font></template>
            <el-table :data="outbound1RecordBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'outbound1RecordBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="3-2" v-if="outbound2RecordBean.length > 0">
            <template slot="title">非销售出库 <font color="red">（{{ blockbeannums.outbound2RecordBean}}）</font></template>
            <el-table :data="outbound2RecordBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'outbound2RecordBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="card_span" v-if="outbound4RecordBean.length > 0 || outbound5RecordBean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">出库回款提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="4-1" v-if="outbound4RecordBean.length > 0">
            <template slot="title">出库未回款临近 <font color="red">（{{ blockbeannums.outbound4RecordBean}}）</font></template>
            <el-table :data="outbound4RecordBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'outbound4RecordBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="4-2" v-if="outbound5RecordBean.length > 0">
            <template slot="title">出库未回款到期 <font color="red">（{{ blockbeannums.outbound5RecordBean}}）</font></template>
            <el-table :data="outbound5RecordBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'outbound5RecordBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="card_span" v-if="stock180BlockBean.length > 0">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">库存提醒</span>
          <el-button style="float: right;" type="primary">刷新</el-button>
        </div>
        <el-collapse @change="collaspe_handleChange">
          <el-collapse-item name="6-1" v-if="stock15BlockBean.length > 0">
            <template slot="title">15日临保提醒 <font color="red">（{{ blockbeannums.stock15BlockBean}}）</font></template>
            <el-table :data="stock15BlockBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'stock15BlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="6-2" v-if="stock30BlockBean.length > 0">
            <template slot="title">30日临保提醒 <font color="red">（{{ blockbeannums.stock30BlockBean}}）</font></template>
            <el-table :data="stock30BlockBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'stock30BlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="6-3" v-if="stock60BlockBean.length > 0">
            <template slot="title">60日临保提醒 <font color="red">（{{ blockbeannums.stock60BlockBean}}）</font></template>
            <el-table :data="stock60BlockBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'stock60BlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="6-4" v-if="stock90BlockBean.length > 0">
            <template slot="title">90日临保提醒 <font color="red">（{{ blockbeannums.stock90BlockBean}}）</font></template>
            <el-table :data="stock90BlockBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'stock90BlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item name="6-5" v-if="stock180BlockBean.length > 0">
            <template slot="title">180日临保提醒 <font color="red">（{{ blockbeannums.stock180BlockBean}}）</font></template>
            <el-table :data="stock180BlockBean" highlight-current-row style="width: 100%;" >
              <el-table-column label="编号">
                <template slot-scope="scope"><span>{{scope.row}}</span></template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="showViewDialog(scope.row, 'stock180BlockBean')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <!-- 查看页 -->
    <el-dialog :title="edititle" size="large" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" ref="editForm">
        <el-row>
          <el-col v-for="(editor,index) in editArr" :span="edit_span" :key="Math.random()">
            <el-form-item :label="editor.field_desc" v-if="editor.field_type!='hidden' && editor.field_type!='arr'" :prop="editor.field_name">
              <el-input size="small" v-model="enums[editor.field_name][editForm[editor.field_name]]" readonly v-if="editor.field_type=='enum'"></el-input>
              <el-date-picker size="small" type="date" v-model="editForm[editor.field_name]" readonly v-else-if="editor.field_type=='date'"></el-date-picker>
              <el-date-picker size="small" type="datetime" v-model="editForm[editor.field_name]" readonly v-else-if="editor.field_type=='datetime'"></el-date-picker>
              <el-input size="small" v-model="editForm[editor.field_name]" readonly v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 编辑页子表 -->
      <el-row class="warp" v-if="edittype == 'details'">
        <el-table :data="detailData" class="tb-edit" v-loading="detaillistLoading" highlight-current-row>
          <el-table-column :label="detailFieldData.field_desc" width="212" v-for="detailFieldData in detailFieldDatas" v-if="detailFieldData.field_type!='hidden'" :key="Math.random()">
            <template slot-scope="scope">
              <span v-if="detailFieldData.field_type=='enum'">{{enums[detailFieldData.field_name][scope.row[detailFieldData.field_name]]}}</span>
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
  </el-row>
</template>

<script>
  import util from '../common/util'
  import VDistpicker from 'v-distpicker'
  import acc from '../common/acc'

  /* vv模板配置 */
  let puBlockBean = {};
  puBlockBean.modelName = "采购单";
  puBlockBean.detailModelName = '物料';
  puBlockBean.key_name = 'purchase_id'; // 主键名
  puBlockBean.edit_type = "details"; // 单表结构："normal" / 主子表结构："details"
  puBlockBean.getListAPI = 'stockAction.api?getPurchaseList'; // 查找获取列表API
  puBlockBean.getDetailAPI = 'stockAction.api?getPurchase'; // 获取编辑页子表信息API
  puBlockBean.columns = 2;
  puBlockBean.enums = {
    accept_state:{0:'未采购', 1:'部分采购', 2:'采购完成'},
    purchase_approval_state:{0:'未审批', 1:'审批通过', 2:'审批不通过'},
    payoff_approval_state:{0:'未审批', 1:'审批通过', 2:'审批不通过'}
  };
  let outboundRecordBean = {};
  outboundRecordBean.modelName = "出库";
  outboundRecordBean.detailModelName = '出库记录';
  outboundRecordBean.key_name = 'record_id'; // 主键名
  outboundRecordBean.edit_type = "details"; // 单表结构："normal" / 主子表结构："details"
  outboundRecordBean.getListAPI = 'stockAction.api?getOutboundList'; // 查找获取列表API
  outboundRecordBean.getDetailAPI = 'stockAction.api?getOutbound'; // 获取编辑页子表信息API
  outboundRecordBean.columns = 3;
  outboundRecordBean.enums = {
    record_type:{sales_outbound:'销售出库',exchange_outbound:"换货出库",return_factory:"退货返厂",other_outbound:'其他出库'},
    record_state:{0:'未出库',1:'已出库'},
    payment_state:{0:'未完成',1:"已完成"},
    financial_processing_state:{0:'未处理',1:"已处理"}
  };
  let inBlockBean = {};
  inBlockBean.modelName = "入库";
  inBlockBean.detailModelName = '入库记录';
  inBlockBean.key_name = 'record_id'; // 主键名
  inBlockBean.edit_type = "details"; // 单表结构："normal" / 主子表结构："details"
  inBlockBean.getListAPI = 'stockAction.api?getInboundList'; // 查找获取列表API
  inBlockBean.getDetailAPI = 'stockAction.api?getInbound'; // 获取编辑页子表信息API
  inBlockBean.columns = 3;
  inBlockBean.enums = {
    record_type:{confirm_inbound:'采购入库',refund_inbound:"退货入库",others_inbound:"其他入库"},
    record_state:{0:'未入库',1:'已入库'},
    is_payoff:{0:'未付款',1:"已付款"}
  };
  let stockBlockBean = {};
  stockBlockBean.modelName = "库存";
  stockBlockBean.detailModelName = '';
  stockBlockBean.key_name = 'stock_id'; // 主键名
  stockBlockBean.edit_type = "normal"; // 单表结构："normal" / 主子表结构："details"
  stockBlockBean.getListAPI = 'stockAction.api?getStockList'; // 查找获取列表API
  stockBlockBean.getDetailAPI = ''; // 获取编辑页子表信息API
  stockBlockBean.columns = 3;
  stockBlockBean.enums = {};
  /* 模板配置结束 */

  export default{
    components: { VDistpicker },
    data(){
      return {
        filters: {},//搜索条件
        fieldDatas: [], // 字段数据
        readonlyDatas: [], // 隐藏主表数据
        detailData: [], // 子表数据
        detailFieldDatas: [],  // 子表字段数据
        detailDataBeansName: "", // 子表表头名
        removedDetailData: [], // 原有但被删除的子表数据
        editArr: [], // 主表编辑数组
        editForm: {}, // 主表编辑对象
        editForm_address: {}, // 用于记录地址
        editForm_datefield: [], // 用于记录主表日期时间字段
        editForm_detail_datefield: [], // 用于记录子表日期时间字段
        refuseChange: 1, // 全局禁止修改
        edit_span: 8,
        sels: [], //列表选中列
        selectenums : {}, // 选择器显示枚举
        selectoptions: {},
        saveLoading: false, // 保存中标记
        detaillistLoading: false, // 子表加载中标记
        edititle: "", // 编辑页标题
        edittype: 'normal', // 编辑页面样式
        editFormVisible: false,//编辑界面是否显示
        /* vv此处自定义数据 */
        card_span: 10, // dashboard的卡片宽度
        inBlock1Bean: [], // 入库未付款临近提醒
        inBlock2Bean: [], // 入库未付款到期提醒
        inBlock3Bean: [], // 入库表10日内未付款提醒
        outbound1RecordBean: [], // 待开发票出库提醒
        outbound2RecordBean: [], // 非销售出库提醒
        outbound3RecordBean: [], // 客户回款提醒
        outbound4RecordBean: [], // 出库未回款临近提醒
        outbound5RecordBean: [], // 出库未回款到期提醒
        puBlockBean: [], // 未完成采购订单提醒
        stock15BlockBean: [], // 临保提醒
        stock30BlockBean: [], // 临保提醒
        stock60BlockBean: [], // 临保提醒
        stock90BlockBean: [], // 临保提醒
        stock180BlockBean: [], // 临保提醒
        blockbeannums:{}, // 数量
      };
    },
    methods: {
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
      // 编辑model
      showViewDialog: function(row, beansName){
        var beanBean = {};
        if(beansName == 'puBlockBean'){
          beanBean = puBlockBean;
        }else if(beansName == 'outbound1RecordBean' || beansName == 'outbound2RecordBean' || beansName == 'outbound3RecordBean' || beansName == 'outbound4RecordBean' || beansName == 'outbound5RecordBean'){
          beanBean = outboundRecordBean;
        }else if(beansName == 'inBlock1Bean' || beansName == 'inBlock2Bean' || beansName == 'inBlock3Bean'){
          beanBean = inBlockBean;
        }else if(beansName == 'stock15BlockBean' || beansName == 'stock30BlockBean' || beansName == 'stock60BlockBean' || beansName == 'stock90BlockBean' || beansName == 'stock180BlockBean'){
          beanBean = stockBlockBean;
        }else{
          console.log('异常Bean名称')
          return;
        }
        this.editFormVisible = true;
        this.detaillistLoading = true;
        let modelName = beanBean.modelName;
        this.edititle = beanBean.modelName;
        let detailModelName = beanBean.detailModelName;
        let key_name = beanBean.key_name; // 主键名
        this.edittype = beanBean.edit_type; // 单表结构："normal" / 主子表结构："details"
        let getListAPI = beanBean.getListAPI; // 查找获取列表API
        let getDetailAPI = beanBean.getDetailAPI; // 获取编辑页子表信息API
        this.edit_span = 24 / beanBean.columns;
        this.enums = beanBean.enums; // 枚举,形如merchants_id: {1:'one', 2:'two'}

        // 根据id获取主表及主子表字段
        eval("this.filters." + key_name + " = '" + row + "'");
        this.$ajax.postu(getListAPI, this.filters).then((res) => {
          if (res.status == "ok") {
            this.editForm = res.data[0];
            this.fieldDatas = res.fields;
            this.editForm_detail_datefield.length = 0;
            for(let i = 0; i < this.fieldDatas.length; ++i){
              var field = this.fieldDatas[i];
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
                    // 弹出详情页
                    this.removedDetailData.length = 0;
                    this.detailData.length = 0;
                    this.editForm_address = {};
                    this.editForm_datefield.length = 0;
                    var data = {};
                    eval("data." + key_name + "=" + row);
                    // 获取子表数据
                    if(this.edittype == "details") {
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
                    var edit_data_arr = res.data[0];
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
                          this.editForm.record_time = new Date(edit_data_arr.record_time);
//                          eval("this.editForm." + field.field_name + "=new Date(edit_data_arr." + field.field_name + ")");
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






                  } else {
                    this.$message({
                      message: '请求失败，请重试！（' + res.error + "）",
                      type: 'error'
                    });
                    this.detaillistLoading = false;
                  }
                });
              }
            }
            if (this.edittype == 'normal'){
//              this.detailFieldDatas.push(9);
              // 弹出详情页
              this.removedDetailData.length = 0;
              this.detailData.length = 0;
              this.editForm_address = {};
              this.editForm_datefield.length = 0;
              var data = {};
              eval("data." + key_name + "=" + row);
              // 处理主表数据
              var edit_data_arr = res.data[0];
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
                    this.editForm.record_time = new Date(edit_data_arr.record_time);
//                          eval("this.editForm." + field.field_name + "=new Date(edit_data_arr." + field.field_name + ")");
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
            }

          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
          this.detaillistLoading = false;
        });
      },
      // 取消提交
      cancelSubmit: function () {
        this.editFormVisible = false;
        this.temp_scoperow == "";
        this.fieldDatas.length = 0;
        this.editArr.length = 0;
        this.editForm.length = 0;
        this.readonlyDatas.length = 0;
        this.filters = {};
        this.readonlyDatas.length = 0;
        this.detailFieldDatas.length = 0;
        this.detailData = []; // 子表数据
      },
      /* vv此处添加自定义方法 */
      getDashboard: function(){
        this.$ajax.postu('/stockAction.api?getDashboardList',{}).then((res) => {
          if (res.status == "ok") {
            var detaildatas = res.data;
            this.inBlock1Bean = this.splitIds(detaildatas.inBlock1Bean);
            this.inBlock2Bean = this.splitIds(detaildatas.inBlock2Bean);
            this.inBlock3Bean = this.splitIds(detaildatas.inBlock3Bean);
            this.outbound1RecordBean = this.splitIds(detaildatas.outbound1RecordBean);
            this.outbound2RecordBean = this.splitIds(detaildatas.outbound2RecordBean);
            this.outbound3RecordBean = this.splitIds(detaildatas.outbound3RecordBean);
            this.outbound4RecordBean = this.splitIds(detaildatas.outbound4RecordBean);
            this.outbound5RecordBean = this.splitIds(detaildatas.outbound5RecordBean);
            this.puBlockBean = this.splitIds(detaildatas.puBlockBean);
            this.stock15BlockBean = this.splitIds(detaildatas.stock15BlockBean);
            this.stock30BlockBean = this.splitIds(detaildatas.stock30BlockBean);
            this.stock60BlockBean = this.splitIds(detaildatas.stock60BlockBean);
            this.stock90BlockBean = this.splitIds(detaildatas.stock90BlockBean);
            this.stock180BlockBean = this.splitIds(detaildatas.stock180BlockBean);
            this.blockbeannums.inBlock1Bean = detaildatas.inBlock1Bean['num'];
            this.blockbeannums.inBlock2Bean = detaildatas.inBlock2Bean['num'];
            this.blockbeannums.inBlock3Bean = detaildatas.inBlock3Bean['num'];
            this.blockbeannums.outbound1RecordBean = detaildatas.outbound1RecordBean['num'];
            this.blockbeannums.outbound2RecordBean = detaildatas.outbound2RecordBean['num'];
            this.blockbeannums.outbound3RecordBean = detaildatas.outbound3RecordBean['num'];
            this.blockbeannums.outbound4RecordBean = detaildatas.outbound4RecordBean['num'];
            this.blockbeannums.outbound5RecordBean = detaildatas.outbound5RecordBean['num'];
            this.blockbeannums.puBlockBean = detaildatas.puBlockBean['num'];
            this.blockbeannums.stock15BlockBean = detaildatas.stock15BlockBean['num'];
            this.blockbeannums.stock30BlockBean = detaildatas.stock30BlockBean['num'];
            this.blockbeannums.stock60BlockBean = detaildatas.stock60BlockBean['num'];
            this.blockbeannums.stock90BlockBean = detaildatas.stock90BlockBean['num'];
            this.blockbeannums.stock180BlockBean = detaildatas.stock180BlockBean['num'];
          } else {
            this.$message({
              message: '请求失败，请重试！（' + res.error + "）",
              type: 'error'
            });
          }
        });
      },
      splitIds:function (bean) {
        if(bean['id']){
            return bean['id'].split(',');
        }else{
            return [];
        }
      },
      // 折叠状态
      collaspe_handleChange:function (e) {
        console.log(e)
      }
    },
    mounted() {
      this.initSelectoptions();
      this.getDashboard();
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
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
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
