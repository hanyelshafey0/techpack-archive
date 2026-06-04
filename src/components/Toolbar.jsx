import './Toolbar.css'

export default function Toolbar({
  search, onSearch,
  filterSeason, onSeason,
  filterMachine, onMachine,
  filterGauge, onGauge,
  total, winter, summer
}) {
  return (
    <div className="toolbar-wrap">
      <div className="toolbar">
        <div className="search-wrap">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text" value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="ابحث باسم الموديل أو رقمه..."
          />
        </div>
        <select value={filterSeason} onChange={e => onSeason(e.target.value)}>
          <option value="">كل المواسم</option>
          <option>شتوي</option><option>صيفي</option>
        </select>
        <select value={filterMachine} onChange={e => onMachine(e.target.value)}>
          <option value="">كل الماكينات</option>
          <option>Stoll</option><option>Chinese</option>
        </select>
        <select value={filterGauge} onChange={e => onGauge(e.target.value)}>
          <option value="">كل الجوج</option>
          {['3','5','7','10','12','14','16','18'].map(g => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="stats-bar">
        <span className="stat"><strong>{total}</strong> موديل</span>
        <span className="stat"><strong>{winter}</strong> شتوي</span>
        <span className="stat"><strong>{summer}</strong> صيفي</span>
      </div>
    </div>
  )
}
