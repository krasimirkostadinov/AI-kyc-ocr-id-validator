import './App.css'
import { Provider } from 'react-redux'
import ResultsDisplay from './components/ResultsDisplay'
import store from './store/store'
import ImageUploadForm from './components/ImageUploadForm'

const App = () => {
  return (
    <Provider store={store}>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          AI tool for KYC and OCR user profile matching
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:pr-4">
            <ImageUploadForm />
          </div>
          <div className="md:pl-4">
            <ResultsDisplay />
          </div>
        </div>
      </div>
    </Provider>
  )
}

export default App;
