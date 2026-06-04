import { useState, useRef } from 'react'
import { supabase } from '../supabase'
import { parseXlsx } from '../utils/parseXlsx'
import './UploadModal.css'

export default function UploadModal({ onClose, onSaved }) {
  const [parsed, setParsed]   = useState(null)
  const [imgData, setImgData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const xlsxRef = useRef()
  const imgRef  = useRef()

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.xlsx')) return
    try {
      const model = await parseXlsx(file)
      setParsed(model)
    } catch {
      alert('خطأ في قراءة الملف — تأكد إنه نفس قالب الـ Tech Pack')
    }
  }

  const handleImg = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setImgData(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!parsed) return
    setLoading(true)
    const { data, error } = await supabase
      .from('models')
      .insert([{ ...parsed, img: imgData }])
      .select()
      .single()
    setLoading(false)
    if (error) { alert('خطأ في الحفظ: ' + error.message); return }
    onSaved(data)
  }

  return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <div className="modal">
        <div className="modal-head" style={{alignItems:'center'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:600,color:'var(--text)'}}>رفع Tech Pack</div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="modal-body" style={{maxHeight:'none'}}>
          {/* DROP ZONE */}
          <div
            className={`drop-zone ${dragging ? 'drag' : ''}`}
            onClick={() => xlsxRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3>اسحب ملف الـ Tech Pack هنا</h3>
            <p>أو اضغط لاختيار ملف .xlsx</p>
          </div>
          <input ref={xlsxRef} type="file" accept=".xlsx" style={{display:'none'}}
            onChange={e => handleFile(e.target.files[0])} />

          {/* PARSED PREVIEW */}
          {parsed && (
            <div className="parsed-box">
              <h4>البيانات المستخرجة</h4>
              {[
                ['اسم الموديل', parsed.name],
                ['رقم الموديل', parsed.model_no],
                ['الموسم', parsed.season],
                ['نوع الماكينة', parsed.machine],
                ['الجوج', parsed.gauge],
                ['المشرف', parsed.supervisor],
              ].map(([label, val]) => (
                <div key={label} className="parsed-row">
                  <span className="parsed-label">{label}</span>
                  <span className="parsed-val">{val || '—'}</span>
                </div>
              ))}
            </div>
          )}

          {/* IMAGE */}
          <div className="img-drop" onClick={() => imgRef.current.click()}>
            {imgData
              ? <img src={imgData} alt="" style={{maxHeight:90,borderRadius:6,display:'block',margin:'0 auto'}} />
              : <>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                    style={{width:20,height:20,margin:'0 auto 5px',display:'block',color:'var(--muted)'}}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path strokeLinecap="round" d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span>أضف صورة الموديل (اختياري)</span>
                </>
            }
          </div>
          <input ref={imgRef} type="file" accept="image/*" style={{display:'none'}}
            onChange={e => handleImg(e.target.files[0])} />
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" onClick={handleSave} disabled={!parsed || loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ في الأرشيف'}
          </button>
        </div>
      </div>
    </div>
  )
}
