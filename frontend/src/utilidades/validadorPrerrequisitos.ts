import type { Asignatura, Estudiante } from '../tipos';

export interface EvaluacionPrerrequisito {
  habilitado: boolean;
  motivo: string;
  esReglaEspecial39: boolean;
  ramoPendiente?: string;
  notaObtenida?: number;
}

/**
 * Validador Oficial de Prerrequisitos de la Universidad de Valparaíso
 *
 * Regla de negocio institucional UV:
 * Para que un alumno quede habilitado para tomar un ramo R, cada prerrequisito P
 * asociado en su malla debe cumplir una de estas dos condiciones en su historial:
 *   1. Estar aprobado (nota_final >= 4.0).
 *   2. Estar cursado y reprobado con promedio final exactamente igual a 3.9 (nota_final = 3.9, regla de gracia).
 */
export function evaluarPrerrequisitosEstudiante(
  asignatura: Asignatura,
  estudiante: Estudiante
): EvaluacionPrerrequisito {
  // Asignaturas sin prerrequisitos (ej. Semestre 1 o electivos iniciales)
  if (
    !asignatura.prerrequisitos ||
    asignatura.prerrequisitos.length === 0 ||
    asignatura.prerrequisitos.some((p) => p.toLowerCase().includes('sin prerrequisito'))
  ) {
    return {
      habilitado: true,
      motivo: 'Sin prerrequisitos exigidos',
      esReglaEspecial39: false,
    };
  }

  const historial = estudiante.historialAcademico || [];

  for (const prereqStr of asignatura.prerrequisitos) {
    // Normalizar códigos: 'INF-110', 'INF 110', 'CIN 211', etc.
    const codigoNormalizado = prereqStr.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    const registro = historial.find((h) => {
      const hCodigo = h.codigoRamo.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      return hCodigo === codigoNormalizado || h.nombreRamo.toLowerCase() === prereqStr.toLowerCase();
    });

    if (!registro) {
      // Si el estudiante no tiene historial registrado para este prerrequisito:
      // Si su semestre actual es superior al del ramo, se asume habilitado históricamente
      if (estudiante.semestreActual > asignatura.semestre) {
        continue;
      }
      return {
        habilitado: false,
        motivo: `Prerrequisito pendiente: ${prereqStr} no figura aprobado en tu registro histórico.`,
        esReglaEspecial39: false,
        ramoPendiente: prereqStr,
      };
    }

    // Caso 1: Aprobado (nota_final >= 4.0)
    if (registro.estado === 'APROBADO' && (registro.notaFinal === undefined || registro.notaFinal >= 4.0)) {
      continue;
    }

    // Caso 2: Regla Especial de Gracia UV (nota_final = 3.9)
    if (registro.notaFinal === 3.9) {
      return {
        habilitado: true,
        motivo: `Habilitado por Regla Especial UV: nota 3.9 en ${registro.codigoRamo} (${registro.nombreRamo}).`,
        esReglaEspecial39: true,
        ramoPendiente: registro.codigoRamo,
        notaObtenida: 3.9,
      };
    }

    // Caso 3: Reprobado con nota < 3.9 (ej. 3.5)
    return {
      habilitado: false,
      motivo: `Prerrequisito no cumplido: ${registro.codigoRamo} (${registro.nombreRamo}). Calificación final: ${registro.notaFinal}. La normativa institucional exige nota ≥ 4.0 o gracia = 3.9.`,
      esReglaEspecial39: false,
      ramoPendiente: registro.codigoRamo,
      notaObtenida: registro.notaFinal,
    };
  }

  return {
    habilitado: true,
    motivo: 'Todos los prerrequisitos aprobados satisfactoriamente',
    esReglaEspecial39: false,
  };
}

