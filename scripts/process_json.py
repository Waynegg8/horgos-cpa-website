import json
import os
import glob
import re

# --- 常數定義 (方便統一管理路徑) ---
SOURCE_CONTENT_DIR = 'src/content-source'
GENERATED_CONTENT_DIR = 'src/generated-content'
DATA_DIR = 'src/_data'
SITE_OUTPUT_DIR = '_site' # Eleventy 的預設輸出目錄

def process_articles():
    print("🚀 開始處理文章...")
    articles_source_dir = os.path.join(SOURCE_CONTENT_DIR, 'content-json')
    output_dir = os.path.join(GENERATED_CONTENT_DIR, 'articles')
    os.makedirs(output_dir, exist_ok=True)
    total_articles_processed = 0
    for series_folder in os.listdir(articles_source_dir):
        series_folder_path = os.path.join(articles_source_dir, series_folder)
        if not os.path.isdir(series_folder_path): continue
        series_map = {}
        series_json_path = os.path.join(series_folder_path, 'series.json')
        if os.path.exists(series_json_path):
            with open(series_json_path, 'r', encoding='utf-8') as f:
                series_data = json.load(f)
            if isinstance(series_data, list):
                series_map = {item.get('id'): item.get('name') for item in series_data if 'id' in item and 'name' in item}
            elif isinstance(series_data, dict):
                if 'series_id' in series_data and 'name' in series_data:
                    series_map = {series_data['series_id']: series_data['name']}
        processed_dir = os.path.join(series_folder_path, 'processed')
        if not os.path.isdir(processed_dir): continue
        for json_path in glob.glob(os.path.join(processed_dir, '*.json')):
            with open(json_path, 'r', encoding='utf-8') as f:
                article_meta = json.load(f)
            slug = article_meta.get('slug')
            if not slug: continue
            series_name = series_map.get(article_meta.get('series_id'), '')
            front_matter = {
                # === 修改點: 使用完整的、不會出錯的路徑 ===
                'layout': 'layouts/article.njk',
                'permalink': f"/articles/{slug}/index.html",
                'title': article_meta.get('title', ''),
                'description': article_meta.get('description', ''),
                'date': article_meta.get('date', ''),
                'tags': article_meta.get('tags', []),
                'series_id': article_meta.get('series_id', ''),
                'series_name': series_name,
                'image': article_meta.get('image', '')
            }
            md_content = ""
            md_path = os.path.join(processed_dir, f"{slug}.md")
            if os.path.exists(md_path):
                with open(md_path, 'r', encoding='utf-8') as f:
                    md_content = f.read()
            output_file_path = os.path.join(output_dir, f"{slug}.md")
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write('---\n')
                for key, value in front_matter.items():
                    f.write(f"{key}: {json.dumps(value, ensure_ascii=False)}\n")
                f.write('---\n\n')
                f.write(md_content)
            total_articles_processed += 1
    print(f"✅ 成功處理 {total_articles_processed} 篇文章，檔案已生成於 {output_dir}")

def process_videos():
    print("🚀 開始處理影片...")
    input_path = os.path.join(DATA_DIR, 'videos.txt')
    output_dir = os.path.join(GENERATED_CONTENT_DIR, 'videos')
    os.makedirs(output_dir, exist_ok=True)
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return
    total_videos_processed = 0
    for line in lines:
        parts = line.split('|')
        if len(parts) < 3: continue
        title = parts[0]
        embed_url = parts[2]
        video_id = embed_url.split('/')[-1]
        if not re.match(r'^[a-zA-Z0-9_-]+$', video_id): continue
        front_matter = {
            # === 修改點: 使用完整的、不會出錯的路徑 ===
            'layout': 'layouts/video.njk',
            'permalink': f"/videos/{video_id}/index.html",
            'video_id': video_id,
            'title': title,
            'description': parts[1] if len(parts) > 1 else "",
            'date': parts[3] if len(parts) > 3 else "",
            'tags': [tag.strip() for tag in parts[4].split(',')] if len(parts) > 4 and parts[4] else ['video'],
            'image': parts[5] if len(parts) > 5 else ""
        }
        file_path = os.path.join(output_dir, f"{video_id}.md")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('---\n')
            for key, value in front_matter.items():
                f.write(f"{key}: {json.dumps(value, ensure_ascii=False)}\n")
            f.write('---\n')
        total_videos_processed += 1
    print(f"✅ 成功處理 {total_videos_processed} 部影片，檔案已生成於 {output_dir}")

# ... (process_faqs 和 process_downloads 函數維持不變) ...
def process_faqs():
    print("🚀 開始處理常見問答...")
    faq_source_dir = os.path.join(SOURCE_CONTENT_DIR, 'faqs')
    output_path = os.path.join(DATA_DIR, 'faqs.json')
    if not os.path.isdir(faq_source_dir): return
    all_faqs = []
    for file_path in glob.glob(os.path.join(faq_source_dir, '*.json')):
        with open(file_path, 'r', encoding='utf-8') as f:
            all_faqs.append(json.load(f))
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_faqs, f, ensure_ascii=False, indent=2)
    print(f"✅ 成功整合 {len(all_faqs)} 個 FAQ 分類，檔案已生成於 {output_path}")

def process_downloads():
    print("🚀 開始處理下載項目...")
    input_path = os.path.join(DATA_DIR, 'downloads.txt')
    output_path = os.path.join(DATA_DIR, 'processed_downloads.json')
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f if line.strip()]
    except FileNotFoundError: return
    downloads_list = []
    for line in lines:
        parts = line.split(',', 2)
        if len(parts) == 3:
            downloads_list.append({"title": parts[0].strip(), "description": parts[1].strip(), "path": parts[2].strip()})
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(downloads_list, f, ensure_ascii=False, indent=2)
    print(f"✅ 成功處理 {len(downloads_list)} 個下載項目，檔案已生成於 {output_path}")

if __name__ == '__main__':
    process_articles()
    process_faqs()
    process_downloads()
    process_videos()
    print("\n🎉 所有自動化任務執行完畢！")