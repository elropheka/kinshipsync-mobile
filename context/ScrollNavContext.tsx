import React, {
  createContext,
  useCallback,
  useContext,
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

export class ScrollNavProvider extends React.Component<ScrollNavProviderProps> {
  public render(): React.ReactNode {
    return <ScrollNavProviderInner {...this.props} />;
  }
}

const ScrollNavProviderInner: React.FC<ScrollNavProviderProps> = ({ children }) => {
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

  return (
    <ScrollNavContext.Provider value={{ handleScroll, isNavVisible }}>
      {children}
    </ScrollNavContext.Provider>
  );
};

export default ScrollNavContext;
