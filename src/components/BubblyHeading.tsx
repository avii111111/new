import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function BubblyHeading() {
  const [isVisible, setIsVisible] = useState(true);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number; duration: number }[]>([]);

  // Periodically toggle visibility of the text to simulate "appearing and disappearing"
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 7000); // 7 seconds cycle: 4.5s visible, 2.5s transition & hidden
    return () => clearInterval(interval);
  }, []);

  // Generate background floating bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      size: Math.random() * 40 + 15, // 15px to 55px
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 6, // 6s to 12s
    }));
    setBubbles(initialBubbles);
  }, []);

  const words = [
    { text: "Build", highlight: false },
    { text: "The", highlight: false },
    { text: "Future", highlight: false },
    { text: "With", highlight: false },
    { text: "AI-Powered", highlight: true },
    { text: "Business", highlight: false },
    { text: "Solutions", highlight: false },
  ];

  // Particle explosion on clicking a bubble
  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    // Spawn a new bubble shortly after to keep the ambient effect active
    setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          size: Math.random() * 40 + 15,
          delay: 0,
          duration: Math.random() * 6 + 6,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="relative py-8 px-2 select-none min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex items-center justify-center overflow-visible">
      {/* Interactive Floating Background Bubbles */}
      <div className="absolute inset-0 overflow-visible pointer-events-auto z-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute bottom-0 rounded-full bg-gradient-to-tr from-orange-400/10 via-amber-400/10 to-transparent border border-orange-500/20 backdrop-blur-[1px] shadow-[inset_0_2px_4px_rgba(249,115,22,0.15),_0_4px_12px_rgba(249,115,22,0.05)] cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${bubble.x}%`,
              width: bubble.size,
              height: bubble.size,
            }}
            initial={{ y: 50, opacity: 0, scale: 0.8 }}
            animate={{
              y: -320,
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.8, 1.1, 0.9, 1.2],
              x: [0, Math.sin(bubble.id) * 20, Math.cos(bubble.id) * -20, 0],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Bouncy Bubble Text */}
      <div className="relative z-10 w-full text-center flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-2 md:gap-y-4">
        <AnimatePresence mode="popLayout">
          {isVisible && (
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[1.1] flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-2 md:gap-y-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: 0.06,
                    staggerDirection: -1,
                  },
                },
              }}
            >
              {words.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      scale: 0.3, 
                      y: 40,
                      filter: "blur(4px)"
                    },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        damping: 10,
                        stiffness: 100,
                        mass: 0.8,
                      },
                    },
                    exit: { 
                      opacity: 0, 
                      scale: 0.4, 
                      y: -50,
                      filter: "blur(6px)",
                      transition: {
                        duration: 0.4,
                        ease: "easeIn"
                      }
                    },
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -6,
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  className={`inline-block cursor-pointer font-display select-none py-1 px-2 rounded-2xl ${
                    word.highlight 
                      ? "text-gradient bg-orange-100/40 border border-orange-500/10 px-3 shadow-sm" 
                      : "text-slate-900 hover:text-orange-600"
                  }`}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.h1>
          )}
        </AnimatePresence>

          {/* Prompt/Indicator when text disappears to let the user know it pops in/out */}
          {!isVisible && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute text-orange-500/40 text-xs sm:text-sm font-display tracking-widest uppercase flex items-center justify-center gap-2 pointer-events-none"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-300"></span>
              </div>
              Blowing AI Dreams...
            </motion.div>
          )}
      </div>
    </div>
  );
}
