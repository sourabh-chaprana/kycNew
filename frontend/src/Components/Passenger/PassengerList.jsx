const PassengerList = ({ records, activeTab, onSelect, formatDate }) => {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-lg">No {activeTab} records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          onClick={() => onSelect(record)}
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
                        : record.status === 'declined'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {record.status === 'pending'
                      ? 'Pending Review'
                      : record.status === 'approved'
                      ? 'Approved'
                      : record.status === 'declined'
                      ? 'Declined'
                      : 'Partially'}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {record.passengers} {record.passengers === 1 ? 'Passenger' : 'Passengers'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">{formatDate(record.date)}</span>
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
      ))}
    </div>
  );
};

export default PassengerList;

