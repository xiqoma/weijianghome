import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  Bot,
  Check,
  ChevronRight,
  CircleUserRound,
  Database,
  Eye,
  FileSpreadsheet,
  Gauge,
  Layers3,
  LockKeyhole,
  Maximize2,
  PackageCheck,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Store,
  UploadCloud,
  WandSparkles,
} from 'lucide-react'
import {
  agentWork,
  evidenceRows,
  modules,
  navItems,
  orders,
  products,
} from './data'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value)

const assetUrl = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

function App() {
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [scale, setScale] = useState(92)
  const [angle, setAngle] = useState(12)
  const [accessibility, setAccessibility] = useState(false)
  const [assistantMode, setAssistantMode] = useState<'售前' | '售后' | '商家'>('售前')

  const selected = products.find((product) => product.id === selectedId) ?? products[0]
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)
  const moduleScore = useMemo(
    () => Math.round(modules.reduce((sum, item) => sum + item.progress, 0) / modules.length),
    [],
  )

  return (
    <main className={accessibility ? 'app app--accessible' : 'app'}>
      <aside className="sidebar" aria-label="唯匠家居产品导航">
        <a className="brand" href="#top" aria-label="WeijiangHome">
          <span className="brand-mark">WJ</span>
          <span>
            <strong>WeijiangHome</strong>
            <small>唯匠家居</small>
          </span>
        </a>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button className={`nav-item nav-item--${item.tone}`} type="button" key={item.label}>
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="agent-signature">
          <WandSparkles size={18} aria-hidden="true" />
          <strong>AI Agent Pipeline</strong>
          <span>Claude Code / Codex / Cursor / Windsurf / DeepSeek</span>
        </div>
      </aside>

      <section className="workspace" id="top">
        <header className="topbar">
          <div>
            <p className="eyeline">家具零售 + AR 空间预览 + 商家后台</p>
            <h1>唯匠家居全栈工作台</h1>
          </div>
          <div className="topbar-actions" aria-label="全局操作">
            <button
              className="icon-button"
              type="button"
              title="搜索商品、订单和用户"
              aria-label="搜索商品、订单和用户"
            >
              <Search size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              title="导出订单数据"
              aria-label="导出订单数据"
            >
              <ArrowDownToLine size={18} />
            </button>
            <button
              className={accessibility ? 'toggle is-on' : 'toggle'}
              type="button"
              onClick={() => setAccessibility((value) => !value)}
              aria-pressed={accessibility}
            >
              <Eye size={17} aria-hidden="true" />
              无障碍模式
            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="项目实时指标">
          <Metric label="订单 GMV" value={formatCurrency(totalRevenue)} trend="+24.6%" />
          <Metric label="AR 预览转化" value="37.2%" trend="+8.4%" />
          <Metric label="模块完成度" value={`${moduleScore}%`} trend="7/9 modules" />
          <Metric label="AI Agent 协作" value="5 工具链" trend="长上下文" />
        </section>

        <section className="hero-grid">
          <MiniProgramPanel
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedPrice={selected.price}
          />
          <ArPreviewPanel
            angle={angle}
            scale={scale}
            selectedId={selectedId}
            setAngle={setAngle}
            setScale={setScale}
          />
          <EvidencePanel assistantMode={assistantMode} setAssistantMode={setAssistantMode} />
        </section>

        <section className="operations-grid">
          <MerchantPanel selectedId={selectedId} setSelectedId={setSelectedId} />
          <DataBoard />
        </section>
      </section>
    </main>
  )
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </article>
  )
}

function MiniProgramPanel({
  selectedId,
  selectedPrice,
  setSelectedId,
}: {
  selectedId: string
  selectedPrice: number
  setSelectedId: (id: string) => void
}) {
  const selected = products.find((product) => product.id === selectedId) ?? products[0]

  return (
    <section className="surface phone-surface" aria-labelledby="mini-title">
      <div className="section-heading">
        <span className="section-icon">
          <CircleUserRound size={18} aria-hidden="true" />
        </span>
        <div>
          <p>用户端小程序</p>
          <h2 id="mini-title">微信登录、商品详情、购物车</h2>
        </div>
      </div>
      <div className="phone-frame">
        <div className="phone-status">
          <span>唯匠家居</span>
          <LockKeyhole size={14} aria-label="微信登录" />
        </div>
        <div
          className="phone-hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(16, 18, 14, 0.12), rgba(16, 18, 14, 0.72)), url("${assetUrl('raw-room.jpg')}")`,
          }}
        >
          <strong>客厅套装预约</strong>
          <small>签到积分可抵 ¥80</small>
        </div>
        <div className="product-switcher" aria-label="商品选择">
          {products.map((product) => (
            <button
              className={product.id === selectedId ? 'product-pill is-active' : 'product-pill'}
              type="button"
              key={product.id}
              onClick={() => setSelectedId(product.id)}
            >
              {product.name}
            </button>
          ))}
        </div>
        <article className={`product-card product-card--${selected.shape}`}>
          <div className="product-visual" aria-hidden="true">
            <span />
          </div>
          <div>
            <p>{selected.category}</p>
            <h3>{selected.name}</h3>
            <small>{selected.dimensions}</small>
          </div>
          <strong>{formatCurrency(selectedPrice)}</strong>
        </article>
        <div className="checkout-bar">
          <span>购物车 3 件</span>
          <button type="button">
            <ShoppingCartIcon />
            提交订单
          </button>
        </div>
      </div>
    </section>
  )
}

function ShoppingCartIcon() {
  return <PackageCheck size={15} aria-hidden="true" />
}

function ArPreviewPanel({
  angle,
  scale,
  selectedId,
  setAngle,
  setScale,
}: {
  angle: number
  scale: number
  selectedId: string
  setAngle: (value: number) => void
  setScale: (value: number) => void
}) {
  const selected = products.find((product) => product.id === selectedId) ?? products[0]

  return (
    <section className="surface ar-surface" aria-labelledby="ar-title">
      <div className="section-heading">
        <span className="section-icon section-icon--green">
          <Layers3 size={18} aria-hidden="true" />
        </span>
        <div>
          <p>AR 空间预览</p>
          <h2 id="ar-title">真实房间内的家具模型摆放</h2>
        </div>
        <button className="icon-button" type="button" title="全屏预览" aria-label="全屏预览">
          <Maximize2 size={17} />
        </button>
      </div>

      <div className="room-preview">
        <img src={assetUrl('raw-room.jpg')} alt="真实房间毛坯空间" />
        <div className="scan-line" aria-hidden="true" />
        <div className="space-tag space-tag--one">墙面 3.2m</div>
        <div className="space-tag space-tag--two">阳台采光</div>
        <div
          className={`virtual-piece virtual-piece--${selected.shape}`}
          style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale / 100})` }}
          aria-label={`${selected.name} AR 模型`}
        >
          <span />
        </div>
        <div className="fit-score">
          <Gauge size={17} aria-hidden="true" />
          空间匹配 94%
        </div>
      </div>

      <div className="controls-row">
        <label>
          <span>缩放</span>
          <input
            type="range"
            min="72"
            max="118"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
          <output>{scale}%</output>
        </label>
        <label>
          <span>旋转</span>
          <input
            type="range"
            min="-28"
            max="28"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
          />
          <output>{angle}°</output>
        </label>
        <button
          className="icon-button"
          type="button"
          onClick={() => {
            setScale(92)
            setAngle(12)
          }}
          title="重置模型"
          aria-label="重置模型"
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </section>
  )
}

function EvidencePanel({
  assistantMode,
  setAssistantMode,
}: {
  assistantMode: '售前' | '售后' | '商家'
  setAssistantMode: (mode: '售前' | '售后' | '商家') => void
}) {
  return (
    <section className="surface evidence-surface" aria-labelledby="evidence-title">
      <div className="section-heading">
        <span className="section-icon section-icon--wood">
          <Bot size={18} aria-hidden="true" />
        </span>
        <div>
          <p>Token Plan Evidence</p>
          <h2 id="evidence-title">AI 客服与 Agent 工作流证明</h2>
        </div>
      </div>
      <div className="assistant-tabs" role="tablist" aria-label="AI 客服模式">
        {(['售前', '售后', '商家'] as const).map((mode) => (
          <button
            className={assistantMode === mode ? 'assistant-tab is-active' : 'assistant-tab'}
            type="button"
            key={mode}
            onClick={() => setAssistantMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="chat-window">
        <p className="bubble bubble--user">这张户型图客厅能放 2.7 米沙发吗？</p>
        <p className="bubble bubble--agent">
          已结合商品尺寸、客厅开间和阳台动线判断：建议摆放 2.68 米模块沙发，预留通道约
          860mm。
        </p>
      </div>
      <div className="evidence-list">
        {evidenceRows.map((row) => (
          <div className={`evidence-row evidence-row--${row.tone}`} key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
      <form className="assistant-input">
        <input aria-label="AI 客服输入" value={`当前模式：${assistantMode}`} readOnly />
        <button type="button" aria-label="发送">
          <Send size={16} />
        </button>
      </form>
    </section>
  )
}

function MerchantPanel({
  selectedId,
  setSelectedId,
}: {
  selectedId: string
  setSelectedId: (id: string) => void
}) {
  return (
    <section className="surface merchant-surface" aria-labelledby="merchant-title">
      <div className="section-heading">
        <span className="section-icon section-icon--ink">
          <Store size={18} aria-hidden="true" />
        </span>
        <div>
          <p>商家后台</p>
          <h2 id="merchant-title">商品管理、订单管理、数据导出</h2>
        </div>
        <button className="text-button" type="button">
          <UploadCloud size={17} aria-hidden="true" />
          上传模型
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>置顶</th>
              <th>商品</th>
              <th>模型</th>
              <th>库存</th>
              <th>转化</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className={product.id === selectedId ? 'is-selected' : ''} key={product.id}>
                <td>#{product.topOrder}</td>
                <td>
                  <strong>{product.name}</strong>
                  <span>{product.material}</span>
                </td>
                <td>{product.modelStatus}</td>
                <td>{product.inventory}</td>
                <td>{product.conversion}</td>
                <td>
                  <button type="button" onClick={() => setSelectedId(product.id)}>
                    预览
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="order-strip" aria-label="近期订单">
        {orders.map((order) => (
          <article className="order-item" key={order.id}>
            <span>{order.id}</span>
            <strong>{order.item}</strong>
            <small>{order.status} / {order.invoice}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function DataBoard() {
  return (
    <section className="surface data-surface" aria-labelledby="data-title">
      <div className="section-heading">
        <span className="section-icon section-icon--mint">
          <Database size={18} aria-hidden="true" />
        </span>
        <div>
          <p>数据看板</p>
          <h2 id="data-title">长上下文开发消耗与模块状态</h2>
        </div>
      </div>
      <div className="module-list">
        {modules.map((module) => (
          <article className="module-row" key={module.label}>
            <module.icon size={17} aria-hidden="true" />
            <div>
              <strong>{module.label}</strong>
              <span>{module.state}</span>
            </div>
            <progress max="100" value={module.progress}>
              {module.progress}%
            </progress>
          </article>
        ))}
      </div>
      <div className="floor-plan">
        <img src={assetUrl('floor-plan.jpg')} alt="唯匠家居项目户型图" />
        <div>
          <FileSpreadsheet size={18} aria-hidden="true" />
          用户行为分析、订单导出、AR 扫描点位持续接入
        </div>
      </div>
      <div className="agent-checklist">
        {agentWork.map((item) => (
          <p key={item}>
            <Check size={15} aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>
      <div className="launch-note">
        <Sparkles size={18} aria-hidden="true" />
        适合提交“GitHub 项目链接或产品在线演示地址”
      </div>
    </section>
  )
}

export default App
