import React, { useState } from 'react';
import { apiClient } from '../services/api';

const BackendTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await apiClient.healthCheck();
      setStatus(`✅ Connected: ${response.message}`);
    } catch (error: any) {
      setStatus(`❌ Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <div className="text-sm font-semibold mb-2">Django Backend</div>
      <div className="text-xs mb-2">{status}</div>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
    </div>
  );
};

export default BackendTest;
