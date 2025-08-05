import { Button } from '@/components/ui/button';

export default function DealsHero() {
  return (
    <section className="bg-gradient-to-r from-cyan-400 to-teal-500 py-16 px-4 text-center relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Wellness with Omni
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Explore exclusive wellness offers and curated experiences for conscious living
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 flex items-center gap-4">
          <div className="flex items-center gap-2 px-4">
            <span className="text-gray-500">📍</span>
            <select className="text-gray-700 bg-transparent border-none outline-none">
              <option>National</option>
              <option>Cape Town</option>
              <option>Johannesburg</option>
              <option>Durban</option>
            </select>
          </div>
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="What wellness experience are you looking for?"
              className="w-full px-4 py-3 border-none outline-none text-gray-700"
            />
          </div>
          <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded-md">
            🔍
          </Button>
        </div>
        
        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">Spa & Beauty</span>
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">Fitness Classes</span>
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">Wellness Retreats</span>
        </div>
      </div>
    </section>
  );
}