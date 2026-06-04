import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import Grid from './components/Grid'
import Toolbar from './components/Toolbar'
import Header from './components/Header'
import UploadModal from './components/UploadModal'
import ViewModal from './components/ViewModal'
import EditModal from './components/EditModal'
import './App.css'

export default function App() {
  const [models, setModels]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterSeason, setFilterSeason]   = useState('')
  const [filterMachine, setFilterMachine] = useState('')
  const [filterGauge, setFilterGauge]     = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [viewModel, setViewModel]   = useState(null)
  const [editModel, setEditModel]   = useState(null)

  const fetchModels = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setModels(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchModels() }, [fetchModels])

  const filtered = models.filter(m => {
    const q = search.toLowerCase()
    return (
      (!q || (m.name||'').toLowerCase().includes(q) || (m.model_no||'').toLowerCase().includes(q)) &&
      (!filterSeason  || m.season  === filterSeason) &&
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
      if (idx > -1) {
        const next = [...prev]; next[idx] = saved; return next
      }
      return [saved, ...prev]
    })
  }

  const openEdit = (m) => { setViewModel(null); setEditModel(m) }
  const openView = (m) => { setEditModel(null); setViewModel(m) }

  return (
    <div className="app">
      <Header onUpload={() => setShowUpload(true)} />

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
        models={filtered}
        loading={loading}
        onOpen={openView}
        onDelete={handleDelete}
        isEmpty={models.length === 0}
      />

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSaved={(m) => { handleSaved(m); setShowUpload(false) }}
        />
      )}

      {viewModel && (
        <ViewModal
          model={viewModel}
          onClose={() => setViewModel(null)}
          onEdit={() => openEdit(viewModel)}
          onDelete={() => handleDelete(viewModel.id)}
        />
      )}

      {editModel && (
        <EditModal
          model={editModel}
          onClose={() => setEditModel(null)}
          onSaved={(m) => { handleSaved(m); setEditModel(null) }}
        />
      )}
    </div>
  )
}
