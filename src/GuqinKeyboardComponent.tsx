// src/GuqinKeyboardComponent.tsx
import React, { useState, useMemo } from 'react';
import { AdvancedGuqinEngine } from './guqinKeyboardEngine';
import { guqinSvgToCodeMap } from './guqinKeyMapping';

const allKeys = Object.entries(guqinSvgToCodeMap).map(([svgName, val]) => ({ svgName, ...val }));

const topLeftRowKeys = [
  { chineseName: "名", fontCode: "s", type: '1a_LEFT_FINGER' as const, isControl: false },
  { chineseName: "中", fontCode: "d", type: '1a_LEFT_FINGER' as const, isControl: false },
  { chineseName: "食", fontCode: "f", type: '1a_LEFT_FINGER' as const, isControl: false },
  { chineseName: "大", fontCode: "v", type: '1a_LEFT_FINGER' as const, isControl: false },
  { chineseName: "跪", fontCode: "x", type: '1a_LEFT_FINGER' as const, isControl: false },
  { chineseName: "散", fontCode: "0", type: '1d_SPECIAL_CASES' as const, isControl: false },
  { chineseName: "就", fontCode: "jiu", type: '1d_SPECIAL_CASES' as const, isControl: false },
  { chineseName: "独字", fontCode: "duzi_toggle", type: '3_GENERAL_SYMBOLS' as const, isControl: true } 
];

const fadeInLeftVerticalKeys = [
  { chineseName: "绰", fontCode: "/", type: '1b_SPEED_MODS' as const },
  { chineseName: "急", fontCode: ">", type: '1b_SPEED_MODS' as const },
  { chineseName: "注", fontCode: "\\", type: '1b_SPEED_MODS' as const }
];

const rightBlockKeys = [
  { chineseName: "劈", fontCode: "n", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "托", fontCode: "h", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "抹", fontCode: "j", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "挑", fontCode: "u", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "勾", fontCode: "k", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "剔", fontCode: "i", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "打", fontCode: "l", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "摘", fontCode: "o", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "抹挑", fontCode: "ju", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "勾剔", fontCode: "ki", type: '2a_BASIC_RIGHT_HAND' as const },
  { chineseName: "打摘", fontCode: "lo", type: '2a_BASIC_RIGHT_HAND' as const }
];

// 💡 恢复了多弦按钮，用于触发进入多声部模式
const localMobileStringButtons = [
  { label: "一", code: "1" }, { label: "二", code: "2" }, { label: "三", code: "3" },
  { label: "四", code: "4" }, { label: "五", code: "5" }, { label: "六", code: "6" },
  { label: "七", code: "7" }, { label: "多弦", code: "|" }
];

const mobileHuiButtons = [
  { label: "1", code: "1" }, { label: "2", code: "2" }, { label: "3", code: "3" },
  { label: "4", code: "4" }, { label: "5", code: "5" }, { label: "6", code: "6" },
  { label: "7", code: "7" }, { label: "8", code: "8" }, { label: "9", code: "9" },
  { label: "10", code: "10" }, { label: "11", code: "11" }, { label: "12", code: "12" },
  { label: "13", code: "13" }, { label: "外", code: "13+" }
];

const mobileFenButtons = [
  { label: "0", code: "0" },
  { label: ".1", code: ".1" }, { label: ".2", code: ".2" }, { label: ".3", code: ".3" },
  { label: ".4", code: ".4" }, { label: ".5", code: ".5" }, { label: ".6", code: ".6" },
  { label: ".7", code: ".7" }, { label: ".8", code: ".8" }, { label: ".9", code: ".9" }
];

const CULTURAL_TOKENS = {
  colors: {
    bg_drawer: '#FAF8F5',
    bg_btn_default: '#FFFFFF',
    bg_panel_alt: '#F3F4F4',
    border_soft: '#E5DFD5',
    text_main: '#3A2D26',
    text_sec: '#8A7A71',
    accent_red: '#B8422B',
    accent_purple: '#5A4A75',
    space_khaki: '#F5EFE6' 
  },
  radius: { btn: '8px', panel: '16px' },
  shadow: {
    drawer: '0 -6px 20px rgba(58, 45, 38, 0.06)',
    panel: '0 4px 12px rgba(58, 45, 38, 0.08)'
  }
};

interface KeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (newValue: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const GuqinKeyboardComponent: React.FC<KeyboardProps> = ({ 
  isOpen, 
  onClose, 
  value, 
  onChange, 
  textareaRef 
}) => {
  const engine = useMemo(() => new AdvancedGuqinEngine(), []);
  
  const [isDuZiOpen, setIsDuZiOpen] = useState<boolean>(false);
  const [isRightPlusOpen, setIsRightPlusOpen] = useState<boolean>(false);
  
  const [buildingRange, setBuildingRange] = useState<{ start: number; end: number } | null>(null);

  const handleInsertGuqinText = (insertedText: string, isCommit: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + insertedText);
      return;
    }

    const currentText = textarea.value;
    let startPos = textarea.selectionStart;
    let nextText = '';
    let newCursorPos = startPos;

    if (!isCommit) {
      if (buildingRange === null) {
        nextText = currentText.substring(0, startPos) + insertedText + currentText.substring(textarea.selectionEnd);
        newCursorPos = startPos + insertedText.length;
        setBuildingRange({ start: startPos, end: startPos + insertedText.length });
      } else {
        const { start, end } = buildingRange;
        nextText = currentText.substring(0, start) + insertedText + currentText.substring(end);
        newCursorPos = start + insertedText.length;
        setBuildingRange({ start: start, end: start + insertedText.length });
      }
      onChange(nextText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    } else {
      if (buildingRange === null) {
        nextText = currentText.substring(0, startPos) + insertedText + currentText.substring(textarea.selectionEnd);
        newCursorPos = startPos + insertedText.length;
      } else {
        const { start, end } = buildingRange;
        nextText = currentText.substring(0, start) + insertedText + currentText.substring(end);
        newCursorPos = start + insertedText.length;
      }
      onChange(nextText);
      setBuildingRange(null); 
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.scrollTop = textarea.scrollHeight;
      }, 10);
    }
  };

  const handleKeyClick = (category: any, fontCode: string) => {
    const res = engine.processInput(category, fontCode);
    if (res && typeof res.text === 'string') {
      handleInsertGuqinText(res.text, res.isCommit);
    }
  };

  const handleBackspaceLogic = () => {
    const textarea = textareaRef.current;

    if (engine.hasBuffer()) {
      const remainingText = engine.deleteLastComponent();
      if (remainingText !== null) {
        if (buildingRange !== null) {
          handleInsertGuqinText(remainingText, false);
        }
        return;
      }
      setBuildingRange(null);
    }

    setBuildingRange(null);
    engine.clearCurrentBuffer();

    if (!textarea) {
      if (value.endsWith('  ')) {
        onChange(value.slice(0, -1));
      } else if (value.endsWith(' ') && value.length > 1) {
        const lastSpace = value.slice(0, -1).lastIndexOf(' ');
        onChange(lastSpace === -1 ? '' : value.substring(0, lastSpace + 1));
      } else if (value === ' ') {
        onChange('');
      } else {
        const lastSpace = value.lastIndexOf(' ');
        onChange(lastSpace === -1 ? '' : value.substring(0, lastSpace + 1));
      }
      return;
    }

    const currentText = textarea.value;
    const startPos = textarea.selectionStart;

    if (startPos > 0) {
      let nextText = '';
      let newCursorPos = 0;
      const textBeforeCursor = currentText.substring(0, startPos);

      if (textBeforeCursor.endsWith('  ')) {
        nextText = textBeforeCursor.slice(0, -1) + currentText.substring(textarea.selectionEnd);
        newCursorPos = startPos - 1;
      } else if (textBeforeCursor.endsWith(' ') && textBeforeCursor.length > 1) {
        const lastSpaceIndex = textBeforeCursor.slice(0, -1).lastIndexOf(' ');
        nextText = textBeforeCursor.slice(0, lastSpaceIndex + 1) + currentText.substring(textarea.selectionEnd);
        newCursorPos = lastSpaceIndex + 1;
      } else if (textBeforeCursor === ' ') {
        nextText = currentText.substring(textarea.selectionEnd);
        newCursorPos = 0;
      } else {
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
        nextText = textBeforeCursor.slice(0, lastSpaceIndex + 1) + currentText.substring(textarea.selectionEnd);
        newCursorPos = lastSpaceIndex + 1;
      }

      onChange(nextText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    }
  };

  const handleSpaceBarClick = () => {
    if (engine.hasBuffer()) {
      const output = engine.commitChar();
      if (output) {
        handleInsertGuqinText(output, true);
      }
    }
    handleInsertGuqinText(' ', true);
  };

  const handleCommitClick = () => {
    const output = engine.commitChar();
    if (output) {
      handleInsertGuqinText(output, true);
    }
  };

  const rightComplexKeys = useMemo(() => {
    const baseKeys = allKeys.filter(k => 
      (k.type === '2b_CHORDS' || k.type === '2c_RIGHT_STRUM_TECH' || k.type === '1c_LEFT_TECHNIQUES') &&
      k.chineseName !== '半轮音'
    );
    return [{ chineseName: "历", fontCode: "U", type: '2a_BASIC_RIGHT_HAND' as const }, ...baseKeys];
  }, []);

  const duZiKeys = useMemo(() => {
    return allKeys.filter(k => 
      (k.type === '1d_VIBRATOS_SLIDES' || k.type === '3_GENERAL_SYMBOLS') &&
      !['半', '外', '*'].includes(k.chineseName)
    );
  }, []);

  const baseBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: CULTURAL_TOKENS.colors.bg_btn_default, color: CULTURAL_TOKENS.colors.text_main,
    border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`, borderRadius: CULTURAL_TOKENS.radius.btn,
    fontSize: '14px', cursor: 'pointer', boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s ease',
  };

  const preventBlurProps = {
    onMouseDown: (e: React.MouseEvent) => e.preventDefault()
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: CULTURAL_TOKENS.colors.bg_drawer,
      borderTopLeftRadius: CULTURAL_TOKENS.radius.panel, borderTopRightRadius: CULTURAL_TOKENS.radius.panel,
      boxShadow: CULTURAL_TOKENS.shadow.drawer,
      padding: '12px 10px calc(10px + env(safe-area-inset-bottom)) 10px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Noto Serif CJK SC", "Microsoft YaHei", serif',
      transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      display: 'flex', flexDirection: 'column', gap: '8px'
    }}>
      
      {/* 1. 第一排左手区 */}
      <div style={{
        border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`, borderRadius: CULTURAL_TOKENS.radius.btn,
        background: CULTURAL_TOKENS.colors.bg_btn_default, padding: '5px', width: '100%', boxSizing: 'border-box', position: 'relative' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
          {topLeftRowKeys.map(k => {
            if (k.isControl) {
              return (
                <button
                  key="toggle-duzi"
                  {...preventBlurProps}
                  onClick={() => setIsDuZiOpen(!isDuZiOpen)}
                  style={{
                    ...baseBtnStyle, height: '36px',
                    background: isDuZiOpen ? CULTURAL_TOKENS.colors.text_main : CULTURAL_TOKENS.colors.bg_panel_alt,
                    color: isDuZiOpen ? '#fff' : CULTURAL_TOKENS.colors.text_main,
                    borderColor: isDuZiOpen ? CULTURAL_TOKENS.colors.text_main : CULTURAL_TOKENS.colors.border_soft,
                    fontSize: '12px',
                  }}
                >
                  独字{isDuZiOpen ? ' ▾' : ' ▴'}
                </button>
              );
            }
            return (
              <button
                key={`top-left-${k.fontCode}`}
                {...preventBlurProps}
                onClick={() => handleKeyClick(k.type, k.fontCode)}
                style={{ ...baseBtnStyle, height: '36px' }}
              >
                {k.chineseName}
              </button>
            );
          })}
        </div>

        {isDuZiOpen && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: '10px',
            background: CULTURAL_TOKENS.colors.bg_btn_default, border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`,
            borderRadius: CULTURAL_TOKENS.radius.btn, padding: '8px', boxShadow: CULTURAL_TOKENS.shadow.panel,
            zIndex: 10000, maxHeight: '160px', overflowY: 'auto'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
              {duZiKeys.map(k => (
                <button
                  key={`duzi-${k.svgName}`}
                  {...preventBlurProps}
                  onClick={() => {
                    handleKeyClick(k.type, k.fontCode);
                    setIsDuZiOpen(false);
                  }}
                  style={{ 
                    ...baseBtnStyle, height: '32px', fontSize: '12px',
                    color: CULTURAL_TOKENS.colors.text_sec, background: CULTURAL_TOKENS.colors.bg_drawer
                  }}
                >
                  {k.chineseName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. 中间功能双区 */}
      <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'stretch' }}>
        <div style={{
          border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`, borderRadius: CULTURAL_TOKENS.radius.btn,
          background: CULTURAL_TOKENS.colors.bg_btn_default, padding: '5px', width: '15%',
          display: 'flex', flexDirection: 'column', gap: '5px', boxSizing: 'border-box'
        }}>
          {fadeInLeftVerticalKeys.map(k => (
            <button
              key={`left-vertical-${k.fontCode}`}
              {...preventBlurProps}
              onClick={() => handleKeyClick(k.type, k.fontCode)}
              style={{ 
                ...baseBtnStyle, flex: 1, minHeight: '34px',
                color: CULTURAL_TOKENS.colors.text_main, background: CULTURAL_TOKENS.colors.bg_panel_alt,
                border: 'none', fontSize: '13px'
              }}
            >
              {k.chineseName}
            </button>
          ))}
        </div>

        <div style={{
          flex: 1, border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`, borderRadius: CULTURAL_TOKENS.radius.btn,
          background: CULTURAL_TOKENS.colors.bg_btn_default, padding: '5px', boxSizing: 'border-box'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
            {rightBlockKeys.map(k => (
              <button
                key={`right-block-${k.fontCode}`}
                {...preventBlurProps}
                onClick={() => handleKeyClick(k.type, k.fontCode)}
                style={{ ...baseBtnStyle, height: '34px', fontSize: '13px' }}
              >
                {k.chineseName}
              </button>
            ))}
            <button
              {...preventBlurProps}
              onClick={() => setIsRightPlusOpen(!isRightPlusOpen)}
              style={{ 
                ...baseBtnStyle, height: '34px',
                background: isRightPlusOpen ? CULTURAL_TOKENS.colors.text_sec : '#ECE6DC', 
                border: 'none', fontSize: '15px', color: isRightPlusOpen ? '#fff' : CULTURAL_TOKENS.colors.text_main,
              }}
            >
              {isRightPlusOpen ? '－' : '＋'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. 右手复杂扩展 */}
      {isRightPlusOpen && (
        <div style={{
          background: CULTURAL_TOKENS.colors.bg_btn_default, border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`,
          borderRadius: CULTURAL_TOKENS.radius.btn, padding: '6px', boxShadow: CULTURAL_TOKENS.shadow.panel
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
            {rightComplexKeys.map((k, index) => (
              <button
                key={`right-complex-${k.chineseName}-${index}`}
                {...preventBlurProps}
                onClick={() => handleKeyClick(k.type, k.fontCode)}
                style={{ 
                  ...baseBtnStyle, height: '32px',
                  background: k.chineseName === '历' ? CULTURAL_TOKENS.colors.bg_panel_alt : CULTURAL_TOKENS.colors.bg_drawer, 
                  fontSize: '12px', color: CULTURAL_TOKENS.colors.text_main, border: `1px solid ${CULTURAL_TOKENS.colors.border_soft}`
                }}
              >
                {k.chineseName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. 徽位面板 */}
      <div style={{ background: CULTURAL_TOKENS.colors.bg_panel_alt, padding: '5px', borderRadius: CULTURAL_TOKENS.radius.btn }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {mobileHuiButtons.map(b => (
            <button
              key={`hui-${b.code}`}
              {...preventBlurProps}
              onClick={() => handleKeyClick('TRACK_HUI', b.code)}
              style={{ ...baseBtnStyle, height: '32px', background: CULTURAL_TOKENS.colors.bg_btn_default, border: 'none', fontSize: '13px' }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 徽分面板 */}
      <div style={{ background: CULTURAL_TOKENS.colors.bg_panel_alt, padding: '5px', borderRadius: CULTURAL_TOKENS.radius.btn }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
          {mobileFenButtons.map(b => (
            <button
              key={`fen-${b.code}`}
              {...preventBlurProps}
              onClick={() => handleKeyClick('TRACK_FEN', b.code)}
              style={{ ...baseBtnStyle, height: '30px', background: CULTURAL_TOKENS.colors.bg_btn_default, border: 'none', fontSize: '12px' }}
            >
              {b.label.replace('.', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 6. 弦号面板 */}
      <div style={{ background: '#EAE5FC', padding: '5px', borderRadius: CULTURAL_TOKENS.radius.btn }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {localMobileStringButtons.map(b => (
            <button
              key={`str-${b.code}`}
              {...preventBlurProps}
              onClick={() => {
                if (b.code === '|') {
                  handleKeyClick('CORE_DIGIT', '|');
                } else {
                  handleKeyClick('TRACK_STRING', b.code);
                }
              }}
              style={{ 
                ...baseBtnStyle, flex: 1, height: '38px', background: CULTURAL_TOKENS.colors.bg_btn_default, 
                border: 'none', fontSize: '14px', color: CULTURAL_TOKENS.colors.accent_purple, fontWeight: 'bold'
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. 底部控制台 */}
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
         <button
          key="btn-commit-word"
          {...preventBlurProps}
          onClick={handleCommitClick}
          style={{
            ...baseBtnStyle, flex: '1.8', height: '44px', background: CULTURAL_TOKENS.colors.accent_red, color: '#fff', 
            fontSize: '15px', border: 'none', boxShadow: '0 2px 8px rgba(184, 66, 43, 0.2)'
          }}
        >
          确定
        </button>
        


        <button
          key="btn-spacebar-cultural"
          {...preventBlurProps}
          onClick={handleSpaceBarClick}
          style={{ ...baseBtnStyle, flex: '1.5', height: '44px', background: CULTURAL_TOKENS.colors.space_khaki, color: CULTURAL_TOKENS.colors.text_main, fontSize: '14px', border: 'none' }}
        >
          ␣ 空格 (空拍)
        </button>
        <button
          key="btn-backspace-smart"
          {...preventBlurProps}
          onClick={handleBackspaceLogic}
          style={{ ...baseBtnStyle, flex: '1.2', height: '44px', background: '#ECE6DC', color: CULTURAL_TOKENS.colors.text_sec, fontSize: '14px', border: 'none' }}
        >
          ⌫ 删除
        </button>
       

        
      </div>

    </div>
  );
};