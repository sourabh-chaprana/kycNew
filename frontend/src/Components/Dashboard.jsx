import { useState } from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../Action/auth/auth.slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserDetailModal from './Modals/UserDetailModal';
import Toast from './Toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPnr, setSelectedPnr] = useState(null);
  const [toast, setToast] = useState(null);

  // Mock data - replace with API calls later
  const [records, setRecords] = useState([
    {
      id: 1,
      pnr: 'ABC123',
      passengers: 2,
      status: 'pending',
      date: 'Dec 19, 2025 09:52',
      tag: 'ABC',
      passengersData: [
        {
          id: 1,
          name: 'John Doe',
          documentId: 'PASS-001234',
          status: 'pending',
          image: 'https://i.pravatar.cc/150?img=12',
        },
        {
          id: 2,
          name: 'Jane Doe',
          documentId: 'PASS-001235',
          status: 'pending',
          image: 'https://i.pravatar.cc/150?img=13',
        },
      ],
    },
    {
      id: 2,
      pnr: 'XYZ789',
      passengers: 1,
      status: 'pending',
      date: 'Dec 19, 2025 08:52',
      tag: 'XYZ',
      passengersData: [
        {
          id: 3,
          name: 'Test User',
          documentId: 'PASS-001236',
          status: 'pending',
          image: 'https://i.pravatar.cc/150?img=14',
        },
      ],
    },
  ]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handlePnrClick = (pnr) => {
    setSelectedPnr(pnr);
  };

  const handleCloseModal = () => {
    setSelectedPnr(null);
  };

  const handleStatusChange = (pnrId, passengerId, newStatus, passengerName) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id === pnrId) {
          const updatedPassengers = record.passengersData.map((p) =>
            p.id === passengerId ? { ...p, status: newStatus } : p
          );
          const allApproved = updatedPassengers.every((p) => p.status === 'approved');
          const hasDeclined = updatedPassengers.some((p) => p.status === 'declined');
          
          let newRecordStatus = record.status;
          if (allApproved && updatedPassengers.length > 0) {
            newRecordStatus = 'approved';
          } else if (hasDeclined) {
            newRecordStatus = 'declined';
          }

          // Show toast notification
          if (newStatus === 'approved') {
            setToast({
              message: `Document for ${passengerName} has been approved.`,
              type: 'success',
            });
          } else if (newStatus === 'declined') {
            setToast({
              message: `Document for ${passengerName} has been declined.`,
              type: 'error',
            });
          }

          return {
            ...record,
            status: newRecordStatus,
            passengersData: updatedPassengers,
          };
        }
        return record;
      })
    );
  };

  const filteredRecords = records.filter((record) => {
    if (activeTab === 'pending') return record.status === 'pending';
    if (activeTab === 'approved') return record.status === 'approved';
    if (activeTab === 'declined') return record.status === 'declined';
    return true;
  });

  const stats = {
    pending: records.filter((r) => r.status === 'pending').length,
    approved: records.filter((r) => r.status === 'approved').length,
    declined: records.filter((r) => r.status === 'declined').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">KYC Verification Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">Agent Portal</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto">
              <nav className="flex items-center space-x-2 md:space-x-4">
                <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition text-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">Home</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition text-sm">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">Upload Documents</span>
                </a>
              </nav>

              <div className="flex items-center space-x-2 md:space-x-3 border-l border-gray-200 pl-3 md:pl-6">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-gray-700 hidden md:inline">{user?.name || 'User'}</span>
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-600 hidden md:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                  {user?.avatar || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 px-2 md:px-3 py-1 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.2)] transition-all duration-300 p-6 border border-orange-100 hover:border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pending Records</p>
                <p className="text-5xl font-extrabold text-gray-900 leading-none">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 flex-shrink-0 ml-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.2)] transition-all duration-300 p-6 border border-green-100 hover:border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Approved Records</p>
                <p className="text-5xl font-extrabold text-gray-900 leading-none">{stats.approved}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200 flex-shrink-0 ml-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.2)] transition-all duration-300 p-6 border border-red-100 hover:border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Declined Records</p>
                <p className="text-5xl font-extrabold text-gray-900 leading-none">{stats.declined}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0 ml-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 p-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 relative mr-2 rounded-t-lg ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pending</span>
              {stats.pending > 0 && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                  activeTab === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 mr-2 rounded-t-lg ${
                activeTab === 'approved'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Approved</span>
            </button>
            <button
              onClick={() => setActiveTab('declined')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 rounded-t-lg ${
                activeTab === 'declined'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Declined</span>
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-12 text-center">
              <p className="text-gray-500 text-lg">No {activeTab} records found</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => handlePnrClick(record)}
                className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.2)] transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 flex-shrink-0">
                      {record.tag}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">PNR: {record.pnr}</h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
                            record.status === 'pending'
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : record.status === 'approved'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {record.status === 'pending'
                            ? 'Pending Review'
                            : record.status === 'approved'
                            ? 'Approved'
                            : 'Declined'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">{record.passengers} {record.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{record.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <svg className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedPnr && (
        <UserDetailModal
          pnr={selectedPnr}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

