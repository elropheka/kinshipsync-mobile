import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface ScrollNavContextValue {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isNavVisible: boolean;
}

const ScrollNavContext = createContext<ScrollNavContextValue>({
  handleScroll: (_event: NativeSyntheticEvent<NativeScrollEvent>) => {},
  isNavVisible: true,
});

export const useScrollHandler = (): ScrollNavContextValue => useContext(ScrollNavContext);

interface ScrollNavProviderProps {
  children: ReactNode;
}

export const ScrollNavProvider: React.FC<ScrollNavProviderProps> = ({ children }) => {
  const [isNavVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10;

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > lastScrollY.current + scrollThreshold) {
      setNavVisible(false);
    } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
      setNavVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  const value = useMemo(
    () => ({
      handleScroll,
      isNavVisible,
    }),
    [handleScroll, isNavVisible],
  );

  return <ScrollNavContext.Provider value={value}>{children}</ScrollNavContext.Provider>;
};

export default ScrollNavContext;
