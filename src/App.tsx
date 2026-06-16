// src/App.tsx
import React from 'react';
import { JianzipuInput } from './JianzipuInput';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9', 
      boxSizing: 'border-box' 
    }}>
      <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>古琴减字谱高精度输入终端</h2>
      
      {/* 直接引用封装好的高内聚输入组件 */}
      <JianzipuInput />
      
    </div>
  );
}

export default App;