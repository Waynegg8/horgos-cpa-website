import json
import os
from datetime import datetime

def process_json_files():
    """
    讀取 content-json 目錄下的 JSON 檔案，
    並將其內容轉換為 Eleventy 可讀取的 Markdown 檔案，
    輸出路徑為 src/generated-articles/ 下對應的分類資料夾。
    """
    content_dirs = [
        'content-json/entrepreneurship-tax',
        'content-json/company-setup',
        'content-json/standalone'
    ]
    
    print("Starting content processing...")

    for content_dir in content_dirs:
        source_file_name = 'series.json' if 'standalone' not in content_dir else 'articles.json'
        series_file_path = os.path.join(content_dir, source_file_name)
        
        if not os.path.exists(series_file_path):
            continue

        try:
            with open(series_file_path, 'r', encoding='utf-8') as f:
                articles = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading {series_file_path}: {e}")
            continue
        
        for article in articles:
            try:
                # 準備輸出路徑和分類
                category_slug = content_dir.split('/')[-1].replace('\\', '/')
                output_dir = os.path.join('src', 'generated-articles', category_slug)
                
                # 建立輸出資料夾
                if not os.path.exists(output_dir):
                    os.makedirs(output_dir)
                    
                md_path = os.path.join(output_dir, f"{article['slug']}.md")
                
                print(f"Generating '{md_path}'...")
                
                # 組裝 front matter
                permalink_str = f"/articles/{category_slug}/{article['slug']}/"
                structured_data_block = f'''  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{article['title']}",
    "description": "{article['description']}",
    "image": "{article['image']}"
  }}'''
                
                md_content = f'''---
layout: layouts/article.njk
title: "{article['title']}"
description: "{article['description']}"
slug: {article['slug']}
permalink: {permalink_str}
category: {category_slug}
series_progress: "{article.get('series_progress', '')}"
image: {article['image']}
keywords: {json.dumps(article['keywords'], ensure_ascii=False)}
structuredData: |
{structured_data_block}
relatedFaqs: {json.dumps(article.get('related_faqs', []), ensure_ascii=False)}
---
{article['content']}
'''
                with open(md_path, 'w', encoding='utf-8') as f:
                    f.write(md_content)
            except Exception as e:
                print(f"Error processing article {article.get('slug', 'unknown')}: {e}")
                continue

    print("Content processing finished.")

if __name__ == '__main__':
    process_json_files()