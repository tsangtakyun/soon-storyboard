# SOON 分鏡系統

## 快速開始

### 安裝依賴
```bash
npm install
npm install docx
```

### 本地開發
```bash
npm run dev
```
然後去 http://localhost:3000/storyboard

---

## 加入示例相

將所有拍法示例相放入以下路徑（**必須係 9:16 比例**）：

```
public/
  shooting/
    opening/
      a.jpg   ← 拍法 A：誇張表情＋特效字
      b.jpg   ← 拍法 B：誇張反應＋突出主體物
      c.jpg   ← 拍法 C：主持向後行
      d.jpg   ← 拍法 D：主持企定推前
      e.jpg   ← 拍法 E：手勢示意推前
      f.jpg   ← 拍法 F：主持走前 track back
    transition/
      a.jpg   ← 拍法 A：試產品自然反應
      b.jpg   ← 拍法 B：誇張動作轉場
      c.jpg   ← 拍法 C：fixed wide shot
      d.jpg   ← 拍法 D：鏡頭繞過主持
      e.jpg   ← 拍法 E：U 型弧線移動
      f.jpg   ← 拍法 F：前景產品＋誇張反應
    ending/
      a.jpg   ← 拍法 A：extreme wide zoom 產品
      b.jpg   ← 拍法 B：close-up 主持跑走
      c.jpg   ← 拍法 C：medium shot track back
      d.jpg   ← 拍法 D：主持叫 cut
      e.jpg   ← 拍法 E：wide→medium 切換
      f.jpg   ← 拍法 F：scale down 尷尬式
```

相可以用你之前 upload 嘅截圖，直接 rename 就可以。

---

## 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

或者直接係 Vercel dashboard import GitHub repo：
https://vercel.com/new → Import `tsangtakyun/idea-brainstorm`

---

## 加入 SOON System 導航

喺你現有嘅 `idea-brainstorm` 項目加一個連結去 `/storyboard` 就打通咗。

---

## 下一步：接 Supabase

```
ideas (table)
  └── id, title, url, script, created_at

shots_guide (table)
  └── id, idea_id (FK), step, shot_choice, script_text, created_at
```

呢個 schema 可以將 Idea Collection → Script Generator → 分鏡系統 完全打通。
