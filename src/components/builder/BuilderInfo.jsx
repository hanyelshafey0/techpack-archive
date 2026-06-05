import './BuilderInfo.css'

const SEASONS  = ['شتوي','صيفي']
const MACHINES = ['Stoll','Chinese']
const GAUGES   = ['3','5','7','10','12','14','16','18']

export default function BuilderInfo({ model, onChange }) {
  const handleImg = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => onChange('img', e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="builder-info">
      <div className="info-main">
        {/* ── FIELDS ── */}
        <div className="info-fields">
          <div className="section-label">بيانات الموديل</div>
          <div className="fields-grid">
            <div className="fgroup">
              <label>اسم الموديل <span className="required">*</span></label>
              <input
                value={model.name}
                onChange={e => onChange('name', e.target.value)}
                placeholder="مثال: بلوفر كلاسيك"
              />
            </div>
            <div className="fgroup">
              <label>رقم الموديل</label>
              <input
                value={model.model_no}
                onChange={e => onChange('model_no', e.target.value)}
                placeholder="مثال: W-2024-001"
                style={{fontFamily:'monospace'}}
              />
            </div>
            <div className="fgroup">
              <label>الموسم</label>
              <select value={model.season} onChange={e => onChange('season', e.target.value)}>
                {SEASONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>نوع الماكينة</label>
              <select value={model.machine} onChange={e => onChange('machine', e.target.value)}>
                {MACHINES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>الجوج</label>
              <select value={model.gauge} onChange={e => onChange('gauge', e.target.value)}>
                {GAUGES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>المشرف</label>
              <input
                value={model.supervisor}
                onChange={e => onChange('supervisor', e.target.value)}
                placeholder="اسم المشرف"
              />
            </div>
          </div>
        </div>

        {/* ── IMAGE ── */}
        <div className="info-image">
          <div className="section-label">صورة الموديل</div>
          <div
            className="img-upload-box"
            onClick={() => document.getElementById('builder-img').click()}
          >
            {model.img
              ? <img src={model.img} alt="الموديل" className="uploaded-img" />
              : <div className="img-placeholder">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path strokeLinecap="round" d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span>اضغط لإضافة صورة</span>
                  <small>PNG, JPG</small>
                </div>
            }
          </div>
          <input
            id="builder-img" type="file" accept="image/*"
            style={{display:'none'}}
            onChange={e => handleImg(e.target.files[0])}
          />
          {model.img && (
            <button className="remove-img" onClick={() => onChange('img', null)}>
              حذف الصورة
            </button>
          )}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      <div className="info-summary">
        <div className="section-label">ملخص الموديل</div>
        <div className="summary-grid">
          {[
            ['اسم الموديل', model.name || '—'],
            ['رقم الموديل', model.model_no || '—'],
            ['الموسم',      model.season],
            ['الماكينة',    model.machine],
            ['الجوج',       model.gauge],
            ['المشرف',      model.supervisor || '—'],
          ].map(([l,v]) => (
            <div key={l} className="summary-item">
              <span className="summary-label">{l}</span>
              <span className="summary-val">{v}</span>
            </div>
          ))}
        </div>
        <div className="pieces-hint">
          <div className="section-label" style={{marginBottom:8}}>القطع</div>
          <p>اضغط على تبويب أي قطعة من الأعلى لتعبئة بياناتها</p>
          <div className="pieces-list">
            {["الصدر","الضهر","الكم","الياقة","البنده"].map(p => (
              <span key={p} className="piece-chip">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
