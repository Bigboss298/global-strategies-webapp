export default function TBPLoader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Outer pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#05A346]/20 animate-ping-slow"></div>
        </div>
        
        {/* Main logo circle with TBP */}
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center shadow-2xl animate-pulse-custom">
          <span className="text-4xl font-bold text-white tracking-wider">TBP</span>
        </div>
        
        {/* Rotating border */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#05A346] animate-spin-slow"></div>
        
        <style>{`
          @keyframes pulse-custom {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(5, 163, 70, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 20px 10px rgba(5, 163, 70, 0);
            }
          }
          
          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .animate-pulse-custom {
            animation: pulse-custom 2s ease-in-out infinite;
          }
          
          .animate-ping-slow {
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    </div>
  )
}
