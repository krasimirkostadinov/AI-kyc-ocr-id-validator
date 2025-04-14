import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import React from 'react';

const ResultsDisplay: React.FC = () => {
  const { text, status, error } = useSelector((state: RootState) => state.ocr);

  if (status === 'loading') {
    return (
      <div className="text-center py-4">
        <div className="text-lg font-semibold text-gray-600">AI Processing image...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center text-red-500 py-4">
        <p className="text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (status === 'succeeded' && text) {
    const extracted = text.extractedData || {};
    const matchSummary = text.matchSummary || { percentage: "0%", matched: [], mismatched: [] };

    return (
      <div className="max-w-3xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Verification Result</h2>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Match Percentage:</span>
          <span
            className={`px-3 py-1 rounded-md text-white ${
              parseFloat(matchSummary.percentage) >= 80
                ? 'bg-green-500'
                : parseFloat(matchSummary.percentage) >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          >
            {matchSummary.percentage}
          </span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {[
                { label: 'Full Name', value: extracted.fullName },
                { label: 'Given Name', value: extracted.givenName },
                { label: 'Middle Name', value: extracted.middleName },
                { label: 'Surname', value: extracted.surname },
                { label: 'Nationality', value: extracted.nationality },
                { label: 'Date of Birth', value: extracted.dateOfBirth },
                { label: 'Gender', value: extracted.gender },
                { label: 'Personal No (EGN)', value: extracted.personalNo },
                { label: 'Document No', value: extracted.documentNo },
                { label: 'Expiry Date', value: extracted.expiryDate },
              ].map((field, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-4 py-2 font-medium text-gray-700 border">{field.label}</td>
                  <td className="px-4 py-2 text-gray-900 border">{field.value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-700">Matched Fields:</h3>
          <p className="text-sm text-green-700">{matchSummary.matched.join(', ') || 'None'}</p>
        </div> */}

        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700">Mismatched Fields:</h3>
          <p className="text-sm text-red-600">{matchSummary.mismatched.join(', ') || 'None'}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultsDisplay;
