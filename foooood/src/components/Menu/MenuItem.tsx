import React from 'react';
import { Star, Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../../types';
import { useCart } from '../../context/CartContext';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {item.popular && (
            <div className="absolute top-3 left-3">
              <div className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </div>
            </div>
          )}
        </div>
        <div className="md:w-2/3 p-4 md:p-6 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex items-center mr-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {item.prepTime} • {item.category}
                </div>
              </div>
            </div>
            <div className="text-primary-600 font-bold text-lg">
              ${item.price.toFixed(2)}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {item.description}
          </p>
          
          <button 
            onClick={() => addToCart(item)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 w-full md:w-auto self-end"
          >
            <Plus size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;