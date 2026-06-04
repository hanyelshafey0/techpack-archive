import { useState } from 'react'
import { supabase } from '../supabase'
import { PieceNav, PIECES, PC, PC_BG } from './PieceTabs'

const YARN_TYPES  = ['عجينه','قطيفة','أكريليك','بوليستر']
const PLIES_TYPES = ['فتلة واحدة','فتلتين','3 فتلات','4 فتلات']

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

function EditPiece({ data, onChange }) {
  const update = (section, idx, field, val) => {
    const next = deepClone(data)
    next[section][idx][field] = val
    onChange(next)
  }

  const { makok=[], eyarat=[], needles=[], cycles=[] } = data || {}

  return (
    <>
      {/* MAKOK */}
      <div className="sec-title" style={{background:'#0D2149',color:'#58A6FF',marginBottom:8}}>المواكيك</div>
      <table className="data-table" style={{marginBottom:14}}>
        <thead><tr><th>الماكوك</th><th>نوع الخيط</th><th>الفتلات</th><th>اللون</th><th>ملاحظات</th></tr></thead>
        <tbody>{makok.map((r,i) => (
          <tr key={i}>
            <td style={{color:'var(--muted2)',textAlign:'center',fontSize:11}}>{r.num||i+1}</td>
            <td><select className="inline-select" value={r.yarnType||''} onChange={e=>update('makok',i,'yarnType',e.target.value)}>
              <option value="">—</option>{YARN_TYPES.map(y=><option key={y}>{y}</option>)}
            </select></td>
            <td><select className="inline-select" value={r.plies||''} onChange={e=>update('makok',i,'plies',e.target.value)}>
              <option value="">—</option>{PLIES_TYPES.map(p=><option key={p}>{p}</option>)}
            </select></td>
            <td><input className="inline-input" value={r.color||''} onChange={e=>update('makok',i,'color',e.target.value)}/></td>
            <td><input className="inline-input" value={r.notes||''} onChange={e=>update('makok',i,'notes',e.target.value)}/></td>
          </tr>
        ))}</tbody>
      </table>

      {/* EYARAT */}
      <div className="sec-title" style={{background:'var(--orange-bg)',color:'var(--orange)',marginBottom:8}}>العيارات</div>
      <table className="data-table" style={{marginBottom:14}}>
        <thead><tr><th>#</th><th>القيمة</th><th>الوظيفة</th><th>ملاحظات</th></tr></thead>
        <tbody>{eyarat.map((r,i) => (
          <tr key={i}>
            <td style={{color:'var(--muted2)',textAlign:'center'}}>{r.num||i+1}</td>
            <td><input className="inline-input" value={r.value||''} onChange={e=>update('eyarat',i,'value',e.target.value)}/></td>
            <td><input className="inline-input" value={r.func||''} onChange={e=>update('eyarat',i,'func',e.target.value)}/></td>
            <td><input className="inline-input" value={r.notes||''} onChange={e=>update('eyarat',i,'notes',e.target.value)}/></td>
          </tr>
        ))}</tbody>
      </table>

      {/* NEEDLES */}
      <div className="sec-title" style={{background:'var(--purple-bg)',color:'var(--purple)',marginBottom:8}}>عرض الإبر</div>
      <table className="data-table" style={{marginBottom:14}}>
        <thead><tr><th>المرحلة</th><th>بداية</th><th>نهاية</th><th>القيمة</th><th>ملاحظات</th></tr></thead>
        <tbody>{needles.map((r,i) => (
          <tr key={i}>
            <td><input className="inline-input" value={r.stage||''} onChange={e=>update('needles',i,'stage',e.target.value)}/></td>
            <td><input className="inline-input" style={{width:60}} value={r.start||''} onChange={e=>update('needles',i,'start',e.target.value)}/></td>
            <td><input className="inline-input" style={{width:60}} value={r.end||''} onChange={e=>update('needles',i,'end',e.target.value)}/></td>
            <td><input className="inline-input" style={{width:60}} value={r.value||''} onChange={e=>update('needles',i,'value',e.target.value)}/></td>
            <td><input className="inline-input" value={r.notes||''} onChange={e=>update('needles',i,'notes',e.target.value)}/></td>
          </tr>
        ))}</tbody>
      </table>

      {/* CYCLES */}
      <div className="sec-title" style={{background:'var(--red-bg)',color:'var(--red)',marginBottom:8}}>السياكل</div>
      <table className="data-table">
        <thead><tr><th>#</th><th>اسم السايكل</th><th>القيمة</th><th>ملاحظات</th></tr></thead>
        <tbody>{cycles.map((r,i) => (
          <tr key={i}>
            <td style={{color:'var(--muted2)',textAlign:'center'}}>{r.num||i+1}</td>
            <td><input className="inline-input" value={r.name||''} onChange={e=>update('cycles',i,'name',e.target.value)}/></td>
            <td><input className="inline-input" value={r.value||''} onChange={e=>update('cycles',i,'value',e.target.value)}/></td>
            <td><input className="inline-input" value={r.notes||''} onChange={e=>update('cycles',i,'notes',e.target.value)}/></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  )
}

export default function EditModal({ model, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:       model.name       || '',
    model_no:   model.model_no   || '',
    season:     model.season     || 'شتوي',
    machine:    model.machine    || 'Stoll',
    gauge:      model.gauge      || '12',
    supervisor: model.supervisor || '',
  })
  const [pieces, setPieces] = useState(deepClone(model.pieces || {}))
  const [img, setImg]       = useState(model.img || null)
  const [piece, setPiece]   = useState(PIECES[0])
  const [saving, setSaving] = useState(false)

  const handleImg = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setImg(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    const updated = { ...form, pieces, img }
    const { data, error } = await supabase
      .from('models')
      .update(updated)
      .eq('id', model.id)
      .select()
      .single()
    setSaving(false)
    if (error) { alert('خطأ: ' + error.message); return }
    onSaved(data)
  }

  return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <div className="modal">
        <div className="modal-head" style={{alignItems:'center'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:600,color:'var(--text)'}}>تعديل الموديل</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:2,fontFamily:'monospace'}}>{model.model_no}</div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body" style={{maxHeight:'60vh'}}>
          {/* INFO FIELDS */}
          <div className="form-grid">
            <div className="fgroup">
              <label>اسم الموديل</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div className="fgroup">
              <label>رقم الموديل</label>
              <input value={form.model_no} style={{fontFamily:'monospace'}} onChange={e=>setForm(f=>({...f,model_no:e.target.value}))} />
            </div>
            <div className="fgroup">
              <label>الموسم</label>
              <select value={form.season} onChange={e=>setForm(f=>({...f,season:e.target.value}))}>
                <option>شتوي</option><option>صيفي</option>
              </select>
            </div>
            <div className="fgroup">
              <label>نوع الماكينة</label>
              <select value={form.machine} onChange={e=>setForm(f=>({...f,machine:e.target.value}))}>
                <option>Stoll</option><option>Chinese</option>
              </select>
            </div>
            <div className="fgroup">
              <label>الجوج</label>
              <select value={form.gauge} onChange={e=>setForm(f=>({...f,gauge:e.target.value}))}>
                {['3','5','7','10','12','14','16','18'].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>المشرف</label>
              <input value={form.supervisor} onChange={e=>setForm(f=>({...f,supervisor:e.target.value}))} />
            </div>
          </div>

          <div className="sep"/>

          {/* PIECE TABS */}
          <div style={{fontSize:11,color:'var(--muted)',marginBottom:10,fontWeight:600}}>بيانات القطع</div>
          <PieceNav active={piece} onChange={setPiece} />
          <div style={{marginTop:14}}>
            <EditPiece
              data={pieces[piece]}
              onChange={next => setPieces(p => ({...p, [piece]: next}))}
            />
          </div>

          <div className="sep"/>
          <div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>صورة الموديل</div>
          <div className="img-drop" onClick={() => document.getElementById('edit-img-inp').click()}>
            {img
              ? <img src={img} alt="" style={{maxHeight:80,borderRadius:6,display:'block',margin:'0 auto'}} />
              : <span>اضغط لاستبدال الصورة (اختياري)</span>
            }
          </div>
          <input id="edit-img-inp" type="file" accept="image/*" style={{display:'none'}}
            onChange={e=>handleImg(e.target.files[0])} />
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </div>
    </div>
  )
}
