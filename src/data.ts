import {
  Bot,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  Cuboid,
  FileText,
  Home,
  ScanSearch,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserCheck,
  WalletCards,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
  tone: string
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  dimensions: string
  material: string
  modelStatus: string
  image: string
  position: { left: number; top: number; width: number }
  inventory: number
  topOrder: number
  conversion: string
  shape: 'sofa' | 'cabinet' | 'table'
}

export type Order = {
  id: string
  buyer: string
  item: string
  status: string
  amount: number
  invoice: string
}

export type ModuleState = {
  label: string
  icon: LucideIcon
  progress: number
  state: string
}

export const navItems: NavItem[] = [
  { label: '首页', icon: Home, tone: 'dark' },
  { label: 'AR 空间预览', icon: ScanSearch, tone: 'green' },
  { label: '商品管理', icon: Boxes, tone: 'wood' },
  { label: '订单管理', icon: ClipboardList, tone: 'ink' },
  { label: '数据看板', icon: ChartNoAxesCombined, tone: 'mint' },
  { label: 'AI 客服', icon: Bot, tone: 'sand' },
]

export const products: Product[] = [
  {
    id: 'wj-sofa-01',
    name: '云栖模块沙发',
    category: '客厅 / 沙发',
    price: 5680,
    dimensions: '2680 x 930 x 780mm',
    material: '棉麻 + 白蜡木',
    modelStatus: 'GLB 已上传',
    image: 'product-sofa.png',
    position: { left: 58, top: 76, width: 42 },
    inventory: 36,
    topOrder: 1,
    conversion: '18.7%',
    shape: 'sofa',
  },
  {
    id: 'wj-cabinet-08',
    name: '森境餐边柜',
    category: '餐厅 / 收纳',
    price: 4290,
    dimensions: '1600 x 420 x 860mm',
    material: '胡桃木贴面',
    modelStatus: '贴图待压缩',
    image: 'product-cabinet.png',
    position: { left: 42, top: 62, width: 35 },
    inventory: 14,
    topOrder: 2,
    conversion: '12.4%',
    shape: 'cabinet',
  },
  {
    id: 'wj-table-12',
    name: '岩板圆餐桌',
    category: '餐厅 / 餐桌',
    price: 3380,
    dimensions: '1380 x 1380 x 750mm',
    material: '岩板 + 碳钢',
    modelStatus: 'USDZ 已生成',
    image: 'product-table.png',
    position: { left: 56, top: 68, width: 26 },
    inventory: 21,
    topOrder: 3,
    conversion: '15.9%',
    shape: 'table',
  },
]

export const orders: Order[] = [
  {
    id: 'WH20260523018',
    buyer: '微信用户 A19',
    item: '云栖模块沙发',
    status: '待支付',
    amount: 5680,
    invoice: '未申请',
  },
  {
    id: 'WH20260523017',
    buyer: '上海浦东客户',
    item: '森境餐边柜',
    status: '商家备货',
    amount: 4290,
    invoice: '电子普票',
  },
  {
    id: 'WH20260522091',
    buyer: '无障碍模式用户',
    item: '岩板圆餐桌',
    status: '待发货',
    amount: 3380,
    invoice: '待审核',
  },
]

export const modules: ModuleState[] = [
  { label: '微信登录', icon: UserCheck, progress: 95, state: '已联调' },
  { label: '购物车', icon: ShoppingCart, progress: 90, state: '支付区已修复' },
  { label: '商家后台', icon: Store, progress: 82, state: '排序逻辑完成' },
  { label: 'AR 模型', icon: Cuboid, progress: 68, state: '缩放旋转中' },
  { label: '发票申请', icon: FileText, progress: 72, state: '流程可跑通' },
  { label: '权限识别', icon: ShieldCheck, progress: 88, state: '角色已隔离' },
  { label: '微信支付', icon: WalletCards, progress: 46, state: '待商户号' },
]

export const agentWork = [
  '修复 app.json 页面路径与 tabBar 跳转冲突',
  '重构商品数据结构，统一小程序端与后台端字段',
  '定位购物车底部支付区域遮挡并完成响应式修复',
  '排查 AR 模型显示异常，拆分 glb/usdz 加载状态',
  '生成商家后台商品排序、订单导出、发票审核流程',
]

export const evidenceRows = [
  { label: '单次复杂任务文件读取', value: '18-46 files', tone: 'green' },
  { label: '跨端上下文窗口', value: '小程序 + Vue + API + DB', tone: 'wood' },
  { label: '月度 Agent 迭代', value: '120+ prompts', tone: 'ink' },
  { label: 'Token Plan Evidence', value: '长期全栈开发', tone: 'mint' },
]
