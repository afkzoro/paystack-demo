import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  const verifyPayment = useCallback(async (reference) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verify-payment/${reference}`);
      console.log(response)
      const data = await response.json();
      console.log(response)

      
      if (data.status === true && data.data.status === 'success') {
        setTransaction(data.data);
      } else {
        navigate('/payment/failure');
      }
    } catch (error) {
      navigate('/payment/failure');
    } finally {
      setVerifying(false);
    }
  }, [navigate]);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      verifyPayment(reference);
    } else {
      navigate('/payment/failure');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl text-center">Verifying payment...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <h2 className="mt-4 text-2xl font-bold">Payment Successful!</h2>
        {transaction && (
          <div className="mt-4 text-left">
            <p><strong>Amount:</strong> ₦{transaction.amount / 100}</p>
            <p><strong>Reference:</strong> {transaction.reference}</p>
            <p><strong>Email:</strong> {transaction.customer.email}</p>
          </div>
        )}
        <button 
          onClick={() => navigate('/')}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Make Another Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
