import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPNR } from '../../Action/Passenger/passenger.thunk';

const PassengerAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.passenger);

  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [pnrNumber, setPnrNumber] = useState('');
  const [tag, setTag] = useState('');
  const [travelers, setTravelers] = useState([
    { name: '', documentId: '', image: '', inputType: 'file' }, // inputType: 'file' | 'url'
  ]);
  const [error, setError] = useState(null);

  const handleTravelerChange = (index, field, value) => {
    setTravelers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const handleInputTypeChange = (index, type) => {
    setTravelers((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, inputType: type, image: '' } : t
      )
    );
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload an image (JPEG, PNG) or PDF.');
        return;
      }
      // Validate file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please upload a file smaller than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleTravelerChange(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleAddTraveler = () => {
    setTravelers((prev) => [
      ...prev,
      { name: '', documentId: '', image: '', inputType: 'file' },
    ]);
  };

  const handleRemoveTraveler = (index) => {
    setTravelers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!pnrNumber.trim()) {
      setError('PNR number is required');
      return;
    }

    const validTravelers = travelers.filter(
      (t) => t.name.trim() && t.documentId.trim()
    );

    if (validTravelers.length === 0) {
      setError('At least one traveler with name and document ID is required');
      return;
    }

    const payload = {
      pnr: pnrNumber.trim().toUpperCase(),
      tag:
        tag.trim().toUpperCase() ||
        airline.trim().split(' ')[0]?.substring(0, 3).toUpperCase() ||
        pnrNumber.trim().substring(0, 3).toUpperCase(),
      passengers: validTravelers.map((t) => ({
        name: t.name.trim(),
        documentId: t.documentId.trim(),
        image: t.image.trim() || null,
      })),
    };

    const result = await dispatch(createPNR(payload));
    if (createPNR.fulfilled.match(result)) {
      navigate('/dashboard');
    } else if (result.payload) {
      setError(result.payload);
    } else {
      setError('Failed to create passenger record');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add New Passenger
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter basic flight and traveler information to create a new PNR for
            KYC verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Flight Information (minimal fields used for UI only) */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Flight Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airline
                </label>
                <input
                  type="text"
                  value={airline}
                  onChange={(e) => setAirline(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="e.g., AIR INDIA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="e.g., AI-2409"
                />
              </div>
            </div>
          </section>

          {/* PNR & Tag */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              PNR Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PNR Number *
                </label>
                <input
                  type="text"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="e.g., ABC123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag (optional)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                  placeholder="e.g., ABC"
                />
              </div>
            </div>
          </section>

          {/* Travelers */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Traveler Information
              </h2>
              <button
                type="button"
                onClick={handleAddTraveler}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-green-700 transition"
              >
                <span className="mr-1 text-lg leading-none">+</span>
                Add Traveler
              </button>
            </div>

            <div className="space-y-6">
              {travelers.map((traveler, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Traveler {index + 1}
                    </h3>
                    {travelers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTraveler(index)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 h-5">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={traveler.name}
                        onChange={(e) =>
                          handleTravelerChange(index, 'name', e.target.value)
                        }
                        className="w-full h-[46px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                        placeholder="Enter traveler name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 h-5">
                        Document ID *
                      </label>
                      <input
                        type="text"
                        value={traveler.documentId}
                        onChange={(e) =>
                          handleTravelerChange(
                            index,
                            'documentId',
                            e.target.value
                          )
                        }
                        className="w-full h-[46px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                        placeholder="e.g., PASS-001234"
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1 h-5">
                        <label className="block text-sm font-medium text-gray-700">
                          Photo/Document
                        </label>
                        <div className="flex text-xs bg-gray-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleInputTypeChange(index, 'file')}
                            className={`px-2 py-0.5 rounded-md transition-colors ${
                              traveler.inputType === 'file'
                                ? 'bg-white shadow text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputTypeChange(index, 'url')}
                            className={`px-2 py-0.5 rounded-md transition-colors ${
                              traveler.inputType === 'url'
                                ? 'bg-white shadow text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            URL
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        {traveler.inputType === 'file' ? (
                          <>
                            <div className="relative w-full h-[46px]">
                              <input
                                type="file"
                                id={`file-upload-${index}`}
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(index, e)}
                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                              />
                              <div className="w-full h-full px-4 border-2 border-gray-200 rounded-xl bg-white flex items-center justify-between text-gray-500">
                                <span className="truncate pr-2">
                                  {traveler.image ? 'File selected' : 'No file chosen'}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold whitespace-nowrap">
                                  Choose File
                                </span>
                              </div>
                            </div>
                            {traveler.image && (
                              <p className="absolute -bottom-5 left-0 text-xs text-green-600 truncate w-full">
                                File ready to upload
                              </p>
                            )}
                          </>
                        ) : (
                          <input
                            type="url"
                            value={traveler.image}
                            onChange={(e) =>
                              handleTravelerChange(index, 'image', e.target.value)
                            }
                            className="w-full h-[46px] px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition"
                            placeholder="https://..."
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : `Create ${travelers.length} Passenger(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerAdd;
