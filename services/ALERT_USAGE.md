# Centralized Alert System Usage Guide

This app uses a centralized alert system that provides consistent alert UI across all components and screens.

## Setup

The `AlertProvider` is already set up in the root layout (`app/_layout.tsx`), so you can use alerts anywhere in your app.

## Basic Usage

### Import the hook

```typescript
import { useAlert } from '@/context/AlertContext';
```

### In your component

```typescript
const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useAlert();

  const handleAction = () => {
    showSuccess('Success!', 'Your action was completed successfully.');
  };

  return (
    // Your component JSX
  );
};
```

## Available Methods

### Simple Alerts

```typescript
const { showSuccess, showError, showWarning, showInfo } = useAlert();

// Success alert
showSuccess('Success', 'Operation completed successfully');

// Error alert
showError('Error', 'Something went wrong');

// Warning alert
showWarning('Warning', 'Please check your input');

// Info alert
showInfo('Information', 'Here is some information');
```

### Advanced Options

All alert methods accept an optional `options` parameter:

```typescript
showError('Error', 'Something went wrong', {
  position: 'center',        // 'top' | 'center' | 'bottom'
  autoHide: true,            // Auto-hide after duration
  autoHideDuration: 3000,    // Duration in milliseconds
  showIcon: true,            // Show/hide icon
  closable: true,            // Allow manual close
});
```

### Confirmation Dialogs

Use `showConfirm` for alerts that require user confirmation:

```typescript
const { showConfirm } = useAlert();

showConfirm(
  'warning',                    // Alert type
  'Delete Item',                 // Title
  'Are you sure you want to delete this item?', // Message
  () => {                        // onConfirm callback
    // Handle confirmation
    deleteItem();
  },
  {
    confirmText: 'Delete',       // Optional: custom confirm button text
    cancelText: 'Cancel',        // Optional: custom cancel button text
  }
);
```

### Generic Alert Method

For full control, use the `showAlert` method:

```typescript
const { showAlert } = useAlert();

showAlert(
  'error',                      // type: 'success' | 'error' | 'warning' | 'info'
  'Error Title',                // title
  'Error message',              // message (optional)
  {
    position: 'center',
    showCancelButton: true,
    onConfirm: () => {
      // Handle confirm
    },
    confirmText: 'OK',
    cancelText: 'Cancel',
    autoHide: false,
    // ... other options
  }
);
```

## Migration from Alert.alert

### Before (React Native Alert)

```typescript
import { Alert } from 'react-native';

Alert.alert('Title', 'Message');
```

### After (Centralized Alert)

```typescript
import { useAlert } from '@/context/AlertContext';

const { showInfo } = useAlert();
showInfo('Title', 'Message');
```

### Confirmation Dialogs

#### Before
```typescript
Alert.alert('Delete', 'Are you sure?', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Delete', onPress: () => deleteItem() },
]);
```

#### After
```typescript
const { showConfirm } = useAlert();

showConfirm(
  'warning',
  'Delete',
  'Are you sure?',
  () => deleteItem(),
  { confirmText: 'Delete', cancelText: 'Cancel' }
);
```

## Direct Service Usage (Advanced)

You can also use the alert service directly without the hook (useful in non-React contexts):

```typescript
import { alertService } from '@/services/alertService';

alertService.showSuccess('Success', 'Operation completed');
alertService.showError('Error', 'Something went wrong');
```

## Examples

See these files for reference:
- `app/(main)/notifications.tsx` - Simple info alerts
- `app/(events)/messages.tsx` - Error alerts
- `app/(events)/schedule/index.tsx` - Confirmation dialogs

