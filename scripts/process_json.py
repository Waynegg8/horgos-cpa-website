import json
import os
from datetime import datetime

def process_articles():
    """
    Reads content-json articles and converts them to Eleventy-ready Markdown.
    讀取內容 JSON 文章並將其轉換為 Eleventy 可用的 Markdown。
    """
    content_dirs = [
        'content-json/entrepreneurship-tax',
        'content-json/company-setup',
        'content-json/standalone'
    ]
    
    print("Starting article processing...")
    all_content_for_search = []

    for content_dir in content_dirs:
        source_file_name = 'series.json' if 'standalone' not in content_dir else 'articles.json'
        json_file_path = os.path.join(content_dir, source_file_name)
        
        if not os.path.exists(json_file_path):
            continue

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                items = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading {json_file_path}: {e}")
            continue
        
        for item in items:
            try:
                category_slug = content_dir.split('/')[-1].replace('\\', '/')
                output_dir = os.path.join('src', 'generated-articles', category_slug)
                
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                    
                md_path = os.path.join(output_dir, f"{item['slug']}.md")
                
                print(f"Generating article '{md_path}'...")
                
                permalink_str = f"/articles/{category_slug}/{item['slug']}/"
                structured_data_block = f'''  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{item['title']}",
    "description": "{item['description']}",
    "image": "{item['image']}"
  }}'''
                
                md_content = f'''---
layout: layouts/article.njk
title: "{item['title']}"
description: "{item['description']}"
slug: {item['slug']}
permalink: {permalink_str}
category: {category_slug}
series_progress: "{item.get('series_progress', '')}"
image: {item['image']}
keywords: {json.dumps(item['keywords'], ensure_ascii=False)}
structuredData: |
{structured_data_block}
relatedFaqs: {json.dumps(item.get('related_faqs', []), ensure_ascii=False)}
---
{item['content']}
'''
                with open(md_path, 'w', encoding='utf-8') as f:
                    f.write(md_content)

                # Add to all_content_for_search
                all_content_for_search.append({
                    "title": item['title'],
                    "description": item['description'],
                    "url": permalink_str,
                    "image": item['image'],
                    "date": item.get('publish_date', ''),
                    "category": "articles",
                    "tags": item['keywords']
                })
            except Exception as e:
                print(f"Error processing article {item.get('slug', 'unknown')}: {e}")
                continue
    print("Article processing finished.")
    return all_content_for_search

def process_videos():
    """
    Reads videos.txt and converts each entry into a separate Eleventy-ready Markdown file.
    讀取 videos.txt 並將每個條目轉換為單獨的 Eleventy 可用的 Markdown 檔案。
    """
    video_file_path = os.path.join('src', '_data', 'videos.txt')
    output_dir = os.path.join('src', 'generated-videos')
    
    # Ensure the output directory exists
    # 確保輸出目錄存在
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Clear existing generated video files to avoid duplicates
    # 清除現有的生成影片檔案以避免重複
    for f in os.listdir(output_dir):
        os.remove(os.path.join(output_dir, f))

    print("Starting video processing for individual pages...")
    videos_for_search = []
    
    try:
        with open(video_file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                line = line.strip()
                if not line:
                    continue
                
                # Expected format: [source: X] Title|Description|VideoURL
                # 預期格式: [來源: X] 標題|描述|影片URL
                parts = line.split('|')
                if len(parts) >= 3:
                    source_ref_and_title_part = parts[0].strip()
                    title_start = source_ref_and_title_part.find(']') + 1
                    title = source_ref_and_title_part[title_start:].strip()
                    description = parts[1].strip()
                    video_url = parts[2].strip()
                    
                    slug = f"video{i+1}" # Simple slug generation
                    permalink_str = f"/videos/{slug}/"
                    
                    md_content = f'''---
layout: layouts/video.njk
title: "{title}"
description: "{description}"
url: "{video_url}"
slug: {slug}
permalink: {permalink_str}
image: /assets/images/videos/default-video-thumbnail.webp # Placeholder, update as needed if specific images are available
structuredData: |
  {{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "{title}",
    "description": "{description}",
    "thumbnailUrl": "/assets/images/videos/default-video-thumbnail.webp"
  }}
---
'''
                    md_path = os.path.join(output_dir, f"{slug}.md")
                    with open(md_path, 'w', encoding='utf-8') as out_f:
                        out_f.write(md_content)

                    # Add to all_content_for_search (each individual video page)
                    # 添加到 all_content_for_search (每個獨立的影片頁面)
                    videos_for_search.append({
                        "title": title,
                        "description": description,
                        "url": permalink_str,
                        "image": "/assets/images/videos/default-video-thumbnail.webp",
                        "date": "", # Not available in current format
                        "category": "videos",
                        "tags": [] # Not available in current format
                    })
    except Exception as e:
        print(f"Error processing videos.txt: {e}")
    
    print("Video processing finished.")
    return videos_for_search

def process_downloads():
    """
    Reads downloads.txt and converts them into a JSON data file for the single downloads list page.
    No individual Markdown files are generated for downloads.
    讀取 downloads.txt 並將其轉換為 JSON 數據檔案，供單一下載列表頁面使用。
    不為下載生成單獨的 Markdown 檔案。
    """
    download_file_path = os.path.join('src', '_data', 'downloads.txt')

    if not os.path.exists(download_file_path):
        return [], [] # Return empty lists if file not found

    print("Starting download processing for data...")
    downloads_data = [] # This will be written to processed_downloads.json
    downloads_for_search = [] # This will be added to all-content.json

    try:
        with open(download_file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                line = line.strip()
                if not line:
                    continue
                
                # Expected format: [source: X] filename.ext|Title|Description|Tag1,Tag2|YYYY-MM-DD|Clicks
                # 預期格式: [來源: X] 檔案名稱.副檔名|標題|描述|標籤1,標籤2|YYYY-MM-DD|點擊數
                parts = line.split('|')
                if len(parts) >= 6:
                    source_and_filename_part = parts[0].strip()
                    first_bracket_end = source_and_filename_part.find(']')
                    
                    filename = source_and_filename_part[first_bracket_end + 1:].strip()
                    title = parts[1].strip()
                    description = parts[2].strip()
                    date = parts[4].strip()
                    tags = [t.strip() for t in parts[5].split(',')]
                    
                    # Data for the downloads list page (accessed via `data.processed_downloads`)
                    downloads_data.append({
                        "title": title,
                        "description": description,
                        "filename": filename,
                        "url": f"/assets/downloads/{filename}", # Direct URL to the asset
                        "tags": tags,
                        "publish_date": date
                    })

                    # Data for the search index (points to the main downloads list page)
                    # 搜尋索引的數據（指向主下載列表頁面）
                    downloads_for_search.append({
                        "title": title,
                        "description": description,
                        "url": "/downloads/", # Point to the main downloads list page for search results
                        "image": "", # No image provided in the data
                        "date": date,
                        "category": "downloads",
                        "tags": tags
                    })
    except Exception as e:
        print(f"Error processing downloads.txt for data: {e}")

    # Write processed download data to a JSON file in src/_data
    # 將處理後的下載數據寫入 src/_data 中的 JSON 檔案
    output_data_path = os.path.join('src', '_data', 'processed_downloads.json')
    try:
        with open(output_data_path, 'w', encoding='utf-8') as f:
            json.dump(downloads_data, f, ensure_ascii=False, indent=2)
        print(f"Processed download data written to {output_data_path}")
    except Exception as e:
        print(f"Error writing processed_downloads.json: {e}")

    print("Download processing finished.")
    return downloads_for_search

def process_faqs_for_search():
    """
    Reads FAQ JSON files and consolidates them into a single JSON for search.
    讀取 FAQ JSON 檔案並將其整合到一個單一的 JSON 中供搜尋使用。
    """
    faq_dir = os.path.join('faqs')
    all_faqs = []

    if not os.path.exists(faq_dir):
        return []

    print("Starting FAQ processing for search...")
    try:
        categories = os.listdir(faq_dir)
        for category in categories:
            category_path = os.path.join(faq_dir, category)
            if os.path.isdir(category_path):
                faq_file = os.path.join(category_path, 'faq.json')
                if os.path.exists(faq_file):
                    with open(faq_file, 'r', encoding='utf-8') as f:
                        faq_data = json.load(f)
                        for item in faq_data:
                            # Use question as a simple anchor ID for now
                            # 目前使用問題作為簡單的錨點 ID
                            anchor_id = item['question'].replace(' ', '-').replace('?', '').replace('？', '')
                            all_faqs.append({
                                "title": item['question'], # Use question as title for search
                                "description": item['answer'], # Use answer as description
                                "url": f"/faq/#{anchor_id}", # Simple anchor for FAQ
                                "category": "faqs",
                                "tags": item.get('tags', []),
                                "date": "", # No date for FAQs
                                "image": "" # No image for FAQs
                            })
    except Exception as e:
        print(f"Error processing FAQ files: {e}")
    print("FAQ processing for search finished.")
    return all_faqs

def main():
    all_content_for_search = process_articles()
    
    # process_videos now returns only search data
    # process_videos 現在只返回搜尋數據
    videos_search_data = process_videos()
    all_content_for_search.extend(videos_search_data)

    # process_downloads now returns only search data
    # process_downloads 現在只返回搜尋數據
    downloads_search_data = process_downloads()
    all_content_for_search.extend(downloads_search_data)
    
    faqs_for_search = process_faqs_for_search()

    # Consolidate all search data and write to a single JSON file in _site
    # 合併所有搜尋資料並寫入 _site 中的單一 JSON 檔案
    output_site_dir = os.path.join('_site', 'content-json')
    if not os.path.exists(output_site_dir):
        os.makedirs(output_site_dir)
    
    final_search_data = all_content_for_search + faqs_for_search

    all_content_json_path = os.path.join(output_site_dir, 'all-content.json')
    try:
        with open(all_content_json_path, 'w', encoding='utf-8') as f:
            json.dump(final_search_data, f, ensure_ascii=False, indent=2)
        print(f"Consolidated search data written to {all_content_json_path}")
    except Exception as e:
        print(f"Error writing all-content.json: {e}")


if __name__ == '__main__':
    main()
