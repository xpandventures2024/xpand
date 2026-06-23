import os
from PIL import Image

ASSETS_DIR = r'c:\Users\lenovo\Desktop\xvwebosite\assets'
IMAGES = ['Our-services-new.png', 'new aout us banner .png']

for filename in IMAGES:
    filepath = os.path.join(ASSETS_DIR, filename)
    if os.path.exists(filepath):
        try:
            with Image.open(filepath) as img:
                max_width = 1920
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                base_name = os.path.splitext(filename)[0]
                target_filename = base_name + '.webp'
                target_path = os.path.join(ASSETS_DIR, target_filename)
                
                img.save(target_path, 'WEBP', quality=85)
                
                print(f"Optimized: {filename} -> {target_filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    else:
        print(f"File not found: {filepath}")

print("Optimization complete.")
