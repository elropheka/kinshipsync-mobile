import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Spacing } from '@/constants/dimensions';

interface SliderProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: number;
  width?: number;
  onSlideChange?: (index: number) => void;
  loop?: boolean;
  pauseOnHover?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  children,
  autoPlay = true,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  height = 200,
  width = Dimensions.get('window').width,
  onSlideChange,
  loop = true,
  pauseOnHover = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = children.length;

  const startAutoPlay = () => {
    if (!autoPlay || isPaused) return;

    autoPlayTimerRef.current = setInterval(() => {
      if (currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1);
      } else if (loop) {
        goToSlide(0);
      }
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides) return;
    
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    
    onSlideChange?.(index);
  };

  const goToNextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    } else if (loop) {
      goToSlide(0);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else if (loop) {
      goToSlide(totalSlides - 1);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onSlideChange?.(index);
    }
  };

  const handleTouchStart = () => {
    if (pauseOnHover) {
      setIsPaused(true);
      stopAutoPlay();
    }
  };

  const handleTouchEnd = () => {
    if (pauseOnHover) {
      setIsPaused(false);
      startAutoPlay();
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    }

    return () => {
      stopAutoPlay();
    };
  }, [currentIndex, autoPlay, isPaused]);

  useEffect(() => {
    return () => {
      stopAutoPlay();
    };
  }, []);

  if (!children || children.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { height, width }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.scrollView}
      >
        {children.map((child, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            {child}
          </View>
        ))}
      </ScrollView>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <TouchableOpacity
            style={[styles.arrow, styles.leftArrow]}
            onPress={goToPreviousSlide}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.light.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.arrow, styles.rightArrow]}
            onPress={goToNextSlide}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color={Colors.light.textLight} />
          </TouchableOpacity>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <View style={styles.dotsContainer}>
          {children.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: Dimensions.get('window').width - Spacing.l,
    marginHorizontal: Spacing.s,
    backgroundColor: Colors.light.error,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.light.textLight,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default Slider;
