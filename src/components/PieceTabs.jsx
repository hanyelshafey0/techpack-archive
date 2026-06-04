const PIECES = ["الصدر","الضهر","الكم","الياقة","البنده"]
const PC = {
  "الصدر":"#58A6FF","الضهر":"#3FB950",
  "الكم":"#BC8CFF","الياقة":"#F0883E","البنده":"#FF7B72"
}
const PC_BG = {
  "الصدر":"#0D2149","الضهر":"#0D4429",
  "الكم":"#2D1F5E","الياقة":"#3D2B1A","البنده":"#3D1F1F"
}

export { PIECES, PC, PC_BG }

export function PieceNav({ active, onChange }) {
  return (
    <div className="piece-nav">
      {PIECES.map(p => (
        <button
          key={p}
          className={`pnav-btn${active === p ? ' active' : ''}`}
          style={active === p ? {background: PC[p], color: '#0D1117', borderColor: PC[p]} : {}}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

export function SectionTitle({ color, bg, children }) {
  return (
    <div className="sec-title" style={{background: bg, color}}>
      {children}
    </div>
  )
}
