import React from 'react';
import { QueueProvider, useQueue } from './context/QueueEnrollmentContext';
import { DevControlBar } from './components/dev/DevControlBar';
import { WebHeader } from './components/web/WebHeader';
import { WebSidebar } from './components/web/WebSidebar';
import { WebHomePortal } from './components/web/WebHomePortal';
import { WebLoginSSO } from './components/web/WebLoginSSO';
import { WebQueueWidget } from './components/web/WebQueueWidget';
import { WebCourseSelector } from './components/web/WebCourseSelector';
import { WebTimetableGrid } from './components/web/WebTimetableGrid';
import { MobileFrame } from './components/mobile/MobileFrame';
import { StructuredScheduleView } from './components/shared/StructuredScheduleView';
import { OfficialVoucher } from './components/shared/OfficialVoucher';
import { TurnArrivalCelebration } from './components/shared/TurnArrivalCelebration';
import { ConcurrencyModal } from './components/shared/ConcurrencyModal';
import { ConflictModal } from './components/shared/ConflictModal';

const AppContent: React.FC = () => {
  const { viewMode, step, showTurnCelebration, dismissTurnCelebration } = useQueue();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#004A77] selection:text-white">
      {/* Dev & Simulation Control Bar (Always visible at top) */}
      <DevControlBar />

      {/* Main Content dependent on viewMode */}
      {viewMode === 'MOBILE' ? (
        /* Mobile APPTUI UV View */
        <main className="flex-1 bg-slate-900 flex items-center justify-center p-2 sm:p-4">
          <MobileFrame />
        </main>
      ) : (
        /* Desktop Portal UV View */
        <div className="flex-1 flex flex-col">
          <WebHeader />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {step === 'HOME' && <WebHomePortal />}

            {step === 'LOGIN' && <WebLoginSSO />}

            {step === 'QUEUE' && <WebQueueWidget />}

            {step === 'ENROLLMENT' && (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Column: Student Profile & Countdown */}
                <WebSidebar />

                {/* Right Column: Courses & Interactive Timetable Grid */}
                <div className="flex-1 w-full space-y-6">
                  <WebCourseSelector />
                  <WebTimetableGrid />
                </div>
              </div>
            )}

            {step === 'SCHEDULE_VIEW' && <StructuredScheduleView />}

            {step === 'VOUCHER' && <OfficialVoucher />}
          </main>

          {/* Desktop Footer */}
          <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 text-center text-xs text-slate-500 print:hidden">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/uv_azul.svg" alt="UV" className="h-7 w-auto" />
                <span className="font-semibold text-slate-700">
                  Universidad de Valparaíso • Sistema de Toma de Ramos
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dirección General de Pregrado • Mesa de Ayuda: (32) 250 7000 • contacto@uv.cl
              </p>
            </div>
          </footer>
        </div>
      )}

      {/* Celebratory Turn Arrival Moment: "¡Uy! ¡Al fin me toca!" */}
      <TurnArrivalCelebration
        isOpen={showTurnCelebration}
        onProceed={dismissTurnCelebration}
      />

      {/* Shared Global Modals */}
      <ConcurrencyModal />
      <ConflictModal />
    </div>
  );
};

export default function App() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}
