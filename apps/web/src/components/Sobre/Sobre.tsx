import styles from './Sobre.module.css'

const howItWorks = [
  {
    icon: '⚡',
    title: 'Datos en tiempo real',
    description:
      'Cada hora descargamos el CSV del Portal de Datos Abiertos de la IM y actualizamos el mapa automáticamente.',
  },
  {
    icon: '🗺️',
    title: 'Visualización inteligente',
    description:
      'Los 10.000+ contenedores se agrupan en clusters tricolores según su estado: verde (al día), amarillo (atención) y rojo (crítico).',
  },
  {
    icon: '📢',
    title: 'Reportá en un click',
    description:
      'Al hacer click en cualquier contenedor podés reportar el problema directamente al WhatsApp oficial de la Intendencia con el mensaje ya armado.',
  },
]

const dataSources = [
  {
    label: 'Fuente',
    value: 'Portal de Datos Abiertos — Intendencia de Montevideo',
  },
  {
    label: 'Dataset',
    value: 'Levantes de contenedores domiciliarios',
  },
  {
    label: 'Link',
    value: 'https://ckan.montevideo.gub.uy/dataset/informacion-de-levantes-de-contenedores-domiciliarios',
    href: 'https://ckan.montevideo.gub.uy/dataset/informacion-de-levantes-de-contenedores-domiciliarios',
  },
]

export function Sobre() {
  return (
    <section className={styles.sobre}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Civic tech · Montevideo</p>
        <h1 className={styles.title}>BasuraCero MVD</h1>
        <p className={styles.subtitle}>Haciendo visible lo que ya es público</p>
      </header>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>¿Qué es?</h2>
        <p className={styles.text}>
          BasuraCero MVD es una plataforma civic tech que transforma los datos abiertos de la
          Intendencia de Montevideo en información visual y accionable para el ciudadano.
        </p>
        <p className={styles.text}>
          La IM publica en tiempo real el estado de recolección de sus más de 10.000 contenedores
          domiciliarios. Esa información existe, es pública y se actualiza cada hora — pero vive en
          un archivo CSV técnico. BasuraCero la convierte en un mapa, un dashboard y la posibilidad
          de reportar directamente a los canales oficiales.
        </p>
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>

        <div className={styles.cardsRow}>
          {howItWorks.map(({ icon, title, description }) => (
            <article key={title} className={styles.card}>
              <div className={styles.cardIcon}>{icon}</div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Datos utilizados</h2>

        <div className={styles.dataCard}>
          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Fuente</span>
            <span className={styles.dataValue}>Portal de Datos Abiertos — Intendencia de Montevideo</span>
          </div>

          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Dataset</span>
            <span className={styles.dataValue}>Levantes de contenedores domiciliarios</span>
          </div>

          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Link</span>
            <a
              className={styles.dataLink}
              href="https://ckan.montevideo.gub.uy/dataset/informacion-de-levantes-de-contenedores-domiciliarios"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ckan.montevideo.gub.uy/dataset/informacion-de-levantes-de-contenedores-domiciliarios
            </a>
          </div>

          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Fuente</span>
            <span className={styles.dataValue}>Nominatim / OpenStreetMap</span>
          </div>

          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Uso</span>
            <span className={styles.dataValue}>Geocodificación de direcciones</span>
          </div>

          <div className={styles.dataItem}>
            <span className={styles.dataLabel}>Link</span>
            <a className={styles.dataLink} href="https://nominatim.openstreetmap.org" target="_blank" rel="noopener noreferrer">
              https://nominatim.openstreetmap.org
            </a>
          </div>
        </div>

        <div className={styles.licenseBox}>
          <p className={styles.licenseText}>
            “Los datos utilizados están publicados bajo la Licencia de Datos Abiertos de Uruguay
            (DAG-UY), reglamentada por el Decreto 54/2017 y el artículo 82 de la Ley 19.355. Esta
            aplicación cita la fuente, hace referencia a la licencia y al conjunto de datos utilizado,
            en cumplimiento de dicha licencia.”
          </p>
          <a
            className={styles.licenseLink}
            href="https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/licencia-datos-abiertos-uruguay-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver licencia DAG-UY
          </a>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Sobre el proyecto</h2>
        <p className={styles.text}>
          BasuraCero MVD es una iniciativa ciudadana independiente y de código abierto. No tiene
          fines comerciales ni está afiliada a ningún organismo público o privado.
        </p>
        <a
          className={styles.githubLink}
          href="https://github.com/matof12/basura-cero-mvd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver código en GitHub
        </a>
      </div>
    </section>
  )
}
