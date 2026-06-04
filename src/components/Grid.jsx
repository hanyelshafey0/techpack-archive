import './Grid.css'

const PC = {
  "الصدر":"#58A6FF","الضهر":"#3FB950",
  "الكم":"#BC8CFF","الياقة":"#F0883E","البنده":"#FF7B72"
}
const PIECES = ["الصدر","الضهر","الكم","الياقة","البنده"]

function badgeMachine(m) { return m === 'Stoll' ? 'b-stoll' : 'b-chinese' }
function badgeSeason(s)  { return s === 'شتوي'  ? 'b-winter' : 'b-summer' }

export default function Grid({ models, loading, onOpen, onDelete, isEmpty }) {
  if (loading) return (
    <div className="grid-loading">
      {Array(8).fill(0).map((_,i) => <div key={i} className="skeleton" />)}
    </div>
  )

  if (isEmpty) return (
    <div className="empty">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth="1"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
      </svg>
      <h3>الأرشيف فاضي</h3>
      <p>ارفع أول ملف Tech Pack وهيظهر هنا</p>
    </div>
  )

  if (!models.length) return (
    <div className="empty">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="11" cy="11" r="8" strokeWidth="1"/>
        <path strokeLinecap="round" strokeWidth="1" d="M21 21l-4.35-4.35"/>
      </svg>
      <h3>لا توجد نتائج</h3>
      <p>جرب تغيير الفلتر أو البحث</p>
    </div>
  )

  return (
    <div className="grid">
      {models.map(m => (
        <div key={m.id} className="card" onClick={() => onOpen(m)}>
          <button
            className="card-del"
            onClick={e => { e.stopPropagation(); onDelete(m.id) }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {m.img
            ? <img className="card-img" src={m.img} alt={m.name} loading="lazy" />
            : <div className="card-ph">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path strokeLinecap="round" d="M21 15l-5-5L5 21"/>
                </svg>
                <span>لا توجد صورة</span>
              </div>
          }

          <div className="card-info">
            <div className="card-name">{m.name || 'بدون اسم'}</div>
            <div className="card-badges">
              <span className={`badge ${badgeMachine(m.machine)}`}>{m.machine || '—'}</span>
              <span className={`badge ${badgeSeason(m.season)}`}>{m.season || '—'}</span>
              <span className="badge b-gauge">G{m.gauge || '—'}</span>
            </div>
            <div className="card-dots">
              {PIECES.map(p => (
                <div key={p} className="dot" style={{background: PC[p]}} title={p} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
