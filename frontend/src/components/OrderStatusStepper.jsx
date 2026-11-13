import { Check, X as XIcon } from 'lucide-react';

const STEPS = [
  { key: 'RECEIVED', label: 'Recebido' },
  { key: 'PREPARING', label: 'Em preparo' },
  { key: 'READY', label: 'Pronto' },
  { key: 'DELIVERED', label: 'Entregue' },
];

const STATUS_TO_STEP = {
  RECEIVED: 1,
  PREPARING: 2,
  READY: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export default function OrderStatusStepper({ status }) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;
  const isCancelled = status === 'CANCELLED';

  return (
    <div className="relative w-full px-2 py-4">
      {/* Cancelled overlay badge */}
      {isCancelled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 shadow-lg">
            <XIcon size={16} className="text-white" />
            <span className="text-sm font-bold text-white">Cancelado</span>
          </div>
        </div>
      )}

      <div className={isCancelled ? 'opacity-30' : ''}>
        {/* Steps container */}
        <div className="flex items-start justify-between">
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep >= stepNumber;
            const isActive = currentStep === stepNumber;
            const isPending = currentStep < stepNumber;

            return (
              <div
                key={step.key}
                className="relative flex flex-1 flex-col items-center"
              >
                {/* Connecting line (before circle, except first) */}
                {index > 0 && (
                  <div className="absolute top-4 right-1/2 left-[-50%] h-0.5">
                    <div
                      className={`h-full w-full ${
                        currentStep >= stepNumber
                          ? 'bg-emerald-500'
                          : 'bg-neutral-800'
                      }`}
                    />
                  </div>
                )}

                {/* Circle */}
                <div
                  className={`relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    isCompleted && !isActive
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isActive
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-black/40'
                        : 'border-neutral-700 bg-neutral-900 text-neutral-500'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-center text-xs font-medium leading-tight ${
                    isActive
                      ? 'text-orange-400 font-semibold'
                      : isCompleted
                        ? 'text-emerald-400 font-medium'
                        : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
