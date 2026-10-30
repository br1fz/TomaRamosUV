import { Check, Users, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

export const WebCourseSelector: React.FC = () => {
  const {
    subjects,
    enrolledCourses,
    selectSection,
    removeSubject,
    joinWaitlist,
    waitlistedSubjects,
    confirmEnrollment,
    totalCredits,
  } = useQueue();

  const isEnrolled = (subjectCode: string, sectionId: string) => {
    return enrolledCourses.some(
      (e) => e.subject.code === subjectCode && e.section.id === sectionId
    );
  };


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Oferta Académica • 5.° Semestre
            </h2>
            <p className="text-xs text-slate-500">
              Ingeniería Civil Informática • Malla Curricular 5125 UV
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Total seleccionado:</span>
            <span className="px-3 py-1 bg-sky-50 text-[#004A77] border border-sky-200 rounded-full text-xs font-bold font-mono">
              {totalCredits} / 30 Créditos
            </span>
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-5 mt-5">
          {subjects.map((sub) => {
            const enrolledItem = enrolledCourses.find((e) => e.subject.code === sub.code);
            const isWaitlisted = waitlistedSubjects[sub.code];

            return (
              <div
                key={sub.code}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  enrolledItem
                    ? 'border-blue-300 bg-blue-50/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Subject Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <span
                      className="px-2.5 py-1 text-xs font-black rounded-lg shadow-sm"
                      style={{ backgroundColor: sub.color, color: sub.textColor }}
                    >
                      {sub.code}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">{sub.name}</h3>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                          {sub.credits} Créditos SCT
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          ✓ Prerrequisito Cumplido: {sub.prerequisites.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {enrolledItem && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Inscrita (Sec. {enrolledItem.section.sectionNumber})
                      </span>
                      <button
                        onClick={() => removeSubject(sub.code)}
                        className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold ml-1"
                      >
                        Desmarcar
                      </button>
                    </div>
                  )}
                </div>

                {/* Sections List */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {sub.sections.map((sec) => {
                    const isSelected = isEnrolled(sub.code, sec.id);
                    const isFull = sec.availableQuota <= 0;

                    return (
                      <div
                        key={sec.id}
                        className={`py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                          isSelected ? 'bg-sky-50/50 p-3 rounded-xl' : ''
                        }`}
                      >
                        {/* Section info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                              Sección {sec.sectionNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              {sec.professor}
                            </span>
                          </div>

                          {/* Schedule pills */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                            {sec.schedule.map((slot, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1 bg-slate-100/90 text-slate-700 px-2 py-1 rounded-md text-[11px]"
                              >
                                <Clock className="w-3 h-3 text-slate-400" />
                                <strong>{slot.day}:</strong> {slot.startTime}-{slot.endTime} ({slot.room})
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quota and Action button */}
                        <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0">
                          {/* Quota Gauge */}
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block font-medium">Cupos:</span>
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={`font-extrabold ${
                                  isFull ? 'text-red-600' : 'text-slate-800'
                                }`}
                              >
                                {sec.availableQuota}
                              </span>
                              <span className="text-slate-400">/ {sec.totalQuota}</span>
                            </div>
                          </div>

                          {/* Button */}
                          {isFull ? (
                            isWaitlisted ? (
                              <span className="px-3.5 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                                En Lista de Espera (Turno #{isWaitlisted})
                              </span>
                            ) : (
                              <button
                                onClick={() => joinWaitlist(sub.code)}
                                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                              >
                                <Users className="w-3.5 h-3.5" />
                                Anotarse en Lista de Espera (Turno #4)
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => selectSection(sub, sec)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-[#004A77] text-white hover:bg-[#003859]'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Seleccionada
                                </>
                              ) : (
                                'Inscribir Sección'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Confirmation Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
            <p>
              Asignaturas seleccionadas: <strong>{enrolledCourses.length}</strong> • Total créditos:{' '}
              <strong className="text-[#004A77] font-bold">{totalCredits} SCT</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Al confirmar, se ejecuta una transacción atómica protegida en la base de datos UV.
            </p>
          </div>

          <button
            onClick={confirmEnrollment}
            disabled={enrolledCourses.length === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              enrolledCourses.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Confirmar y Guardar Carga Curricular
          </button>
        </div>
      </div>
    </div>
  );
};
