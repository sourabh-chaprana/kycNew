import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAgentPassengers,
} from '../../Action/Agent/agent.thunk';
import { clearError, clearSelectedAgent } from '../../Action/Agent/agent.slice';
import {
  updatePassengerStatus,
  approveAllPending,
} from '../../Action/Passenger/passenger.thunk';
import PassengerList from '../Passenger/PassengerList';
import UserDetailModal from '../Modals/UserDetailModal';
import Toast from '../Toast';

const AgentDetails = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAgent, agentPassengers, stats, loading, error } = useSelector((state) => state.agent);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPnr, setSelectedPnr] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchAgentPassengers({ agentId, status: activeTab === 'all' ? null : activeTab }));
    
    return () => {
      dispatch(clearSelectedAgent());
    };
  }, [dispatch, agentId, activeTab]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handlePnrClick = (pnr) => {
    setSelectedPnr(pnr);
  };

  const handleCloseModal = () => {
    setSelectedPnr(null);
  };

  const handleStatusChange = async (pnrId, passengerId, newStatus, passengerName, rejectionReason = '') => {
    try {
      const result = await dispatch(updatePassengerStatus({
        pnrId,
        passengerId,
        status: newStatus,
        rejectionReason
      }));

      if (updatePassengerStatus.fulfilled.match(result)) {
        if (selectedPnr && selectedPnr.id === pnrId) {
          setSelectedPnr(result.payload);
        }

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

        dispatch(fetchAgentPassengers({ agentId, status: activeTab === 'all' ? null : activeTab }));
      }
    } catch (err) {
      setToast({
        message: err.message || 'Failed to update passenger status',
        type: 'error',
      });
    }
  };

  const handleApproveAll = async (pnrId) => {
    try {
      const result = await dispatch(approveAllPending(pnrId));

      if (approveAllPending.fulfilled.match(result)) {
        if (selectedPnr && selectedPnr.id === pnrId) {
          setSelectedPnr(result.payload);
        }

        setToast({
          message: 'All pending passengers have been approved.',
          type: 'success',
        });

        dispatch(fetchAgentPassengers({ agentId, status: activeTab === 'all' ? null : activeTab }));
      }
    } catch (err) {
      setToast({
        message: err.message || 'Failed to approve all pending',
        type: 'error',
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRecords = agentPassengers.filter((record) => {
    if (activeTab === 'pending') return record.status === 'pending';
    if (activeTab === 'approved') return record.status === 'approved';
    if (activeTab === 'declined') return record.status === 'declined';
    if (activeTab === 'partially') return record.status === 'partially';
    return true;
  });

  if (!selectedAgent && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Agent Not Found</h2>
          <p className="text-gray-600 mb-4">The agent you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/agents')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Agents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/agents')}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Agents</span>
        </button>

        {/* Agent Header */}
        {selectedAgent && (
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200 flex-shrink-0">
                {selectedAgent.avatar || selectedAgent.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{selectedAgent.name}</h1>
                <p className="text-gray-600 mb-2">{selectedAgent.email}</p>
                {!selectedAgent.isActive && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(147,51,234,0.2)] transition-all duration-300 p-6 border border-purple-100 hover:border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Partially Records</p>
                <p className="text-5xl font-extrabold text-gray-900 leading-none">{stats.partially}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0 ml-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 p-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 relative mr-2 rounded-t-lg whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>All</span>
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 relative mr-2 rounded-t-lg whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 mr-2 rounded-t-lg whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 mr-2 rounded-t-lg whitespace-nowrap ${
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
            <button
              onClick={() => setActiveTab('partially')}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-200 rounded-t-lg whitespace-nowrap ${
                activeTab === 'partially'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Partially</span>
              {stats.partially > 0 && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                  activeTab === 'partially'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {stats.partially}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Records List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading records...</p>
          </div>
        ) : (
          <PassengerList
            records={filteredRecords}
            activeTab={activeTab}
            onSelect={handlePnrClick}
            formatDate={formatDate}
          />
        )}
      </main>

      {/* Modal */}
      {selectedPnr && (
        <UserDetailModal
          pnr={selectedPnr}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
          onApproveAll={handleApproveAll}
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

export default AgentDetails;

