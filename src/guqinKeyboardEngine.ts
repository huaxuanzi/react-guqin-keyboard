// src/guqinKeyboardEngine.ts
import { guqinSvgToCodeMap } from './guqinKeyMapping';

export class AdvancedGuqinEngine {
  constructor() {
    const count = Object.keys(guqinSvgToCodeMap).length;
    console.log(`[初始化自检] 当前加载 of 指法映射文件总数: ${count}`);
    if (count < 221) {
      console.warn(`⚠️ 警告：映射文件不足 221 个，当前仅加载了 ${count} 个！`);
    }
  }

  // 官方指法与状态槽位
  private verticalIndicator: string = ''; 
  private leftTech: string = '';          
  private leftFinger: string = '';        
  private speedMod: string = '';          
  private specialCase: string = '';        
  private vibratoSlide: string = '';      
  private chordBase: string = '';         
  private rightBase: string = '';         
  private strumTech: string = '';         
  private generalSymbol: string = '';     

  // 数字物理槽位
  private huiCore: string = '';     
  private fenPart: string = '';     
  private hasComma: boolean = false;
  private stringNum: string = '';   

  // 寄存竖线左半部分的物理快照
  private leftPartSnapshot: string = '';

  private inputHistory: Array<string> = [];

  // 💡 核心新增：供外部视图层探测当前是否处于“多声部”状态
  public get isMultiVoiceMode(): boolean {
    return this.leftPartSnapshot.length > 0;
  }

  public processInput(categoryType: string, fontCode: string): { text: string; isCommit: boolean } {
    if (fontCode === '：') {
      this.verticalIndicator = '：';
      return { text: this.assembleWord(), isCommit: false };
    }

    if (categoryType === 'TRACK_FEN' && !this.huiCore) {
      console.warn("⚠️ [输入拦截] 尚未输入任何徽位，禁止输入徽分！");
      return { text: this.assembleWord(), isCommit: false };
    }

    if (fontCode === '|') {
      this.leftPartSnapshot = this.assembleRawCurrent() + '|';
      this.reset();
      this.huiCore = '';
      this.fenPart = '';
      this.stringNum = '';
      this.hasComma = false;
      this.inputHistory = []; 
      return { text: this.assembleWord(), isCommit: false };
    }

    this.inputHistory.push(categoryType);

    switch (categoryType) {
      case 'TRACK_HUI': this.huiCore = fontCode; break;
      case 'TRACK_FEN': this.fenPart = fontCode; break;
      case 'TRACK_STRING':
        if (this.stringNum.length >= 2) {
          this.stringNum = fontCode; 
        } else {
          this.stringNum += fontCode; 
        }
        break;
      case 'TRACK_COMMA': this.hasComma = !this.hasComma; break;

      case '1a_LEFT_FINGER': this.leftFinger = fontCode; break;
      case '1b_SPEED_MODS': this.speedMod = this.speedMod.includes(fontCode) ? fontCode : (this.speedMod + fontCode); break;
      case '1c_LEFT_TECHNIQUES': this.leftTech = fontCode; break;
      case '1d_SPECIAL_CASES': this.specialCase = fontCode; break;
      case '1d_VIBRATOS_SLIDES': this.vibratoSlide = fontCode; break;
      case '2a_BASIC_RIGHT_HAND': this.rightBase = fontCode; break;
      case '2b_CHORDS': this.chordBase = fontCode; break;
      case '2c_RIGHT_STRUM_TECH': this.strumTech = fontCode; break;
      case '3_GENERAL_SYMBOLS': this.generalSymbol = fontCode; break;
    }

    return { text: this.assembleWord(), isCommit: false };
  }

  public deleteLastComponent(): string | null {
    if (!this.hasBuffer()) {
      return null;
    }

    const lastCategory = this.inputHistory.pop();
    
    if (!lastCategory && this.leftPartSnapshot) {
      this.leftPartSnapshot = '';
      return this.hasBuffer() ? this.assembleWord() : null;
    }

    if (!lastCategory) {
      return this.hasBuffer() ? this.assembleWord() : null;
    }

    switch (lastCategory) {
      case 'TRACK_HUI': this.huiCore = ''; break;
      case 'TRACK_FEN': this.fenPart = ''; break;
      case 'TRACK_STRING': this.stringNum = ''; break;
      case 'TRACK_COMMA': this.hasComma = false; break;
      case '1a_LEFT_FINGER': this.leftFinger = ''; break;
      case '1b_SPEED_MODS': this.speedMod = ''; break;
      case '1c_LEFT_TECHNIQUES': this.leftTech = ''; break;
      case '1d_SPECIAL_CASES': this.specialCase = ''; break;
      case '1d_VIBRATOS_SLIDES': this.vibratoSlide = ''; break;
      case '2a_BASIC_RIGHT_HAND': this.rightBase = ''; break;
      case '2b_CHORDS': this.chordBase = ''; break;
      case '2c_RIGHT_STRUM_TECH': this.strumTech = ''; break;
      case '3_GENERAL_SYMBOLS': this.generalSymbol = ''; break;
    }

    return this.hasBuffer() ? this.assembleWord() : null;
  }

  private assembleWord(): string {
    return `${this.leftPartSnapshot}${this.assembleRawCurrent()}`;
  }

  private assembleRawCurrent(): string {
    const commaStr = this.hasComma ? ',' : '';
    let leftSideDigits = '';
    if (this.huiCore) {
      const cleanFen = this.fenPart.replace('.', '');
      if (this.huiCore === '1') {
        leftSideDigits = cleanFen ? `1,${cleanFen}` : '1';
      } else {
        leftSideDigits = `${this.huiCore}${cleanFen}`;
      }
    } else {
      leftSideDigits = this.fenPart;
    }

    const processedString = this.stringNum ? `,${this.stringNum}` : '';

    if (this.chordBase) {
      return `${this.chordBase}${this.leftTech}${this.leftFinger}${this.specialCase}${leftSideDigits}${commaStr}${processedString}`;
    }

    if (this.verticalIndicator || this.generalSymbol || this.strumTech || this.vibratoSlide) {
      const base = `${this.verticalIndicator}${this.generalSymbol}${this.strumTech}${this.vibratoSlide}`;
      return `${base}${this.leftTech}${this.leftFinger}${this.specialCase}${leftSideDigits}${commaStr}${this.speedMod}${this.rightBase}${processedString}`;
    }

    return `${this.leftTech}${this.leftFinger}${this.specialCase}${leftSideDigits}${this.speedMod}${this.rightBase}${processedString}${commaStr}`;
  }

  public hasBuffer(): boolean {
    return !!(
      this.leftPartSnapshot || this.verticalIndicator || this.leftTech || this.leftFinger || 
      this.speedMod || this.specialCase || this.vibratoSlide || this.chordBase || 
      this.rightBase || this.strumTech || this.generalSymbol || this.huiCore || 
      this.fenPart || this.stringNum
    );
  }

  public clearCurrentBuffer(): void {
    this.huiCore = '';
    this.fenPart = '';
    this.stringNum = '';
    this.hasComma = false;
    this.leftPartSnapshot = '';
    this.inputHistory = [];
    this.reset();
  }

  public commitChar(): string {
    if (this.hasBuffer()) {
      const finalWord = this.assembleWord() + ' '; 
      this.reset();
      this.huiCore = '';
      this.fenPart = '';
      this.stringNum = '';
      this.hasComma = false;
      this.leftPartSnapshot = '';
      this.inputHistory = [];
      return finalWord;
    }
    return '';
  }

  public reset(): void {
    this.verticalIndicator = '';
    this.leftTech = '';
    this.leftFinger = '';
    this.speedMod = '';
    this.specialCase = '';
    this.vibratoSlide = '';
    this.chordBase = '';
    this.rightBase = '';
    this.strumTech = '';
    this.generalSymbol = '';
  }
}