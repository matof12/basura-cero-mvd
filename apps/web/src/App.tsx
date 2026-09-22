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
  const { containers, loading, error, lastUpdate, isRealData } = useContainers()

  const handleViewInMap = (municipio: string) => {
    setMapMunicipality(municipio)
    setView('map')
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
      <Header currentView={view} onChangeView={setView} />
      <DataBanner isRealData={isRealData} lastUpdate={lastUpdate} />
      <main className={styles.main}>
        {renderView()}
      </main>
    </div>
  )
}

export default App