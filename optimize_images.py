import os
from PIL import Image

SOURCE_DIR = r'c:\Users\lenovo\Desktop\homepage\assets\services'
TARGET_DIR = r'c:\Users\lenovo\Desktop\homepage\assets\services_optimized'

if not os.path.exists(TARGET_DIR):
    os.makedirs(TARGET_DIR)

files = os.listdir(SOURCE_DIR)
print(f"Found {len(files)} files in {SOURCE_DIR}")

for filename in files:
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        filepath = os.path.join(SOURCE_DIR, filename)
        try:
            with Image.open(filepath) as img:
                # Convert to RGB if needed (e.g. for PNGs with transparency if saving as JPG, but WebP handles RGBA)
                if img.mode in ('RGBA', 'LA') and False: 
                    # Logic for JPG would need background fill. For WebP, keep transparency.
                    pass
                
                # Resize
                max_width = 800
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as WebP
                base_name = os.path.splitext(filename)[0]
                target_filename = base_name + '.webp'
                target_path = os.path.join(TARGET_DIR, target_filename)
                
                img.save(target_path, 'WEBP', quality=80)
                
                print(f"Optimized: {filename} -> {target_filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("Optimization complete.")
