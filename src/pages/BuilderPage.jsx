import { useState } from 'react'
import { supabase } from '../supabase'
import BuilderInfo from '../components/builder/BuilderInfo'
import BuilderPiece from '../components/builder/BuilderPiece'
import BuilderPrint from '../components/builder/BuilderPrint'
import './BuilderPage.css'

const PIECES = ["الصدر","الضهر","الكم","الياقة","البنده"]
const PC = {"الصدر":"#58A6FF","الضهر":"#3FB950","الكم":"#BC8CFF","الياقة":"#F0883E","البنده":"#FF7B72"}

function emptyPiece() {
  return {
    makok:   Array(8).fill(0).map((_,i)=>({num:i+1,yarnType:'',plies:'',color:'',notes:''})),
    eyarat:  Array(10).fill(0).map((_,i)=>({num:i+1,value:'',func:'',notes:''})),
    needles: Array(3).fill(0).map((_,i)=>({num:i+1,stage:'',start:'',end:'',value:'',notes:''})),
    cycles:  Array(15).fill(0).map((_,i)=>({num:i+1,name:'',value:'',notes:''})),
  }
}

function emptyModel() {
  const pieces = {}
  PIECES.forEach(p => { pieces[p] = emptyPiece() })
  return {
    name:'', model_no:'', season:'شتوي', machine:'Stoll',
    gauge:'12', supervisor:'', img:null, status:'draft', pieces
  }
}

export default function BuilderPage() {
  const [model, setModel]       = useState(emptyModel())
  const [activePiece, setActivePiece] = useState(PIECES[0])
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [showPrint, setShowPrint] = useState(false)
  const [activeTab, setActiveTab] = useState('info') // info | piece

  const updateInfo = (field, val) => {
    setModel(m => ({...m, [field]: val}))
    setSaved(false)
  }

  const updatePiece = (piece, next) => {
    setModel(m => ({...m, pieces: {...m.pieces, [piece]: next}}))
    setSaved(false)
  }

  const handleSave = async (status='draft') => {
    if (!model.name) { alert('من فضلك أدخل اسم الموديل'); return }
    setSaving(true)
    const payload = { ...model, status, updated_at: new Date().toISOString() }
    let result
    if (model.id) {
      result = await supabase.from('tech_packs').update(payload).eq('id', model.id).select().single()
    } else {
      result = await supabase.from('tech_packs').insert([payload]).select().single()
    }
    setSaving(false)
    if (result.error) { alert('خطأ في الحفظ: ' + result.error.message); return }
    setModel(result.data)
    setSaved(true)
    if (status === 'approved') {
      // copy to archive
      const archiveData = {
        name: result.data.name, model_no: result.data.model_no,
        season: result.data.season, machine: result.data.machine,
        gauge: result.data.gauge, supervisor: result.data.supervisor,
        img: result.data.img, pieces: result.data.pieces,
        archived_date: new Date().toLocaleDateString('ar-EG')
      }
      await supabase.from('models').insert([archiveData])
      alert('✅ تم اعتماد الموديل وحفظه في الأرشيف!')
    }
  }

  const handleNew = () => {
    if (!saved && model.name) {
      if (!window.confirm('هل تريد إنشاء موديل جديد؟ التغييرات غير المحفوظة ستُفقد')) return
    }
    setModel(emptyModel())
    setActivePiece(PIECES[0])
    setActiveTab('info')
    setSaved(false)
  }

  return (
    <div className="builder">
      {/* ── BUILDER HEADER ── */}
      <div className="builder-header">
        <div className="builder-header-right">
          <div className="builder-title">
            {model.name || 'موديل جديد'}
            {model.status === 'approved' && <span className="status-badge approved">معتمد</span>}
            {model.status === 'draft' && model.name && <span className="status-badge draft">مسودة</span>}
          </div>
          {model.model_no && <div className="builder-subtitle">{model.model_no}</div>}
        </div>
        <div className="builder-actions">
          <button className="action-btn ghost" onClick={handleNew}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M12 4v16m8-8H4"/>
            </svg>
            موديل جديد
          </button>
          <button className="action-btn ghost" onClick={() => setShowPrint(true)} disabled={!model.name}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            طباعة
          </button>
          <button className="action-btn primary" onClick={() => handleSave('draft')} disabled={saving}>
            {saving ? 'جاري الحفظ...' : saved ? '✓ محفوظ' : 'حفظ'}
          </button>
          <button className="action-btn approve" onClick={() => handleSave('approved')} disabled={saving || !model.name}>
            اعتماد وأرشفة
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="builder-tabs">
        <button
          className={`btab ${activeTab==='info'?'active':''}`}
          onClick={() => setActiveTab('info')}
        >
          معلومات الموديل
        </button>
        {PIECES.map(p => (
          <button
            key={p}
            className={`btab ${activeTab==='piece' && activePiece===p ? 'active' : ''}`}
            style={activeTab==='piece' && activePiece===p ? {color:PC[p],borderColor:PC[p]} : {}}
            onClick={() => { setActiveTab('piece'); setActivePiece(p) }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="builder-content">
        {activeTab === 'info' && (
          <BuilderInfo model={model} onChange={updateInfo} />
        )}
        {activeTab === 'piece' && (
          <BuilderPiece
            key={activePiece}
            piece={activePiece}
            data={model.pieces[activePiece]}
            color={PC[activePiece]}
            onChange={next => updatePiece(activePiece, next)}
          />
        )}
      </div>

      {/* ── PRINT MODAL ── */}
      {showPrint && (
        <BuilderPrint model={model} onClose={() => setShowPrint(false)} />
      )}
    </div>
  )
}
