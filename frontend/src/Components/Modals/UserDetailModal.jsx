import { useState } from 'react';

const UserDetailModal = ({ pnr, onClose, onStatusChange }) => {
  const [rejectingPassenger, setRejectingPassenger] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (passengerId, passengerName) => {
    onStatusChange(pnr.id, passengerId, 'approved', passengerName);
  };

  const handleReject = (passengerId) => {
    setRejectingPassenger(passengerId);
  };

  const handleConfirmRejection = () => {
    if (rejectionReason.trim()) {
      const passenger = pnr.passengersData.find((p) => p.id === rejectingPassenger);
      onStatusChange(pnr.id, rejectingPassenger, 'declined', passenger?.name || 'Passenger');
      setRejectingPassenger(null);
      setRejectionReason('');
    }
  };

  const handleCancelRejection = () => {
    setRejectingPassenger(null);
    setRejectionReason('');
  };

  const handleApproveAll = () => {
    pnr.passengersData.forEach((passenger) => {
      if (passenger.status === 'pending') {
        onStatusChange(pnr.id, passenger.id, 'approved', passenger.name);
      }
    });
  };

  const pendingCount = pnr.passengersData.filter((p) => p.status === 'pending').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.25)] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm">
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
        <div className="px-6 py-6 space-y-6">
          {pnr.passengersData.map((passenger) => (
            <div
              key={passenger.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* Passenger Image */}
                <div className="flex-shrink-0">
                  <img
                    src={passenger.image}
                    alt={passenger.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>

                {/* Passenger Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900">{passenger.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Document ID: {passenger.documentId}</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-400 outline-none resize-none shadow-sm"
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
                    <div className="flex items-center space-x-3 mt-4">
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
        <div className="sticky bottom-0 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200 px-6 py-5 flex items-center justify-between shadow-lg">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-sm"
          >
            Close
          </button>
          {pendingCount > 0 && (
            <button
              onClick={handleApproveAll}
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
    </div>
  );
};

export default UserDetailModal;

