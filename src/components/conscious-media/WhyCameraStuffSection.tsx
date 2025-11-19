export const WhyCameraStuffSection = () => {
  return (
    <section className="bg-white py-16 lg:py-20 px-10 lg:px-20 border-b border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Content (55% width) */}
          <div className="lg:w-[55%] space-y-6">
            <div className="mb-4">
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                Values-Aligned Partnership
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Why CameraStuff?
              </h2>
            </div>
            
            <p className="text-[17px] text-foreground/80 leading-relaxed mb-6">
              CameraStuff is South Africa's creative partner for photographers and videographers. Authorized Godox distributor with 2-year local warranty.
            </p>

            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Proudly South African Since 2006
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Founded locally, serving creative communities across South Africa with fast nationwide delivery and local expertise.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Authorized Godox Distributor with Local Warranty
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  2-year local warranty. Fast repairs. Professional gear accessible to wellness communities.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Shared Commitment to Consciousness
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Values-aligned partnerships that prioritize ethics in visual storytelling over extraction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Supporting Local Creative Economy
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  When you choose CameraStuff, you invest in South African creative infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Logo and Reviews (45% width) */}
          <div className="lg:w-[45%]">
            <div className="bg-purple-50 p-10 rounded-xl shadow-md">
              <div className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                    South African Commitment
                  </p>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    Founded 2006. Proudly South African Godox authorized distributor with local warranty, fast nationwide delivery, supporting local creative economy
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/30">
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5">✓</span>
                    <p className="text-sm text-foreground/80">Local capacity building</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5">✓</span>
                    <p className="text-sm text-foreground/80">Ethical visual documentation</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5">✓</span>
                    <p className="text-sm text-foreground/80">South African economic sovereignty</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5">✓</span>
                    <p className="text-sm text-foreground/80">Values-aligned practitioner support</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary text-lg mt-0.5">✓</span>
                    <p className="text-sm text-foreground/80">Professional quality accessible pricing</p>
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
                    className="h-20 w-auto object-contain mx-auto rounded-lg"
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
