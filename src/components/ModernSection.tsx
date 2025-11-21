import React from 'react';
import { Link } from "react-router-dom";

const ModernSection = () => {
  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
              Join 50,000+ knowledge workers
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Transform how you <span className="text-blue-600">learn</span> and <span className="text-blue-600">remember</span>
          </h2>
          
          {/* Subheading */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Our AI-powered platform helps you organize, understand, and retain information from everything you read online. 
            Never lose a valuable insight again.
          </p>
          
          {/* Bullet Points */}
          <ul className="space-y-3">
            {[
              "No credit card required",
              "Setup in 2 minutes",
              "Cancel anytime"
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-foreground text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to="/register">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-sm md:text-base w-full sm:w-auto">
                Start Free Trial
              </button>
            </Link>
            <button 
              onClick={scrollToPricing}
              className="px-6 py-3 bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-foreground font-semibold rounded-lg transition-all duration-300 text-sm md:text-base w-full sm:w-auto"
            >
              View Pricing
            </button>
          </div>
        </div>
        
        {/* Right Side - Visual Mockup */}
        <div className="relative h-96 lg:h-[500px]">
          {/* Card 1 */}
          <div className="absolute top-0 left-0 w-48 md:w-64 h-36 md:h-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 transform rotate-3 animate-float">
            <div className="flex space-x-1.5 md:space-x-2 mb-2 md:mb-3">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="h-2.5 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-2.5 md:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2.5 md:h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="absolute top-12 md:top-16 right-0 w-48 md:w-64 h-36 md:h-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 transform -rotate-2 animate-float-delayed">
            <div className="flex space-x-1.5 md:space-x-2 mb-2 md:mb-3">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="h-2.5 md:h-4 bg-blue-200 dark:bg-blue-900/50 rounded w-3/4"></div>
              <div className="h-2.5 md:h-4 bg-blue-200 dark:bg-blue-900/50 rounded"></div>
              <div className="h-2.5 md:h-4 bg-blue-200 dark:bg-blue-900/50 rounded w-5/6"></div>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 md:w-64 h-36 md:h-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 md:p-4 transform rotate-1 animate-float-delayed-2">
            <div className="flex space-x-1.5 md:space-x-2 mb-2 md:mb-3">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="h-2.5 md:h-4 bg-purple-200 dark:bg-purple-900/50 rounded w-3/4"></div>
              <div className="h-2.5 md:h-4 bg-purple-200 dark:bg-purple-900/50 rounded"></div>
              <div className="h-2.5 md:h-4 bg-purple-200 dark:bg-purple-900/50 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernSection;