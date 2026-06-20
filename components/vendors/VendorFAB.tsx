import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { Spacing } from '@/constants/dimensions';
import { BOTTOM_NAV_HEIGHT } from '@/styles/components/common/Navigation/bottomNavigation.styles';

const FAB_SIZE = 56;
const MENU_ITEM_SIZE = 48;
const RADIUS = 80;
const MENU_ITEM_OFFSET = (FAB_SIZE - MENU_ITEM_SIZE) / 2;
const FAB_RIGHT_INSET = Spacing.l + Spacing.s;

interface VendorFABProps {
  isVisible: boolean;
}

interface VendorFabMenuItem {
  key: string;
  label: string;
  icon: string;
  route: string;
  params?: Record<string, string>;
}

const menuItems: VendorFabMenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid-outline', route: '/(vendors)/dashboard' },
  { key: 'items', label: 'Items', icon: 'list-outline', route: '/(vendors)/items' },
  {
    key: 'add-item',
    label: 'Add Item',
    icon: 'add-circle-outline',
    route: '/(vendors)/items',
    params: { openAdd: '1' },
  },
];

const VendorFAB: React.FC<VendorFABProps> = ({ isVisible }) => {
  const { currentColors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isVisible) {
      setIsOpen(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(menuAnim, {
        toValue: 1,
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, menuAnim]);

  if (!isVisible) return null;

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleNavigate = (route: string, params?: Record<string, string>) => {
    setIsOpen(false);
    router.push({ pathname: route, params } as any);
  };

  const startAngle = -Math.PI / 2;
  const endAngle = -Math.PI;
  const angleStep = (endAngle - startAngle) / (menuItems.length - 1);

  return (
    <>
      {isOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}
        />
      )}
      <View style={styles.fabAnchor} pointerEvents="box-none">
        {isOpen &&
          menuItems.map((item, index) => {
            const angle = startAngle + angleStep * index;
            const translateX = menuAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(angle) * RADIUS],
            });
            const translateY = menuAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(angle) * RADIUS],
            });
            const opacity = menuAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            });

            return (
              <Animated.View
                key={item.key}
                style={[
                  styles.menuItemContainer,
                  {
                    transform: [{ translateX }, { translateY }],
                    opacity,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: currentColors.accent }]}
                  onPress={() => handleNavigate(item.route, item.params)}
                  activeOpacity={0.8}
                  accessibilityLabel={item.label}
                >
                  <Ionicons name={item.icon as any} size={22} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: currentColors.accent }]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isOpen ? 'close' : 'storefront-outline'}
            size={isOpen ? 28 : 26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  fabAnchor: {
    position: 'absolute',
    bottom: BOTTOM_NAV_HEIGHT + Spacing.m,
    right: FAB_RIGHT_INSET,
    width: FAB_SIZE,
    height: FAB_SIZE,
    overflow: 'visible',
    zIndex: 60,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menuItemContainer: {
    position: 'absolute',
    top: MENU_ITEM_OFFSET,
    left: MENU_ITEM_OFFSET,
    width: MENU_ITEM_SIZE,
    height: MENU_ITEM_SIZE,
    zIndex: 55,
  },
  menuItem: {
    width: MENU_ITEM_SIZE,
    height: MENU_ITEM_SIZE,
    borderRadius: MENU_ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default VendorFAB;
