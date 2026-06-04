import { useState } from 'react'
import { PieceNav, PIECES, PC, PC_BG } from './PieceTabs'

function PieceBody({ data }) {
  if (!data) return null
  const makok   = (data.makok   || []).filter(r => r.yarnType || r.color || r.notes)
  const eyarat  = (data.eyarat  || []).filter(r => r.value || r.func)
  const needles = (data.needles || [])
  const cycles  = (data.cycles  || []).filter(r => r.name || r.value)

  return (
    <>
      <div className="section">
        <div className="sec-title" style={{background:'#0D2149',color:'#58A6FF'}}>المواكيك</div>
        {makok.length ? (
          <table className="data-table">
            <thead><tr><th>الماكوك</th><th>نوع الخيط</th><th>الفتلات</th><th>اللون</th><th>ملاحظات</th></tr></thead>
            <tbody>{makok.map((r,i) => (
              <tr key={i}>
                <td style={{color:'var(--muted2)',textAlign:'center'}}>{r.num}</td>
                <td>{r.yarnType||'—'}</td><td>{r.plies||'—'}</td>
                <td>{r.color||'—'}</td><td>{r.notes||'—'}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p className="no-data">لا توجد بيانات</p>}
      </div>

      <div className="section">
        <div className="sec-title" style={{background:'var(--orange-bg)',color:'var(--orange)'}}>العيارات</div>
        {eyarat.length ? (
          <table className="data-table">
            <thead><tr><th>#</th><th>القيمة</th><th>الوظيفة</th><th>ملاحظات</th></tr></thead>
            <tbody>{eyarat.map((r,i) => (
              <tr key={i}>
                <td style={{color:'var(--muted2)',textAlign:'center'}}>{r.num}</td>
                <td>{r.value||'—'}</td><td>{r.func||'—'}</td><td>{r.notes||'—'}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p className="no-data">لا توجد بيانات</p>}
      </div>

      <div className="section">
        <div className="sec-title" style={{background:'var(--purple-bg)',color:'var(--purple)'}}>عرض الإبر</div>
        <table className="data-table">
          <thead><tr><th>المرحلة</th><th>بداية</th><th>نهاية</th><th>القيمة</th><th>ملاحظات</th></tr></thead>
          <tbody>{needles.map((r,i) => (
            <tr key={i}>
              <td>{r.stage||'—'}</td><td>{r.start||'—'}</td>
              <td>{r.end||'—'}</td><td>{r.value||'—'}</td><td>{r.notes||'—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div className="section">
        <div className="sec-title" style={{background:'var(--red-bg)',color:'var(--red)'}}>السياكل</div>
        {cycles.length ? (
          <table className="data-table">
            <thead><tr><th>#</th><th>اسم السايكل</th><th>القيمة</th><th>ملاحظات</th></tr></thead>
            <tbody>{cycles.map((r,i) => (
              <tr key={i}>
                <td style={{color:'var(--muted2)',textAlign:'center'}}>{r.num}</td>
                <td>{r.name||'—'}</td><td>{r.value||'—'}</td><td>{r.notes||'—'}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p className="no-data">لا توجد بيانات</p>}
      </div>
    </>
  )
}

export default function ViewModal({ model: m, onClose, onEdit, onDelete }) {
  const [piece, setPiece] = useState(PIECES[0])

  return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <div className="modal">
        <div className="modal-head">
          {m.img
            ? <img src={m.img} alt={m.name} style={{width:72,height:88,borderRadius:8,objectFit:'cover',flexShrink:0,border:'1px solid var(--border)'}} />
            : <div style={{width:72,height:88,borderRadius:8,background:'var(--bg2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:'1px solid var(--border)'}}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{color:'var(--muted2)'}}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
          }
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:18,fontWeight:600,color:'var(--text)',marginBottom:5}}>{m.name||'بدون اسم'}</div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
              <span className={`badge ${m.machine==='Stoll'?'b-stoll':'b-chinese'}`}>{m.machine||'—'}</span>
              <span className={`badge ${m.season==='شتوي'?'b-winter':'b-summer'}`}>{m.season||'—'}</span>
              <span className="badge b-gauge">جوج {m.gauge||'—'}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {[['رقم الموديل', m.model_no], ['المشرف', m.supervisor], ['تاريخ الأرشفة', m.archived_date]].map(([l,v]) => (
                <div key={l} style={{background:'var(--bg2)',borderRadius:'var(--radius-sm)',padding:'7px 9px'}}>
                  <div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text)',fontFamily:l==='رقم الموديل'?'monospace':'inherit'}}>{v||'—'}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
            <button className="btn-edit" onClick={onEdit}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              تعديل
            </button>
            <button className="btn-icon" onClick={onDelete}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
            <button className="btn-close" onClick={onClose}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <PieceNav active={piece} onChange={setPiece} />
        <div className="modal-body">
          <PieceBody data={m.pieces?.[piece]} />
        </div>
      </div>
    </div>
  )
}
