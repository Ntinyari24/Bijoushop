import React, { useState } from 'react';
import { Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface MpesaPaymentProps {
  amount: number;
  phoneNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ amount, phoneNumber, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [mpesaPin, setMpesaPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMpesaPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate M-Pesa API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate successful payment
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number to Kenyan format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    } else if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    }
    return phone;
  };

  if (step === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          KES {amount.toFixed(2)} has been sent to 0792408543
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Transaction ID:</strong> MP{Date.now().toString().slice(-8)}
          </p>
          <p className="text-green-800 text-sm">
            <strong>Amount:</strong> KES {amount.toFixed(2)}
          </p>
          <p className="text-green-800 text-sm">
            <strong>Recipient:</strong> 0792408543
          </p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h3>
        <p className="text-gray-600 mb-6">
          There was an issue processing your M-Pesa payment. Please try again.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setStep('confirm')}
            className="flex-1 bg-jungle-600 text-white py-3 rounded-lg font-semibold hover:bg-jungle-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Smartphone className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment...</h3>
        <p className="text-gray-600 mb-6">
          Please check your phone for the M-Pesa prompt and enter your PIN.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Amount:</strong> KES {amount.toFixed(2)}
          </p>
          <p className="text-blue-800 text-sm">
            <strong>Recipient:</strong> 0792408543
          </p>
          <p className="text-blue-800 text-sm">
            <strong>Your Phone:</strong> {formatPhoneNumber(phoneNumber)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">M-Pesa Payment</h3>
        <p className="text-gray-600">Pay securely with M-Pesa</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:1</span>
          <span className="font-semibold">KES {amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Your Phone:</span>
          <span className="font-semibold">{formatPhoneNumber(phoneNumber)}</span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium text-sm">Important:</p>
            <p className="text-yellow-700 text-sm mt-1">
              You will receive an M-Pesa prompt on your phone. Enter your M-Pesa PIN to complete the payment.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleMpesaPayment}
          disabled={isProcessing}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MpesaPayment;
