import styles from './Reportar.module.css'
import { URLS, IM_CONTACT } from '../../constants'

export function Reportar() {
  return (
    <section className={styles.reportar}>

      <div className={styles.header}>
        <h2 className={styles.title}>
          ¿Contenedor desbordado o basura en la vereda?
        </h2>
        <p className={styles.subtitle}>
          La Intendencia de Montevideo tiene un canal oficial de WhatsApp.
          Mandás una foto y la dirección y ellos se encargan.
        </p>
      </div>

      {/* WhatsApp card */}
      <div className={styles.wppCard}>
        <div className={styles.wppIcon}>💬</div>
        <h3 className={styles.wppTitle}>Canal oficial de la Intendencia de Montevideo</h3>
        <p className={styles.wppDesc}>
          Enviá una foto y la dirección exacta del problema. El servicio atiende en días hábiles.
        </p>
        <span className={styles.wppNumber}>{IM_CONTACT.WHATSAPP_NUMBER}</span>
        <a
          className={styles.wppBtn}
          href={URLS.WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.561 4.14 1.54 5.876L.057 23.882a.5.5 0 00.61.61l6.079-1.488A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.986 0-3.84-.54-5.432-1.48l-.39-.23-4.03.986.998-3.944-.252-.406A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
          </svg>
          Abrir WhatsApp
        </a>
        <p className={styles.wppHint}>
          Se va a abrir WhatsApp en tu celular o computadora
        </p>
      </div>

      {/* Tips */}
      <div className={styles.tipsCard}>
        <h4 className={styles.tipsTitle}>📋 Qué mandar para que te atiendan más rápido</h4>
        <div className={styles.tipsList}>
          {[
            'Una foto del problema',
            'La dirección exacta: calle y número, o calle y esquina',
          ].map((tip, i) => (
            <div key={i} className={styles.tipRow}>
              <div className={styles.tipNum}>{i + 1}</div>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Otros canales */}
      <div className={styles.channelsCard}>
        <h4 className={styles.channelsTitle}>Otros canales de contacto</h4>
        <div className={styles.channelRow}>
          <span className={styles.channelIcon}>📞</span>
          <span className={styles.channelLabel}>Teléfono (División Limpieza)</span>
          <span className={styles.channelVal}>{IM_CONTACT.PHONE}</span>
        </div>
        <div className={styles.channelRow}>
          <span className={styles.channelIcon}>🌐</span>
          <span className={styles.channelLabel}>Portal web</span>
          <a className={styles.channelLink} href={`https://${URLS.IM_WEB}`} target="_blank" rel="noopener noreferrer">
            {URLS.IM_WEB}
          </a>
        </div>
        <div className={styles.channelRow}>
          <span className={styles.channelIcon}>🏢</span>
          <span className={styles.channelLabel}>Centros Comunales Zonales</span>
          <a className={styles.channelLink} href={URLS.IM_CCZ} target="_blank" rel="noopener noreferrer">
            CCZ de tu zona
          </a>
        </div>
      </div>

    </section>
  )
}