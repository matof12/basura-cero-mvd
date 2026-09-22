import type { ViewMode } from '../../types'
import styles from './Header.module.css'

interface HeaderProps {
  currentView: ViewMode
  onChangeView: (view: ViewMode) => void
}

const NAV_BUTTONS: Array<{ view: ViewMode; label: string }> = [
  { view: 'map',       label: 'Mapa'      },
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'reportar',  label: 'Reportar'  },
  { view: 'sobre',     label: 'Sobre el proyecto'     },
]

export function Header({ currentView, onChangeView }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <button
          className={styles.brand}
          onClick={() => onChangeView('map')}
          aria-label="Ir al inicio"
        >
          <span className={styles.brandIcon}>🗑️</span>
          <div>
            <span className={styles.brandName}>BasuraCero MVD</span>
            <span className={styles.brandSub}>Datos abiertos · Montevideo</span>
          </div>
        </button>

        <nav className={styles.nav} aria-label="Navegación principal">
          {NAV_BUTTONS.map(({ view, label }) => (
            <button
              key={view}
              type="button"
              className={`${styles.navBtn} ${view === currentView ? styles.active : ''}`}
              aria-pressed={view === currentView}
              onClick={() => onChangeView(view)}
            >
              {label}
            </button>
          ))}
        </nav>

      </div>

      <div className={styles.footerNote}>
        Datos bajo Licencia DAG-UY · Portal de Datos Abiertos IM
      </div>
    </header>
  )
}