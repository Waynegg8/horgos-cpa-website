import json
import os
from datetime import datetime

# --- NEW: Get the absolute path of the project's root directory ---
# This makes the script work regardless of where it's called from.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def process_articles():
    print("Starting article processing...")
    # --- Use absolute paths based on the project root ---
    source_dir = os.path.join(PROJECT_ROOT, 'content-json', 'articles')
    target_dir = os.path.join(PROJECT_ROOT, 'src', 'generated-articles')

    if not os.path.exists(source_dir):
        print(f"Warning: Article source directory not found at '{source_dir}'. Skipping.")
        return

    for category in os.listdir(source_dir):
        category_path = os.path.join(source_dir, category)
        if os.path.isdir(category_path):
            for filename in os.listdir(category_path):
                if filename.endswith('.json'):
                    filepath = os.path.join(category_path, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)

                    md_filename_base = os.path.splitext(filename)[0]
                    target_category_dir = os.path.join(target_dir, category)
                    ensure_dir(target_category_dir)
                    md_filepath = os.path.join(target_category_dir, f"{md_filename_base}.md")

                    print(f"Generating article '{md_filepath}'...")
                    with open(md_filepath, 'w', encoding='utf-8') as f:
                        f.write('---\n')
                        f.write(f"title: \"{data['title']}\"\n")
                        f.write(f"description: \"{data['description']}\"\n")
                        f.write(f"date: {data.get('date', datetime.now().strftime('%Y-%m-%d'))}\n")
                        f.write(f"tags: {json.dumps(data.get('tags', []))}\n")
                        f.write(f"category: \"{data.get('category', 'general')}\"\n")
                        f.write(f"layout: layouts/article.njk\n")
                        f.write(f"permalink: /articles/{category}/{md_filename_base}/\n")
                        f.write('---\n\n')
                        f.write(data['content'])
    print("Article processing finished.")


def process_videos():
    print("Starting video processing for individual pages...")
    source_file = os.path.join(PROJECT_ROOT, 'src', '_data', 'videos.txt')
    target_dir = os.path.join(PROJECT_ROOT, 'src', 'generated-videos')
    ensure_dir(target_dir)

    if not os.path.exists(source_file):
        print(f"Warning: Videos source file not found at '{source_file}'. Skipping.")
        return

    with open(source_file, 'r', encoding='utf-8') as f:
        videos = f.read().strip().split('\n\n')

    for video_data in videos:
        lines = video_data.strip().split('\n')
        video_info = {k.strip(): v.strip() for k, v in [line.split(':', 1) for line in lines]}

        video_id = video_info.get('id')
        if not video_id:
            continue

        md_filepath = os.path.join(target_dir, f"{video_id}.md")
        with open(md_filepath, 'w', encoding='utf-8') as f:
            f.write('---\n')
            f.write(f"title: \"{video_info.get('title', '')}\"\n")
            f.write(f"description: \"{video_info.get('description', '')}\"\n")
            f.write(f"date: {video_info.get('date', datetime.now().strftime('%Y-%m-%d'))}\n")
            f.write(f"video_url: \"{video_info.get('url', '')}\"\n")
            f.write(f"tags: {json.dumps(video_info.get('tags', '[]').split(','))}\n")
            f.write("layout: layouts/video.njk\n")
            f.write(f"permalink: /videos/{video_id}/\n")
            f.write('---\n\n')
            f.write(video_info.get('content', ''))
    print("Video processing finished.")


def process_downloads():
    print("Starting download processing for data...")
    source_dir = os.path.join(PROJECT_ROOT, 'content-json', 'downloads')
    target_file = os.path.join(PROJECT_ROOT, 'src', '_data', 'processed_downloads.json')

    downloads = []
    if os.path.exists(source_dir):
        for filename in os.listdir(source_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(source_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    downloads.append(data)

    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(downloads, f, ensure_ascii=False, indent=2)
    print(f"Processed download data written to {target_file}")
    print("Download processing finished.")

def consolidate_search_data():
    print("Consolidating all content for search...")
    all_content = []

    # Process articles from generated markdown
    articles_dir = os.path.join(PROJECT_ROOT, 'src', 'generated-articles')
    if os.path.exists(articles_dir):
        for root, _, files in os.walk(articles_dir):
            for file in files:
                if file.endswith('.md'):
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        content = f.read()
                        parts = content.split('---')
                        if len(parts) >= 3:
                            front_matter = parts[1]
                            body = '---'.join(parts[2:])
                            title = ""
                            url = ""
                            for line in front_matter.strip().split('\n'):
                                if line.startswith('title:'):
                                    title = line.split(':', 1)[1].strip().strip('"')
                                if line.startswith('permalink:'):
                                    url = line.split(':', 1)[1].strip()
                            if title and url:
                                all_content.append({'title': title, 'content': body.strip(), 'url': url})

    # Process FAQs from original json
    faq_file = os.path.join(PROJECT_ROOT, 'faqs', 'faq.json')
    if os.path.exists(faq_file):
        with open(faq_file, 'r', encoding='utf-8') as f:
            faqs = json.load(f)
            for faq in faqs:
                all_content.append({
                    'title': faq.get('question'),
                    'content': faq.get('answer'),
                    'url': f"/faq/#{faq.get('id')}"
                })

    target_file = os.path.join(PROJECT_ROOT, '_site', 'content-json', 'all-content.json')
    ensure_dir(os.path.dirname(target_file))
    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(all_content, f, ensure_ascii=False, indent=2)
    print(f"Consolidated search data written to {target_file}")


if __name__ == '__main__':
    process_articles()
    process_videos()
    process_downloads()
    # The consolidate_search_data function now handles both articles and FAQs
    consolidate_search_data()