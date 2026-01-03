# Components Theme Usage Audit Report

## Summary
This report identifies which components are using the theme system (`useAppTheme` or `useTheme`) and which are not.

## Theme System Overview
The codebase uses two theme systems:
1. **`useAppTheme()`** from `@/context/AppThemeContext` - For app-wide light/dark theme (uses `Colors.light` or `Colors.dark` based on user preference)
2. **`useTheme()`** from `@/context/ThemeContext` - For event-specific themes

## Components USING Theme ✅

1. **components/home/UpcomingEvents.tsx**
   - Uses: `useAppTheme()`
   - Status: ✅ Properly implemented

2. **components/home/RecentActivities.tsx**
   - Uses: `useAppTheme()`
   - Status: ✅ Properly implemented

3. **components/common/Navigation/bottomNavigation.tsx**
   - Uses: `useAppTheme()`
   - Status: ✅ Properly implemented

4. **components/website/EventWebsiteForm.tsx**
   - Uses: `useTheme()` (event theme)
   - Status: ✅ Properly implemented (though also uses `Colors.light` directly in some places)

## Components NOT Using Theme ❌

### Common Components
1. **components/common/Navigation/BackButton.tsx**
   - Issue: Imports `useTheme()` but doesn't use it
   - Uses: Hardcoded `color="white"`
   - Recommendation: Use `useAppTheme()` to get `currentColors.text` or appropriate color

2. **components/common/Avatar.tsx**
   - Uses: `Colors.light` directly
   - Recommendation: Use `useAppTheme()` to get `currentColors`

3. **components/common/alert.tsx**
   - Uses: `Colors.light` directly throughout
   - Recommendation: Use `useAppTheme()` to get `currentColors`

4. **components/common/LoadingScreen.tsx**
   - Uses: Hardcoded colors (`#FFFFFF`, `#333333`)
   - Recommendation: Use `useAppTheme()` to get `currentColors`

5. **components/common/ErrorBoundary.tsx**
   - Uses: Hardcoded inline styles
   - Recommendation: Use `useAppTheme()` to get `currentColors`

6. **components/common/Navigation/AppCoreNav.tsx**
   - Uses: `Colors.light.backgroundPrimary` directly
   - Recommendation: Use `useAppTheme()` to get `currentColors`

7. **components/common/Navigation/sideBar.tsx**
   - Uses: `Colors.light.primary` directly, also hardcoded colors (`#333`, `#FF3B30`)
   - Recommendation: Use `useAppTheme()` to get `currentColors`

8. **components/common/MultiUserPicker.tsx**
   - Uses: `Colors.light` directly
   - Recommendation: Use `useAppTheme()` to get `currentColors`

9. **components/common/RichTextEditor.tsx**
   - Uses: `Colors.light` directly
   - Recommendation: Use `useAppTheme()` to get `currentColors`

10. **components/common/GoogleIcon.tsx**
    - Status: ✅ No theme needed (SVG with fixed brand colors)

11. **components/common/slider.tsx**
    - Uses: `Colors.light.textLight` directly, hardcoded `rgba(0, 0, 0, 0.5)`, `rgba(255, 255, 255, 0.5)`
    - Recommendation: Use `useAppTheme()` to get `currentColors`

12. **components/common/Layout/landingPageHome.tsx**
    - Uses: `Colors.light.buttonPrimary` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

13. **components/common/Layout/ResponsiveContainer.tsx**
    - Status: ✅ No colors used (layout only)

14. **components/common/Layout/teams.tsx**
    - Uses: Hardcoded colors (`#000`, `#0000ff`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

15. **components/common/Ads/InterstitialAdModal.tsx**
    - Uses: Hardcoded colors (`#333`, `#007AFF`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

### Form Components
16. **components/budget/BudgetForm.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

17. **components/tasks/TaskForm.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

18. **components/ideas/IdeaForm.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

19. **components/teams/EventTeamForm.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

20. **components/schedules/form/ScheduleForm.tsx**
    - Uses: `Colors.light` directly (based on import)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

### Event Components
21. **components/events/InviteGuestModal.tsx**
    - Uses: `Colors.light` directly, also `Colors.dark.text` for contrast
    - Recommendation: Use `useAppTheme()` to get `currentColors`

22. **components/events/RsvpPreferenceForm.tsx**
    - Uses: External styles file, hardcoded colors (`#000`, `#fff`, `#007AFF`, `#81b0ff`, `#f4f3f4`, `#3e3e3e`)
    - Recommendation: Use `useAppTheme()` to get `currentColors` and update styles file

23. **components/events/ScheduleItemForm.tsx**
    - Uses: External styles file, hardcoded colors (`#000`, `#666`)
    - Recommendation: Use `useAppTheme()` to get `currentColors` and update styles file

24. **components/events/TableForm.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

25. **components/events/details/EventDetailHeader.tsx**
    - Uses: `Colors.light.primary` directly, also hardcoded `#555`
    - Recommendation: Use `useAppTheme()` to get `currentColors`

26. **components/events/details/EventDetailTasks.tsx**
    - Uses: `Colors.light` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

27. **components/events/details/EventDetailBudget.tsx**
    - Uses: `Colors.light.primary` and `Colors.light.error` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

28. **components/events/details/EventDetailIdeas.tsx**
    - Uses: `Colors.light.primary`, `Colors.light.success`, `Colors.light.error` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

29. **components/events/details/EventDetailTeams.tsx**
    - Uses: `Colors.light.primary`, `Colors.light.error`, `Colors.light.text`, `Colors.light.textSecondary`, `Colors.light.backgroundSecondary` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

30. **components/events/details/EventDetailWebsite.tsx**
    - Uses: `Colors.light.primary` directly
    - Recommendation: Use `useAppTheme()` to get `currentColors`

31. **components/events/details/EventDetailTheme.tsx**
    - Status: Need to check (not read yet)

32. **components/events/details/EventDetailNavButtons.tsx**
    - Uses: Hardcoded `#fff` for icon colors
    - Recommendation: Use `useAppTheme()` to get `currentColors`

### Notification Components
33. **components/notifications/NotificationListItem.tsx**
    - Uses: External styles file
    - Recommendation: Check if styles file uses theme, update if needed

34. **components/notifications/NotificationSearchBar.tsx**
    - Uses: Hardcoded colors (`#888`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

35. **components/notifications/NotificationSettingsBar.tsx**
    - Uses: Hardcoded colors (`#e0e0e0`, `#8df5d3`, `#fff`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

36. **components/notifications/NotificationFilterChips.tsx**
    - Uses: External styles file
    - Recommendation: Check if styles file uses theme, update if needed

### Schedule Components
37. **components/schedules/list/ScheduleListItem.tsx**
    - Uses: `Colors.light` directly throughout
    - Recommendation: Use `useAppTheme()` to get `currentColors`

### Team Components
38. **components/teams/list/TeamListItem.tsx**
    - Uses: Hardcoded colors (`#555`, `#4050FF`, `#ccc`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

39. **components/teams/list/SuggestedTeamListItem.tsx**
    - Uses: External styles file
    - Recommendation: Check if styles file uses theme, update if needed

40. **components/teams/FamilyMemberNode.tsx**
    - Status: Need to check (not read yet)

### Vendor Components
41. **components/vendors/vendorScreen.tsx**
    - Uses: `Colors.light` directly (based on import)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

42. **components/vendors/vendorManagement.tsx**
    - Uses: `Colors.light.tint` directly, hardcoded colors (`#555`, `#ccc`)
    - Recommendation: Use `useAppTheme()` to get `currentColors`

## Recommendations

1. **Standardize on `useAppTheme()`**: For app-wide theming, all components should use `useAppTheme()` to get `currentColors` instead of directly accessing `Colors.light` or `Colors.dark`.

2. **Replace hardcoded colors**: All hardcoded color values (like `#FFFFFF`, `#333333`, `#555`, `#FF3B30`, etc.) should be replaced with theme colors.

3. **Update style functions**: Components that use style creation functions should pass `currentColors` as a parameter.

4. **Pattern to follow**:
   ```typescript
   import { useAppTheme } from '@/context/AppThemeContext';
   
   const MyComponent = () => {
     const { currentColors } = useAppTheme();
     const styles = useMemo(() => createStyles(currentColors), [currentColors]);
     // Use currentColors instead of Colors.light
   };
   ```

5. **Priority order for migration**:
   - High priority: Common components (Avatar, alert, LoadingScreen, ErrorBoundary, Navigation components)
   - Medium priority: Form components (all form components)
   - Low priority: Detail/display components

## Notes

- Some components may use external style files. Those style files should also be updated to accept `currentColors` as a parameter.
- The `EventWebsiteForm.tsx` component uses both `useTheme()` (for event theme) and `Colors.light` directly - this should be reviewed and potentially unified.

