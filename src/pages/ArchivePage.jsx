import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'
import Grid from '../components/Grid'
import Toolbar from '../components/Toolbar'
import ViewModal from '../components/ViewModal'
import EditModal from '../components/EditModal'

export default function ArchivePage() {
  const [models, setModels]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filterSeason,  setFilterSeason]  = useState('')
  const [filterMachine, setFilterMachine] = useState('')
  const [filterGauge,   setFilterGauge]   = useState('')
  const [viewModel, setViewModel] = useState(null)
  const [editModel, setEditModel] = useState(null)

  const fetchModels = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false })
    setModels(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchModels() }, [fetchModels])

  const filtered = models.filter(m => {
    const q = search.toLowerCase()
    return (
      (!q || (m.name||'').toLowerCase().includes(q) || (m.model_no||'').toLowerCase().includes(q)) &&
      (!filterSeason  || m.season  === filterSeason)  &&
      (!filterMachine || m.machine === filterMachine) &&
      (!filterGauge   || m.gauge   === filterGauge)
    )
  })

  const handleDelete = async (id) => {
    if (!window.confirm('هل متأكد من حذف الموديل؟')) return
    await supabase.from('models').delete().eq('id', id)
    setModels(prev => prev.filter(m => m.id !== id))
    setViewModel(null)
  }

  const handleSaved = (saved) => {
    setModels(prev => {
      const idx = prev.findIndex(m => m.id === saved.id)
      if (idx > -1) { const n=[...prev]; n[idx]=saved; return n }
      return [saved, ...prev]
    })
  }

  return (
    <div>
      <Toolbar
        search={search} onSearch={setSearch}
        filterSeason={filterSeason}   onSeason={setFilterSeason}
        filterMachine={filterMachine} onMachine={setFilterMachine}
        filterGauge={filterGauge}     onGauge={setFilterGauge}
        total={models.length}
        winter={models.filter(m=>m.season==='شتوي').length}
        summer={models.filter(m=>m.season==='صيفي').length}
      />
      <Grid
        models={filtered} loading={loading}
        onOpen={m => { setEditModel(null); setViewModel(m) }}
        onDelete={handleDelete}
        isEmpty={models.length === 0}
      />
      {viewModel && (
        <ViewModal
          model={viewModel}
          onClose={() => setViewModel(null)}
          onEdit={() => { setViewModel(null); setEditModel(viewModel) }}
          onDelete={() => handleDelete(viewModel.id)}
        />
      )}
      {editModel && (
        <EditModal
          model={editModel}
          onClose={() => setEditModel(null)}
          onSaved={m => { handleSaved(m); setEditModel(null) }}
        />
      )}
    </div>
  )
}
