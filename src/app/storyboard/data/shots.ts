export type ShotOption = {
  id: string
  name: string
  description: string
  img?: string
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
      },
      {
        id: 'o-b',
        name: '拍法 B',
        description: '誇張反應＋突出主體物',
        img: '/shooting/opening/b.jpg',
      },
      {
        id: 'o-c',
        name: '拍法 C',
        description: '主持向後行，鏡頭追蹤，最後 pan 過主持露背景',
        img: '/shooting/opening/c.jpg',
      },
      {
        id: 'o-d',
        name: '拍法 D',
        description: '主持企定，鏡頭微微前推，背景寬闊',
        img: '/shooting/opening/d.jpg',
      },
      {
        id: 'o-e',
        name: '拍法 E',
        description: '主持手勢示意鏡頭推前，然後直接對鏡講話',
        img: '/shooting/opening/e.jpg',
      },
      {
        id: 'o-f',
        name: '拍法 F',
        description: '主持向鏡頭走前，鏡頭同步向後 track',
        img: '/shooting/opening/f.jpg',
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
    note: '可多選，通常需要包含以下元素',
    options: [
      { id: 'bg-env', name: '環境鏡頭', description: '展示拍攝地點，建立空間感' },
      { id: 'bg-walk', name: '主持行入鏡頭', description: '主持由遠至近步行入鏡' },
      { id: 'bg-mid', name: 'Medium shot', description: '腰部以上，展示主持表情同動作' },
      { id: 'bg-close', name: 'Close-up', description: '面部特寫，加強情緒' },
      { id: 'bg-custom1', name: '（可再更新）', description: '根據題材加入' },
      { id: 'bg-custom2', name: '（可再更新）', description: '根據題材加入' },
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
        description: '主持試產品後自然反應作轉拆（如「嘩！好脆！」），鏡頭緩緩推前',
        img: '/shooting/transition/a.jpg',
      },
      {
        id: 't-b',
        name: '拍法 B',
        description: '主持講完轉場對白後做誇張動作（如「唔好食我就番 table！」），鏡頭緩緩推前',
        img: '/shooting/transition/b.jpg',
      },
      {
        id: 't-c',
        name: '拍法 C',
        description: '固定 wide shot，主持從鏡頭走出去說「去試吓！」',
        img: '/shooting/transition/c.jpg',
      },
      {
        id: 't-d',
        name: '拍法 D',
        description: '主持講完對白，鏡頭推前並繞過主持作轉場',
        img: '/shooting/transition/d.jpg',
      },
      {
        id: 't-e',
        name: '拍法 E',
        description: '主持手持產品，鏡頭以 U 型弧線移動，帶動感過渡',
        img: '/shooting/transition/e.jpg',
      },
      {
        id: 't-f',
        name: '拍法 F',
        description: '無對白，前景突出產品，背景主持做誇張反應',
        img: '/shooting/transition/f.jpg',
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
    note: '視乎題材多選',
    options: [
      { id: 'm-detail', name: '產品特寫', description: 'Close-up 展示細節' },
      { id: 'm-process', name: '使用過程', description: '記錄實際操作步驟' },
      { id: 'm-react', name: '反應鏡頭', description: '主持反應 / 表情' },
      { id: 'm-compare', name: '對比鏡頭', description: 'Before / After 對照' },
      { id: 'm-custom1', name: '（依題材）', description: '根據當日內容決定' },
      { id: 'm-custom2', name: '（依題材）', description: '根據當日內容決定' },
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
        description: 'Extreme wide，主持對鏡講對白後離開，鏡頭 zoom 入產品作結',
        img: '/shooting/ending/a.jpg',
      },
      {
        id: 'e-b',
        name: '拍法 B',
        description: 'Close-up 開場，主持講完對白後向後跑走，鏡頭 hold 定',
        img: '/shooting/ending/b.jpg',
      },
      {
        id: 'e-c',
        name: '拍法 C',
        description: 'Medium shot，主持講完對白，鏡頭向後 track 拉遠',
        img: '/shooting/ending/c.jpg',
      },
      {
        id: 'e-d',
        name: '拍法 D',
        description: 'Medium shot，鏡頭跟住主持擺動，主持叫鏡頭 cut 作結',
        img: '/shooting/ending/d.jpg',
      },
      {
        id: 'e-e',
        name: '拍法 E',
        description: 'Wide shot 主持講完對白，急速切換 medium shot，主持再補一個反應作結',
        img: '/shooting/ending/e.jpg',
      },
      {
        id: 'e-f',
        name: '拍法 F',
        description: 'Medium shot，預留後期 scale down 空間，適合尷尬式／自嘲式結尾',
        img: '/shooting/ending/f.jpg',
      },
    ],
  },
]
