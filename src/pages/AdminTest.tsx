import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const AdminTest = () => {
  const { user, isLoggedIn } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any, error?: any) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      error,
      timestamp: new Date().toISOString()
    }]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    if (!user) {
      addResult('User Check', null, 'No user found');
      setLoading(false);
      return;
    }

    addResult('User Info', {
      id: user.id,
      email: user.email,
      isLoggedIn
    });

    // Test 1: Direct query to admin_roles table
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id);

      addResult('Direct Admin Query', { data, error });
    } catch (err) {
      addResult('Direct Admin Query', null, err);
    }

    // Test 2: Check if admin_roles table exists
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('count')
        .limit(1);

      addResult('Table Exists Check', { data, error });
    } catch (err) {
      addResult('Table Exists Check', null, err);
    }

    // Test 3: Try to insert admin role
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .upsert({
          user_id: user.id,
          role: 'super_admin',
          permissions: ['manage_colleges', 'manage_events', 'manage_keam_data', 'manage_users', 'manage_reviews'],
          is_active: true
        })
        .select();

      addResult('Insert Admin Role', { data, error });
    } catch (err) {
      addResult('Insert Admin Role', null, err);
    }

    // Test 4: Query again after insert
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id);

      addResult('Query After Insert', { data, error });
    } catch (err) {
      addResult('Query After Insert', null, err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Access Test</h1>
          
          <div className="mb-6">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run Admin Tests'}
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{result.test}</h3>
                <div className="text-sm">
                  <p><strong>Timestamp:</strong> {result.timestamp}</p>
                  {result.error ? (
                    <div className="mt-2">
                      <p className="text-red-600 font-medium">Error:</p>
                      <pre className="bg-red-50 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-green-600 font-medium">Result:</p>
                      <pre className="bg-green-50 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {testResults.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              Click "Run Admin Tests" to start debugging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 