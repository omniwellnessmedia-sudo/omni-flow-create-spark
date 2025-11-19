import { Star } from "lucide-react";

export const WhyCameraStuffSection = () => {
  return (
    <div className="bg-muted/30 py-12 lg:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
          {/* LEFT SIDE - Text Content (60%) */}
          <div className="w-full lg:w-[60%] space-y-5">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why CameraStuff?
            </h2>
            
            <p className="text-base text-foreground/90 leading-relaxed">
              CameraStuff has been South Africa's trusted creative equipment partner 
              since 2006. They're an authorized Godox distributor with local warranty, 
              professional gear, and genuine understanding of what African creators need.
            </p>
            
            <p className="text-base text-foreground/90 leading-relaxed">
              We chose them because they embody the values we champion: local economy 
              support, professional quality, and accessibility for creators who prioritize 
              ethics in their work.
            </p>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              This isn't about product specs. It's about working with partners who 
              understand that conscious media requires tools that respect spaces, 
              honor participants, and support storytellers who document with intention.
            </p>
          </div>

          {/* RIGHT SIDE - Logo & Review (40%) */}
          <div className="w-full lg:w-[40%] space-y-8">
            {/* CameraStuff Logo */}
            <div className="flex justify-center lg:justify-start">
              <img 
                src="https://camerastuff.co.za/wp-content/uploads/2023/01/camerastuff-logo-green.png"
                alt="CameraStuff Logo"
                className="h-12 lg:h-14"
              />
            </div>

            {/* Review Card */}
            <div className="bg-background rounded-lg p-6 shadow-md text-center space-y-3 border border-border">
              {/* Star Rating */}
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Rating Number */}
              <div className="text-3xl font-bold text-foreground">4.8 / 5</div>
              
              {/* Review Count */}
              <p className="text-sm text-muted-foreground">
                From 1,000+ customer reviews
              </p>
              
              {/* Trust Text */}
              <p className="text-xs italic text-muted-foreground pt-3 border-t border-border">
                Trusted by photographers, videographers, and 
                content creators across South Africa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
