import { useState } from 'react'
import type { ViewMode } from './types'
import { useContainers } from './hooks/useContainers'
import {Header} from './components/Layout/Header'
import { DataBanner } from './components/Layout/DataBanner'
import { MapView } from './components/Map/MapView'
import { Dashboard } from './components/Dashboard/Dashboard'
import { Reportar } from './components/Reportar/Reportar'
import { Sobre } from './components/Sobre/Sobre'
import styles from './App.module.css'

function App() {
  const [view, setView] = useState<ViewMode>('map')
  const [mapMunicipality, setMapMunicipality] = useState('Todos')
  const [isViewLoading, setIsViewLoading] = useState(false)
  const { containers, loading, error, lastUpdate, isRealData } = useContainers()
  const shouldShowLoader = isViewLoading

  const changeView = (nextView: ViewMode) => {
    if (nextView === view || isViewLoading) return

    setIsViewLoading(true)

    window.setTimeout(() => {
      setView(nextView)
      window.setTimeout(() => setIsViewLoading(false), 160)
    }, 240)
  }

  const handleViewInMap = (municipio: string) => {
    setMapMunicipality(municipio)
    changeView('map')
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard containers={containers} loading={loading} onViewInMap={handleViewInMap} />
      case 'reportar':
        return <Reportar />
      case 'sobre':
        return <Sobre />
      default:
        return (
          <MapView
            containers={containers}
            loading={loading}
            error={error}
            municipalityFilter={mapMunicipality}
            onMunicipalityFilterChange={setMapMunicipality}
          />
        )
    }
  }

  return (
    <div className={styles.app}>
      <Header currentView={view} onChangeView={changeView} />
      <DataBanner isRealData={isRealData} lastUpdate={lastUpdate} />

      {shouldShowLoader && (
        <div className={styles.viewLoader} aria-live="polite" aria-label="Cargando vista">
          <div className={styles.loaderStage} aria-hidden="true">
            <div className={styles.binSpinner}>🗑️</div>
          </div>
          <span className={styles.loaderText}>CARGANDO...</span>
        </div>
      )}

      <main className={`${styles.main} ${shouldShowLoader ? styles.mainLoading : ''}`}>
        {renderView()}
      </main>

      <footer className={styles.footer}>
        Datos bajo Licencia DAG-UY · Portal de Datos Abiertos IM
      </footer>
    </div>
  )
}

export default App