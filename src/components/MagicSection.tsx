import React, { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MagicSection = () => {
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoSlides = [
    {
      title: "AI Auto-Organization",
      description: "Watch AI instantly categorize 1,000+ bookmarks in seconds",
      image: "🧠",
      stats: { processed: "1,247", time: "0.3s", accuracy: "94%" },
      mockData: [
        { category: "Development", count: 234, color: "bg-indigo-500" },
        { category: "Design", count: 187, color: "bg-purple-500" },
        { category: "Research", count: 156, color: "bg-emerald-500" },
        { category: "Marketing", count: 98, color: "bg-pink-500" }
      ]
    },
    {
      title: "Smart Content Summaries",
      description: "Never forget why you saved something with AI-generated insights",
      image: "📝",
      stats: { summaries: "1,247", time: "instant", satisfaction: "96%" },
      mockContent: {
        title: "Complete Guide to React Server Components",
        url: "nextjs.org/docs/server-components",
        summary: "Comprehensive overview of RSCs, rendering patterns, and performance benefits for modern React applications...",
        tags: ["React", "Next.js", "Performance", "SSR"]
      }
    },
    {
      title: "Semantic Search Magic",
      description: "Find anything by meaning, not just keywords",
      image: "🔍",
      stats: { queries: "50K+", speed: "0.1s", relevance: "97%" },
      searchQuery: "AI tools for creative work",
      results: [
        { title: "Midjourney - AI Art Generator", relevance: 98 },
        { title: "Copy.ai - Writing Assistant", relevance: 95 },
        { title: "Runway ML - Video Creation", relevance: 92 }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [demoSlides.length]);

  // Framer Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <motion.section
      className="py-16 px-4 bg-gradient-to-b from-background to-muted"
      initial="hidden"
      animate="visible"
      variants={fadeInUp as any}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp as any}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            See The <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Magic</span> Happen
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how Markly's AI transforms bookmark chaos into organized knowledge
          </p>
        </motion.div>

        <div className="bg-card rounded-2xl border border-border shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Demo Visualization */}
            <div className="order-2 md:order-1">
              <div className="bg-muted rounded-xl p-4 border border-border min-h-[300px] shadow-inner">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-muted h-7 rounded-lg mx-3 flex items-center px-3">
                    <span className="text-xs text-muted-foreground">markly.ai/dashboard</span>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {currentDemo === 0 && (
                    <motion.div key="demo0" variants={slideTransition as any} initial="initial" animate="animate" exit="exit" className="space-y-3">
                      <div className="text-base font-semibold mb-3 text-foreground">AI Categorization in Progress...</div>
                      {demoSlides[0].mockData.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border transform transition-all hover:scale-[1.02] shadow-xs"
                        >
                          <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground text-sm">{item.category}</div>
                            <div className="text-xs text-muted-foreground">{item.count} bookmarks</div>
                          </div>
                          <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {currentDemo === 1 && (
                    <motion.div key="demo1" variants={slideTransition as any} initial="initial" animate="animate" exit="exit">
                      <div className="text-base font-semibold mb-3 text-foreground">AI Summary Generation</div>
                      <div className="bg-background p-4 rounded-lg border border-border space-y-3 shadow-xs">
                        <div className="font-medium text-foreground text-sm">{demoSlides[1].mockContent.title}</div>
                        <div className="text-xs text-primary">{demoSlides[1].mockContent.url}</div>
                        <div className="p-3 bg-muted rounded-lg border border-border">
                          <div className="text-xs text-muted-foreground italic mb-1">✨ AI Summary:</div>
                          <div className="text-foreground text-sm">{demoSlides[1].mockContent.summary}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {demoSlides[1].mockContent.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentDemo === 2 && (
                    <motion.div key="demo2" variants={slideTransition as any} initial="initial" animate="animate" exit="exit">
                      <div className="text-base font-semibold mb-3 text-foreground">Semantic Search</div>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="text"
                          value={demoSlides[2].searchQuery}
                          className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg font-medium text-foreground shadow-xs text-sm"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        {demoSlides[2].results.map((result, idx) => (
                          <div key={idx} className="p-3 bg-background rounded-lg border border-border flex items-center justify-between hover:shadow-sm transition-all shadow-xs">
                            <div className="font-medium text-foreground text-sm">{result.title}</div>
                            <div className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                              {result.relevance}% match
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {demoSlides.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentDemo === index ? 'bg-primary w-6' : 'bg-muted-foreground/20 w-2.5'
                    }`}
                    onClick={() => setCurrentDemo(index)}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Show demo slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Demo Controls */}
            <div className="order-1 md:order-2 space-y-4">
              {demoSlides.map((slide, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl border transition-all cursor-pointer transform hover:scale-[1.02] shadow-md ${
                    currentDemo === index
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-primary ring-2 ring-primary/20'
                      : 'bg-card border-border hover:border-muted-foreground/30'
                  }`}
                  onClick={() => setCurrentDemo(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{slide.image}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1.5 text-foreground">{slide.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{slide.description}</p>
                      <div className="flex gap-3 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-foreground">{Object.values(slide.stats)[0]}</div>
                          <div className="text-muted-foreground">{Object.keys(slide.stats)[0]}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-foreground">{Object.values(slide.stats)[1]}</div>
                          <div className="text-muted-foreground">{Object.keys(slide.stats)[1]}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-foreground">{Object.values(slide.stats)[2]}</div>
                          <div className="text-muted-foreground">{Object.keys(slide.stats)[2]}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MagicSection;