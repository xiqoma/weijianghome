import {
  Bot,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  Cuboid,
  Home,
  ScanSearch,
  ShieldCheck,
  ShoppingCart,
  Store,
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
  summary: string
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
  { label: 'Home', icon: Home, tone: 'dark' },
  { label: 'AR Preview', icon: ScanSearch, tone: 'green' },
  { label: 'Products', icon: Boxes, tone: 'wood' },
  { label: 'Orders', icon: ClipboardList, tone: 'ink' },
  { label: 'Dashboard', icon: ChartNoAxesCombined, tone: 'mint' },
  { label: 'AI Agent', icon: Bot, tone: 'sand' },
]

export const products: Product[] = [
  {
    id: 'wj-sofa-01',
    name: 'Cloud Modular Sofa',
    category: 'Living Room / Sofa',
    price: 5680,
    dimensions: '2680 x 930 x 780mm',
    material: 'Cotton linen and beech frame',
    modelStatus: 'GLB ready',
    image: 'product-sofa.png',
    position: { left: 57, top: 78, width: 38 },
    inventory: 36,
    topOrder: 1,
    conversion: '18.7%',
    shape: 'sofa',
    summary: 'Soft modular seating for small apartments and family living rooms.',
  },
  {
    id: 'wj-cabinet-08',
    name: 'Forest Side Cabinet',
    category: 'Dining Room / Storage',
    price: 4290,
    dimensions: '1600 x 420 x 860mm',
    material: 'Walnut veneer and matte metal',
    modelStatus: 'Texture review',
    image: 'product-cabinet.png',
    position: { left: 43, top: 66, width: 30 },
    inventory: 14,
    topOrder: 2,
    conversion: '12.4%',
    shape: 'cabinet',
    summary: 'Warm storage cabinet with clean lines for dining and hallway scenes.',
  },
  {
    id: 'wj-table-12',
    name: 'Stone Round Table',
    category: 'Dining Room / Table',
    price: 3380,
    dimensions: '1380 x 1380 x 750mm',
    material: 'Stone top and carbon steel base',
    modelStatus: 'USDZ ready',
    image: 'product-table.png',
    position: { left: 55, top: 72, width: 25 },
    inventory: 21,
    topOrder: 3,
    conversion: '15.9%',
    shape: 'table',
    summary: 'Compact round table that keeps the circulation route open.',
  },
]

export const orders: Order[] = [
  {
    id: 'WH20260523018',
    buyer: 'WeChat User A19',
    item: 'Cloud Modular Sofa',
    status: 'Awaiting payment',
    amount: 5680,
    invoice: 'Not requested',
  },
  {
    id: 'WH20260523017',
    buyer: 'Shanghai Pudong Client',
    item: 'Forest Side Cabinet',
    status: 'Merchant preparing',
    amount: 4290,
    invoice: 'E-invoice',
  },
  {
    id: 'WH20260522091',
    buyer: 'Accessible Mode User',
    item: 'Stone Round Table',
    status: 'Ready to ship',
    amount: 3380,
    invoice: 'Pending review',
  },
]

export const modules: ModuleState[] = [
  { label: 'WeChat Login', icon: ShieldCheck, progress: 95, state: 'Connected' },
  { label: 'Shopping Cart', icon: ShoppingCart, progress: 90, state: 'Payment area fixed' },
  { label: 'Merchant Console', icon: Store, progress: 82, state: 'Sorting flow complete' },
  { label: 'AR Model Loader', icon: Cuboid, progress: 76, state: 'Scale and rotate enabled' },
  { label: 'Agent Evidence', icon: Bot, progress: 88, state: 'Worklog synced' },
  { label: 'WeChat Pay', icon: WalletCards, progress: 58, state: 'Merchant ID pending' },
]

export const agentWork = [
  'Mapped furniture assets into room preview coordinates',
  'Rebuilt product cards for image-first browsing',
  'Added AR scale and rotation controls',
  'Linked order, inventory, and model status in one dashboard',
  'Cleaned project copy so the demo reads like a real product',
]

export const evidenceRows = [
  { label: 'Product images', value: '3 scenes', tone: 'green' },
  { label: 'AR controls', value: 'Scale + rotate', tone: 'wood' },
  { label: 'Agent worklog', value: '5 tasks', tone: 'ink' },
  { label: 'Modules ready', value: '6 tracked', tone: 'mint' },
]
