import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import Test from '@/components/Test'

import BookList from '@/components/book/list'
import RouteList from '@/components/model/routelist'
import RouteChildrenList from '@/components/model/routeChildren'
//系统管理模块
import AccountList from '@/components/model/Account'
import Permission from '@/components/model/Permission' 
import RoleEditor from '@/components/model/RoleEditor' 
import TestEditor from '@/components/model/TestEditor' //测试权限分配编辑
import RoleList from '@/components/model/RoleList'   //账号管理
//库存模块
import StoreHouseList from '@/components/stock/StoreHouse'  //仓库管理
import OutofStorage from '@/components/stock/OutofStorage'  //出入库
import StockChange from '@/components/stock/StockChange'  //库存变动
import StockCheck from '@/components/stock/StockCheck'  //库存盘点
import StockInformation from '@/components/stock/StockInformation'  //库存盘点
//主数据模块
import VendorsManage from '@/components/main/VendorsManage'   //供应商管理
import MaterialManage from '@/components/main/MaterialManage'   //物料管理
import CustomerManage from '@/components/main/CustomerManage'   //客户管理
// 物流模块
import GoodsTest from '@/components/logisticGet/GoodsTest'   //货物验收
import PurchaseStorage from '@/components/logisticGet/PurchaseStorage'   //采购入库
import ReturnStorage from '@/components/logisticGet/ReturnStorage'   //退货入库
import OtherStorage from '@/components/logisticGet/OtherStorage'   //其它入库
import ExchangeOut from '@/components/logisticSend/ExchangeOut'   //换货出库
import ReturnFactory from '@/components/logisticSend/ReturnFactory'   //退货返厂
import SalesOut from '@/components/logisticSend/SalesOut'   //销售出库
import OtherOut from '@/components/logisticSend/OtherOut'   //其它出库
//销售模块
import OrderManage from '@/components/sales/OrderManage'   //订单管理
// 采购模块
import OrderPurchase from '@/components/purchase/OrderPurchase'   //订单采购
// 用户模块
import UserInfo from '@/components/setting/UserInfo'   //用户信息设置
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)
Vue.use(Router)


export default new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,//主界面组件名
      redirect: '/dashboard',//重定向
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-shouye', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true},
        {path: '/test', component: BookList, name: '测试页', menuShow: true},
        {path: 'set_ee_e', component: BookList, name: '仅供', menuShow: true},
        {path: 'system_route_list', component: RouteList, name: '模块_管理', menuShow: false},
        {path: 'route_childlist', component: RouteChildrenList, name: '子模块_管理', menuShow: true},
        {path: 'system_account', component: AccountList, name: '账号_管理', menuShow: true},
        {path: '/system_permission', component: Permission, name: '权限_分配', menuShow: true},
        {path: '/system_role_editor', component: RoleEditor, name: '权限_分配编辑', menuShow: true},
        {path: '/TestEditor', component: TestEditor, name: '权限_分配编辑测试', menuShow: true},
        {path: '/stock_storehouse', component: StoreHouseList, name: '仓库_管理', menuShow: true},
        {path: '/stock_information', component: StockInformation, name: '库存_信息', menuShow: true},
        {path: '/stock_check', component: StockCheck, name: '库存_盘点', menuShow: true},
        {path: '/stock_change', component: StockChange, name: '库存_变动', menuShow: true},
        {path: '/stock_outof', component: OutofStorage, name: '出入_库', menuShow: true},
        {path: '/system_rolelist', component: RoleList, name: '角色_管理', menuShow: true},
        {path: '/main_vendors', component: VendorsManage, name: '供应商_管理', menuShow: true},
        {path: '/main_material', component: MaterialManage, name: '物料_管理', menuShow: false},
        {path: '/main_customer', component: CustomerManage, name: '供客户_管理', menuShow: true},
        {path: '/logistic_goods_test', component: GoodsTest, name: '货物验收_管理', menuShow: true},
        {path: '/logistic_purchase_storage', component: PurchaseStorage, name: '采购入库_管理', menuShow: true},
        {path: '/logistic_return_storage', component: ReturnStorage, name: '返厂入库_管理', menuShow: true},
        {path: '/logistic_other_storage', component: OtherStorage, name: '其他入库_管理', menuShow: true},
        {path: '/logistic_exchange_out', component: ExchangeOut, name: '换货出库_管理', menuShow: true}, 
        {path: '/logistic_return_factory', component: ReturnFactory, name: '退货出库_管理', menuShow: true},
        {path: '/logistic_sale_out', component: SalesOut, name: '销售出库_管理', menuShow: true},
        {path: '/logistic_other_out', component: OtherOut, name: '其他出库_管理', menuShow: true},
        {path: '/sales_order_manage', component: OrderManage, name: '订单_管理', menuShow: true},
        {path: '/purchase_order_purchase', component: OrderPurchase , name: '采购订单_管理', menuShow: true},
        {path: '/set_userinfo', component: UserInfo, name: '用户信息_管理', menuShow: true},
      ]
    }
  ]
})
