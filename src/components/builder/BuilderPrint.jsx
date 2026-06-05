import { useRef } from 'react'
import './BuilderPrint.css'

const PIECES = ["الصدر","الضهر","الكم","الياقة","البنده"]

function PrintPage({ model, piece }) {
  const pd = model.pieces?.[piece] || {}
  const makok   = pd.makok   || []
  const eyarat  = pd.eyarat  || []
  const needles = pd.needles || []
  const cycles  = pd.cycles  || []

  return (
    <div className="print-page">
      {/* HEADER */}
      <div className="print-header">
        <div className="print-header-right">
          <div className="print-title">Tech Pack — {piece}</div>
          <div className="print-ref">
            {model.name} &nbsp;|&nbsp; {model.model_no} &nbsp;|&nbsp;
            جوج {model.gauge} &nbsp;|&nbsp; {model.machine} &nbsp;|&nbsp;
            المشرف: {model.supervisor}
          </div>
        </div>
        {model.img && <img src={model.img} alt="" className="print-thumb" />}
      </div>

      {/* MAKOK */}
      <div className="print-section">
        <div className="print-sec-title makok">المواكيك</div>
        <table className="print-table">
          <thead>
            <tr><th>الماكوك</th><th>نوع الخيط</th><th>عدد الفتلات</th><th>اللون</th><th>ملاحظات</th></tr>
          </thead>
          <tbody>
            {makok.map((r,i) => (
              <tr key={i}>
                <td className="center">{r.num}</td>
                <td>{r.yarnType}</td>
                <td>{r.plies}</td>
                <td>{r.color}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EYARAT */}
      <div className="print-section">
        <div className="print-sec-title eyarat">عيارات الشغل</div>
        <table className="print-table">
          <thead>
            <tr><th>#</th><th>القيمة</th><th>وظيفة العيار</th><th>ملاحظات</th></tr>
          </thead>
          <tbody>
            {eyarat.map((r,i) => (
              <tr key={i}>
                <td className="center">{r.num}</td>
                <td>{r.value}</td>
                <td>{r.func}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEEDLES */}
      <div className="print-section">
        <div className="print-sec-title needles">عرض الإبر</div>
        <table className="print-table">
          <thead>
            <tr><th>المرحلة</th><th>بداية الإبر</th><th>نهاية الإبر</th><th>القيمة</th><th>ملاحظات</th></tr>
          </thead>
          <tbody>
            {needles.map((r,i) => (
              <tr key={i}>
                <td>{r.stage || `${piece} — مرحلة ${i+1}`}</td>
                <td className="center">{r.start}</td>
                <td className="center">{r.end}</td>
                <td className="center">{r.value}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CYCLES */}
      <div className="print-section">
        <div className="print-sec-title cycles">السياكل</div>
        <table className="print-table">
          <thead>
            <tr><th>#</th><th>اسم السايكل</th><th>القيمة</th><th>ملاحظات</th></tr>
          </thead>
          <tbody>
            {cycles.map((r,i) => (
              <tr key={i}>
                <td className="center">{r.num}</td>
                <td>{r.name}</td>
                <td className="center">{r.value}</td>
                <td>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="print-footer">
        <span>إعداد: __________________</span>
        <span>اعتماد المشرف: __________________</span>
        <span>التاريخ: __________________</span>
        <span>التوقيع: __________________</span>
      </div>
    </div>
  )
}

export default function BuilderPrint({ model, onClose }) {
  const printRef = useRef()

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>Tech Pack — ${model.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; direction: rtl; background: #fff; color: #000; }
          .print-page { width: 210mm; min-height: 297mm; padding: 10mm 12mm; page-break-after: always; }
          .print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #1B2A4A; }
          .print-title { font-size: 18px; font-weight: 700; color: #1B2A4A; margin-bottom: 4px; }
          .print-ref { font-size: 10px; color: #555; }
          .print-thumb { width: 60px; height: 75px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
          .print-section { margin-bottom: 10px; }
          .print-sec-title { font-size: 11px; font-weight: 700; padding: 4px 10px; margin-bottom: 4px; display: inline-block; border-radius: 4px; color: #fff; }
          .makok   { background: #1E7145; }
          .eyarat  { background: #C55A11; }
          .needles { background: #5C3D8F; }
          .cycles  { background: #C00000; }
          .print-table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .print-table th { text-align: right; padding: 5px 8px; background: #F0F4FF; color: #555; font-weight: 600; border: 1px solid #ddd; }
          .print-table td { padding: 4px 8px; border: 1px solid #eee; }
          .print-table tr:nth-child(even) td { background: #FAFBFD; }
          .center { text-align: center; }
          .print-footer { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 10px; color: #888; }
          @media print {
            .print-page { page-break-after: always; }
            @page { size: A4 portrait; margin: 0; }
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `)
    win.document.close()
    setTimeout(() => { win.focus(); win.print(); }, 500)
  }

  return (
    <div className="overlay" onClick={e => e.target.classList.contains('overlay') && onClose()}>
      <div className="modal" style={{maxWidth:860}}>
        <div className="modal-head" style={{alignItems:'center'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600,color:'var(--text)'}}>معاينة الطباعة</div>
            <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{model.name} — {PIECES.length} صفحات</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn-ghost" onClick={onClose}>إغلاق</button>
            <button className="btn-primary" onClick={handlePrint}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              طباعة الكل
            </button>
          </div>
        </div>
        <div className="modal-body print-preview" ref={printRef}>
          {PIECES.map(p => <PrintPage key={p} model={model} piece={p} />)}
        </div>
      </div>
    </div>
  )
}
