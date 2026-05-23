import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownToLine,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  FileSpreadsheet,
  Maximize2,
  PackageCheck,
  RotateCcw,
  Search,
  Send,
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

type ModalKind = 'search' | 'ar' | 'plan' | null

const assetUrl = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [scale, setScale] = useState(88)
  const [angle, setAngle] = useState(0)
  const [activeNav, setActiveNav] = useState(navItems[0].label)
  const [searchQuery, setSearchQuery] = useState('')
  const [modal, setModal] = useState<ModalKind>(null)
  const [toast, setToast] = useState('WeijiangHome workspace loaded')
  const [cartCount, setCartCount] = useState(3)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'user',
      text: 'Can this sofa work in a 2.7m living room?',
    },
    {
      role: 'agent',
      text: 'Yes. The sofa width is 2.68m. Keep the cabinet zone light and reserve an 860mm route near the balcony.',
    },
  ])

  const selected = products.find((product) => product.id === selectedId) ?? products[0]
  const moduleScore = useMemo(
    () => Math.round(modules.reduce((sum, item) => sum + item.progress, 0) / modules.length),
    [],
  )
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)
  const filteredProducts = products.filter((product) =>
    [product.name, product.category, product.material, product.id]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  )

  const selectProduct = (product: Product) => {
    setSelectedId(product.id)
    setToast(`${product.name} selected`)
  }

  const cycleProduct = (direction: 'prev' | 'next') => {
    const currentIndex = products.findIndex((product) => product.id === selectedId)
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % products.length
        : (currentIndex - 1 + products.length) % products.length
    selectProduct(products[nextIndex])
  }

  const exportEvidence = () => {
    const payload = {
      project: 'WeijiangHome',
      selectedProduct: selected,
      cartCount,
      modules,
      orders,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'weijianghome-evidence.json'
    link.click()
    URL.revokeObjectURL(link.href)
    setToast('Evidence file exported')
  }

  const sendMessage = () => {
    const question = chatInput.trim()
    if (!question) return
    setMessages((items) => [
      ...items,
      { role: 'user', text: question },
      {
        role: 'agent',
        text: `${selected.name} is active. Inventory is ${selected.inventory}, conversion is ${selected.conversion}, and the AR model status is ${selected.modelStatus}.`,
      },
    ])
    setChatInput('')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="WeijiangHome">
          <span className="brand-mark">WJ</span>
          <span>
            <strong>WeijiangHome</strong>
            <small>Furniture AR workspace</small>
          </span>
        </a>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              className={activeNav === item.label ? `nav-item nav-item--${item.tone} is-active` : `nav-item nav-item--${item.tone}`}
              type="button"
              key={item.label}
              onClick={() => setActiveNav(item.label)}
            >
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="agent-signature">
          <Bot size={18} aria-hidden="true" />
          <strong>Agent pipeline</strong>
          <span>{moduleScore}% module readiness with product, AR, and order evidence.</span>
        </div>
      </aside>

      <main className="workspace" id="top">
        <section className="topbar">
          <div>
            <p className="eyeline">Furniture retail + AR preview + merchant console</p>
            <h1>WeijiangHome full workspace</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={() => setModal('search')} aria-label="Search">
              <Search size={18} />
            </button>
            <button className="text-button" type="button" onClick={exportEvidence}>
              <ArrowDownToLine size={16} aria-hidden="true" />
              Export
            </button>
            <span className="cart-badge">
              <PackageCheck size={17} aria-hidden="true" />
              {cartCount}
            </span>
          </div>
        </section>

        <section className="metric-grid" aria-label="Workspace metrics">
          <Metric label="Order GMV" value={formatCurrency(totalRevenue)} helper="+24.6%" />
          <Metric label="AR conversion" value="37.2%" helper="+8.4%" />
          <Metric label="Module readiness" value={`${moduleScore}%`} helper={`${modules.length} modules`} />
          <Metric label="Products live" value={`${products.length}`} helper="Image assets ready" />
        </section>

        <section className="hero-grid" aria-label="Interactive workspace">
          <Panel icon={<Eye size={18} />} eyebrow="AR space preview" title="Place furniture inside the generated room">
            <RoomPreview
              selected={selected}
              scale={scale}
              angle={angle}
              cycleProduct={cycleProduct}
              openFullscreen={() => setModal('ar')}
            />
            <div className="controls-row">
              <button className="icon-button" type="button" onClick={() => setScale(Math.max(72, scale - 5))} aria-label="Zoom out">
                <RotateCcw size={17} />
              </button>
              <label className="range-group">
                <span>Scale</span>
                <input type="range" min="72" max="128" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
                <output>{scale}%</output>
              </label>
              <button className="icon-button" type="button" onClick={() => setScale(Math.min(128, scale + 5))} aria-label="Zoom in">
                <Maximize2 size={17} />
              </button>
            </div>
            <label className="range-group range-group--wide">
              <span>Rotation</span>
              <input type="range" min="-28" max="28" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
              <output>{angle} deg</output>
            </label>
          </Panel>

          <Panel icon={<PackageCheck size={18} />} eyebrow="Selected product" title={selected.name} action={formatCurrency(selected.price)}>
            <div className="product-focus">
              <button className="gallery-arrow gallery-arrow--left" type="button" onClick={() => cycleProduct('prev')} aria-label="Previous product">
                <ChevronLeft size={19} />
              </button>
              <img src={assetUrl(selected.image)} alt={selected.name} />
              <button className="gallery-arrow gallery-arrow--right" type="button" onClick={() => cycleProduct('next')} aria-label="Next product">
                <ChevronRight size={19} />
              </button>
            </div>
            <p className="product-summary">{selected.summary}</p>
            <div className="spec-grid">
              <Spec label="Category" value={selected.category} />
              <Spec label="Dimensions" value={selected.dimensions} />
              <Spec label="Material" value={selected.material} />
              <Spec label="Model" value={selected.modelStatus} />
              <Spec label="Inventory" value={`${selected.inventory} pieces`} />
              <Spec label="Conversion" value={selected.conversion} />
            </div>
            <button
              className="text-button text-button--primary"
              type="button"
              onClick={() => {
                setCartCount((count) => count + 1)
                setToast(`${selected.name} added to cart`)
              }}
            >
              <PackageCheck size={15} aria-hidden="true" />
              Add to cart
            </button>
          </Panel>
        </section>

        <section className="catalogue" aria-label="Product catalogue">
          {products.map((product) => (
            <article className={product.id === selected.id ? 'product-card is-selected' : 'product-card'} key={product.id}>
              <button type="button" onClick={() => selectProduct(product)}>
                <span className="product-image">
                  <img src={assetUrl(product.image)} alt={product.name} loading="lazy" />
                  <small>{product.shape}</small>
                  {product.id === selected.id && <Check size={16} aria-hidden="true" />}
                </span>
                <span className="product-copy">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <em>{formatCurrency(product.price)}</em>
                </span>
              </button>
            </article>
          ))}
        </section>

        <section className="operations-grid">
          <Panel icon={<Database size={18} />} eyebrow="Merchant dashboard" title="Inventory, orders, and model status">
            <div className="module-list">
              {modules.map((module) => (
                <button className="module-row" type="button" key={module.label}>
                  <module.icon size={17} aria-hidden="true" />
                  <span>
                    <strong>{module.label}</strong>
                    <small>{module.state}</small>
                  </span>
                  <progress max="100" value={module.progress}>{module.progress}%</progress>
                </button>
              ))}
            </div>
          </Panel>

          <Panel icon={<FileSpreadsheet size={18} />} eyebrow="Floor plan" title="Layout and circulation">
            <button className="floor-plan" type="button" onClick={() => setModal('plan')}>
              <img src={assetUrl('generated-plan.png')} alt="Generated floor plan" />
              <span>
                <strong>Living route is clear</strong>
                <small>860mm path remains open near the balcony and dining zone.</small>
              </span>
            </button>
            <div className="evidence-list">
              {evidenceRows.map((row) => (
                <div className={`evidence-card evidence-card--${row.tone}`} key={row.label}>
                  <strong>{row.value}</strong>
                  <span>{row.label}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={<Bot size={18} />} eyebrow="AI Agent" title="Collaboration log">
            <div className="chat-panel">
              {messages.map((message, index) => (
                <p className={message.role === 'user' ? 'bubble bubble--user' : 'bubble'} key={`${message.role}-${index}`}>
                  {message.text}
                </p>
              ))}
            </div>
            <div className="assistant-input">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                placeholder="Ask about fit, model status, or inventory..."
              />
              <button type="button" onClick={sendMessage} aria-label="Send">
                <Send size={16} />
              </button>
            </div>
            <div className="agent-checklist">
              {agentWork.map((item) => (
                <span key={item}>
                  <Check size={14} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </Panel>
        </section>
      </main>

      {modal === 'search' && (
        <Modal title="Search products" onClose={() => setModal(null)}>
          <label className="search-box">
            <Search size={16} aria-hidden="true" />
            <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search product, category, material..." />
          </label>
          <div className="search-results">
            {filteredProducts.map((product) => (
              <button type="button" key={product.id} onClick={() => selectProduct(product)}>
                <img src={assetUrl(product.image)} alt="" />
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'ar' && (
        <Modal title="Fullscreen AR preview" onClose={() => setModal(null)}>
          <RoomPreview selected={selected} scale={scale} angle={angle} cycleProduct={cycleProduct} large />
        </Modal>
      )}

      {modal === 'plan' && (
        <Modal title="Floor plan" onClose={() => setModal(null)}>
          <img className="plan-large" src={assetUrl('generated-plan.png')} alt="Generated floor plan" />
        </Modal>
      )}

      {toast && (
        <div className="toast" role="status" onAnimationEnd={() => setToast('')}>
          {toast}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  )
}

function Panel({
  icon,
  eyebrow,
  title,
  action,
  children,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
  action?: string
  children: ReactNode
}) {
  return (
    <section className="surface">
      <header className="section-heading">
        <span className="section-icon">{icon}</span>
        <span>
          <small>{eyebrow}</small>
          <strong>{title}</strong>
        </span>
        {action && <em>{action}</em>}
      </header>
      {children}
    </section>
  )
}

function RoomPreview({
  selected,
  scale,
  angle,
  cycleProduct,
  openFullscreen,
  large = false,
}: {
  selected: Product
  scale: number
  angle: number
  cycleProduct: (direction: 'prev' | 'next') => void
  openFullscreen?: () => void
  large?: boolean
}) {
  return (
    <div className={large ? 'room-preview room-preview--large' : 'room-preview'}>
      <img src={assetUrl('generated-room.png')} alt="Generated room" />
      <div className="room-shade" />
      <div
        className="virtual-piece"
        style={{
          left: `${selected.position.left}%`,
          top: `${selected.position.top}%`,
          width: `${selected.position.width * (scale / 100)}%`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      >
        <img src={assetUrl(selected.image)} alt={selected.name} />
        <span>{selected.name}</span>
      </div>
      <div className="room-actions">
        <button type="button" onClick={() => cycleProduct('prev')} aria-label="Previous product">
          <ChevronLeft size={18} />
        </button>
        {openFullscreen && (
          <button type="button" onClick={openFullscreen} aria-label="Fullscreen preview">
            <Maximize2 size={18} />
          </button>
        )}
        <button type="button" onClick={() => cycleProduct('next')} aria-label="Next product">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <span className="spec">
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  )
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default App
