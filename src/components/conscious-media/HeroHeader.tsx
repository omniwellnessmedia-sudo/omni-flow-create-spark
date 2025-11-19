export const HeroHeader = () => {
  return (
    <section className="bg-gradient-to-b from-white to-purple-50 py-16 px-10 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center max-w-[800px] mx-auto">
          <p className="font-bold text-[13px] text-primary uppercase tracking-[1.5px] mb-3">
            Omni Wellness Media Partner
          </p>
          <h1 className="font-bold text-4xl lg:text-[52px] text-foreground leading-[1.1] mb-4">
            Conscious Media Infrastructure
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Document your wellness journey authentically. Empower conscious practitioners. Support South African capacity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#framework" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors"
            >
              Learn About Our Framework
            </a>
            <a 
              href="https://www.camerastuff.co.za/?a_aid=omniwellnessmedia" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-background border-2 border-primary text-primary hover:bg-primary/5 font-semibold rounded-md transition-colors"
            >
              Explore Partnership
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
