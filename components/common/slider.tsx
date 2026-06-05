import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { Spacing } from '@/constants/dimensions';

interface SliderProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: number;
  width?: number;
  containerWidth?: number;
  peekAdjacent?: boolean;
  slideGap?: number;
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
  containerWidth,
  peekAdjacent = false,
  slideGap = Spacing.s,
  onSlideChange,
  loop = true,
  pauseOnHover = false,
}) => {
  const { currentColors } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollIndexRef = useRef(0);
  const isAdjustingLoopRef = useRef(false);

  const totalSlides = children.length;
  const canLoop = loop && totalSlides > 1;
  const viewportWidth = containerWidth ?? width;
  const itemWidth = width;
  const slideStride = peekAdjacent ? itemWidth + slideGap : itemWidth;
  const sidePadding = peekAdjacent ? Math.max((viewportWidth - itemWidth) / 2, 0) : 0;
  const initialScrollIndex = canLoop ? 1 : 0;

  const renderedSlides = useMemo(() => {
    if (!canLoop) {
      return children;
    }
    return [children[totalSlides - 1], ...children, children[0]];
  }, [canLoop, children, totalSlides]);

  const toLogicalIndex = useCallback(
    (scrollIndex: number): number => {
      if (!canLoop) {
        return scrollIndex;
      }
      if (scrollIndex === 0) {
        return totalSlides - 1;
      }
      if (scrollIndex === totalSlides + 1) {
        return 0;
      }
      return scrollIndex - 1;
    },
    [canLoop, totalSlides],
  );

  const scrollToIndex = useCallback(
    (scrollIndex: number, animated: boolean) => {
      scrollViewRef.current?.scrollTo({
        x: scrollIndex * slideStride,
        animated,
      });
      scrollIndexRef.current = scrollIndex;
    },
    [slideStride],
  );

  const setLogicalIndex = useCallback(
    (scrollIndex: number) => {
      const logicalIndex = toLogicalIndex(scrollIndex);
      setCurrentIndex(logicalIndex);
      onSlideChange?.(logicalIndex);
    },
    [onSlideChange, toLogicalIndex],
  );

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const goToScrollIndex = useCallback(
    (scrollIndex: number, animated = true) => {
      if (!canLoop && (scrollIndex < 0 || scrollIndex >= totalSlides)) {
        return;
      }
      scrollToIndex(scrollIndex, animated);
    },
    [canLoop, scrollToIndex, totalSlides],
  );

  const goToSlide = useCallback(
    (logicalIndex: number) => {
      if (logicalIndex < 0 || logicalIndex >= totalSlides) {
        return;
      }
      const targetScrollIndex = canLoop ? logicalIndex + 1 : logicalIndex;
      goToScrollIndex(targetScrollIndex, true);
      setLogicalIndex(targetScrollIndex);
    },
    [canLoop, goToScrollIndex, setLogicalIndex, totalSlides],
  );

  const goToNextSlide = useCallback(() => {
    if (!canLoop && scrollIndexRef.current >= totalSlides - 1) {
      return;
    }
    goToScrollIndex(scrollIndexRef.current + 1, true);
  }, [canLoop, goToScrollIndex, totalSlides]);

  const goToPreviousSlide = useCallback(() => {
    if (!canLoop && scrollIndexRef.current <= 0) {
      return;
    }
    goToScrollIndex(scrollIndexRef.current - 1, true);
  }, [canLoop, goToScrollIndex]);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (isAdjustingLoopRef.current) {
      return;
    }

    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / slideStride);

    if (index !== scrollIndexRef.current) {
      scrollIndexRef.current = index;
      setLogicalIndex(index);
    }
  };

  const handleMomentumScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (!canLoop) {
      return;
    }

    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / slideStride);

    if (index === 0) {
      isAdjustingLoopRef.current = true;
      scrollToIndex(totalSlides, false);
      setLogicalIndex(totalSlides);
      requestAnimationFrame(() => {
        isAdjustingLoopRef.current = false;
      });
      return;
    }

    if (index === totalSlides + 1) {
      isAdjustingLoopRef.current = true;
      scrollToIndex(1, false);
      setLogicalIndex(1);
      requestAnimationFrame(() => {
        isAdjustingLoopRef.current = false;
      });
      return;
    }

    scrollIndexRef.current = index;
    setLogicalIndex(index);
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
    }
  };

  useEffect(() => {
    scrollToIndex(initialScrollIndex, false);
    setLogicalIndex(initialScrollIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSlides, canLoop, slideStride]);

  useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) {
      stopAutoPlay();
      return undefined;
    }

    autoPlayTimerRef.current = setInterval(() => {
      goToNextSlide();
    }, autoPlayInterval);

    return () => {
      stopAutoPlay();
    };
  }, [autoPlay, autoPlayInterval, goToNextSlide, isPaused, stopAutoPlay, totalSlides]);

  useEffect(() => () => stopAutoPlay(), [stopAutoPlay]);

  const styles = useMemo(() => SliderStyles(currentColors), [currentColors]);

  if (!children || children.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        peekAdjacent ? styles.containerPeek : null,
        { height, width: viewportWidth },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={!peekAdjacent}
        snapToInterval={peekAdjacent ? slideStride : undefined}
        snapToAlignment={peekAdjacent ? 'start' : undefined}
        decelerationRate={peekAdjacent ? 'fast' : undefined}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.scrollView}
        contentContainerStyle={
          peekAdjacent ? { paddingHorizontal: sidePadding } : undefined
        }
      >
        {renderedSlides.map((child, index) => (
          <View
            key={`slide-${index}`}
            style={[
              styles.slide,
              { width: peekAdjacent ? slideStride : itemWidth },
              peekAdjacent ? styles.slidePeek : null,
            ]}
          >
            <View style={[styles.slideContent, peekAdjacent ? { width: itemWidth } : null]}>
              {child}
            </View>
          </View>
        ))}
      </ScrollView>

      {showArrows && totalSlides > 1 ? (
        <>
          <TouchableOpacity
            style={[styles.arrow, styles.leftArrow]}
            onPress={goToPreviousSlide}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={currentColors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.arrow, styles.rightArrow]}
            onPress={goToNextSlide}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color={currentColors.textLight} />
          </TouchableOpacity>
        </>
      ) : null}

      {showDots && totalSlides > 1 ? (
        <View style={styles.dotsContainer}>
          {children.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const SliderStyles = (currentColors: typeof import('constants/Colors').Colors.light) => StyleSheet.create({
  container: {
    position: 'relative',
    paddingRight: Spacing.l,
    marginHorizontal: Spacing.s,
  },
  containerPeek: {
    paddingRight: 0,
    marginHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidePeek: {
    alignItems: 'flex-start',
  },
  slideContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
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
    backgroundColor: currentColors.textLight,
  },
  inactiveDot: {
    backgroundColor: currentColors.backgroundPaper + '80',
  },
});

export default Slider;
