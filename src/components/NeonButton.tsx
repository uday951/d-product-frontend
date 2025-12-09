import React from 'react';
import anime from 'animejs';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Anime.js ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    ripple.style.pointerEvents = 'none';
    
    button.appendChild(ripple);
    
    anime({
      targets: ripple,
      scale: [0, 4],
      opacity: [1, 0],
      duration: 600,
      easing: 'easeOutExpo',
      complete: () => ripple.remove()
    });
    
    onClick?.();
  };

  const baseClasses = `
    relative px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider
    transition-all duration-300 transform hover:scale-105 overflow-hidden
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-yellow-500 to-orange-500
      text-black hover:shadow-lg hover:shadow-yellow-500/50
      border border-yellow-500
    `,
    secondary: `
      bg-transparent border-2 border-yellow-500 text-yellow-500
      hover:bg-yellow-500 hover:text-black hover:shadow-lg hover:shadow-yellow-500/50
    `
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NeonButton;