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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CORS Examples</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={makePublicRequest} disabled={loading}>
          1. Public Request (No CORS restrictions)
        </button>
        
        <button onClick={makeRestrictedRequest} disabled={loading}>
          2. Restricted Request (Specific origin only)
        </button>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={login} disabled={loading}>
            3a. Login (Sets cookie)
          </button>
          <button onClick={fetchProtectedData} disabled={loading}>
            3b. Protected Data (Requires cookie)
          </button>
        </div>
        
        <button onClick={makeCustomHeadersRequest} disabled={loading}>
          4. Custom Headers (Triggers preflight)
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}