import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test health endpoint
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await apiClient.healthCheck();
        setHealthStatus(response.message || 'OK');
      } catch (error: any) {
        setHealthStatus(`Error: ${error.message}`);
      }
    };

    checkHealth();
  }, []);

  // Test products endpoint
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProducts();
      if (response.success) {
        setProducts(response.data?.results || []);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Test registration
  const testRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'testpass123',
        first_name: 'Test',
        last_name: 'User'
      };

      const response = await apiClient.register(testUser);
      if (response.success) {
        alert('Registration successful!');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Backend API Test</h2>
      
      {/* Health Check */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Health Check</h3>
        <p className={`${healthStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          Status: {healthStatus}
        </p>
      </div>

      {/* Products Test */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Products API</h3>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Products'}
        </button>
        
        {products.length > 0 && (
          <div className="mt-4">
            <p className="text-green-600">Found {products.length} products</p>
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
        
        {products.length === 0 && !loading && !error && (
          <p className="mt-4 text-gray-600">No products found (this is normal for a new backend)</p>
        )}
      </div>

      {/* Registration Test */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Registration Test</h3>
        <button
          onClick={testRegistration}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This will create a test user account
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h4 className="font-semibold">Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Connection Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Connection Info</h3>
        <p><strong>Backend URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</p>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
      </div>
    </div>
  );
};

export default ApiTest;
