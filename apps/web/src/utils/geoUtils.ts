import proj4 from 'proj4';

const EARTH_RADIUS = 6371000; // metros

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param lat1 Latitud del primer punto
 * @param lng1 Longitud del primer punto
 * @param lat2 Latitud del segundo punto
 * @param lng2 Longitud del segundo punto
 * @returns Distancia en metros
 */
export const haversine = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};

/**
 * Formatea una distancia en metros a string legible
 * @param metros Distancia en metros
 * @returns Distancia formateada (ej: "500 m" o "1.5 km")
 */
export const formatDist = (metros: number): string => {
  if (metros < 1000) {
    return `${Math.round(metros)} m`;
  }
  return `${(metros / 1000).toFixed(1)} km`;
};

/**
 * Convierte coordenadas UTM (zona 21S) a latitud y longitud
 * @param easting Coordenada Este (X)
 * @param northing Coordenada Norte (Y)
 * @returns Objeto con lat y lng
 */
export const utmToLatLng = (
  easting: number,
  northing: number
): { lat: number; lng: number } => {
  const utmProj =
    '+proj=utm +zone=21 +south +datum=WGS84 +units=m +no_defs';
  const wgs84Proj = 'WGS84';

  const [lng, lat] = proj4(utmProj, wgs84Proj, [easting, northing]);

  return { lat, lng };
};
