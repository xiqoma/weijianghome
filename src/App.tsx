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

type AssistantMode = '鍞墠' | '鍞悗' | '鍟嗗'
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
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('鍞墠')
  const [activeNav, setActiveNav] = useState(navItems[0].label)
  const [modal, setModal] = useState<ModalKind>(null)
  const [toast, setToast] = useState('绾夸笂婕旂ず宸叉帴鍏ョ敓鎴愬満鏅浘涓庝氦浜掔姸鎬?)
  const [cartCount, setCartCount] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadTarget, setUploadTarget] = useState(products[0].id)
  const [uploadedModels, setUploadedModels] = useState<string[]>([])
  const [selectedModule, setSelectedModule] = useState(modules[0].label)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'user', text: '杩欏紶鎴峰瀷鍥惧鍘呰兘鏀?2.7 绫虫矙鍙戝悧锛? },
    {
      role: 'agent',
      text: '鍙互銆傜粨鍚堝鍘呭紑闂淬€侀槼鍙板姩绾垮拰鍟嗗搧灏哄锛屽缓璁憜鏀?2.68 绫虫ā鍧楁矙鍙戯紝閫氶亾绾?860mm銆?,
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

  const selectProduct = (product: Product, message = `宸插垏鎹㈠埌 ${product.name}`) => {
    setSelectedId(product.id)
    setToast(message)
  }

  const handleExport = () => {
    const payload = {
      project: 'WeijiangHome / 鍞尃瀹跺眳',
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
    setToast('宸茬敓鎴愬苟涓嬭浇椤圭洰鏁版嵁瀵煎嚭鏂囦欢')
  }

  const addToCart = () => {
    setCartCount((count) => count + 1)
    setToast(`${selected.name} 宸插姞鍏ヨ喘鐗╄溅锛屽綋鍓?${cartCount + 1} 浠禶)
  }

  const sendMessage = () => {
    const question = chatInput.trim()
    if (!question) {
      setToast('璇疯緭鍏?AI 瀹㈡湇闂')
      return
    }
    const replyByMode: Record<AssistantMode, string> = {
      鍞墠: `宸叉寜 ${selected.name} 鐨勫昂瀵搞€佹潗璐ㄥ拰褰撳墠鎴峰瀷缁欏嚭鎼厤寤鸿锛屽彲缁х画鍒囨崲鍟嗗搧鏌ョ湅绌洪棿閫傞厤銆俙,
      鍞悗: `宸插畾浣嶅埌鏈€杩戣鍗曪紝鍙户缁鐞嗗彂绁ㄧ敵璇枫€侀厤閫佽繘搴﹀拰鍞悗澶囨敞銆俙,
      鍟嗗: `宸茶繘鍏ュ晢瀹舵ā寮忥紝鍙户缁煡璇㈠晢鍝佺疆椤堕『搴忋€佹ā鍨嬩笂浼犵姸鎬佸拰璁㈠崟瀵煎嚭銆俙,
    }
    setMessages((items) => [
      ...items,
      { role: 'user', text: question },
      { role: 'agent', text: replyByMode[assistantMode] },
    ])
    setChatInput('')
    setToast('AI 瀹㈡湇宸茬敓鎴愬洖澶?)
  }

  const confirmUpload = () => {
    setUploadedModels((items) => Array.from(new Set([...items, uploadTarget])))
    const product = products.find((item) => item.id === uploadTarget) ?? products[0]
    setSelectedId(product.id)
    setModal(null)
    setToast(`${product.name} 鐨?3D 妯″瀷宸叉爣璁颁负宸蹭笂浼燻)
  }

  return (
    <main className={accessibility ? 'app app--accessible' : 'app'}>
      <aside className="sidebar" aria-label="鍞尃瀹跺眳浜у搧瀵艰埅">
        <a className="brand" href="#top" aria-label="WeijiangHome">
          <span className="brand-mark">WJ</span>
          <span>
            <strong>WeijiangHome</strong>
            <small>鍞尃瀹跺眳</small>
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
                setToast(`宸茶繘鍏?${item.label} 妯″潡`)
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
            <p className="eyeline">瀹跺叿闆跺敭 + AR 绌洪棿棰勮 + 鍟嗗鍚庡彴</p>
            <h1>鍞尃瀹跺眳鍏ㄦ爤宸ヤ綔鍙?/h1>
          </div>
          <div className="topbar-actions" aria-label="鍏ㄥ眬鎿嶄綔">
            <button
              className="icon-button"
              type="button"
              title="鎼滅储鍟嗗搧銆佽鍗曞拰鐢ㄦ埛"
              aria-label="鎼滅储鍟嗗搧銆佽鍗曞拰鐢ㄦ埛"
              onClick={() => openModal('search', '鎼滅储闈㈡澘宸叉墦寮€')}
            >
              <Search size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              title="瀵煎嚭璁㈠崟鏁版嵁"
              aria-label="瀵煎嚭璁㈠崟鏁版嵁"
              onClick={handleExport}
            >
              <ArrowDownToLine size={18} />
            </button>
            <button
              className={accessibility ? 'toggle is-on' : 'toggle'}
              type="button"
              onClick={() => {
                setAccessibility((value) => !value)
                setToast(accessibility ? '宸插叧闂棤闅滅妯″紡' : '宸插紑鍚棤闅滅妯″紡')
              }}
              aria-pressed={accessibility}
            >
              <Eye size={17} aria-hidden="true" />
              鏃犻殰纰嶆ā寮?            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="椤圭洰瀹炴椂鎸囨爣">
          <Metric label="璁㈠崟 GMV" value={formatCurrency(totalRevenue)} trend="+24.6%" onClick={handleExport} />
          <Metric label="AR 棰勮杞寲" value="37.2%" trend="+8.4%" onClick={() => openModal('ar', 'AR 鍏ㄥ睆棰勮宸叉墦寮€')} />
          <Metric label="妯″潡瀹屾垚搴? value={`${moduleScore}%`} trend="7/9 modules" onClick={() => setToast(`${activeModule.label}锛?{activeModule.state}`)} />
          <Metric label="AI Agent 鍗忎綔" value="5 宸ュ叿閾? trend="闀夸笂涓嬫枃" onClick={() => setActiveNav('AI 瀹㈡湇')} />
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
            openFullscreen={() => openModal('ar', 'AR 鍏ㄥ睆棰勮宸叉墦寮€')}
          />
          <EvidencePanel
            assistantMode={assistantMode}
            chatInput={chatInput}
            messages={messages}
            sendMessage={sendMessage}
            setAssistantMode={(mode) => {
              setAssistantMode(mode)
              setToast(`AI 瀹㈡湇宸插垏鎹㈠埌${mode}妯″紡`)
            }}
            setChatInput={setChatInput}
          />
        </section>

        <section className="operations-grid">
          <MerchantPanel
            selectedId={selectedId}
            selectProduct={selectProduct}
            uploadedModels={uploadedModels}
            openUpload={() => openModal('upload', '妯″瀷涓婁紶闈㈡澘宸叉墦寮€')}
          />
          <DataBoard
            activeModule={activeModule}
            selectedModule={selectedModule}
            setSelectedModule={(label) => {
              setSelectedModule(label)
              setToast(`宸叉煡鐪?${label} 妯″潡鐘舵€乣)
            }}
            openPlan={() => openModal('plan', '鎴峰瀷灏哄鍥惧凡鎵撳紑')}
          />
        </section>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}

      {modal === 'search' && (
        <Modal title="鍏ㄥ眬鎼滅储" onClose={() => setModal(null)}>
          <div className="search-panel">
            <input
              autoFocus
              placeholder="鎼滅储鍟嗗搧銆佹潗璐ㄣ€佽鍗?.."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <div className="search-results">
              {filteredProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => {
                    selectProduct(product, `鎼滅储鍛戒腑骞舵墦寮€ ${product.name}`)
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
                <button type="button" key={order.id} onClick={() => setToast(`宸插畾浣嶈鍗?${order.id}`)}>
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
        <Modal title="AR 绌洪棿棰勮" onClose={() => setModal(null)}>
          <div className="ar-modal-preview">
            <ArScene angle={angle} scale={scale} selected={selected} />
          </div>
        </Modal>
      )}

      {modal === 'upload' && (
        <Modal title="涓婁紶 3D 妯″瀷" onClose={() => setModal(null)}>
          <div className="upload-panel">
            <label>
              閫夋嫨鍟嗗搧
              <select value={uploadTarget} onChange={(event) => setUploadTarget(event.target.value)}>
                {products.map((product) => (
                  <option value={product.id} key={product.id}>{product.name}</option>
                ))}
              </select>
            </label>
            <div className="drop-zone">
              <UploadCloud size={28} aria-hidden="true" />
              <strong>妯℃嫙涓婁紶 GLB / USDZ / 璐村浘鍖?/strong>
              <span>婕旂ず鐜浼氱洿鎺ュ啓鍏モ€滃凡涓婁紶鈥濈姸鎬?/span>
            </div>
            <button className="primary-action" type="button" onClick={confirmUpload}>纭涓婁紶</button>
          </div>
        </Modal>
      )}

      {modal === 'plan' && (
        <Modal title="鎴峰瀷灏哄涓?AR 鐐逛綅" onClose={() => setModal(null)}>
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
          <p>鐢ㄦ埛绔皬绋嬪簭</p>
          <h2 id="mini-title">寰俊鐧诲綍銆佸晢鍝佽鎯呫€佽喘鐗╄溅</h2>
        </div>
      </div>
      <div className="phone-frame">
        <div className="phone-status">
          <span>鍞尃瀹跺眳</span>
          <LockKeyhole size={14} aria-label="寰俊鐧诲綍" />
        </div>
        <div
          className="phone-hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(16, 18, 14, 0.1), rgba(16, 18, 14, 0.72)), url("${assetUrl('generated-room.png')}")`,
          }}
        >
          <strong>瀹㈠巺濂楄棰勭害</strong>
          <small>绛惧埌绉垎鍙姷 楼80</small>
        </div>
        <div className="product-switcher" aria-label="鍟嗗搧閫夋嫨">
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
            <img src={assetUrl(selected.image)} alt={`${selected.name} 鍟嗗搧鍥綻} />
            <span>鍔犲叆璐墿杞?/span>
          </button>
          <div>
            <p>{selected.category}</p>
            <h3>{selected.name}</h3>
            <small>{selected.dimensions}</small>
          </div>
          <strong>{formatCurrency(selected.price)}</strong>
        </article>
        <div className="checkout-bar">
          <span>璐墿杞?{cartCount} 浠?/span>
          <button type="button" onClick={addToCart}>
            <PackageCheck size={15} aria-hidden="true" />
            鎻愪氦璁㈠崟
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
          <p>AR 绌洪棿棰勮</p>
          <h2 id="ar-title">鐢熸垚鍦烘櫙鍐呯殑瀹跺叿妯″瀷鎽嗘斁</h2>
        </div>
        <button className="icon-button" type="button" title="鍏ㄥ睆棰勮" aria-label="鍏ㄥ睆棰勮" onClick={openFullscreen}>
          <Maximize2 size={17} />
        </button>
      </div>

      <ArScene angle={angle} scale={scale} selected={selected} />

      <div className="controls-row">
        <label>
          <span>缂╂斁</span>
          <input type="range" min="72" max="118" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
          <output>{scale}%</output>
        </label>
        <label>
          <span>鏃嬭浆</span>
          <input type="range" min="-28" max="28" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
          <output>{angle}掳</output>
        </label>
        <button
          className="icon-button"
          type="button"
          onClick={() => {
            setScale(92)
            setAngle(12)
          }}
          title="閲嶇疆妯″瀷"
          aria-label="閲嶇疆妯″瀷"
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
      <img src={assetUrl('generated-room.png')} alt="AI 鐢熸垚鐨勭幇浠ｅ鍘?AR 鍦烘櫙" />
      <div className="scan-line" aria-hidden="true" />
      <div className="space-tag space-tag--one">澧欓潰 3.2m</div>
      <div className="space-tag space-tag--two">闃冲彴閲囧厜</div>
      <img
        className={`virtual-product virtual-product--${selected.shape}`}
        src={assetUrl(selected.image)}
        alt={`${selected.name} AR 妯″瀷`}
        style={{
          left: `${selected.position.left}%`,
          top: `${selected.position.top}%`,
          width: `${selected.position.width}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale / 100})`,
        }}
      />
      <div className="fit-score">
        <Gauge size={17} aria-hidden="true" />
        绌洪棿鍖归厤 94%
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
          <h2 id="evidence-title">AI 瀹㈡湇涓?Agent 宸ヤ綔娴佽瘉鏄?/h2>
        </div>
      </div>
      <div className="assistant-tabs" role="tablist" aria-label="AI 瀹㈡湇妯″紡">
        {(['鍞墠', '鍞悗', '鍟嗗'] as const).map((mode) => (
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
        <input aria-label="AI 瀹㈡湇杈撳叆" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={`褰撳墠妯″紡锛?{assistantMode}`} />
        <button type="submit" aria-label="鍙戦€?>
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
          <p>鍟嗗鍚庡彴</p>
          <h2 id="merchant-title">鍟嗗搧绠＄悊銆佽鍗曠鐞嗐€佹暟鎹鍑?/h2>
        </div>
        <button className="text-button" type="button" onClick={openUpload}>
          <UploadCloud size={17} aria-hidden="true" />
          涓婁紶妯″瀷
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>缃《</th>
              <th>鍟嗗搧</th>
              <th>妯″瀷</th>
              <th>搴撳瓨</th>
              <th>杞寲</th>
              <th>鎿嶄綔</th>
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
                <td>{uploadedModels.includes(product.id) ? '鍒氬垰涓婁紶' : product.modelStatus}</td>
                <td>{product.inventory}</td>
                <td>{product.conversion}</td>
                <td>
                  <button type="button" onClick={() => selectProduct(product, `鍚庡彴宸查瑙?${product.name}`)}>
                    棰勮
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="order-strip" aria-label="杩戞湡璁㈠崟">
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
          <p>鏁版嵁鐪嬫澘</p>
          <h2 id="data-title">闀夸笂涓嬫枃寮€鍙戞秷鑰椾笌妯″潡鐘舵€?/h2>
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
          {activeModule.label}锛歿activeModule.state}锛岃繘搴?{activeModule.progress}%
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
  )
}

function PlanView({ large = false }: { large?: boolean }) {
  return (
    <figure className={large ? 'plan-view plan-view--large' : 'plan-view'}>
      <img src={assetUrl('generated-plan.png')} alt="AI 鐢熸垚鐨勬埛鍨嬪昂瀵稿浘" />
      <figcaption>
        <span className="plan-chip plan-chip--living">瀹㈠巺 4.2m</span>
        <span className="plan-chip plan-chip--balcony">闃冲彴 3.0m</span>
        <span className="plan-chip plan-chip--route">鍔ㄧ嚎 860mm</span>
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
          <button className="icon-button" type="button" aria-label="鍏抽棴" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default App
