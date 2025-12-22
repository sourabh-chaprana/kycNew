import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllAgents } from '../../Action/Agent/agent.thunk';
import { clearError } from '../../Action/Agent/agent.slice';

const AgentsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { agents, loading, error } = useSelector((state) => state.agent);

  useEffect(() => {
    dispatch(fetchAllAgents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleAgentClick = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Agents</h1>
          <p className="text-gray-600">View and manage all agents and their passengers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg">No agents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentClick(agent.id)}
                className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.2)] transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 cursor-pointer transform hover:-translate-y-1"
              >
                {/* Agent Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 flex-shrink-0">
                    {agent.avatar || agent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{agent.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{agent.email}</p>
                    {!agent.isActive && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total PNRs</p>
                    <p className="text-2xl font-bold text-gray-900">{agent.stats.total}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-orange-600 uppercase mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-700">{agent.stats.pending}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-600 uppercase mb-1">Approved</p>
                    <p className="text-2xl font-bold text-green-700">{agent.stats.approved}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-600 uppercase mb-1">Declined</p>
                    <p className="text-2xl font-bold text-red-700">{agent.stats.declined}</p>
                  </div>
                </div>

                {/* Partially Status */}
                {agent.stats.partially > 0 && (
                  <div className="mb-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Partially</p>
                      <p className="text-xl font-bold text-purple-700">{agent.stats.partially}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Joined {formatDate(agent.createdAt)}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentsList;

