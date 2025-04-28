import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cartItems, totalItems } = useCart();
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
            <p className="text-gray-600">
              {totalItems === 0 
                ? 'Your cart is empty' 
                : `You have ${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
            </p>
          </div>
          
          {totalItems === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-lg mx-auto">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={64} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-medium text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/menu"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;