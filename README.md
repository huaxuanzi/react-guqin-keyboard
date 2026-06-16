## 🏷️ 致谢与参考 (Acknowledgments)

本项目的指法状态机设计及核心编码映射，参考并致敬了开源社区在古琴数字化领域的优秀研究成果。特此感谢：

- **[neuralfirings](https://github.com/neuralfirings)**：感谢原作者在古琴减字谱数字化、字体映射以及指法逻辑拆解上的先驱性研究与成果沉淀，为本项目的解耦重构和高保真外挂键盘的设计提供了核心灵感与重要参考。

---
*本项目遵循 [MIT](LICENSE) 开源协议，旨在传承与发扬古琴传统文化，推进国风音乐软件的数字化基础设施建设。*

# 琴学高精度减字谱输入终端插件 (React)

这是一个专为古琴减字谱交互设计的 React 输入法插件。它采用了彻底的关注点分离（Separation of Concerns）架构，将复杂的指法、徽位、多声部排版状态机转化为高度内聚的外挂键盘组件，不依赖任何外部 CSS，真正实现即插即用。

## 🎯 核心特性

- **高保真外挂架构**：彻底剥离内置文本框，可通过外部绑定任意 `textarea` 的 Ref、value 和 onChange，全权接管文本域。
- **字级智能擦除**：区分草稿态与已上屏态，实现未确定草稿一键清除、已确定字及空格一键整字擦除，绝不留残碎代码。
- **动态多声部触控**：支持多弦 `|` 输入自动进入多声部状态，并在底部空格旁动态浮现“分割”键盘。
- **典雅古风视觉**：采用宣纸底色与乌木深褐作为主调，辅以故宫朱砂红与内敛黛紫，完美承载传统文化底蕴。
- **完全解耦闭环**：运行时动态注入字体驱动并锁死连字特性，完全不受宿主环境外部 CSS 样式的影响。

## 📦 极简使用示例

如果你在自己的本地其他项目中使用该插件，只需将 `src/` 下的核心组件拷贝过去，并将 `JianZiPu.ttf` 字体文件放入你新项目的 `public/` 目录下即可：

```tsx
import React, { useState, useRef } from 'react';
import { GuqinKeyboardComponent } from './components/GuqinKeyboardComponent';

export const MyComponent = () => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsOpen(true)}
        inputMode="none" /* ⚡️ 致命关键：拦截手机原生键盘 */
        style={{ fontFamily: "'StandaloneJianZiPu', sans-serif", fontSize: '42px' }}
      />
      <GuqinKeyboardComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={text}
        onChange={setText}
        textareaRef={textareaRef}
      />
    </div>
  );
};

