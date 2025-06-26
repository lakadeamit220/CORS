import { useState } from 'react';
import axios from 'axios';

// Configure axios to send credentials (cookies) with requests
axios.defaults.withCredentials = true;

export default function CORSExamples() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Basic public request (no CORS restrictions)
  const makePublicRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:3001/api/public');
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Restricted request (specific origin)
  const makeRestrictedRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:3001/api/restricted');
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Request with credentials (cookies)
  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(
        'http://localhost:3001/api/login',
        { username: 'testuser' },
        { withCredentials: true }
      );
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProtectedData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:3001/api/protected', {
        withCredentials: true
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Request with custom headers (will trigger preflight)
  const makeCustomHeadersRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(
        'http://localhost:3001/api/with-headers',
        { someData: 'value' },
        {
          headers: {
            'X-Custom-Header': 'custom-value',
            'Content-Type': 'application/json'
          }
        }
      );
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear all states
  const clearAll = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CORS Demonstration</h1>
          <p className="text-gray-600">
            Test different CORS scenarios with this interactive demo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Public Request */}
          <button
            onClick={makePublicRequest}
            disabled={loading}
            className="btn-primary"
          >
            Public Request
            <span className="text-xs block font-normal">No CORS restrictions</span>
          </button>

          {/* Restricted Request */}
          <button
            onClick={makeRestrictedRequest}
            disabled={loading}
            className="btn-secondary"
          >
            Restricted Request
            <span className="text-xs block font-normal">Specific origin only</span>
          </button>

          {/* Login */}
          <button
            onClick={login}
            disabled={loading}
            className="btn-accent"
          >
            Login (Set Cookie)
            <span className="text-xs block font-normal">With credentials</span>
          </button>

          {/* Protected Data */}
          <button
            onClick={fetchProtectedData}
            disabled={loading}
            className="btn-accent"
          >
            Protected Data
            <span className="text-xs block font-normal">Requires cookie</span>
          </button>

          {/* Custom Headers */}
          <button
            onClick={makeCustomHeadersRequest}
            disabled={loading}
            className="btn-warning col-span-2"
          >
            Custom Headers Request
            <span className="text-xs block font-normal">Triggers preflight</span>
          </button>
        </div>

        {/* Clear button */}
        <div className="flex justify-center">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear Results
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">CORS Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response display */}
        {response && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">API Response</h3>
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Info panel */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Check your browser's Network tab</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Look for CORS headers like <code>Access-Control-Allow-Origin</code> and preflight OPTIONS requests.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom button styles to your global CSS or in a style tag */}
      <style jsx>{`
        .btn-primary {
          @apply px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
          @apply flex flex-col items-center;
        }
        .btn-secondary {
          @apply px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition;
          @apply flex flex-col items-center;
        }
        .btn-accent {
          @apply px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition;
          @apply flex flex-col items-center;
        }
        .btn-warning {
          @apply px-4 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition;
          @apply flex flex-col items-center;
        }
        button:disabled {
          @apply opacity-50 cursor-not-allowed;
        }
      `}</style>
    </div>
  );
}