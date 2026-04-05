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
        video: '/shooting/background/a.mp4',
      },
      {
        id: 'b-b',
        name: '主持行入鏡頭',
        description: '主持由遠走近，自然介紹場景',
        video: '/shooting/background/b.mp4',
      },
      {
        id: 'b-c',
        name: 'Medium shot',
        description: '主持半身，講解背景資訊',
        video: '/shooting/background/c.mp4',
      },
      {
        id: 'b-d',
        name: 'Close-up',
        description: '特寫產品或場景細節',
        video: '/shooting/background/d.mp4',
      },
      {
        id: 'b-e',
        name: 'B-roll 剪接',
        description: '多角度場景片段快速剪接',
        video: '/shooting/background/e.mp4',
      },
      {
        id: 'b-f',
        name: '文字卡資訊',
        description: '加入字幕卡顯示重點資訊',
        video: '/shooting/background/f.mp4',
      },
      {
        id: 'b-g',
        name: '對話訪談',
        description: '主持與店員或路人對話',
        video: '/shooting/background/g.mp4',
      },
    ],
  },
  {
    id: 'transition',
    num: '03',
    name: '轉拆',
    nameEm: 'Transition',
    type: 'single',
    placeholder: '貼入 Script Generator 嘅 Transition 部分…',
    note: '揀一個轉拆拍法',
    options: [
      {
        id: 't-a',
        name: '拍法 A',
        description: '主持突然走近鏡頭遮黑畫面',
        img: '/shooting/transition/a.jpg',
        video: '/shooting/transition/a.mp4',
      },
      {
        id: 't-b',
        name: '拍法 B',
        description: '主持轉身走，鏡頭 pan 跟住',
        img: '/shooting/transition/b.jpg',
        video: '/shooting/transition/b.mp4',
      },
      {
        id: 't-c',
        name: '拍法 C',
        description: '快速 zoom in 入主體物',
        img: '/shooting/transition/c.jpg',
        video: '/shooting/transition/c.mp4',
      },
      {
        id: 't-d',
        name: '拍法 D',
        description: '手遮鏡頭做 wipe 轉場',
        img: '/shooting/transition/d.jpg',
        video: '/shooting/transition/d.mp4',
      },
      {
        id: 't-e',
        name: '拍法 E',
        description: '主持做動作帶出下一段',
        img: '/shooting/transition/e.jpg',
        video: '/shooting/transition/e.mp4',
      },
      {
        id: 't-f',
        name: '拍法 F',
        description: '跳切配合音效轉場',
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
        video: '/shooting/main/a.mp4',
      },
      {
        id: 'm-b',
        name: '使用過程',
        description: '完整示範產品使用步驟',
        video: '/shooting/main/b.mp4',
      },
      {
        id: 'm-c',
        name: '反應鏡頭',
        description: '主持真實反應和表情',
        video: '/shooting/main/c.mp4',
      },
      {
        id: 'm-d',
        name: '對比展示',
        description: '前後對比或不同選項比較',
        video: '/shooting/main/d.mp4',
      },
      {
        id: 'm-e',
        name: '數據字幕',
        description: '加入價格、數字等資訊字幕',
        video: '/shooting/main/e.mp4',
      },
      {
        id: 'm-f',
        name: '多角度拍攝',
        description: '由唔同角度展示同一產品',
        video: '/shooting/main/f.mp4',
      },
      {
        id: 'm-g',
        name: '慢動作',
        description: '關鍵時刻慢鏡突出效果',
        video: '/shooting/main/g.mp4',
      },
      {
        id: 'm-h',
        name: '手持跟拍',
        description: '跟住主持移動，動感十足',
        video: '/shooting/main/h.mp4',
      },
      {
        id: 'm-i',
        name: '旁白配合 B-roll',
        description: '主持聲音配合場景畫面',
        video: '/shooting/main/i.mp4',
      },
      {
        id: 'm-j',
        name: '試食／試用特寫',
        description: '近鏡捕捉試用產品嘅一刻',
        video: '/shooting/main/j.mp4',
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
        description: '主持直接對鏡 CTA，引導行動',
        img: '/shooting/ending/a.jpg',
        video: '/shooting/ending/a.mp4',
      },
      {
        id: 'e-b',
        name: '拍法 B',
        description: '主持轉身離開，畫面淡出',
        img: '/shooting/ending/b.jpg',
        video: '/shooting/ending/b.mp4',
      },
      {
        id: 'e-c',
        name: '拍法 C',
        description: '產品特寫定格做結',
        img: '/shooting/ending/c.jpg',
        video: '/shooting/ending/c.mp4',
      },
      {
        id: 'e-d',
        name: '拍法 D',
        description: '主持比手勢或動作結束',
        img: '/shooting/ending/d.jpg',
        video: '/shooting/ending/d.mp4',
      },
      {
        id: 'e-e',
        name: '拍法 E',
        description: '字幕卡總結重點，主持旁白',
        img: '/shooting/ending/e.jpg',
        video: '/shooting/ending/e.mp4',
      },
      {
        id: 'e-f',
        name: '拍法 F',
        description: '回顧精華片段快速剪接做結',
        img: '/shooting/ending/f.jpg',
        video: '/shooting/ending/f.mp4',
      },
    ],
  },
]
