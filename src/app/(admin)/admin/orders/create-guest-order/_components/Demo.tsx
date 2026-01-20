"use client";

import React, { useState } from 'react';
import { generateGuestId } from '@/lib/guest/useGuestId';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const Demo = () => {
  const [generatedId, setGeneratedId] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateId = () => {
    const newId = generateGuestId();
    setGeneratedId(newId);
    setIsCopied(false);
    toast.success('New Guest ID generated successfully!');
  };

  const handleCopyId = async () => {
    if (generatedId) {
      try {
        await navigator.clipboard.writeText(generatedId);
        setIsCopied(true);
        toast.success('Guest ID copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Guest Order
            </h1>
            <p className="text-gray-600">
              Generate a new guest ID for manual order creation
            </p>
          </div>

          {/* Guest ID Generation Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Generate Guest ID
              </h2>
              
              {/* Generated ID Display */}
              {generatedId && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Guest ID:
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 font-mono text-lg font-semibold text-gray-800 min-w-0 flex-1 max-w-md">
                      {generatedId}
                    </div>
                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      {isCopied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateId}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <RefreshCw size={20} />
                Generate New Guest ID
              </button>

              {/* Instructions */}
              <div className="mt-8 text-left bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• Click &quot;Generate New Guest ID&quot; to create a unique guest identifier</li>
                  <li>• Each generated ID is 16 characters long with 3 numeric values</li>
                  <li>• Use the &quot;Copy&quot; button to copy the ID to your clipboard</li>
                  <li>• This ID can be used for manual guest order creation</li>
                  <li>• Each click generates a completely new, unique ID</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;