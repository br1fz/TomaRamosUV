import React, { useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';
import { MobileNavBar } from './MobileNavBar';
import { MobileHomeApptui } from './MobileHomeApptui';
import { MobileQueueView } from './MobileQueueView';
import { MobileEnrollment } from './MobileEnrollment';
import { WebLoginSSO } from '../web/WebLoginSSO';
import { StructuredScheduleView } from '../shared/StructuredScheduleView';
import { OfficialVoucher } from '../shared/OfficialVoucher';
import { useQueue } from '../../context/QueueEnrollmentContext';
import { Smartphone, Monitor } from 'lucide-react';

export const MobileFrame: React.FC = () => {
  const { step, setStep } = useQueue();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('novedades');
  const [useDeviceChassis, setUseDeviceChassis] = useState(true);

  const handleTabChange = (tab: string) => {
    setMobileTab(tab);
    if (tab === 'novedades') setStep('HOME');
    if (tab === 'actividades') setStep('SCHEDULE_VIEW');
  };

  const content = (
    <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col relative">
      <MobileHeader onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {step === 'HOME' && <MobileHomeApptui />}
        {step === 'LOGIN' && <WebLoginSSO />}
        {step === 'QUEUE' && <MobileQueueView />}
        {step === 'ENROLLMENT' && <MobileEnrollment />}
        {step === 'SCHEDULE_VIEW' && <StructuredScheduleView />}
        {step === 'VOUCHER' && <OfficialVoucher />}
      </main>

      <MobileNavBar activeTab={mobileTab} onTabChange={handleTabChange} />
    </div>
  );

  return (
    <div className="py-6 px-2 flex flex-col items-center justify-center animate-fadeIn">
      {/* Device Frame Toggle */}
      <div className="mb-4 flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
        <button
          onClick={() => setUseDeviceChassis(true)}
          className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            useDeviceChassis ? 'bg-[#31C4D7] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Marco Smartphone (APPTUI)</span>
        </button>
        <button
          onClick={() => setUseDeviceChassis(false)}
          className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            !useDeviceChassis ? 'bg-[#31C4D7] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Pantalla Completa</span>
        </button>
      </div>

      {useDeviceChassis ? (
        /* Real Smartphone Chassis */
        <div className="w-[390px] h-[844px] bg-[#1a1b20] p-3 rounded-[54px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600 relative overflow-hidden flex flex-col">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-950/60 ring-1 ring-blue-900/40" />
          </div>

          {/* Screen area */}
          <div className="w-full h-full bg-[#14151A] rounded-[44px] overflow-hidden flex flex-col relative border border-[#2D323E]/50 shadow-inner">
            {content}

            {/* Home indicator bar at bottom */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5 z-40" />
          </div>
        </div>
      ) : (
        /* Max-width container without frame */
        <div className="w-full max-w-md bg-[#14151A] rounded-2xl border border-[#2D323E] shadow-2xl overflow-hidden min-h-[700px]">
          {content}
        </div>
      )}
    </div>
  );
};
