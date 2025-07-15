import os
import json

def process_videos():
    """
    Reads video data from a pipe-separated text file,
    and creates individual Markdown files for each video.
    """
    source_file = 'src/_data/videos.txt'
    output_dir = 'src/generated-videos'

    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Clear existing generated files to prevent duplicates
        for item in os.listdir(output_dir):
            if item.endswith(".md"):
                os.remove(os.path.join(output_dir, item))

        # Process each line from the source file
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue

            parts = line.split('|')
            if len(parts) != 3:
                print(f"Warning: Skipping malformed line {i+1}: {line}")
                continue

            title, description, video_url = parts
            # Generate a simple and unique slug from the index
            slug = f"video-{i+1}"
            
            # Create the content for the new Markdown file
            # The permalink determines the final URL of the page
            content = f"""---
layout: layouts/video.njk
title: "{title}"
video_url: "{video_url}"
description: "{description}"
permalink: "/videos/{slug}/"
---
"""
            # Write the new Markdown file
            file_path = os.path.join(output_dir, f'{slug}.md')
            with open(file_path, 'w', encoding='utf-8') as md_file:
                md_file.write(content)
            
            print(f"Generated: {file_path}")

    except FileNotFoundError:
        print(f"Error: Source file not found at {source_file}")
    except Exception as e:
        print(f"An error occurred: {e}")


def main():
    """Main function to run the processing."""
    print("Starting video processing...")
    process_videos()
    print("Video processing finished.")

if __name__ == "__main__":
    main()