import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import NeonButton from '../components/NeonButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutExpo'
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-end pb-32 overflow-hidden">
        
        <div className="relative z-10 container mx-auto px-8 md:px-16 mb-16">
          <div className="max-w-xl">
            <h1 
              ref={titleRef}
              className="text-5xl md:text-7xl font-black mb-6 neon-text"
            >
              UDAYTECHX
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Premium Digital Resources for Tech Professionals - Interview Kits, Coding Templates & More
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <NeonButton onClick={() => navigate('/products')}>
                Browse Resources
              </NeonButton>
              <NeonButton variant="secondary" onClick={() => navigate('/products')}>
                View Catalog
              </NeonButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="curved-section relative py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 neon-text">
            Digital Resources for Tech Success
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interview Kits',
                description: 'Complete interview preparation guides with real questions',
                icon: '💼'
              },
              {
                title: 'Code Templates',
                description: 'Production-ready code snippets and project templates',
                icon: '💻'
              },
              {
                title: 'Tech Resources',
                description: 'Curated learning materials and development tools',
                icon: '📚'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-effect rounded-xl p-8 text-center hover:border hover:border-yellow-500 transition-all duration-300"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-yellow-500">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;