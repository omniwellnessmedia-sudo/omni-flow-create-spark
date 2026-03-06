import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeroAction {
  label: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'wellness' | 'soft';
  external?: boolean;
}

interface HeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  actions?: HeroAction[];
  variant?: 'default' | 'minimal' | 'centered' | 'split';
  height?: 'small' | 'medium' | 'large' | 'full';
  className?: string;
  children?: React.ReactNode;
}

const Hero = ({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  actions = [],
  variant = 'default',
  height = 'medium',
  className,
  children
}: HeroProps) => {
  const heightClasses = {
    small: 'min-h-[50vh] py-20',
    medium: 'min-h-[70vh] py-24',
    large: 'min-h-screen py-32',
    full: 'min-h-screen py-40'
  };

  const variantClasses = {
    default: 'bg-gradient-to-br from-wellhub-light via-white to-wellhub-light/30',
    minimal: 'bg-white',
    centered: 'bg-gradient-to-r from-wellhub-light to-wellhub-accent/10',
    split: 'bg-white'
  };

  const renderContent = () => (
    <div className={cn(
      "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
      variant === 'split' ? 'grid lg:grid-cols-2 gap-12 items-center' : 'text-center'
    )}>
      <div className={cn(
        "animate-fade-in-up overflow-hidden",
        variant === 'split' ? 'text-left' : ''
      )}>
        {subtitle && (
          <p className="text-lg font-medium text-wellhub-accent mb-4">
            {subtitle}
          </p>
        )}
        
        <h1 className={cn(
          "font-heading font-bold leading-tight mb-6 max-w-full break-words",
          variant === 'minimal' ? 'text-2xl sm:text-3xl lg:text-4xl mx-auto max-w-4xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mx-auto max-w-4xl'
        )}>
          {title}
        </h1>

        {description && (
          <p className={cn(
            "text-gray-600 mb-8 leading-relaxed",
            variant === 'split' ? 'text-lg max-w-lg' : 'text-xl sm:text-2xl max-w-4xl mx-auto'
          )}>
            {description}
          </p>
        )}

        {actions.length > 0 && (
          <div className={cn(
            "flex gap-4",
            variant === 'split' ? 'justify-start' : 'justify-center flex-wrap'
          )}>
            {actions.map((action, index) => (
              <Button
                key={index}
                asChild
                variant={action.variant || (index === 0 ? 'wellness' : 'soft')}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {action.external ? (
                  <a href={action.href} target="_blank" rel="noopener noreferrer">
                    {action.label}
                  </a>
                ) : (
                  <Link to={action.href}>{action.label}</Link>
                )}
              </Button>
            ))}
          </div>
        )}

        {children}
      </div>

      {variant === 'split' && image && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <img
            src={image}
            alt={imageAlt || (typeof title === 'string' ? title : 'Hero image')}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );

  return (
    <section className={cn(
      "relative flex items-center justify-center overflow-hidden",
      heightClasses[height],
      variantClasses[variant],
      className
    )}>
      {/* Background Elements for default variant */}
      {variant === 'default' && (
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-xl animate-float opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-rainbow-enhanced rounded-full blur-xl animate-float opacity-15" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-3xl animate-float opacity-5" style={{ animationDelay: '4s' }}></div>
        </div>
      )}

      {/* Background image for split variant */}
      {variant !== 'split' && image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={imageAlt || (typeof title === 'string' ? title : 'Hero image')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {renderContent()}
    </section>
  );
};

export default Hero;