import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.light.background, // Ensure background color matches the app theme
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Added for full centering
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nodeWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10, // Added horizontal margin for spacing between siblings
  },
  spouseNode: {
    marginTop: 10, // Adjust spacing as needed
  },
  childrenContainer: { // This was the old one, might be deprecated by childrenContainerActual
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20, // Increased spacing from parent
    paddingHorizontal: 10, // Added horizontal padding
  },
  // Styles for connecting lines and layout (some might be old, verify usage)
  spouseContainer: { // Used for old renderNode, might be replaced by nodeAndSpouseContainer
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: -10, // Adjust to connect lines properly
  },
  childrenOuterContainer: { // Used for old renderNode
    alignItems: 'center', // Center the vertical line and the children block
    // marginTop: 10,
  },
  childrenInnerContainer: { // Used for old renderNode
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 10,
  },
  childNodeWrapper: { // Used for old renderNode, might be replaced by childWrapper
    alignItems: 'center', // Each child node itself is centered
    marginHorizontal: 5, // Spacing between siblings
  },
  lineHorizontal: {
    height: 2,
    backgroundColor: 'blue',
    width: 30, // Adjust as needed
    marginHorizontal: 5,
  },
  lineVertical: { // Generic vertical line, might be old
    width: 2,
    backgroundColor: 'blue',
    height: 30, // Adjust as needed
  },
  lineHorizontalChildrenBar: { // Used for old renderNode
    height: 2,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 0, // Align with the top of the short vertical lines
    left: '10%', // Span across children, adjust as needed
    right: '10%', // Span across children, adjust as needed
  },
  lineVerticalShort: { // Generic short vertical line, might be old
    width: 2,
    backgroundColor: 'blue',
    height: 15, // Adjust as needed
    // marginBottom: -2 // Connect to the node box
  },
  // New styles for refactored renderNode
  nodeAndSpouseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the node and spouse pair
    // marginBottom: 10, // Space before children section
  },
  lineVerticalShortToParent: { // Line connecting a child node UP to the horizontal bar of its parents
    width: 2,
    backgroundColor: 'blue',
    height: 15, // Adjust height to connect properly
    // This line is drawn by the child, connecting upwards.
  },
  childrenContainerActual: { // Container for the lines and the row of children
    alignItems: 'center', // Center the vertical line and children row
    // marginTop: 5, // Space after the parent/spouse block
    position: 'relative', // For positioning the horizontal bar
  },
  lineVerticalFromParent: { // Vertical line coming down from parent(s)
    width: 2,
    backgroundColor: 'blue',
    height: 20, // Adjust height
  },
  lineHorizontalForChildren: { // Horizontal bar that children hang from
    height: 2,
    backgroundColor: 'blue',
    // width: '80%', // Make it dynamic based on number of children or fixed
    alignSelf: 'stretch', // Stretch if childrenRow is managing width
    marginVertical: 0, // Connects directly to vertical lines
  },
  childrenRow: { // Contains all childWrapper elements
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute children evenly
    alignItems: 'flex-start', // Children hang from the top
    // paddingTop: 0, // Children connect directly to their short vertical line
    // width: '100%', // Ensure it spans to allow lineHorizontalForChildren to work if not absolute
  },
  childWrapper: { // Wrapper for each child, including its connection line from above
    alignItems: 'center', // Center the (line + child node)
    paddingHorizontal: 5, // Spacing between siblings
  }
});
