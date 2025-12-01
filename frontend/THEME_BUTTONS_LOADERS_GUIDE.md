# Theme Integration Guide - Buttons and Loaders

This guide shows how to update buttons and loaders throughout the application to use the dynamic theme color from the backend.

## Available Components & Hooks

### 1. Button Component (Updated)
Location: `frontend/src/components/common/Button.tsx`
- Now automatically uses theme color for primary variant
- Usage: `<Button variant="primary">Click Me</Button>`

### 2. Spinner Components (New)
Location: `frontend/src/components/common/Spinner.tsx`
- `PageSpinner` - Full page loading spinner with theme color
- `Spinner` - Small spinner for buttons (variant="button" for white spinners)

### 3. useTheme Hook
Location: `frontend/src/utils/hooks/useTheme.ts`
- Returns: `{ primaryColor, logo }`
- Always includes fallback values

### 4. useButtonStyles Hook (New)
Location: `frontend/src/utils/hooks/useButtonStyles.ts`
- Returns button styles with theme color
- Use for inline button styling

## Update Patterns

### Loading Spinners

**Before:**
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]"></div>
```

**After:**
```tsx
import { PageSpinner } from "@/components/common/Spinner";

<PageSpinner />
```

### Buttons with Theme Color

**Before:**
```tsx
<button className="px-6 py-3 bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white rounded-lg">
  Submit
</button>
```

**After (Option 1 - Using useButtonStyles):**
```tsx
import { useButtonStyles } from "@/utils/hooks/useButtonStyles";

const buttonStyles = useButtonStyles();
const themeColor = buttonStyles.getThemeColor();

<button
  className={`px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors ${buttonStyles.primary.className}`}
  style={{ backgroundColor: themeColor }}
>
  Submit
</button>
```

**After (Option 2 - Using useTheme directly):**
```tsx
import { useTheme } from "@/utils/hooks/useTheme";

const { primaryColor } = useTheme();
const themeColor = primaryColor || "#094BAC";

<button
  className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
  style={{ 
    backgroundColor: themeColor,
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${themeColor}E6`}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColor}
>
  Submit
</button>
```

### Button Spinners (inside buttons)

**Before:**
```tsx
<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
```

**After:**
```tsx
import { Spinner } from "@/components/common/Spinner";

<Spinner variant="button" size="sm" />
```

### Input Focus Rings

**Before:**
```tsx
className="focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
```

**After:**
```tsx
import { useTheme } from "@/utils/hooks/useTheme";

const { primaryColor } = useTheme();
const themeColor = primaryColor || "#094BAC";

className="focus:ring-2 focus:border-2 transition-all"
style={{
  '--tw-ring-color': `${themeColor}50`,
  borderColor: isFocused ? themeColor : undefined,
} as React.CSSProperties}
```

## Files to Update

### High Priority (Already Updated)
- ✅ `frontend/src/components/common/Loading.tsx`
- ✅ `frontend/src/view/profile/Profile.tsx`
- ✅ `frontend/src/view/dashboard/Dashboard.tsx`
- ✅ `frontend/src/view/dashboard/JobDetails.tsx`
- ✅ `frontend/src/components/application/Attachment.tsx`
- ✅ `frontend/src/components/application/WorkExperience.tsx`
- ✅ `frontend/src/components/application/Skills.tsx`
- ✅ `frontend/src/components/application/RefereesAndAttachments.tsx`

### Still Need Updates

#### Authentication Forms
- `frontend/src/view/auth/SignIn/SignInForm.tsx` - Buttons and loaders
- `frontend/src/view/auth/SignUp/SignUpForm.tsx` - Buttons and loaders
- `frontend/src/view/auth/OTP/OTPForm.tsx` - Buttons
- `frontend/src/view/auth/ForgotPassword/ForgotPasswordForm.tsx` - Buttons and loaders
- `frontend/src/view/auth/ResetPassword/ResetPasswordForm.tsx` - Buttons and loaders

#### Profile & Application Forms
- `frontend/src/view/profile/CreateProfile.tsx` - Buttons and input focus rings
- `frontend/src/view/profile/ApplicationDetails.tsx` - Buttons
- `frontend/src/components/application/AcademicQualifications.tsx` - Buttons and loaders
- `frontend/src/components/application/Certificates.tsx` - Buttons and loaders
- `frontend/src/components/application/ConfirmDetails.tsx` - Buttons

#### Other Components
- `frontend/src/components/common/ErrorBoundary.tsx` - Button color

## Quick Search & Replace Pattern

To find all instances that need updating:

1. Search for: `bg-\[#0D55A3\]` or `border-\[#0D55A3\]`
2. Replace with theme color using `useTheme()` hook
3. Search for: `animate-spin.*border-\[#0D55A3\]`
4. Replace with `<PageSpinner />` or `<Spinner />`

## Notes

- Always import `useTheme` or use the new components
- Always provide fallback colors: `primaryColor || "#094BAC"`
- Button spinners should be white (`variant="button"`)
- Page loaders should use theme color
- Input focus rings should use theme color with opacity

