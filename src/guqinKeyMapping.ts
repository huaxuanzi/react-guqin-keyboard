// guqinKeyMapping.ts

export type OfficialCategory =
  | '1a_LEFT_FINGER'       // 名s, 中d, 食f, 大v, 跪x
  | '1b_SPEED_MODS'        // 绰/, 急>, 注\ (支持复合如/\)
  | '1c_LEFT_TECHNIQUES'   // 掩V, 掐起c, 泛音fy
  | '1d_SPECIAL_CASES'     // 散0, 就jiu
  | '1d_VIBRATOS_SLIDES'   // :tui, :jin, :fu4, :zhuang, :yin, :nao, :changyin等
  | '2a_BASIC_RIGHT_HAND'  // pī n, tuō h, mǒ j, tiǎo u, gōu k, tì i, dǎ l, zhāi o, 抹挑ju, 勾剔ki, 打摘lo, 历U
  | '2b_CHORDS'            // 撮C, 大撮DC, 反撮FC, 拨B, 剌L, 拨剌BL, 双弹TT, 三弹TTT
  | '2c_RIGHT_STRUM_TECH'  // :lun, :banlun, :dayuan, :gun, :fu2, :baisuo, :duansuo, :changsuo, :diejuan, :yuanlou
  | '3_GENERAL_SYMBOLS'    // :fan, :zhi, :qi3, :fanqi, :fanzhi, :ru, :wai, :ban, :shang, :xia, :zhi4, :daxi, :shaoxi, :*
  | 'CORE_DIGIT';          // 彻底还原：全套正徽、点/半/小数、弦号、逗号、竖线分隔符

export interface GuqinKeyMapping {
  chineseName: string;
  fontCode: string;
  type: OfficialCategory;
}

export const guqinSvgToCodeMap: Record<string, GuqinKeyMapping> = {
  // ==== 1a: Left Hand Finger ====
  "md_ming.svg": { chineseName: "名", fontCode: "s", type: '1a_LEFT_FINGER' },
  "md_zhong.svg": { chineseName: "中", fontCode: "d", type: '1a_LEFT_FINGER' },
  "md_shi.svg": { chineseName: "食", fontCode: "f", type: '1a_LEFT_FINGER' },
  "md_da.svg": { chineseName: "大", fontCode: "v", type: '1a_LEFT_FINGER' },
  "md_gui.svg": { chineseName: "跪", fontCode: "x", type: '1a_LEFT_FINGER' },

  // ==== 1b: Speed mods & mods related to 韵 production ====
  "mod_chuo.svg": { chineseName: "绰", fontCode: "/", type: '1b_SPEED_MODS' },
  "mod_ji.svg": { chineseName: "急", fontCode: ">", type: '1b_SPEED_MODS' },
  "mod_zhu.svg": { chineseName: "注", fontCode: "\\", type: '1b_SPEED_MODS' },

  // ==== 1c: Left Hand Techniques (根据物理文件完美纠偏) ====
  "lg_yan.svg": { chineseName: "掩", fontCode: "V", type: '1c_LEFT_TECHNIQUES' },
  "md_yan.svg": { chineseName: "掩", fontCode: "V", type: '1c_LEFT_TECHNIQUES' }, 
  "lg_qiaqi.svg": { chineseName: "掐起", fontCode: "c", type: '1c_LEFT_TECHNIQUES' },
  "mod_fanyin.svg": { chineseName: "泛音", fontCode: "fy", type: '1c_LEFT_TECHNIQUES' },

  // ==== 1d: Special Cases (对齐本地 md_ 简写物理文件) ====
  "md_san.svg": { chineseName: "散", fontCode: "0", type: '1d_SPECIAL_CASES' },
  "md_san2.svg": { chineseName: "散音", fontCode: "0", type: '1d_SPECIAL_CASES' },
  "md_jiu.svg": { chineseName: "就", fontCode: "jiu", type: '1d_SPECIAL_CASES' },
  "md_jiu2.svg": { chineseName: "就位", fontCode: "jiu", type: '1d_SPECIAL_CASES' },
  "md_dai.svg": { chineseName: "带起", fontCode: ":daiqi", type: '1d_SPECIAL_CASES' },
  "md_dui.svg": { chineseName: "对起", fontCode: ":duiqi", type: '1d_SPECIAL_CASES' },
  "md_zhua.svg": { chineseName: "抓起", fontCode: ":zhuaqi", type: '1d_SPECIAL_CASES' },
  "md_pie.svg": { chineseName: "撇起", fontCode: ":pieqi", type: '1d_SPECIAL_CASES' },

  // ==== 1d: Left Hand Vibratos and Slides ====
  "md_tui.svg": { chineseName: "退", fontCode: ":tui", type: '1d_VIBRATOS_SLIDES' },
  "md_jin.svg": { chineseName: "进", fontCode: ":jin", type: '1d_VIBRATOS_SLIDES' },
  "md_fu.svg": { chineseName: "復", fontCode: ":復", type: '1d_VIBRATOS_SLIDES' },
  "md_zhuang.svg": { chineseName: "撞", fontCode: ":zhuang", type: '1d_VIBRATOS_SLIDES' },
  "md_yin.svg": { chineseName: "吟", fontCode: ":yin", type: '1d_VIBRATOS_SLIDES' },
  "md_nao.svg": { chineseName: "猱", fontCode: ":nao", type: '1d_VIBRATOS_SLIDES' },
  "md_chang.svg": { chineseName: "长吟", fontCode: ":长吟", type: '1d_VIBRATOS_SLIDES' },
  "md_xi4.svg": { chineseName: "细吟", fontCode: ":xiyin", type: '1d_VIBRATOS_SLIDES' },
  "md_ding.svg": { chineseName: "定吟", fontCode: ":dingyin", type: '1d_VIBRATOS_SLIDES' },
  "md_xiao.svg": { chineseName: "小吟", fontCode: ":xiaoyin", type: '1d_VIBRATOS_SLIDES' },
  "md_fenkai.svg": { chineseName: "分开", fontCode: ":fenkai", type: '1d_VIBRATOS_SLIDES' },
  "md_yinghe.svg": { chineseName: "应合", fontCode: ":yinghe", type: '1d_VIBRATOS_SLIDES' },

  // ==== 2a: Basic Right Hand ====
  "lg_pi.svg": { chineseName: "劈", fontCode: "n", type: '2a_BASIC_RIGHT_HAND' },
  "lg_tuo.svg": { chineseName: "托", fontCode: "h", type: '2a_BASIC_RIGHT_HAND' },
  "lg_mo.svg": { chineseName: "抹", fontCode: "j", type: '2a_BASIC_RIGHT_HAND' },
  "lg_tiao.svg": { chineseName: "挑", fontCode: "u", type: '2a_BASIC_RIGHT_HAND' },
  "lg_gou.svg": { chineseName: "勾", fontCode: "k", type: '2a_BASIC_RIGHT_HAND' },
  "lg_ti.svg": { chineseName: "剔", fontCode: "i", type: '2a_BASIC_RIGHT_HAND' },
  "lg_da.svg": { chineseName: "打", fontCode: "l", type: '2a_BASIC_RIGHT_HAND' },
  "lg_zhai.svg": { chineseName: "摘", fontCode: "o", type: '2a_BASIC_RIGHT_HAND' },
  "lg_motiao.svg": { chineseName: "抹挑", fontCode: "ju", type: '2a_BASIC_RIGHT_HAND' },
  "lg_gouti.svg": { chineseName: "勾剔", fontCode: "ki", type: '2a_BASIC_RIGHT_HAND' },
  "lg_dazhai.svg": { chineseName: "打摘", fontCode: "lo", type: '2a_BASIC_RIGHT_HAND' },
  "lg_li.svg": { chineseName: "历", fontCode: "U", type: '2a_BASIC_RIGHT_HAND' },

  // ==== 2b: Chords ====
  "xl_cuo.svg": { chineseName: "撮", fontCode: "C", type: '2b_CHORDS' },
  "xl_dacuo.svg": { chineseName: "大撮", fontCode: "DC", type: '2b_CHORDS' },
  "xl_fancuo.svg": { chineseName: "反撮", fontCode: "FC", type: '2b_CHORDS' },
  "xl_bo.svg": { chineseName: "拨", fontCode: "B", type: '2b_CHORDS' },
  "xl_la.svg": { chineseName: "剌", fontCode: "L", type: '2b_CHORDS' },
  "xl_bola.svg": { chineseName: "拨剌", fontCode: "BL", type: '2b_CHORDS' },
  "xl_tt.svg": { chineseName: "双弹", fontCode: "TT", type: '2b_CHORDS' },
  "xl_ttt.svg": { chineseName: "三弹", fontCode: "TTT", type: '2b_CHORDS' },

  // ==== 2c: Other Right Hand Strum Techniques ====
  "md_lun.svg": { chineseName: "轮", fontCode: ":lun", type: '2c_RIGHT_STRUM_TECH' },
  "lg_lun.svg": { chineseName: "轮音", fontCode: ":lun", type: '2c_RIGHT_STRUM_TECH' },
  "md_banlun.svg": { chineseName: "半轮", fontCode: ":banlun", type: '2c_RIGHT_STRUM_TECH' },
  "lg_banlun.svg": { chineseName: "半轮音", fontCode: ":banlun", type: '2c_RIGHT_STRUM_TECH' },
  "md_dayuan.svg": { chineseName: "打圆", fontCode: ":dayuan", type: '2c_RIGHT_STRUM_TECH' },
  "md_gun.svg": { chineseName: "滚", fontCode: ":gun", type: '2c_RIGHT_STRUM_TECH' },
  "xxx_fu.svg": { chineseName: "弗", fontCode: ":fu", type: '3_GENERAL_SYMBOLS' },
  "md_bai.svg": { chineseName: "背璅", fontCode: ":beisuo", type: '2c_RIGHT_STRUM_TECH' },
  "md_duan.svg": { chineseName: "短璅", fontCode: ":duansuo", type: '2c_RIGHT_STRUM_TECH' },
  "md_suo.svg": { chineseName: "璅", fontCode: ":suo", type: '2c_RIGHT_STRUM_TECH' },
  "md_diejuan.svg": { chineseName: "叠蠲", fontCode: ":diejuan", type: '2c_RIGHT_STRUM_TECH' },
  "md_yuanlou.svg": { chineseName: "圆搂", fontCode: ":圆搂", type: '2c_RIGHT_STRUM_TECH' },

  // ==== 3: General Symbols ====
  "md_fan.svg": { chineseName: "泛", fontCode: ":fan", type: '3_GENERAL_SYMBOLS' },
  "md_zhi.svg": { chineseName: "止", fontCode: ":zhi", type: '3_GENERAL_SYMBOLS' },
  "md_qi.svg": { chineseName: "起", fontCode: ":qi", type: '3_GENERAL_SYMBOLS' },
  "md_ru.svg": { chineseName: "如", fontCode: ":ru", type: '3_GENERAL_SYMBOLS' },
  "md_wai.svg": { chineseName: "外", fontCode: "13+", type: '3_GENERAL_SYMBOLS' }, 
  "md_ban.svg": { chineseName: "半", fontCode: "ban", type: '3_GENERAL_SYMBOLS' },  
  "md_shang.svg": { chineseName: "上", fontCode: ":shang", type: '3_GENERAL_SYMBOLS' },
  "md_xia.svg": { chineseName: "下", fontCode: ":xia", type: '3_GENERAL_SYMBOLS' },
  "md_zhi4.svg": { chineseName: "至", fontCode: ":zhi4", type: '3_GENERAL_SYMBOLS' },
  "md_xi.svg": { chineseName: "息", fontCode: ":xi", type: '3_GENERAL_SYMBOLS' },
  "md_shao.svg": { chineseName: "少", fontCode: ":shao", type: '3_GENERAL_SYMBOLS' },
  "md_placeholder.svg": { chineseName: "*", fontCode: ":*", type: '3_GENERAL_SYMBOLS' },

  // ==========================================================
  // 💡 自动化注入核心徽位
  // ==========================================================
  ...(() => {
    const patch: Record<string, GuqinKeyMapping> = {};
    for (let h = 1; h <= 13; h++) {
      patch[`md_${h}.svg`] = { chineseName: `${h}徽`, fontCode: `${h}`, type: 'CORE_DIGIT' };
      patch[`md_${h}.blank.svg`] = { chineseName: `${h}徽空`, fontCode: `${h}`, type: 'CORE_DIGIT' };
      for (let f = 1; f <= 9; f++) {
        patch[`md_${h}.${f}.svg`] = { 
          chineseName: `${h}徽${f}分`, 
          fontCode: `${h}.${f}`, 
          type: 'CORE_DIGIT' 
        };
      }
    }
    patch["md_quanfu.svg"] = { chineseName: "全復", fontCode: ":quanfu", type: '1d_VIBRATOS_SLIDES' };
    patch["md_banfu.svg"] = { chineseName: "半復", fontCode: ":banfu", type: '1d_VIBRATOS_SLIDES' };
    return patch;
  })()
};

export const officialDigits = [
  { label: "1", code: "1" }, { label: "2", code: "2" }, { label: "3", code: "3" },
  { label: "4", code: "4" }, { label: "5", code: "5" }, { label: "6", code: "6" },
  { label: "7", code: "7" }, { label: "8", code: "8" }, { label: "9", code: "9" },
  { label: "10", code: "10" }, { label: "11", code: "11" }, { label: "12", code: "12" },
  { label: "13", code: "13" },
  { label: "点 (.)", code: "." }, 
  { label: "半 (.5)", code: ".5" }, 
  { label: "外 (13+)", code: "13+" },
  { label: "散 (0)", code: "0" },
  { label: "就 (jiu)", code: "jiu" },
  { label: "分隔 (，)", code: "," },
  { label: "声部 (|)", code: "|" },
  { label: "衔接 (+)", code: "+" }
];

// 💡 专为移动端置底弦号设计的中文名与编码映射
export const mobileStringButtons = [
  { label: "一", code: "1" },
  { label: "二", code: "2" },
  { label: "三", code: "3" },
  { label: "四", code: "4" },
  { label: "五", code: "5" },
  { label: "六", code: "6" },
  { label: "七", code: "7" },
  { label: "多弦", code: "|" }
];