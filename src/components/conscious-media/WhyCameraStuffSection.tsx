export const WhyCameraStuffSection = () => {
  return (
    <section className="bg-white py-16 lg:py-20 px-10 lg:px-20 border-b border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Content (55% width) */}
          <div className="lg:w-[55%] space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Why CameraStuff?
            </h2>
            
            <p className="text-[17px] text-foreground/80 leading-relaxed">
              Since 2006, CameraStuff has been South Africa's dedicated partner for visual 
              storytellers. They're an authorized Godox distributor with local warranty, 
              professional expertise, and deep understanding of what African creators actually need.
            </p>
            
            <p className="text-[17px] text-foreground/80 leading-relaxed">
              We chose them because they embody what matters: local economy support, 
              professional quality, and accessibility for creators who prioritize ethics.
            </p>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              This partnership isn't about specs. It's about working with people who understand 
              that conscious media requires tools that respect sacred spaces, honor participants, 
              and support storytellers who document with intention.
            </p>
          </div>

          {/* Right Column: Logo and Reviews (45% width) */}
          <div className="lg:w-[45%]">
            <div className="bg-purple-50 p-10 rounded-xl shadow-md">
              {/* Rating Section */}
              <div className="mb-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-4xl font-bold text-foreground mb-2">4.8 / 5</p>
                <p className="text-[15px] text-muted-foreground mb-6 pb-6 border-b border-border">
                  From 1,000+ verified customer reviews
                </p>
              </div>

              {/* Trust Badges */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      Authorized Godox Distributor
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Official partner with 2-year local warranty
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🇿🇦</span>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      Proudly South African Since 2006
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Supporting local creative infrastructure
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚡</span>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      Fast Nationwide Delivery
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Free delivery on orders over R1,000
                    </p>
                  </div>
                </div>
              </div>
              
              {/* CameraStuff Logo Link */}
              <div className="mt-8 pt-6 border-t border-border">
                <a 
                  href="https://www.camerastuff.co.za/shop/omniwellnessmedia?a_aid=omniwellnessmedia&a_bid=a42a1cc9"
                  target="_top"
                  className="block transition-opacity hover:opacity-80"
                >
                  <img 
                    src="https://camerastuff.postaffiliatepro.com/accounts/default1/nbo4em5ndkg/a42a1cc9.jpg"
                    alt="CameraStuff Shop"
                    title="CameraStuff Shop"
                    className="h-32 lg:h-40 w-auto object-contain mx-auto"
                  />
                </a>
                <img 
                  style={{ border: 0 }} 
                  src="https://camerastuff.postaffiliatepro.com/scripts/nio4em5ndkg?a_aid=omniwellnessmedia&a_bid=a42a1cc9" 
                  width="1" 
                  height="1" 
                  alt="" 
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
