import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSummary: React.FC = () => {
  const { subtotal, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=cart');
      return;
    }
    
    // In a real app, this would redirect to a payment gateway
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={totalItems === 0}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-white font-medium ${
          totalItems === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600 transition-colors'
        }`}
      >
        <ShoppingBag size={20} />
        <span>Checkout</span>
      </button>
      
      <div className="mt-4">
        <button
          onClick={() => navigate('/menu')}
          className="w-full py-2 text-primary-600 font-medium underline-offset-2 hover:underline"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CartSummary;