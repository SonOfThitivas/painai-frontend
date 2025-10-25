// profile/page.tsx
"use client"

import UserProfile from "../components/user_profile"

export default function ProfilePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '1rem'
    }}>
      <UserProfile />
    </div>
  );
}