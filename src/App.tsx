import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
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
  X,
} from 'lucide-react'
import {
  agentWork,
  evidenceRows,
  modules,
  navItems,
  orders,
  products,
} from './data'
import type { Product } from './data'

type AssistantMode = '售前' | '售后' | '商家'
type ModalKind = 'search' | 'ar' | 'upload' | 'plan' | null

type ChatMessage = {
  role: 'user' | 'agent'
  text: string
}

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
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('售前')
  const [activeNav, setActiveNav] = useState(navItems[0].label)
  const [modal, setModal] = useState<ModalKind>(null)
  const [toast, setToast] = useState('线上演示已接入生成场景图与交互状态')
  const [cartCount, setCartCount] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadTarget, setUploadTarget] = useState(products[0].id)
  const [uploadedModels, setUploadedModels] = useState<string[]>([])
  const [selectedModule, setSelectedModule] = useState(modules[0].label)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', text: '这张户型图客厅能放 2.7 米沙发吗？' },
    {
      role: 'agent',
      text: '可以。结合客厅开间、阳台动线和商品尺寸，建议摆放 2.68 米模块沙发，通道约 860mm。',
    },
  ])

  const selected = products.find((product) => product.id === selectedId) ?? products[0]
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)
  const moduleScore = useMemo(
    () => Math.round(modules.reduce((sum, item) => sum + item.progress, 0) / modules.length),
    [],
  )
  const filteredProducts = products.filter((product) =>
    [product.name, product.category, product.material, product.id]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )
  const activeModule = modules.find((module) => module.label === selectedModule) ?? modules[0]

  const openModal = (kind: ModalKind, message: string) => {
    setModal(kind)
    setToast(message)
  }

  const selectProduct = (product: Product, message = `已切换到 ${product.name}`) => {
    setSelectedId(product.id)
    setToast(message)
  }

  const handleExport = () => {
    const payload = {
      project: 'WeijiangHome / 唯匠家居',
      selectedProduct: selected,
      orders,
      modules: modules.map(({ label, progress, state }) => ({ label, progress, state })),
      generatedAssets: [
        'generated-room.png',
        'generated-plan.png',
        'product-sofa.png',
        'product-cabinet.png',
        'product-table.png',
      ],
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'weijianghome-export.json'
    link.click()
    URL.revokeObjectURL(link.href)
    setToast('已生成并下载项目数据导出文件')
  }

  const addToCart = () => {
    setCartCount((count) => count + 1)
    setToast(`${selected.name} 已加入购物车，当前 ${cartCount + 1} 件`)
  }

  const sendMessage = () => {
    const question = chatInput.trim()
    if (!question) {
      setToast('请输入 AI 客服问题')
      return
    }
    const replyByMode: Record<AssistantMode, string> = {
      售前: `已按 ${selected.name} 的尺寸、材质和当前户型给出搭配建议，可继续切换商品查看空间适配。`,
      售后: `已定位到最近订单，可继续处理发票申请、配送进度和售后备注。`,
      商家: `已进入商家模式，可继续查询商品置顶顺序、模型上传状态和订单导出。`,
    }
    setMessages((items) => [
      ...items,
      { role: 'user', text: question },
      { role: 'agent', text: replyByMode[assistantMode] },
    ])
    setChatInput('')
    setToast('AI 客服已生成回复')
  }

  const confirmUpload = () => {
    setUploadedModels((items) => Array.from(new Set([...items, uploadTarget])))
    const product = products.find((item) => item.id === uploadTarget) ?? products[0]
    setSelectedId(product.id)
    setModal(null)
    setToast(`${product.name} 的 3D 模型已标记为已上传`)
  }

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
            <button
              className={`nav-item nav-item--${item.tone} ${activeNav === item.label ? 'is-active' : ''}`}
              type="button"
              key={item.label}
              onClick={() => {
                setActiveNav(item.label)
                setToast(`已进入 ${item.label} 模块`)
              }}
            >
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
              onClick={() => openModal('search', '搜索面板已打开')}
            >
              <Search size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              title="导出订单数据"
              aria-label="导出订单数据"
              onClick={handleExport}
            >
              <ArrowDownToLine size={18} />
            </button>
            <button
              className={accessibility ? 'toggle is-on' : 'toggle'}
              type="button"
              onClick={() => {
                setAccessibility((value) => !value)
                setToast(accessibility ? '已关闭无障碍模式' : '已开启无障碍模式')
              }}
              aria-pressed={accessibility}
            >
              <Eye size={17} aria-hidden="true" />
              无障碍模式
            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="项目实时指标">
          <Metric label="订单 GMV" value={formatCurrency(totalRevenue)} trend="+24.6%" onClick={handleExport} />
          <Metric label="AR 预览转化" value="37.2%" trend="+8.4%" onClick={() => openModal('ar', 'AR 全屏预览已打开')} />
          <Metric label="模块完成度" value={`${moduleScore}%`} trend="7/9 modules" onClick={() => setToast(`${activeModule.label}：${activeModule.state}`)} />
          <Metric label="AI Agent 协作" value="5 工具链" trend="长上下文" onClick={() => setActiveNav('AI 客服')} />
        </section>

        <section className="hero-grid">
          <MiniProgramPanel
            cartCount={cartCount}
            selected={selected}
            selectedId={selectedId}
            addToCart={addToCart}
            selectProduct={selectProduct}
          />
          <ArPreviewPanel
            angle={angle}
            scale={scale}
            selected={selected}
            setAngle={setAngle}
            setScale={setScale}
            openFullscreen={() => openModal('ar', 'AR 全屏预览已打开')}
          />
          <EvidencePanel
            assistantMode={assistantMode}
            chatInput={chatInput}
            messages={messages}
            sendMessage={sendMessage}
            setAssistantMode={(mode) => {
              setAssistantMode(mode)
              setToast(`AI 客服已切换到${mode}模式`)
            }}
            setChatInput={setChatInput}
          />
        </section>

        <section className="operations-grid">
          <MerchantPanel
            selectedId={selectedId}
            selectProduct={selectProduct}
            uploadedModels={uploadedModels}
            openUpload={() => openModal('upload', '模型上传面板已打开')}
          />
          <DataBoard
            activeModule={activeModule}
            selectedModule={selectedModule}
            setSelectedModule={(label) => {
              setSelectedModule(label)
              setToast(`已查看 ${label} 模块状态`)
            }}
            openPlan={() => openModal('plan', '户型尺寸图已打开')}
          />
        </section>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}

      {modal === 'search' && (
        <Modal title="全局搜索" onClose={() => setModal(null)}>
          <div className="search-panel">
            <input
              autoFocus
              placeholder="搜索商品、材质、订单..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div className="search-results">
              {filteredProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => {
                    selectProduct(product, `搜索命中并打开 ${product.name}`)
                    setModal(null)
                  }}
                >
                  <img src={assetUrl(product.image)} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.category} / {product.dimensions}</small>
                  </span>
                </button>
              ))}
              {orders.map((order) => (
                <button type="button" key={order.id} onClick={() => setToast(`已定位订单 ${order.id}`)}>
                  <PackageCheck size={20} aria-hidden="true" />
                  <span>
                    <strong>{order.id}</strong>
                    <small>{order.item} / {order.status}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {modal === 'ar' && (
        <Modal title="AR 空间预览" onClose={() => setModal(null)}>
          <div className="ar-modal-preview">
            <ArScene angle={angle} scale={scale} selected={selected} />
          </div>
        </Modal>
      )}

      {modal === 'upload' && (
        <Modal title="上传 3D 模型" onClose={() => setModal(null)}>
          <div className="upload-panel">
            <label>
              选择商品
              <select value={uploadTarget} onChange={(event) => setUploadTarget(event.target.value)}>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
            <div className="drop-zone">
              <UploadCloud size={28} aria-hidden="true" />
              <strong>模拟上传 GLB / USDZ / 贴图包</strong>
              <span>演示环境会直接写入“已上传”状态</span>
            </div>
            <button className="primary-action" type="button" onClick={confirmUpload}>确认上传</button>
          </div>
        </Modal>
      )}

      {modal === 'plan' && (
        <Modal title="户型尺寸与 AR 点位" onClose={() => setModal(null)}>
          <PlanView large />
        </Modal>
      )}
    </main>
  )
}

function Metric({
  label,
  value,
  trend,
  onClick,
}: {
  label: string
  value: string
  trend: string
  onClick: () => void
}) {
  return (
    <button className="metric" type="button" onClick={onClick}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend}</small>
    </button>
  )
}

function MiniProgramPanel({
  cartCount,
  selected,
  selectedId,
  addToCart,
  selectProduct,
}: {
  cartCount: number
  selected: Product
  selectedId: string
  addToCart: () => void
  selectProduct: (product: Product) => void
}) {
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
            backgroundImage: `linear-gradient(180deg, rgba(16, 18, 14, 0.1), rgba(16, 18, 14, 0.72)), url("${assetUrl('generated-room.png')}")`,
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
              onClick={() => selectProduct(product)}
            >
              {product.name}
            </button>
          ))}
        </div>
        <article className="product-card">
          <button className="product-image-button" type="button" onClick={addToCart}>
            <img src={assetUrl(selected.image)} alt={`${selected.name} 商品图`} />
            <span>加入购物车</span>
          </button>
          <div>
            <p>{selected.category}</p>
            <h3>{selected.name}</h3>
            <small>{selected.dimensions}</small>
          </div>
          <strong>{formatCurrency(selected.price)}</strong>
        </article>
        <div className="checkout-bar">
          <span>购物车 {cartCount} 件</span>
          <button type="button" onClick={addToCart}>
            <PackageCheck size={15} aria-hidden="true" />
            提交订单
          </button>
        </div>
      </div>
    </section>
  )
}

function ArPreviewPanel({
  angle,
  scale,
  selected,
  setAngle,
  setScale,
  openFullscreen,
}: {
  angle: number
  scale: number
  selected: Product
  setAngle: (value: number) => void
  setScale: (value: number) => void
  openFullscreen: () => void
}) {
  return (
    <section className="surface ar-surface" aria-labelledby="ar-title">
      <div className="section-heading">
        <span className="section-icon section-icon--green">
          <Layers3 size={18} aria-hidden="true" />
        </span>
        <div>
          <p>AR 空间预览</p>
          <h2 id="ar-title">生成场景内的家具模型摆放</h2>
        </div>
        <button className="icon-button" type="button" title="全屏预览" aria-label="全屏预览" onClick={openFullscreen}>
          <Maximize2 size={17} />
        </button>
      </div>

      <ArScene angle={angle} scale={scale} selected={selected} />

      <div className="controls-row">
        <label>
          <span>缩放</span>
          <input type="range" min="72" max="118" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
          <output>{scale}%</output>
        </label>
        <label>
          <span>旋转</span>
          <input type="range" min="-28" max="28" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
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

function ArScene({ angle, scale, selected }: { angle: number; scale: number; selected: Product }) {
  return (
    <div className="room-preview">
      <img src={assetUrl('generated-room.png')} alt="AI 生成的现代客厅 AR 场景" />
      <div className="scan-line" aria-hidden="true" />
      <div className="space-tag space-tag--one">墙面 3.2m</div>
      <div className="space-tag space-tag--two">阳台采光</div>
      <img
        className={`virtual-product virtual-product--${selected.shape}`}
        src={assetUrl(selected.image)}
        alt={`${selected.name} AR 模型`}
        style={{
          left: `${selected.position.left}%`,
          top: `${selected.position.top}%`,
          width: `${selected.position.width}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale / 100})`,
        }}
      />
      <div className="fit-score">
        <Gauge size={17} aria-hidden="true" />
        空间匹配 94%
      </div>
    </div>
  )
}

function EvidencePanel({
  assistantMode,
  chatInput,
  messages,
  sendMessage,
  setAssistantMode,
  setChatInput,
}: {
  assistantMode: AssistantMode
  chatInput: string
  messages: ChatMessage[]
  sendMessage: () => void
  setAssistantMode: (mode: AssistantMode) => void
  setChatInput: (value: string) => void
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
        {messages.slice(-4).map((message, index) => (
          <p className={`bubble bubble--${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>
        ))}
      </div>
      <div className="evidence-list">
        {evidenceRows.map((row) => (
          <button className={`evidence-row evidence-row--${row.tone}`} type="button" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </button>
        ))}
      </div>
      <form
        className="assistant-input"
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
      >
        <input aria-label="AI 客服输入" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={`当前模式：${assistantMode}`} />
        <button type="submit" aria-label="发送">
          <Send size={16} />
        </button>
      </form>
    </section>
  )
}

function MerchantPanel({
  selectedId,
  selectProduct,
  uploadedModels,
  openUpload,
}: {
  selectedId: string
  selectProduct: (product: Product, message?: string) => void
  uploadedModels: string[]
  openUpload: () => void
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
        <button className="text-button" type="button" onClick={openUpload}>
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
                <td>{uploadedModels.includes(product.id) ? '刚刚上传' : product.modelStatus}</td>
                <td>{product.inventory}</td>
                <td>{product.conversion}</td>
                <td>
                  <button type="button" onClick={() => selectProduct(product, `后台已预览 ${product.name}`)}>
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
          <button className="order-item" type="button" key={order.id}>
            <span>{order.id}</span>
            <strong>{order.item}</strong>
            <small>{order.status} / {order.invoice}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function DataBoard({
  activeModule,
  selectedModule,
  setSelectedModule,
  openPlan,
}: {
  activeModule: { label: string; progress: number; state: string }
  selectedModule: string
  setSelectedModule: (label: string) => void
  openPlan: () => void
}) {
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
          <button
            className={selectedModule === module.label ? 'module-row is-active' : 'module-row'}
            type="button"
            key={module.label}
            onClick={() => setSelectedModule(module.label)}
          >
            <module.icon size={17} aria-hidden="true" />
            <div>
              <strong>{module.label}</strong>
              <span>{module.state}</span>
            </div>
            <progress max="100" value={module.progress}>{module.progress}%</progress>
          </button>
        ))}
      </div>
      <button className="floor-plan" type="button" onClick={openPlan}>
        <PlanView />
        <div>
          <FileSpreadsheet size={18} aria-hidden="true" />
          {activeModule.label}：{activeModule.state}，进度 {activeModule.progress}%
        </div>
      </button>
      <div className="agent-checklist">
        {agentWork.map((item) => (
          <button type="button" key={item}>
            <Check size={15} aria-hidden="true" />
            {item}
          </button>
        ))}
      </div>
      <div className="launch-note">
        <Sparkles size={18} aria-hidden="true" />
        适合提交“GitHub 项目链接或产品在线演示地址”
      </div>
    </section>
  )
}

function PlanView({ large = false }: { large?: boolean }) {
  return (
    <figure className={large ? 'plan-view plan-view--large' : 'plan-view'}>
      <img src={assetUrl('generated-plan.png')} alt="AI 生成的户型尺寸图" />
      <figcaption>
        <span className="plan-chip plan-chip--living">客厅 4.2m</span>
        <span className="plan-chip plan-chip--balcony">阳台 3.0m</span>
        <span className="plan-chip plan-chip--route">动线 860mm</span>
      </figcaption>
    </figure>
  )
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" type="button" aria-label="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default App
