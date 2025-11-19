interface CreativeExample {
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

const examples: CreativeExample[] = [
  {
    category: "RETREAT DOCUMENTATION",
    title: "Capturing Sacred Retreats Authentically",
    description: "Professional documentation that respects the retreat space. This is how consciousness meets technique.",
    imageUrl: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Business%20Consulting/DSC00124.jpg",
    imageAlt: "Professional retreat documentation showing conscious media approach"
  },
  {
    category: "PRACTITIONER STORIES",
    title: "One-On-One Wellness Documentation",
    description: "Intimate, non-intrusive capture of wellness practices. Equipment that disappears so the work shines.",
    imageUrl: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Sandy/Sandy%20_August%20shoot%20_%20omni-4.png",
    imageAlt: "Practitioner documentation in action"
  },
  {
    category: "EDUCATIONAL PROGRAMS",
    title: "Learning + Documenting Together",
    description: "Capture immersive learning moments. This is why conscious media infrastructure matters for education.",
    imageUrl: "https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/feroza%20begg%20-%20portrait.jpg",
    imageAlt: "Educational program documentation"
  }
];

export const CreativeExamplesSection = () => {
  return (
    <div className="bg-muted/30 py-16 lg:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            What You Can Create
          </h2>
          <p className="text-lg text-muted-foreground">
            Real projects documented with Omni Wellness Media + conscious equipment
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              {/* Image */}
              <div className="h-64 overflow-hidden">
                <img 
                  src={example.imageUrl}
                  alt={example.imageAlt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  {example.category}
                </p>
                
                <h3 className="text-lg font-bold text-foreground">
                  {example.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {example.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
