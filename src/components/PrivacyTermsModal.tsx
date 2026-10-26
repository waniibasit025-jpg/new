import { X, ShieldCheck, Lock, FileText } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export default function PrivacyTermsModal({ isOpen, onClose, type }: PrivacyTermsModalProps) {
  if (!isOpen) return null;
  const ADMIN_EMAIL = 'wajhatbhai30@gmail.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            ) : (
              <FileText className="w-5 h-5 text-indigo-400" />
            )}
            <h3 className="text-lg font-bold text-white">
              {type === 'privacy' ? 'Privacy Policy & Data Protection' : 'Terms of Service & Usage Agreement'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Effective Date:</strong> October 2026<br />
                <strong>Security Administrator:</strong> {ADMIN_EMAIL}
              </p>
              <h4 className="font-bold text-white text-sm">1. Explicit Consent Policy</h4>
              <p>
                PhoneTrace strictly enforces user consent. We never track individuals without their active knowledge and browser permission. Our phone number lookup feature only returns publicly registered telecom allocation data (country code, carrier, line type, exchange circle).
              </p>

              <h4 className="font-bold text-white text-sm">2. Live Location Sharing</h4>
              <p>
                Live GPS coordinates are transmitted exclusively when a recipient clicks a secure invitation link, reviews the request parameters, and explicitly selects "Allow & Share Location". This access can be terminated immediately by either party at any time.
              </p>

              <h4 className="font-bold text-white text-sm">3. Ephemeral Storage & Retention</h4>
              <p>
                Coordinates and tracking breadcrumbs are retained only in temporary cache for the duration of the active session (maximum 24 hours). After expiration, all location coordinate records are automatically purged.
              </p>

              <h4 className="font-bold text-white text-sm">4. Contacting Privacy Administration</h4>
              <p>
                For data access requests, deletion requests, or privacy inquiries, contact our verified officer at <a href={`mailto:${ADMIN_EMAIL}`} className="text-cyan-400 underline">{ADMIN_EMAIL}</a>.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Terms Version:</strong> 2.5<br />
                <strong>Administration:</strong> {ADMIN_EMAIL}
              </p>
              <h4 className="font-bold text-white text-sm">1. Lawful Use Only</h4>
              <p>
                By using PhoneTrace, you agree to use our phone intelligence and location-sharing utilities solely for lawful purposes, such as personal safety, family arrival coordination, delivery dispatch, and phone number validation.
              </p>

              <h4 className="font-bold text-white text-sm">2. Prohibition of Harassment or Stalking</h4>
              <p>
                Users are strictly prohibited from using this service to stalk, harass, intimidate, or unlawfully track any individual. Any suspected abuse will lead to permanent blacklisting and cooperation with competent authorities.
              </p>

              <h4 className="font-bold text-white text-sm">3. Accuracy Disclaimer</h4>
              <p>
                Telecom region maps represent theoretical exchange area allocations based on ITU-T E.164 and national numbering plans. They do not represent live GPS positions of physical persons without our separate consent-based sharing protocol.
              </p>

              <h4 className="font-bold text-white text-sm">4. Administrative Contact</h4>
              <p>
                Notice of claims or service inquiries should be directed to <a href={`mailto:${ADMIN_EMAIL}`} className="text-cyan-400 underline">{ADMIN_EMAIL}</a>.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
