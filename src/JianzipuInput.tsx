import React, { useState, useRef, useEffect } from 'react';
import { GuqinKeyboardComponent } from './GuqinKeyboardComponent';

interface JianzipuInputProps {
  // 允许外部传入字体文件的绝对路径或网络 URL
  fontUrl?: string; 
}

export const JianzipuInput: React.FC<JianzipuInputProps> = ({ 
  fontUrl = '/JianZiPu.ttf' // 默认去外部项目的 public 根目录找
}) => {
  const [myText, setMyText] = useState('');
  const myTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const fontName = 'StandaloneJianZiPu';
    if (!document.getElementById('jianzipu-standalone-style')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'jianzipu-standalone-style';
      // 动态使用传入的 fontUrl
      styleElement.innerHTML = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontUrl}') format('truetype'); 
          font-weight: normal;
          font-style: normal;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [fontUrl]);

  return (
    <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      <textarea
        ref={myTextareaRef}
        value={myText}
        onChange={(e) => setMyText(e.target.value)}
        onFocus={() => setIsKeyboardOpen(true)}
        inputMode="none"         
        style={{
          fontFamily: "'StandaloneJianZiPu', ui-monospace, monospace",
          fontSize: '42px',            
          letterSpacing: 'normal',     
          wordSpacing: '24px',         
          lineHeight: '70px',          
          width: '100%', height: '240px', padding: '16px', borderRadius: '12px',
          border: '1px solid #E5DFD5', backgroundColor: '#FFFDFB', color: '#08060d',
          outline: 'none', resize: 'none', boxSizing: 'border-box'
        }}
      />
      <GuqinKeyboardComponent
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        value={myText}
        onChange={setMyText}
        textareaRef={myTextareaRef}
      />
    </div>
  );
};