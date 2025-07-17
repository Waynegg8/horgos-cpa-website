# src/scripts/update_popular_data.py
import json
from datetime import datetime, timedelta
import os
import sys

# 假設 project-root 是當前工作目錄的父目錄
# 確保腳本能正確找到 _data 和 content-source
SCRIPT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.join(SCRIPT_DIR, '..', '..') # 跳出 scripts 和 src 目錄

DATA_DIR = os.path.join(PROJECT_ROOT, 'src', '_data')
POPULAR_DATA_PATH = os.path.join(DATA_DIR, 'popular.json')

# 定義要從 Google Analytics 查詢的內容類型
CONTENT_TYPES = [
    {'type': 'articles', 'prefix': '/article/'},
    {'type': 'videos', 'prefix': '/video/'},
    {'type': 'faqs', 'prefix': '/faq/'}, # FAQ 頁面雖然是單一頁面，但可追踪其訪問
    {'type': 'downloads', 'prefix': '/downloads/'}
]

def fetch_popular_data_from_ga():
    """
    從 Google Analytics Reporting API 獲取熱門頁面數據。
    
    這是需要您自行實現的部分。您需要：
    1. 安裝 Google Analytics Data API 用戶端程式庫 (例如 google-analytics-data)。
    2. 設置服務帳戶憑證或 OAuth 2.0 認證。
    3. 呼叫 Data API 查詢指定時間範圍內 (例如過去 30 天) 的頁面瀏覽量。
       常見的指標是 'screenPageViews'，維度是 'pagePath' 或 'pageTitle'。
       您可能需要為不同的內容類型設定不同的篩選器。
    
    返回一個列表，每個元素是一個字典，包含 'url' 和 'views'。
    例如：[{'url': '/article/tax-guide-2025/', 'views': 1200}, ...]
    """
    print("WARNING: Google Analytics API Integration not implemented.")
    print("Please implement the Google Analytics Data API integration here.")
    
    # --- 您的 Google Analytics API 整合程式碼將在此處 ---
    # 範例：
    # from google.analytics.data_v1beta import BetaAnalyticsDataClient
    # from google.analytics.data_v1beta.types import (
    #     RunReportRequest,
    #     DateRange,
    #     Dimension,
    #     Metric,
    #     OrderBy,
    # )
    #
    # client = BetaAnalyticsDataClient()
    # property_id = "YOUR_GA4_PROPERTY_ID" # 替換為您的 GA4 資源 ID
    #
    # request = RunReportRequest(
    #     property=f"properties/{property_id}",
    #     date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
    #     dimensions=[Dimension(name="pagePath")],
    #     metrics=[Metric(name="screenPageViews")],
    #     order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
    #     limit=20 # 獲取前 20 個熱門頁面
    # )
    #
    # response = client.run_report(request)
    #
    # ga_popular_items = []
    # for row in response.rows:
    #     page_path = row.dimension_values[0].value
    #     views = int(row.metric_values[0].value)
    #     ga_popular_items.append({'url': page_path, 'views': views})
    #
    # return ga_popular_items
    # --- 您的 Google Analytics API 整合程式碼結束 ---

    # 為了測試目的，這裡返回一個假數據
    print("Returning dummy popular data for demonstration.")
    dummy_data = [
        {'url': '/article/tax-guide-2025/', 'views': 1500},
        {'url': '/faq/#faq-item-tax-qa-1', 'views': 1200},
        {'url': '/downloads/', 'views': 900},
        {'url': '/video/video-tax-intro/', 'views': 800},
        {'url': '/services/registration/', 'views': 750},
    ]
    return dummy_data[:10] # 限制返回數量

def update_popular_json(ga_popular_items):
    """
    根據從 Google Analytics 獲取的數據更新 popular.json。
    """
    popular_items_formatted = []
    
    # 讀取所有文章、影片、FAQ、下載的元數據，用於匹配 URL 並獲取標題、slug 等資訊
    # 這裡的邏輯需要您根據實際的 Eleventy 集合數據結構來調整
    # 假設您有辦法讀取 process_json.py 生成的 search_index.json 或其他集合數據

    # 為了簡化，這裡將直接使用 GA 返回的 URL，並嘗試猜測類型和標題
    # 在實際應用中，您會希望將 GA 返回的 pagePath 與您的網站內容數據進行精確匹配，
    # 以獲取準確的 title, id, type 等資訊。
    # process_json.py 生成的 search_index.json 包含了這些信息，您應該利用它。

    try:
        with open(os.path.join(DATA_DIR, 'search_index.json'), 'r', encoding='utf-8') as f:
            search_index = json.load(f)
        # 將 search_index 轉換為以 URL 為鍵的字典，方便查找
        content_map = {item.get('url') or f"/{item.get('type')}/{item.get('slug')}/": item for item in search_index}
    except FileNotFoundError:
        print(f"Error: {os.path.join(DATA_DIR, 'search_index.json')} not found. Cannot enrich popular items.", file=sys.stderr)
        content_map = {}
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {os.path.join(DATA_DIR, 'search_index.json')}.", file=sys.stderr)
        content_map = {}


    for ga_item in ga_popular_items:
        url = ga_item['url']
        views = ga_item['views']
        
        # 嘗試從 content_map 中查找對應的內容資訊
        matched_content = content_map.get(url)
        if not matched_content:
            # 處理帶有 #hash 的 FAQ URL
            if url.startswith('/faq/#faq-item-'):
                base_faq_url = '/faq/'
                if base_faq_url in content_map:
                    matched_content = content_map[base_faq_url] # 匹配到 FAQ 總覽頁面
                    # 嘗試從原始 FAQ 數據中查找具體問題的標題
                    faq_id = url.split('#faq-item-')[1]
                    try:
                        with open(os.path.join(PROJECT_ROOT, 'src', '_data', 'faqs.json'), 'r', encoding='utf-8') as f:
                            all_faqs_data = json.load(f)
                        # 查找具體的 FAQ 項目
                        found_faq_item = None
                        for category_data in all_faqs_data.get('faqs', []):
                            for item in category_data.get('items', []):
                                if item.get('id') == faq_id:
                                    found_faq_item = item
                                    break
                            if found_faq_item:
                                break
                        if found_faq_item:
                            matched_content = {
                                'id': faq_id,
                                'title': found_faq_item.get('question', f"FAQ: {faq_id}"),
                                'url': url,
                                'type': 'faqs'
                            }
                    except Exception as e:
                        print(f"Warning: Could not get detailed FAQ info for {faq_id}: {e}", file=sys.stderr)
            elif url.startswith('/'): # 嘗試匹配其他服務頁面等
                # For example, if /services/tax/ maps to a service item
                service_slug = url.strip('/').split('/')[-1]
                for service_type in ['tax', 'audit', 'consulting', 'registration']:
                    if service_slug == service_type:
                        matched_content = {'id': service_slug, 'title': f"服務: {service_slug}", 'url': url, 'type': 'services'}
                        break


        item_title = matched_content.get('title', url) if matched_content else url
        item_type = matched_content.get('type', 'unknown') if matched_content else 'unknown'
        item_id = matched_content.get('id', os.path.basename(url.strip('/'))) if matched_content else os.path.basename(url.strip('/'))

        popular_items_formatted.append({
            'id': item_id,
            'title': item_title,
            'url': url,
            'type': item_type,
            'views': views # 這裡保留 views 數值，方便排序和調試
        })

    # 再次根據 views 排序，確保熱門度最高
    popular_items_formatted.sort(key=lambda x: x['views'], reverse=True)
    
    # 限制只保留前 N 個最熱門的項目
    final_popular_items = popular_items_formatted[:10] # 藍圖中未明確指定數量，這裡設為前10個

    output_data = {"items": final_popular_items}

    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(POPULAR_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully updated {POPULAR_DATA_PATH}")
    except Exception as e:
        print(f"Error writing to {POPULAR_DATA_PATH}: {e}", file=sys.stderr)

if __name__ == "__main__":
    print(f"Running update_popular_data.py at {datetime.now()}")
    
    try:
        # 1. 從 Google Analytics 獲取原始熱門數據 (您需要實現這部分)
        ga_data = fetch_popular_data_from_ga()

        if ga_data:
            # 2. 格式化並更新 popular.json
            update_popular_json(ga_data)
        else:
            print("No data fetched from Google Analytics. popular.json not updated.", file=sys.stderr)

    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)