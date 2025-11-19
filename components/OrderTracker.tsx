import React from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle2, ChefHat, Truck, Home, Clock } from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const steps = [
    { status: OrderStatus.CONFIRMED, icon: CheckCircle2, label: 'Confirmed' },
    { status: OrderStatus.PREPARING, icon: ChefHat, label: 'Cooking' },
    { status: OrderStatus.DELIVERING, icon: Truck, label: 'On Way' },
    { status: OrderStatus.DELIVERED, icon: Home, label: 'Delivered' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  // If order status is not in simplified steps (e.g. Pending or Ready), map roughly
  // Ready -> Cooking finished (index 1 full)
  let activeIndex = currentStepIndex;
  if (order.status === OrderStatus.READY) activeIndex = 1; 
  if (order.status === OrderStatus.PENDING) activeIndex = -1;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-street-gray mb-4 animate-slide-up">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <h3 className="font-bold text-street-dark">Order #{order.id.slice(-4)}</h3>
        <div className="flex items-center gap-1 text-xs text-street-orange font-medium bg-orange-50 px-2 py-1 rounded">
          <Clock size={12} />
          <span>25 mins</span>
        </div>
      </div>

      <div className="relative flex justify-between items-start">
        {/* Progress Line Background */}
        <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
        
        {/* Progress Line Active */}
        <div 
          className="absolute top-3 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-1000"
          style={{ width: `${Math.max(0, Math.min(100, (activeIndex / (steps.length - 1)) * 100))}%` }}
        ></div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.label} className="flex flex-col items-center gap-2 w-1/4">
              <div 
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all duration-500
                  ${isActive ? 'bg-green-500 text-white scale-110 shadow-md' : 'bg-gray-200 text-gray-400'}
                  ${isCurrent ? 'ring-4 ring-green-100' : ''}
                `}
              >
                <Icon size={14} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-street-dark' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 bg-gray-50 p-3 rounded-lg flex gap-3">
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden shadow-sm shrink-0">
             <img src="https://picsum.photos/seed/driver/100/100" alt="driver" className="w-full h-full object-cover" />
        </div>
        <div>
            <p className="text-xs text-gray-500">Delivery Partner</p>
            <p className="text-sm font-bold text-street-dark">Mike R.</p>
        </div>
        <button className="ml-auto text-xs bg-white border border-gray-200 px-3 py-1 rounded-full font-medium text-street-dark">Call</button>
      </div>
    </div>
  );
};