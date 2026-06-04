import * as XLSX from 'xlsx'

const PIECES = ["الصدر","الضهر","الكم","الياقة","البنده"]

function cv(ws, addr) {
  const cell = ws[addr]
  return cell ? String(cell.v || '').trim() : ''
}

export function parseXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const model = {
          archived_date: new Date().toLocaleDateString('ar-EG'),
          img: null,
          pieces: {}
        }

        // ── INFO SHEET ──
        // Labels: B6=اسم الموديل, D6=رقم الموديل
        //         B7=الموسم,      D7=نوع الماكينة
        //         B8=المشرف,      D8=الجوج
        // Values: C6, E6, C7, E7, C8, E8
        const iName = wb.SheetNames.find(n => n.includes('معلومات'))
        if (iName) {
          const iws = wb.Sheets[iName]
          model.name       = cv(iws, 'C6')
          model.model_no   = cv(iws, 'E6')
          model.season     = cv(iws, 'C7')
          model.machine    = cv(iws, 'E7')
          model.supervisor = cv(iws, 'C8')
          model.gauge      = cv(iws, 'E8')
        }

        // ── PIECE SHEETS ──
        // Makok rows 7-14:   B=label, C=yarn, D=plies, E=color, F=notes
        // Eyarat rows 18-27: B=num,   C=value, D=func,  F=notes
        // Needle rows 31-33: B=stage, C=start, D=end,   E=value, F=notes
        // Cycle rows 37-51:  B=num,   C=name,  E=value, F=notes
        PIECES.forEach(p => {
          const sName = wb.SheetNames.find(n => n.includes(p))
          if (!sName) {
            model.pieces[p] = { makok: [], eyarat: [], needles: [], cycles: [] }
            return
          }
          const pws = wb.Sheets[sName]

          const makok = []
          for (let r = 7; r <= 14; r++) {
            makok.push({
              num: r - 6,
              yarnType: cv(pws, `C${r}`),
              plies:    cv(pws, `D${r}`),
              color:    cv(pws, `E${r}`),
              notes:    cv(pws, `F${r}`)
            })
          }

          const eyarat = []
          for (let r = 18; r <= 27; r++) {
            eyarat.push({
              num:   r - 17,
              value: cv(pws, `C${r}`),
              func:  cv(pws, `D${r}`),
              notes: cv(pws, `F${r}`)
            })
          }

          const needles = []
          for (let r = 31; r <= 33; r++) {
            needles.push({
              stage: cv(pws, `B${r}`),
              start: cv(pws, `C${r}`),
              end:   cv(pws, `D${r}`),
              value: cv(pws, `E${r}`),
              notes: cv(pws, `F${r}`)
            })
          }

          const cycles = []
          for (let r = 37; r <= 51; r++) {
            cycles.push({
              num:   r - 36,
              name:  cv(pws, `C${r}`),
              value: cv(pws, `E${r}`),
              notes: cv(pws, `F${r}`)
            })
          }

          model.pieces[p] = { makok, eyarat, needles, cycles }
        })

        resolve(model)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
