import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const createFamilyTreeScreenStyles = (theme: typeof Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nodeWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  spouseNode: {
    marginTop: 10,
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  spouseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childrenOuterContainer: {
    alignItems: 'center',
  },
  childrenInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  childNodeWrapper: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  lineHorizontal: {
    height: 2,
    backgroundColor: theme.primary,
    width: 30,
    marginHorizontal: 5,
  },
  lineVertical: {
    width: 2,
    backgroundColor: theme.primary,
    height: 30,
  },
  lineHorizontalChildrenBar: {
    height: 2,
    backgroundColor: theme.primary,
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
  },
  lineVerticalShort: {
    width: 2,
    backgroundColor: theme.primary,
    height: 15,
  },
  nodeAndSpouseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineVerticalShortToParent: {
    width: 2,
    backgroundColor: theme.primary,
    height: 15,
  },
  childrenContainerActual: {
    alignItems: 'center',
    position: 'relative',
  },
  lineVerticalFromParent: {
    width: 2,
    backgroundColor: theme.primary,
    height: 20,
  },
  lineHorizontalForChildren: {
    height: 2,
    backgroundColor: theme.primary,
    alignSelf: 'stretch',
    marginVertical: 0,
  },
  childrenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  childWrapper: {
    alignItems: 'center',
    paddingHorizontal: 5,
  }
});

// For backwards compatibility, export the light theme styles
export const styles = createFamilyTreeScreenStyles(Colors.light);