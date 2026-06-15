import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';

const FAB_SIZE = 56;
const MENU_ITEM_SIZE = 48;
const RADIUS = 90;

interface VendorFABProps {
  isVisible: boolean;
}

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'storefront-outline', route: '/(vendors)/dashboard' },
  { key: 'requests', label: 'Requests', icon: 'chatbox-ellipses-outline', route: '/(vendors)/requests' },
  { key: 'items', label: 'My Items', icon: 'cube-outline', route: '/(vendors)/items' },
];

const VendorFAB: React.FC<VendorFABProps> = ({ isVisible }) => {
  const { currentColors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(menuAnim, {
          toValue: 1,
          damping: 15,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, rotateAnim, menuAnim]);

  if (!isVisible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleNavigate = (route: string) => {
    setIsOpen(false);
    router.push(route as any);
  };

  const angleStep = (Math.PI / 2) / (menuItems.length - 1);
  const startAngle = -Math.PI / 2;

  return (
    <>
      {isOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}
        />
      )}
      {menuItems.map((item, index) => {
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
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon as any} size={22} color="#fff" />
            </TouchableOpacity>
            <Animated.Text
              style={[
                styles.menuLabel,
                { color: currentColors.text, opacity },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Animated.Text>
          </Animated.View>
        );
      })}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: currentColors.accent }]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Ionicons name="storefront-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
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
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  menuItemContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
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
  menuLabel: {
    position: 'absolute',
    right: 56,
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default VendorFAB;
