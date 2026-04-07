export type ShotOption = {
  id: string
  name: string
  description: string
  img?: string
  video?: string
}

export type Step = {
  id: string
  num: string
  name: string
  nameEm: string
  type: 'single' | 'multi'
  placeholder: string
  note: string
  options: ShotOption[]
}

export const STEPS: Step[] = [
  {
    id: 'opening',
    num: '01',
    name: '開場',
    nameEm: 'Opening',
    type: 'single',
    placeholder: '貼入 Script Generator 嘅 Opening 部分…',
    note: '揀一個開場拍法',
    options: [
      {
        id: 'o-a',
        name: '拍法 A',
        description: '誇張表情＋特效字／效果',
        img: '/shooting/opening/a.jpg',
        video: '/shooting/opening/a.mp4',
      },
      {
        id: 'o-b',
        name: '拍法 B',
        description: '誇張反應＋突出主體物',
        img: '/shooting/opening/b.jpg',
        video: '/shooting/opening/b.mp4',
      },
      {
        id: 'o-c',
        name: '拍法 C',
        description: '主持向後行，鏡頭追蹤，最後 pan 過主持露背景',
        img: '/shooting/opening/c.jpg',
        video: '/shooting/opening/c.mp4',
      },
      {
        id: 'o-d',
        name: '拍法 D',
        description: '主持企定，鏡頭微微前推，背景寬闊',
        img: '/shooting/opening/d.jpg',
        video: '/shooting/opening/d.mp4',
      },
      {
        id: 'o-e',
        name: '拍法 E',
        description: '主持手勢示意鏡頭推前，然後直接對鏡講話',
        img: '/shooting/opening/e.jpg',
        video: '/shooting/opening/e.mp4',
      },
      {
        id: 'o-f',
        name: '拍法 F',
        description: '主持行入畫面，停低，轉頭望鏡頭',
        img: '/shooting/opening/f.jpg',
        video: '/shooting/opening/f.mp4',
      },
    ],
  },
  {
    id: 'background',
    num: '02',
    name: '背景介紹',
    nameEm: 'Background',
    type: 'multi',
    placeholder: '貼入 Script Generator 嘅 Background 部分…',
    note: '可揀多個拍法組合',
    options: [
      {
        id: 'b-a',
        name: '環境鏡頭',
        description: '廣角拍攝場景全貌，建立地點感',
      },
      {
        id: 'b-b',
        name: '主持行入鏡頭',
        description: '主持由遠走近，自然介紹場景',
      },
      {
        id: 'b-c',
        name: 'Medium shot',
        description: '主持半身，講解背景資訊',
      },
      {
        id: 'b-d',
        name: 'Close-up',
        description: '特寫產品或場景細節',
      },
      {
        id: 'b-e',
        name: 'B-roll 剪接',
        description: '多角度場景片段快速剪接',
      },
      {
        id: 'b-f',
        name: '文字卡資訊',
        description: '加入字幕卡顯示重點資訊',
      },
      {
        id: 'b-g',
        name: '對話訪談',
        description: '主持與店員或路人對話',
      },
    ],
  },
  {
    id: 'transition',
    num: '03',
    name: '轉場',
    nameEm: 'Transition',
    type: 'single',
    placeholder: '貼入 Script Generator 嘅 Transition 部分…',
    note: '揀一個轉拆拍法',
    options: [
      {
        id: 't-a',
        name: '拍法 A',
        description: '鏡頭慢慢推前，主持試產品做出意想不到效果，鏡頭突然推近',
        img: '/shooting/transition/a.jpg',
        video: '/shooting/transition/a.mp4',
      },
      {
        id: 't-b',
        name: '拍法 B',
        description: '鏡頭慢慢推前，主持對鏡講對白，soundbite 位鏡頭停定',
        img: '/shooting/transition/b.jpg',
        video: '/shooting/transition/b.mp4',
      },
      {
        id: 't-c',
        name: '拍法 C',
        description: 'Extra wide shot，全程保持 handheld 手持感',
        img: '/shooting/transition/c.jpg',
        video: '/shooting/transition/c.mp4',
      },
      {
        id: 't-d',
        name: '拍法 D',
        description: '鏡頭推前，主持向後指，鏡頭穿過主持推向背景',
        img: '/shooting/transition/d.jpg',
        video: '/shooting/transition/d.mp4',
      },
      {
        id: 't-e',
        name: '拍法 E',
        description: '鏡頭慢慢推前，主持講完對白後 close-up 產品',
        img: '/shooting/transition/e.jpg',
        video: '/shooting/transition/e.mp4',
      },
      {
        id: 't-f',
        name: '拍法 F',
        description: '鏡頭固定，主持做出意想不到效果後，重播該效果位',
        img: '/shooting/transition/f.jpg',
        video: '/shooting/transition/f.mp4',
      },
    ],
  },
  {
    id: 'main',
    num: '04',
    name: '實測內容',
    nameEm: 'Main Content',
    type: 'multi',
    placeholder: '貼入 Script Generator 嘅 Main Content 部分…',
    note: '可揀多個拍法組合',
    options: [
      {
        id: 'm-a',
        name: '產品特寫',
        description: '近鏡拍攝產品質感和造型',
      },
      {
        id: 'm-b',
        name: '使用過程',
        description: '完整示範產品使用步驟',
      },
      {
        id: 'm-c',
        name: '反應鏡頭',
        description: '主持真實反應和表情',
      },
      {
        id: 'm-d',
        name: '對比展示',
        description: '前後對比或不同選項比較',
      },
      {
        id: 'm-e',
        name: '數據字幕',
        description: '加入價格、數字等資訊字幕',
      },
      {
        id: 'm-f',
        name: '多角度拍攝',
        description: '由唔同角度展示同一產品',
      },
      {
        id: 'm-g',
        name: '慢動作',
        description: '關鍵時刻慢鏡突出效果',
      },
      {
        id: 'm-h',
        name: '手持跟拍',
        description: '跟住主持移動，動感十足',
      },
      {
        id: 'm-i',
        name: '旁白配合 B-roll',
        description: '主持聲音配合場景畫面',
      },
      {
        id: 'm-j',
        name: '試食／試用特寫',
        description: '近鏡捕捉試用產品嘅一刻',
      },
    ],
  },
  {
    id: 'ending',
    num: '05',
    name: '結尾',
    nameEm: 'Ending',
    type: 'single',
    placeholder: '貼入 Script Generator 嘅 Ending 部分…',
    note: '揀一個結尾拍法',
    options: [
      {
        id: 'e-a',
        name: '拍法 A',
        description: '主持講完感想行出鏡頭，鏡頭 zoom / track 到產品',
        img: '/shooting/ending/a.jpg',
        video: '/shooting/ending/a.mp4',
      },
      {
        id: 'e-b',
        name: '拍法 B',
        description: 'Medium shot 主持講完感想，wide shot 主持行出鏡頭',
        img: '/shooting/ending/b.jpg',
        video: '/shooting/ending/b.mp4',
      },
      {
        id: 'e-c',
        name: '拍法 C',
        description: 'Wide shot 主持行前，鏡頭慢慢推後',
        img: '/shooting/ending/c.jpg',
        video: '/shooting/ending/c.mp4',
      },
      {
        id: 'e-d',
        name: '拍法 D',
        description: 'Handheld 感覺，全程跟住主持動作',
        img: '/shooting/ending/d.jpg',
        video: '/shooting/ending/d.mp4',
      },
      {
        id: 'e-e',
        name: '拍法 E',
        description: 'Medium shot 主持講完感想，鏡頭突然衝前，主持行出鏡頭',
        img: '/shooting/ending/e.jpg',
        video: '/shooting/ending/e.mp4',
      },
      {
        id: 'e-f',
        name: '拍法 F',
        description: '鏡頭跟住主持手指移動，最後回到主持樣子',
        img: '/shooting/ending/f.jpg',
        video: '/shooting/ending/f.mp4',
      },
    ],
  },
]
