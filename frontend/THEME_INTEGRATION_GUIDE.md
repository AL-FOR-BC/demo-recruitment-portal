# Theme Integration Guide

This guide shows how to use the dynamic logo and theme color throughout your recruitment portal.

## Overview

The application now fetches logo and theme color from the backend API (`/api/settings`) and makes them available throughout the app via:
- **ConfigProvider** - Context provider that wraps the app
- **useTheme hook** - Easy hook to access theme values anywhere

## Quick Start

### 1. Using the `useTheme` Hook

The easiest way to access theme values anywhere in your components:

```tsx
import { useTheme } from "@/utils/hooks/useTheme";

function MyComponent() {
  const { primaryColor, logo } = useTheme();
  
  return (
    <div>
      <img src={logo} alt="Logo" />
      <button style={{ backgroundColor: primaryColor }}>
        Click me
      </button>
    </div>
  );
}
```

### 2. Replacing Hardcoded Colors

#### Before:
```tsx
<div className="bg-[#0D55A3]">  {/* Hardcoded */}
  <button className="border-[#0D55A3]">Button</button>
</div>
```

#### After:
```tsx
import { useTheme } from "@/utils/hooks/useTheme";

function MyComponent() {
  const { primaryColor } = useTheme();
  
  return (
    <div style={{ backgroundColor: primaryColor }}>
      <button style={{ borderColor: primaryColor }}>Button</button>
    </div>
  );
}
```

### 3. Using in Tailwind Classes

For Tailwind classes, you have two options:

**Option A: Inline Style (Recommended for dynamic colors)**
```tsx
<div style={{ backgroundColor: primaryColor }}>
  <button 
    className="text-white px-4 py-2 rounded"
    style={{ backgroundColor: primaryColor }}
  >
    Submit
  </button>
</div>
```

**Option B: CSS Variables (For complex styling)**
```tsx
<div style={{ '--theme-color': primaryColor } as React.CSSProperties}>
  <button className="bg-[var(--theme-color)]">Button</button>
</div>
```

## Common Use Cases

### Buttons
```tsx
const { primaryColor } = useTheme();

<button 
  className="text-white px-6 py-3 rounded-lg"
  style={{ backgroundColor: primaryColor }}
>
  Submit
</button>
```

### Borders and Focus States
```tsx
<input
  className="border-gray-300 rounded-lg focus:outline-none focus:ring-2"
  style={{
    '--tw-ring-color': `${primaryColor}50`,
    borderColor: primaryColor,
  } as React.CSSProperties}
/>
```

### Logos
```tsx
const { logo } = useTheme();

<img src={logo} alt="Company Logo" className="h-20" />
```

### Background Colors
```tsx
<div style={{ backgroundColor: primaryColor }}>
  {/* Content */}
</div>
```

## Files That Need Updates

Based on the codebase scan, here are files with hardcoded colors that should be updated:

### High Priority (User-Facing Components)
- ✅ `src/components/layout/AuthLayout.tsx` - Updated
- ✅ `src/components/layout/DashboardLayout.tsx` - Updated  
- ✅ `src/components/layout/Side.tsx` - Updated
- ⚠️ `src/view/profile/Profile.tsx` - Has many `#0D55A3` references
- ⚠️ `src/view/profile/CreateProfile.tsx` - Has many `#0D55A3` references
- ⚠️ `src/view/profile/ApplicationDetails.tsx` - Has hardcoded colors
- ⚠️ `src/components/application/*.tsx` - Multiple files with hardcoded colors

### Example: Updating Profile.tsx

**Find and replace pattern:**
1. Import the hook: `import { useTheme } from "@/utils/hooks/useTheme";`
2. Use it in component: `const { primaryColor } = useTheme();`
3. Replace `#0D55A3` with `primaryColor` in style props
4. Replace `bg-[#0D55A3]` with `style={{ backgroundColor: primaryColor }}`
5. Replace `border-[#0D55A3]` with `style={{ borderColor: primaryColor }}`

## How It Works

1. **On App Start**: `Theme.tsx` component fetches settings from `/api/settings`
2. **Settings Store**: Settings are stored in Redux (`app.settings`)
3. **ConfigProvider**: Makes theme available via React Context
4. **useTheme Hook**: Easy access to theme values anywhere

## API Endpoint

The settings are fetched from:
```
GET http://localhost:8001/api/settings?id=main
```

Response:
```json
{
  "success": true,
  "data": {
    "companyLogo": "https://example.com/logo.png",
    "themeColor": "#094BAC"
  }
}
```

## Default Values

If settings fail to load or don't exist:
- **Theme Color**: `#094BAC` (fallback)
- **Logo**: `logo-rom.png` from assets folder

## Need Help?

If you need to update many files at once, you can:
1. Use Find & Replace in your IDE
2. Search for: `#0D55A3` or `bg-[#0D55A3]`
3. Replace with the `useTheme()` hook pattern shown above

