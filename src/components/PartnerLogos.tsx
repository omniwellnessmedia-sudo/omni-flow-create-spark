// 🏢 PARTNER LOGOS COMPONENT - Authentic Credibility Through Real Organizations
// Showcases real partner organizations from your curated logo collection

import { getPartnerLogo } from "@/lib/images";

interface PartnerLogosProps {
  variant?: 'horizontal' | 'grid' | 'compact';
  showLabels?: boolean;
  className?: string;
}

const PartnerLogos = ({
  variant = 'horizontal',
  showLabels = false,
  className = ''
}: PartnerLogosProps) => {

  const partners = [
    {
      key: 'bwc' as const,
      name: 'BWC - 2 Be Well',
      description: 'Wellness packaging & community programs',
      category: 'Wellness Community'
    },
    {
      key: 'drPhil' as const,
      name: 'Dr Phil NPO',
      description: 'Non-profit wellness initiatives',
      category: 'Healthcare'
    },
    {
      key: 'valley' as const,
      name: 'The Valley of Plenty',
      description: 'Sustainable wellness retreat center',
      category: 'Retreats'
    },
    {
      key: 'apex' as const,
      name: 'APEX Advocacy',
      description: 'Professional advocacy & wellness',
      category: 'Professional Services'
    },
    {
      key: 'muddy' as const,
      name: 'Muddy Rambler',
      description: 'Adventure wellness experiences',
      category: 'Adventure Tourism'
    },
    {
      key: 'kai' as const,
      name: 'Kai Wellness',
      description: 'Holistic wellness practices',
      category: 'Holistic Health'
    },
    {
      key: 'amor' as const,
      name: 'Amor Foundation',
      description: 'Community wellness outreach',
      category: 'Community Impact'
    },
    {
      key: 'muiz' as const,
      name: 'Muiz Kitchen',
      description: 'Conscious nutrition & wellness',
      category: 'Nutrition'
    }
  ];

  const getLayoutClasses = () => {
    switch (variant) {
      case 'grid':
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6';
      case 'compact':
        return 'flex flex-wrap items-center justify-center gap-4';
      default:
        return 'flex flex-wrap items-center justify-center gap-6 lg:gap-8';
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'grid':
        return 'h-16 w-auto object-contain';
      case 'compact':
        return 'h-8 w-auto object-contain';
      default:
        return 'h-12 w-auto object-contain';
    }
  };

  return (
    <div className={`partner-logos ${className}`}>
      {showLabels && (
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Trusted by Leading Wellness Organizations
          </h3>
          <p className="text-sm text-gray-600">
            Partnering with authentic wellness providers across South Africa
          </p>
        </div>
      )}

      <div className={getLayoutClasses()}>
        {partners.map((partner) => (
          <div
            key={partner.key}
            className="group flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img
              {...getPartnerLogo(partner.key)}
              alt={partner.name}
              className={`${getImageClasses()} opacity-70 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0`}
            />
            {showLabels && variant === 'grid' && (
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-gray-900">
                  {partner.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {partner.category}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showLabels && variant === 'horizontal' && (
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Real partnerships • Authentic wellness network • South African wellness leaders
          </p>
        </div>
      )}
    </div>
  );
};

export default PartnerLogos;
