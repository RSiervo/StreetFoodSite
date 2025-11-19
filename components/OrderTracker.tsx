import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle2, ChefHat, Truck, Home, Clock, Phone, MapPin, Navigation, Star } from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const [progress, setProgress] = useState(0);

  // Map status to percentage for the driver position
  const getProgress = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 5;
      case OrderStatus.CONFIRMED: return 15;
      case OrderStatus.PREPARING: return 40;
      case OrderStatus.READY: return 60;
      case OrderStatus.DELIVERING: return 85;
      case OrderStatus.DELIVERED: return 100;
      default: return 0;
    }
  };

  useEffect(() => {
    // Small delay to animate the transition on mount
    const timer = setTimeout(() => {
      setProgress(getProgress(order.status));
    }, 100);
    return () => clearTimeout(timer);
  }, [order.status]);

  const steps = [
    { status: OrderStatus.CONFIRMED, label: 'Confirmed', time: '10:30 AM' },
    { status: OrderStatus.PREPARING, label: 'Preparing', time: '10:35 AM' },
    { status: OrderStatus.DELIVERING, label: 'On the way', time: '10:50 AM' },
    { status: OrderStatus.DELIVERED, label: 'Delivered', time: '11:05 AM' },
  ];

  const isPast = (stepStatus: OrderStatus) => {
    const orderStatusIdx = steps.findIndex(s => s.status === order.status);
    const stepIdx = steps.findIndex(s => s.status === stepStatus);
    // Handle edge cases where status might not be in the simplified steps list
    if (orderStatusIdx === -1) {
       if (order.status === OrderStatus.READY && stepStatus === OrderStatus.PREPARING) return true;
       return false;
    }
    return stepIdx <= orderStatusIdx;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-street-gray/20 overflow-hidden mb-6 animate-slide-up">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="font-bold text-street-dark text-lg">Order #{order.id.slice(-4)}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Estimated Arrival: <span className="font-semibold text-street-dark">12:45 PM</span>
          </p>
        </div>
        <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === OrderStatus.DELIVERED ? 'bg-green-400' : 'bg-street-orange'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${order.status === OrderStatus.DELIVERED ? 'bg-green-500' : 'bg-street-orange'}`}></span>
          </span>
          <span className="text-xs font-bold text-street-dark uppercase tracking-wide">{order.status}</span>
        </div>
      </div>

      {/* Simulated Google Map Area */}
      <div className="relative h-48 bg-gray-100 w-full overflow-hidden group">
        {/* Map Background Pattern (CSS Simulation) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>
        
        {/* Stylized Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <path 
            d="M40,120 C100,120 150,60 280,60 L350,60" 
            fill="none" 
            stroke="white" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
          <path 
            d="M40,120 C100,120 150,60 280,60 L350,60" 
            fill="none" 
            stroke="#e5e7eb" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeDasharray="10,10"
            className="animate-pulse"
          />
        </svg>

        {/* Start Point (Restaurant) */}
        <div className="absolute left-6 top-[95px] flex flex-col items-center z-10">
           <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-street-dark">
              <ChefHat size={16} className="text-street-dark" />
           </div>
           <span className="bg-street-dark text-white text-[10px] px-2 py-0.5 rounded-full mt-1 shadow-sm font-bold">Kitchen</span>
        </div>

        {/* End Point (Home) */}
        <div className="absolute right-6 top-[35px] flex flex-col items-center z-10">
           <div className="w-8 h-8 bg-street-orange rounded-full shadow-md flex items-center justify-center border-2 border-white animate-bounce">
              <Home size={16} className="text-white" />
           </div>
           <span className="bg-white text-street-dark text-[10px] px-2 py-0.5 rounded-full mt-1 shadow-sm font-bold border border-gray-100">Home</span>
        </div>

        {/* Moving Driver Pin */}
        <div 
          className="absolute z-20 transition-all duration-1000 ease-in-out flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${progress}%`, 
            top: progress < 40 ? '120px' : progress < 70 ? '90px' : '60px' // Simple path approximation
          }}
        >
           <div className="relative">
             <div className="w-10 h-10 bg-street-dark rounded-full shadow-xl flex items-center justify-center text-white border-2 border-white z-20">
                {order.status === OrderStatus.DELIVERED ? <CheckCircle2 size={20} /> : <Truck size={20} />}
             </div>
             {order.status === OrderStatus.DELIVERING && (
               <div className="absolute inset-0 bg-street-orange rounded-full animate-ping opacity-30 -z-10"></div>
             )}
           </div>
           {order.status === OrderStatus.DELIVERING && (
             <div className="bg-white/90 backdrop-blur px-2 py-1 rounded shadow mt-1 text-[10px] font-bold border border-gray-100 whitespace-nowrap">
               2 mins away
             </div>
           )}
        </div>

        {/* Google Map Logo Placeholder for authenticity feel */}
        <div className="absolute bottom-2 right-2 opacity-50 text-[10px] font-sans text-gray-500 pointer-events-none select-none">
           Google Maps
        </div>
      </div>

      {/* Detailed Timeline */}
      <div className="p-5">
        <div className="space-y-6 relative">
           {/* Vertical Line */}
           <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

           {steps.map((step, idx) => {
             const completed = isPast(step.status);
             const active = step.status === order.status;
             
             return (
               <div key={step.label} className="flex items-start gap-4">
                 <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 bg-white
                    ${completed ? 'border-green-500 text-green-500' : 'border-gray-200 text-gray-300'}
                    ${active ? 'ring-4 ring-green-50 border-green-500 text-green-500' : ''}
                 `}>
                    {completed ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                 </div>
                 <div className="flex-grow pt-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-sm font-bold ${completed || active ? 'text-street-dark' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <span className="text-[10px] text-gray-400">{step.time}</span>
                    </div>
                    {active && (
                      <p className="text-xs text-street-orange animate-pulse font-medium">
                         Processing...
                      </p>
                    )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Driver Info Card */}
      <div className="bg-street-dark p-4 m-4 mt-0 rounded-xl flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-street-orange">
             <img src="https://picsum.photos/seed/driver1/100/100" alt="Driver" className="w-full h-full object-cover" />
           </div>
           <div>
             <h4 className="font-bold text-sm">Mike Ross</h4>
             <div className="flex items-center text-xs text-gray-300 gap-2">
               <span className="flex items-center text-street-yellow"><Star size={10} className="fill-current mr-0.5" /> 4.9</span>
               <span>• Red Scooter</span>
             </div>
           </div>
        </div>
        <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
           <Phone size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};