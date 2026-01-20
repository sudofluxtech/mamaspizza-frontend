# Guest/Visitor Tracking Implementation

## Overview

This document explains how guest and visitor tracking is implemented in the application. The system tracks anonymous visitors by generating unique guest IDs, collecting device and browser information, and creating session records in the backend.

## Architecture

The guest tracking system consists of three main components:

1. **Guest ID Management** (`useGuestId` hook)
2. **Guest Provider** (`GuestProvider` component)
3. **Session Creation** (`useCreateGuestSession` hook)

---

## 1. Guest ID Generation and Storage

### Location: `src/lib/guest/useGuestId.ts`

### How It Works:

1. **Guest ID Generation**:
   - Generates a unique 16-character alphanumeric ID
   - Format: Mix of uppercase letters (A-Z) and numbers (0-9)
   - Ensures at least 3 numeric characters are included
   - Characters are shuffled to randomize numeric positions
   - Example: `A7K3M9P2Q5R8T1W4`

2. **Persistence**:
   - Guest ID is stored in `localStorage` with key: `mamas_guest_id`
   - On first visit: Generates new ID and stores it
   - On subsequent visits: Retrieves existing ID from `localStorage`
   - Falls back to in-memory ID if `localStorage` is unavailable

3. **Hook Interface**:
   ```typescript
   {
     guestId: string | null;
     isLoading: boolean;
     refreshGuestId: () => string;
     canOrder: boolean;
     setCanOrder: (value: boolean) => void;
   }
   ```

---

## 2. Guest Provider Component

### Location: `src/lib/guest/GuestProvider.tsx`

### Purpose:
The `GuestProvider` is a React Context Provider that:
- Manages guest state across the application
- Collects device and browser information
- Tracks visitor sessions automatically
- Prevents duplicate tracking

### Key Features:

#### A. Device Detection
- Uses `getDeviceType()` utility to detect device type
- Returns: `"mobile" | "tablet" | "desktop" | "unknown"`
- Detection is based on user agent string analysis
- Runs once on component mount

#### B. Browser Detection
- Extracts browser type from `navigator.userAgent`
- Uses `getBrowserType()` utility function
- Detects: Firefox, Chrome, Safari, Edge, Opera, or "Other"
- Runs once on component mount

#### C. Referral Source Tracking
- Extracts `ref` parameter from URL query string
- Example: `https://example.com?ref=facebook` → `ref = "facebook"`
- Defaults to `"direct"` if no ref parameter is present

#### D. Duplicate Tracking Prevention

The system uses multiple mechanisms to prevent duplicate tracking:

1. **Session-level tracking**:
   - `hasTrackedVisitor` ref: Prevents tracking in the same React session
   - `isTrackingInProgress` ref: Prevents concurrent API calls

2. **Persistent tracking**:
   - Uses `localStorage` with key: `visitor_tracked_{guestId}`
   - Checks if visitor has been tracked before making API call
   - Marks visitor as tracked after successful session creation

3. **Validation checks**:
   - Requires all data: `guestId`, `device`, `browserType`
   - Skips tracking if device type is `"unknown"`
   - Early returns if data is missing

#### E. Automatic Tracking Flow

```typescript
useEffect(() => {
  if (guestData.guestId && device && browserType) {
    trackVisitor();
  }
}, [trackVisitor, guestData.guestId, device, browserType]);
```

The tracking is triggered automatically when:
- Guest ID is available
- Device type is detected
- Browser type is detected

### Tracking Function Logic:

```typescript
const trackVisitor = async () => {
  // 1. Check if already tracked (session or persistent)
  // 2. Validate all required data exists
  // 3. Skip if device is "unknown"
  // 4. Check localStorage for previous tracking
  // 5. Mark as tracking in progress
  // 6. Extract ref parameter from URL
  // 7. Create session data object
  // 8. Call API to create guest session
  // 9. Mark as tracked in localStorage
  // 10. Handle errors gracefully
}
```

### Context Value:

The provider exposes the following context:

```typescript
interface GuestContextType {
  guestId: string | null;
  isLoading: boolean;
  refreshGuestId: () => string;
  canOrder: boolean;
  setCanOrder: (value: boolean) => void;
  device: "mobile" | "tablet" | "desktop" | "unknown";
  browserType: string | null;
}
```

### Usage:

```typescript
// Wrap your app with GuestProvider
<GuestProvider>
  <App />
</GuestProvider>

// Access guest data anywhere
const { guestId, device, browserType } = useGuest();
```

---

## 3. Session Creation Hook

### Location: `src/hooks/guest-session.hook.ts`

### Purpose:
Handles the API call to create a guest session record in the backend.

### API Endpoint:
- **URL**: `POST /api/v1/guests`
- **Authentication**: Public endpoint (no authentication required)
- **Base URL**: Configured in `src/app/api.ts` as `GUESTS_API`

### Request Payload:

```typescript
interface CreateGuestSessionData {
  guest_id: string;        // The unique guest identifier
  ref?: string;            // Referral source (default: "direct")
  device_type: string;     // "mobile" | "tablet" | "desktop"
  browser: string;         // Browser name (e.g., "Chrome", "Firefox")
}
```

### Response:

```typescript
interface GuestSessionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    guest_id: string;
    session: number;
    ref: string;
    device_type: string;
    browser: string;
    page_visits?: any[];
    created_at: string;
    updated_at: string;
  };
}
```

### Hook Interface:

```typescript
{
  createGuestSession: (sessionData: CreateGuestSessionData) => Promise<GuestSessionResponse>;
  loading: boolean;
  error: string | null;
}
```

### Error Handling:
- Catches network errors and API errors
- Sets error state for UI feedback
- Throws error for caller to handle
- Always resets loading state in `finally` block

---

## 4. Complete Data Flow

### First Visit Flow:

1. **User visits the website**
   - `GuestProvider` mounts
   - `useGuestId` hook initializes

2. **Guest ID Creation**:
   - Checks `localStorage` for existing ID
   - Not found → Generates new 16-character ID
   - Stores ID in `localStorage` with key `mamas_guest_id`

3. **Device & Browser Detection**:
   - `getDeviceType()` analyzes user agent → Returns device type
   - `getBrowserType()` analyzes user agent → Returns browser name
   - Both stored in component state

4. **Referral Source Extraction**:
   - Checks URL for `?ref=` parameter
   - Extracts value or defaults to `"direct"`

5. **Tracking Validation**:
   - Checks if all required data is available
   - Checks if device is not "unknown"
   - Checks `localStorage` for `visitor_tracked_{guestId}`

6. **Session Creation**:
   - If not tracked before:
     - Sets `isTrackingInProgress = true`
     - Creates session data object
     - Calls `createGuestSession()` API
     - On success: Sets `visitor_tracked_{guestId} = 'true'` in localStorage
     - Sets `hasTrackedVisitor = true`

### Subsequent Visit Flow:

1. **User returns to website**
   - `GuestProvider` mounts
   - `useGuestId` retrieves existing ID from `localStorage`

2. **Tracking Check**:
   - Checks `localStorage` for `visitor_tracked_{guestId}`
   - If found → Skips API call (already tracked)
   - If not found → Proceeds with tracking flow

---

## 5. Implementation Details

### Device Type Detection (`src/lib/getDeviceType.ts`)

The device detection uses regex patterns on the user agent:

- **Tablet**: `iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))`
- **Mobile**: `Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop`
- **Desktop**: `Windows|Macintosh|Linux|X11`
- **Unknown**: If none match

### Browser Type Detection (`src/lib/getDeviceType.ts`)

The browser detection uses regex patterns:

- **Firefox**: `/firefox\/\d+/i`
- **Edge**: `/edg\/\d+/i`
- **Opera**: `/opr\/\d+/i`
- **Chrome**: `/chrome\/\d+/i`
- **Safari**: `/safari\/\d+/i` (excluding Chrome/Chromium)
- **Other**: Fallback for unrecognized browsers

---

## 6. Key Design Decisions

### Why localStorage for Guest ID?
- Persists across browser sessions
- Allows tracking returning visitors
- No server round-trip needed for ID generation
- Works offline

### Why localStorage for Tracking Flag?
- Prevents duplicate API calls on page refreshes
- Reduces server load
- Faster user experience (no unnecessary API calls)

### Why Multiple Tracking Guards?
- **Session refs**: Prevent React re-render issues
- **localStorage flag**: Persist across sessions
- **Validation checks**: Ensure data quality

### Why Skip "unknown" Device Type?
- Ensures data quality in analytics
- Prevents tracking incomplete sessions
- Better backend data integrity

---

## 7. Usage Example

### Setup (App Root):

```typescript
// app/layout.tsx or app/(root)/template.tsx
import { GuestProvider } from '@/lib/guest/GuestProvider';

export default function RootLayout({ children }) {
  return (
    <GuestProvider>
      {children}
    </GuestProvider>
  );
}
```

### Accessing Guest Data:

```typescript
// Any component
import { useGuest } from '@/lib/guest/GuestProvider';

function MyComponent() {
  const { guestId, device, browserType, isLoading } = useGuest();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Guest ID: {guestId}</p>
      <p>Device: {device}</p>
      <p>Browser: {browserType}</p>
    </div>
  );
}
```

---

## 8. Benefits of This Implementation

1. **Automatic Tracking**: No manual intervention needed
2. **Duplicate Prevention**: Multiple layers prevent duplicate records
3. **Performance**: Uses refs and localStorage for fast checks
4. **Data Quality**: Validates data before sending to API
5. **User Privacy**: No PII collected, only device/browser info
6. **Scalable**: Works for any number of visitors
7. **Resilient**: Handles errors gracefully, doesn't break app

---

## 9. Future Enhancements

Potential improvements:
- Add IP address tracking (with privacy considerations)
- Track page views per session
- Add session duration tracking
- Implement session expiration logic
- Add geographic location (with user consent)
- Track conversion events (e.g., order placed)

---

## Summary

The guest tracking system provides a robust, automatic way to track anonymous visitors without requiring authentication. It generates unique IDs, collects device/browser information, tracks referral sources, and creates session records in the backend—all while preventing duplicates and ensuring data quality.

