// Fotos reales de trabajos en cada zona. Van aparte de zonas.js porque ese
// archivo lo carga vite.config.js con Node, que no sabe importar imágenes.
import imgGetafe   from '../assets/img/20261006-fachada-acristalada.webp';
import imgGrinon   from '../assets/img/20260528_141113.webp';
import imgLasRozas from '../assets/img/20260324_122426.webp';
import imgMadrid   from '../assets/img/IMG-20230901-WA0000.webp';

export const imagenesZona = {
  'limpieza-cristales-getafe': {
    src: imgGetafe,
    pie: 'Fachada acristalada que limpiamos en Getafe',
  },
  'limpieza-cristales-grinon': {
    src: imgGrinon,
    pie: 'Edificio acristalado que limpiamos en Griñón',
  },
  'limpieza-cristales-madrid-centro': {
    src: imgMadrid,
    pie: 'Ventana que limpiamos en Madrid, con las Cuatro Torres al fondo',
  },
  'limpieza-cristales-las-rozas': {
    src: imgLasRozas,
    pie: 'Techo de cristal de una terraza que limpiamos en Las Rozas',
  },
};
