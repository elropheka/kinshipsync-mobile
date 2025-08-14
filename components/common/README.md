# Custom Alert Component

A flexible and customizable alert component for React Native that follows the KinshipSync design system.

## Features

- **Multiple Alert Types**: Success, Error, Warning, and Info alerts with appropriate colors and icons
- **Flexible Positioning**: Top, center, or bottom positioning
- **Smooth Animations**: Entrance and exit animations with spring physics
- **Auto-hide Support**: Optional automatic dismissal after a specified duration
- **Action Buttons**: Configurable confirm and cancel buttons
- **Responsive Design**: Follows the project's design system and scales appropriately
- **Accessibility**: Proper touch targets and visual feedback

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Controls whether the alert is visible |
| `type` | `AlertType` | - | Alert type: 'success', 'error', 'warning', 'info' |
| `title` | `string` | - | Main alert title (required) |
| `message` | `string` | - | Optional descriptive message |
| `onClose` | `() => void` | - | Callback when alert is closed |
| `onConfirm` | `() => void` | - | Optional callback for confirm action |
| `confirmText` | `string` | 'OK' | Text for confirm button |
| `cancelText` | `string` | 'Cancel' | Text for cancel button |
| `showCancelButton` | `boolean` | `false` | Whether to show cancel button |
| `autoHide` | `boolean` | `false` | Whether to auto-hide the alert |
| `autoHideDuration` | `number` | `3000` | Duration in milliseconds before auto-hiding |
| `position` | `'top' \| 'center' \| 'bottom'` | `'top'` | Alert position on screen |
| `showIcon` | `boolean` | `true` | Whether to show the alert type icon |
| `closable` | `boolean` | `true` | Whether the alert can be closed manually |

## Alert Types

### Success Alert
- **Color**: Green (`Colors.light.success`)
- **Icon**: Checkmark circle
- **Use Case**: Confirm successful operations, completion messages

### Error Alert
- **Color**: Red (`Colors.light.error`)
- **Icon**: Close circle
- **Use Case**: Error messages, failed operations

### Warning Alert
- **Color**: Yellow (`Colors.light.warning`)
- **Icon**: Warning triangle
- **Use Case**: Caution messages, validation warnings

### Info Alert
- **Color**: Blue (`Colors.light.info`)
- **Icon**: Information circle
- **Use Case**: General information, tips, updates

## Usage Examples

### Basic Success Alert
```tsx
import CustomAlert from '../components/common/alert';

const [showAlert, setShowAlert] = useState(false);

<CustomAlert
  visible={showAlert}
  type="success"
  title="Success!"
  message="Operation completed successfully."
  onClose={() => setShowAlert(false)}
/>
```

### Error Alert with Actions
```tsx
<CustomAlert
  visible={showAlert}
  type="error"
  title="Connection Failed"
  message="Unable to connect to the server. Please try again."
  showCancelButton={true}
  onClose={() => setShowAlert(false)}
  onConfirm={() => {
    // Handle retry logic
    setShowAlert(false);
  }}
  confirmText="Retry"
  cancelText="Cancel"
/>
```

### Auto-hiding Info Alert
```tsx
<CustomAlert
  visible={showAlert}
  type="info"
  title="New Feature Available"
  message="Check out our new event planning tools!"
  autoHide={true}
  autoHideDuration={5000}
  onClose={() => setShowAlert(false)}
/>
```

### Bottom Position Warning
```tsx
<CustomAlert
  visible={showAlert}
  type="warning"
  title="Storage Space Low"
  message="Your device storage is running low."
  position="bottom"
  onClose={() => setShowAlert(false)}
/>
```

## Integration with Existing Code

The custom alert component can replace the native `Alert.alert()` calls throughout the application. Here's how to refactor existing code:

### Before (Native Alert)
```tsx
Alert.alert(
  'Success',
  'Task created successfully.',
  [{ text: 'OK', onPress: () => {} }]
);
```

### After (Custom Alert)
```tsx
const [showSuccessAlert, setShowSuccessAlert] = useState(false);

// Show alert
setShowSuccessAlert(true);

// Alert component
<CustomAlert
  visible={showSuccessAlert}
  type="success"
  title="Success"
  message="Task created successfully."
  onClose={() => setShowSuccessAlert(false)}
/>
```

## Styling

The component automatically uses the project's design system:
- **Colors**: From `constants/Colors.ts`
- **Typography**: From `constants/fonts.ts`
- **Spacing & Dimensions**: From `constants/dimensions.ts`
- **Icons**: Ionicons from `@expo/vector-icons`

## Best Practices

1. **Use appropriate alert types** for different scenarios
2. **Keep titles concise** and messages descriptive
3. **Provide meaningful action buttons** when user input is required
4. **Use auto-hide** for informational alerts that don't require user action
5. **Position alerts appropriately** based on context (top for notifications, center for confirmations)
6. **Handle alert state** properly in your component lifecycle

## Accessibility

- Touch targets meet minimum size requirements
- High contrast colors for different alert types
- Clear visual hierarchy with title and message
- Proper button labeling and feedback

## Performance

- Uses `useNativeDriver: true` for smooth animations
- Efficient re-renders with proper state management
- Cleanup of timers and animations on unmount
