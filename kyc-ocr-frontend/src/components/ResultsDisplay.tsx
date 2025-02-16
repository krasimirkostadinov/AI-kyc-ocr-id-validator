import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ResultsDisplay: React.FC = () => {
  const { text, status, error } = useSelector((state: RootState) => state.ocr);
  
  if (status === 'loading') {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-semibold text-gray-600">AI Processing image...</p>
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
    return (
      <div className="max-w-2xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Verification Result</h2>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Match Percentage:</span>
          <span
            className={`px-3 py-1 rounded-md text-white ${
              parseFloat(text.matchPercentage) >= 80
                ? 'bg-green-500'
                : parseFloat(text.matchPercentage) >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          >
            {text.matchPercentage}
          </span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {[
                { label: 'Full Name', value: text.extractedData.fullName },
                { label: 'Given Name', value: text.extractedData.givenName },
                { label: 'Surname', value: text.extractedData.surname },
                { label: 'Nationality', value: text.extractedData.nationality },
                { label: 'Date of Birth', value: text.extractedData.dateOfBirth },
                { label: 'Gender', value: text.extractedData.gender },
                { label: 'Personal No (EGN)', value: text.extractedData.personalNo },
                { label: 'Document No', value: text.extractedData.documentNo },
                { label: 'Expiry Date', value: text.extractedData.expiryDate },
              ].map((field, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-4 py-2 font-medium text-gray-700 border">{field.label}</td>
                  <td className="px-4 py-2 text-gray-900 border">{field.value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultsDisplay;