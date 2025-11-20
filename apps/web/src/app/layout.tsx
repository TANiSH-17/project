import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Creator Rewards',
  description: 'Performance-based creator campaigns',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{padding:'12px 16px', borderBottom:'1px solid #eee'}}>
          <strong>Creator Rewards</strong>
          <nav style={{marginLeft:16, display:'inline-flex', gap:12}}>
            <a href="/">Home</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/me">My</a>
            <a href="/settings">Settings</a>
            <a href="/demo">Demo</a>
          </nav>
        </header>
        <main style={{padding:'16px'}}>{children}</main>
      </body>
    </html>
  );
}
