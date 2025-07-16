---
title: "影片"
layout: "layouts/base.njk"
permalink: "/videos/"
---

<h1>影片列表</h1>

<div class="video-list">
  {# The 'videosPaginated' collection is defined in .eleventy.js #}
  {%- for item in collections.videosPaginated -%}
    {# Robust check: Ensure item and its URL exist before rendering #}
    {%- if item and item.url and item.data and item.data.title -%}
      <div class="video-item">
        <h2>
          <a href="{{ item.url | url }}">
            {{ item.data.title }}
          </a>
        </h2>
        {%- if item.data.description -%}
          <p>{{ item.data.description }}</p>
        {%- endif -%}
      </div>
    {%- endif -%}
  {%- else -%}
    <p>目前沒有可用的影片。</p>
  {%- endfor -%}
</div>