import type {
  Asignatura,
  SeccionAsignatura,
  AsignaturaInscrita,
  ConflictoTopeHorario,
} from '../tipos';

/**
 * Validador preventivo de choques o topes de horario
 * Compara los bloques horarios de la sección que el alumno intenta inscribir
 * con las asignaturas que ya tiene agregadas en su horario semanal.
 * 
 * Si existe una coincidencia exacta de día e índice de bloque, retorna el detalle
 * descriptivo del conflicto para alertar al estudiante y descartar la colisión.
 */
export function detectarTopeHorario(
  asignaturaCandidata: Asignatura,
  seccionCandidata: SeccionAsignatura,
  asignaturasYaInscritas: AsignaturaInscrita[]
): ConflictoTopeHorario | null {
  // Ignoramos secciones previas de la misma asignatura (ej: cambiar de la sección 1 a la sección 2)
  const otrasAsignaturas = asignaturasYaInscritas.filter(
    (item) => item.asignatura.codigo !== asignaturaCandidata.codigo
  );

  for (const bloqueCandidato of seccionCandidata.horario) {
    for (const inscrita of otrasAsignaturas) {
      for (const bloqueInscrito of inscrita.seccion.horario) {
        if (
          bloqueCandidato.dia === bloqueInscrito.dia &&
          bloqueCandidato.indiceBloque === bloqueInscrito.indiceBloque
        ) {
          return {
            existeConflicto: true,
            asignaturaIntentada: asignaturaCandidata,
            seccionIntentada: seccionCandidata,
            asignaturaEnConflicto: inscrita.asignatura,
            seccionEnConflicto: inscrita.seccion,
            dia: bloqueCandidato.dia,
            rangoHorario: `${bloqueCandidato.horaInicio} - ${bloqueCandidato.horaFin}`,
            mensajeExplicativo: `Conflicto de Horario Detectado: ${asignaturaCandidata.codigo} (${asignaturaCandidata.nombre}) Sección ${seccionCandidata.numeroSeccion} colisiona el día ${bloqueCandidato.dia} (${bloqueCandidato.horaInicio}-${bloqueCandidato.horaFin} hrs) con ${inscrita.asignatura.codigo} (${inscrita.asignatura.nombre}) Sección ${inscrita.seccion.numeroSeccion}.`,
          };
        }
      }
    }
  }

  return null;
}
