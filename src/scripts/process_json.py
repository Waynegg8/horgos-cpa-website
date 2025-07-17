import os
import json
import glob
import random
from datetime import datetime
import yaml

# --- (路徑定義與其他函式維持不變) ---
SOURCE_FAQ_PATH = 'src/_data/content-source/faqs/*.json'
SOURCE_ARTICLE_PATH = 'src/_data/content-source/articles/*.json'
SOURCE_VIDEO_PATH = 'src/_data/content-source/videos/*.json'
SOURCE_DOWNLOAD_PATH = 'src/_data/downloads.json'
OUTPUT_FAQ_DATA_PATH = 'src/_data/faqs.json'
OUTPUT_ARTICLES_DATA_PATH = 'src/_data/articles.json'
OUTPUT_VIDEOS_DATA_PATH = 'src/_data/videos.json'
OUTPUT_SEARCH_INDEX_PATH = 'src/search_index.json'

def process_and_generate_data():
    print("Processing all content sources...")
    today = datetime.now().date()
    
    # 讀取所有原始檔
    all_raw_articles = [json.load(open(f, 'r', encoding='utf-8')) for f in glob.glob(SOURCE_ARTICLE_PATH)]
    all_raw_videos = [json.load(open(f, 'r', encoding='utf-8')) for f in glob.glob(SOURCE_VIDEO_PATH)]
    
    # 過濾出已發布的文章並按日期排序
    published_articles = sorted(
        [art for art in all_raw_articles if datetime.strptime(art['date'], '%Y-%m-%d').date() <= today],
        key=lambda x: x['date'],
        reverse=True
    )

    final_articles_data = []
    for i, current_article in enumerate(published_articles):
        prev_article_data = None
        next_article_data = None

        # 策略一：系列文章優先
        if current_article.get('strategy') == 'article_series':
            series_title = current_article.get('series_title')
            same_series_articles = sorted([art for art in all_raw_articles if art.get('series_title') == series_title], key=lambda x: x.get('episode', 0))
            try:
                current_series_index = [a['id'] for a in same_series_articles].index(current_article['id'])
                if current_series_index > 0:
                    prev_article_data = same_series_articles[current_series_index - 1]
                if current_series_index + 1 < len(same_series_articles):
                    next_article_data = same_series_articles[current_series_index + 1]
            except ValueError:
                pass
        
        # 策略二：如果不是系列，或系列的前後篇不存在，使用時間排序作為後備
        if prev_article_data is None:
            if i + 1 < len(published_articles):
                prev_article_data = published_articles[i + 1]
        if next_article_data is None:
            if i > 0:
                next_article_data = published_articles[i - 1]
        
        # 策略三：如果按時間排序也找不到下一篇 (代表是最新的一篇)，則按標籤隨機推薦
        if next_article_data is None and current_article.get('strategy') != 'article_series': # 只對非系列文章的最後一篇做隨機推薦
            current_tags = set(current_article.get('tags', []))
            if current_tags:
                related_articles = [art for art in published_articles if art['id'] != current_article['id'] and current_tags.intersection(set(art.get('tags', [])))]
                if related_articles:
                    next_article_data = random.choice(related_articles)
        
        # 策略四：最終後備，確保按鈕永遠存在
        if prev_article_data is None: prev_article_data = current_article
        if next_article_data is None: next_article_data = current_article

        article_data = current_article.copy()
        article_data['prev_article'] = {'title': prev_article_data['title'], 'url': f"/{prev_article_data['slug']}/"}
        article_data['next_article'] = {'title': next_article_data['title'], 'url': f"/{next_article_data['slug']}/"}
        
        final_articles_data.append(article_data)

    with open(OUTPUT_ARTICLES_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_articles_data, f, ensure_ascii=False, indent=2)
    print(f"  - Generated final articles data with full navigation logic at {OUTPUT_ARTICLES_DATA_PATH}")
    
    # 處理其他資料 (影片、下載、FAQ、搜尋索引)
    # (為求簡潔，此處省略，但實際腳本應包含它們)
    published_videos = sorted([vid for vid in all_raw_videos if datetime.strptime(vid['date'], '%Y-%m-%d').date() <= today], key=lambda x: x['date'], reverse=True)
    with open(OUTPUT_VIDEOS_DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(published_videos, f, ensure_ascii=False, indent=2)
    print(f"  - Generated final videos data at {OUTPUT_VIDEOS_DATA_PATH}")
    
    # ... (此處應有 process_faqs 和 process_downloads 的邏輯) ...
    # ... (此處應有 generate_search_index 的邏輯) ...


if __name__ == '__main__':
    process_and_generate_data()