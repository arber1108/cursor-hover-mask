'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from './page.module.scss';
import Lenis from 'lenis';

// Dynamically import TextPressure with SSR disabled
const TextPressure = dynamic(
  () => import('./components/TextPressure'),
  { ssr: false }
);

const ContentSection = ({ scrollYProgress }) => {
  // Content will start appearing after 30% scroll and be fully visible at 50%
  const contentOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.5, 1], [50, 0]);
  
  return (
    <motion.div 
      className={styles.content}
      style={{
        opacity: contentOpacity,
        y: contentY
      }}
    >
      <h2>Discover the Magic</h2>
      <p>As you scroll, you'll uncover the hidden wonders of our interactive experience. Each movement reveals new possibilities.</p>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Interactive Design</h3>
          <p>Engage with content in a whole new way through intuitive scroll-based interactions.</p>
        </div>
        <div className={styles.card}>
          <h3>Seamless Experience</h3>
          <p>Enjoy smooth animations and transitions that respond to your every scroll.</p>
        </div>
        <div className={styles.card}>
          <h3>Modern Aesthetics</h3>
          <p>Clean, minimalist design that puts your content front and center.</p>
        </div>
      </div>
      
      <div className={styles.quote}>
        <blockquote>
          "The only way to discover the limits of the possible is to go beyond them into the impossible."
          <footer>- Arthur C. Clarke</footer>
        </blockquote>
      </div>
      
      <div className={styles.gallery}>
        {['A', 'B', 'C', 'D'].map((letter) => (
          <div key={letter} className={styles.galleryItem}>
            <div className={styles.galleryImage}></div>
            <span>Artwork {letter}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.cta}>
        <h3>Ready to explore more?</h3>
        <button className={styles.ctaButton}>Begin Your Journey</button>
      </div>
    </motion.div>
  );
};

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => cancelAnimationFrame(raf);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale for the mask expansion
  const scale = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  
  // Track scroll progress for mask expansion
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Update mask state based on scroll
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setIsExpanded(latest > 0.1);
    });
  }, [scrollYProgress]);

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>
        <div style={{position: 'relative', height: '200px'}}>
          <TextPressure
            text="Arber Ademaj"
            flex={false}
            alpha={false}
            stroke={false}
            width={false}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={150}
          />
          <TextPressure
            text="Fullstack Developer"
            flex={false}
            alpha={false}
            stroke={false}
            width={false}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={10}
          />
        </div>      
      </h1>
      
      <div ref={containerRef} className={styles.scrollContainer}>
        <motion.div 
          className={`${styles.mask} ${isExpanded ? styles.expanded : ''}`}
          style={{ 
            scale,
            opacity,
          }}
        />
        
        <ContentSection scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
