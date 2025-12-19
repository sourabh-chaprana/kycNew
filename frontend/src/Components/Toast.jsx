import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const shadowColor = type === 'success' ? 'shadow-[0_10px_30px_rgba(34,197,94,0.3)]' : 'shadow-[0_10px_30px_rgba(239,68,68,0.3)]';

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} border-2 rounded-xl ${shadowColor} p-5 min-w-[320px] max-w-md z-50 animate-slide-up backdrop-blur-sm`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${type === 'success' ? 'bg-green-200' : 'bg-red-200'} flex items-center justify-center ${iconColor}`}>
          {type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-bold text-base ${textColor}`}>
            {type === 'success' ? 'Document Approved' : 'Document Declined'}
          </p>
          <p className={`text-sm ${textColor} mt-1.5 opacity-90`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-white hover:bg-opacity-50`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;

