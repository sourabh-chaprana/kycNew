import { useState, useEffect } from 'react';

const UserDetailModal = ({ pnr, onClose, onStatusChange, onApproveAll }) => {
  const [rejectingPassenger, setRejectingPassenger] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingFile, setViewingFile] = useState(null); // { url, type: 'image' | 'pdf' }

  // Lock body scroll when file viewer is open
  useEffect(() => {
    if (viewingFile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewingFile]);

  const handleApprove = (passengerId, passengerName) => {
    onStatusChange(pnr.id, passengerId, 'approved', passengerName, '');
  };

  const handleReject = (passengerId) => {
    setRejectingPassenger(passengerId);
  };

  const handleConfirmRejection = () => {
    if (rejectionReason.trim()) {
      const passenger = pnr.passengersData.find((p) => p.id === rejectingPassenger);
      onStatusChange(pnr.id, rejectingPassenger, 'declined', passenger?.name || 'Passenger', rejectionReason);
      setRejectingPassenger(null);
      setRejectionReason('');
    }
  };

  const handleCancelRejection = () => {
    setRejectingPassenger(null);
    setRejectionReason('');
  };

  const handleApproveAllClick = () => {
    if (onApproveAll) {
      onApproveAll(pnr.id);
    } else {
      // Fallback: approve individually
      pnr.passengersData.forEach((passenger) => {
        if (passenger.status === 'pending') {
          onStatusChange(pnr.id, passenger.id, 'approved', passenger.name, '');
        }
      });
    }
  };

  const isPdf = (url) => {
    return url && (url.toLowerCase().endsWith('.pdf') || url.startsWith('data:application/pdf'));
  };

  const openFile = (url) => {
    if (url) {
      setViewingFile({
        url,
        type: isPdf(url) ? 'pdf' : 'image',
      });
    }
  };

  const closeFileViewer = () => {
    setViewingFile(null);
  };

  const pendingCount = pnr.passengersData.filter((p) => p.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.25)] w-full max-w-4xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-gray-100">
        {/* Modal Header */}
        <div className="flex-none bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">PNR: {pnr.pnr}</h2>
              <p className="text-sm text-gray-600">
                Review documents for {pnr.passengers} passenger(s).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {pnr.passengersData.map((passenger) => (
            <div
              key={passenger.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* Passenger Image/Document */}
                <div 
                  className="flex-shrink-0 relative cursor-pointer"
                  onClick={() => openFile(passenger.image)}
                >
                  {passenger.image ? (
                    isPdf(passenger.image) ? (
                      // PDF Icon/Placeholder
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-red-50 flex items-center justify-center group hover:bg-red-100 transition-colors">
                        <svg className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="absolute bottom-0 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">PDF</span>
                      </div>
                    ) : (
                      // Image Avatar
                      <>
                        <img
                          src={passenger.image}
                          alt={passenger.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.fallback-avatar');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl fallback-avatar hidden absolute top-0 left-0">
                          {passenger.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      </>
                    )
                  ) : (
                    // Initial Fallback
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {passenger.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Passenger Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{passenger.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Document ID: {passenger.documentId}</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm self-start sm:self-center ${
                        passenger.status === 'pending'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : passenger.status === 'approved'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {passenger.status === 'pending'
                        ? 'Pending'
                        : passenger.status === 'approved'
                        ? 'Approved'
                        : 'Declined'}
                    </span>
                  </div>

                  {/* Rejection Reason Input */}
                  {rejectingPassenger === passenger.id && (
                    <div className="mt-4 p-5 bg-white rounded-xl border-2 border-red-200 shadow-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Rejection
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejecting this document..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-400 outline-none resize-none shadow-sm text-gray-900 bg-white"
                        rows="3"
                      />
                      <div className="flex items-center space-x-3 mt-4">
                        <button
                          onClick={handleConfirmRejection}
                          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transform hover:scale-105"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Confirm Rejection</span>
                        </button>
                        <button
                          onClick={handleCancelRejection}
                          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {passenger.status === 'pending' && rejectingPassenger !== passenger.id && (
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <button
                        onClick={() => handleApprove(passenger.id, passenger.name)}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(passenger.id)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transform hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex-none bg-gradient-to-r from-white to-gray-50 border-t border-gray-200 px-6 py-5 flex items-center justify-between shadow-lg rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-sm"
          >
            Close
          </button>
          {pendingCount > 0 && (
            <button
              onClick={handleApproveAllClick}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Approve All Pending ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Nested File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center">
             {/* Close Button */}
             <button 
              onClick={closeFileViewer}
              className="absolute -top-12 right-0 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="w-full h-full bg-transparent flex items-center justify-center rounded-lg overflow-hidden shadow-2xl relative">
              {viewingFile.type === 'pdf' ? (
                // Use object tag for PDF to better handle embedding/fallback
                <object
                  data={viewingFile.url}
                  type="application/pdf"
                  className="w-full h-full bg-white rounded-lg"
                >
                  {/* Fallback for when object fails to load or X-Frame-Options blocks it */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white text-center p-8">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Preview Not Available
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      This document cannot be previewed directly here (likely due to security restrictions from the source).
                    </p>
                    <a 
                      href={viewingFile.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center space-x-2"
                    >
                      <span>Open Document in New Tab</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </object>
              ) : (
                <img 
                  src={viewingFile.url} 
                  alt="Document" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailModal;
