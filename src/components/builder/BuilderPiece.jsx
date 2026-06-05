import './BuilderPiece.css'

const YARN_TYPES  = ['','عجينه','قطيفة','أكريليك','بوليستر']
const PLIES_TYPES = ['','فتلة واحدة','فتلتين','3 فتلات','4 فتلات']

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

export default function BuilderPiece({ piece, data, color, onChange }) {
  const update = (section, idx, field, val) => {
    const next = deepClone(data)
    next[section][idx][field] = val
    onChange(next)
  }

  const { makok=[], eyarat=[], needles=[], cycles=[] } = data || {}

  const PC_BG = {
    "#58A6FF":"#0D2149","#3FB950":"#0D4429",
    "#BC8CFF":"#2D1F5E","#F0883E":"#3D2B1A","#FF7B72":"#3D1F1F"
  }
  const bg = PC_BG[color] || '#1a1a2e'

  return (
    <div className="builder-piece">

      {/* ── MAKOK ── */}
      <div className="piece-section">
        <div className="piece-sec-title" style={{background:bg, color}}>
          المواكيك
        </div>
        <div className="table-wrap">
          <table className="builder-table">
            <thead>
              <tr>
                <th style={{width:60}}>الماكوك</th>
                <th>نوع الخيط</th>
                <th>عدد الفتلات</th>
                <th>اللون</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {makok.map((r,i) => (
                <tr key={i}>
                  <td className="row-num">{r.num}</td>
                  <td>
                    <select
                      className="cell-select"
                      value={r.yarnType||''}
                      onChange={e => update('makok',i,'yarnType',e.target.value)}
                    >
                      {YARN_TYPES.map(y => <option key={y} value={y}>{y||'—'}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={r.plies||''}
                      onChange={e => update('makok',i,'plies',e.target.value)}
                    >
                      {PLIES_TYPES.map(p => <option key={p} value={p}>{p||'—'}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.color||''}
                      placeholder="اللون"
                      onChange={e => update('makok',i,'color',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.notes||''}
                      placeholder="ملاحظات"
                      onChange={e => update('makok',i,'notes',e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EYARAT ── */}
      <div className="piece-section">
        <div className="piece-sec-title" style={{background:'var(--orange-bg)',color:'var(--orange)'}}>
          عيارات الشغل
        </div>
        <div className="table-wrap">
          <table className="builder-table">
            <thead>
              <tr>
                <th style={{width:50}}>#</th>
                <th style={{width:140}}>القيمة</th>
                <th>وظيفة العيار</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {eyarat.map((r,i) => (
                <tr key={i}>
                  <td className="row-num">{r.num}</td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.value||''}
                      placeholder="القيمة"
                      onChange={e => update('eyarat',i,'value',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.func||''}
                      placeholder="وظيفة العيار"
                      onChange={e => update('eyarat',i,'func',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.notes||''}
                      placeholder="ملاحظات"
                      onChange={e => update('eyarat',i,'notes',e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── NEEDLES ── */}
      <div className="piece-section">
        <div className="piece-sec-title" style={{background:'var(--purple-bg)',color:'var(--purple)'}}>
          عرض الإبر
        </div>
        <div className="table-wrap">
          <table className="builder-table">
            <thead>
              <tr>
                <th>المرحلة</th>
                <th style={{width:100}}>بداية الإبر</th>
                <th style={{width:100}}>نهاية الإبر</th>
                <th style={{width:100}}>القيمة</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {needles.map((r,i) => (
                <tr key={i}>
                  <td>
                    <input
                      className="cell-input"
                      value={r.stage||''}
                      placeholder={`${piece} — مرحلة ${i+1}`}
                      onChange={e => update('needles',i,'stage',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input center"
                      value={r.start||''}
                      placeholder="0"
                      onChange={e => update('needles',i,'start',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input center"
                      value={r.end||''}
                      placeholder="0"
                      onChange={e => update('needles',i,'end',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input center"
                      value={r.value||''}
                      placeholder="0"
                      onChange={e => update('needles',i,'value',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.notes||''}
                      placeholder="ملاحظات"
                      onChange={e => update('needles',i,'notes',e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CYCLES ── */}
      <div className="piece-section">
        <div className="piece-sec-title" style={{background:'var(--red-bg)',color:'var(--red)'}}>
          السياكل
        </div>
        <div className="table-wrap">
          <table className="builder-table">
            <thead>
              <tr>
                <th style={{width:50}}>#</th>
                <th>اسم السايكل</th>
                <th style={{width:120}}>القيمة</th>
                <th>ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((r,i) => (
                <tr key={i}>
                  <td className="row-num">{r.num}</td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.name||''}
                      placeholder="اسم السايكل"
                      onChange={e => update('cycles',i,'name',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input center"
                      value={r.value||''}
                      placeholder="القيمة"
                      onChange={e => update('cycles',i,'value',e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={r.notes||''}
                      placeholder="ملاحظات"
                      onChange={e => update('cycles',i,'notes',e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
