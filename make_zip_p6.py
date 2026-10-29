import os
import zipfile

def create_project_zip():
    base_dir = r"C:\Users\tvmal\.gemini\antigravity\scratch\StudentSphere-API"
    output_zips = [
        os.path.join(base_dir, "PRN_Name_P6_Title.zip"),
        os.path.join(base_dir, "202401040083_TejasMali_P6_StudentRecordsAPI.zip"),
        r"C:\Users\tvmal\.gemini\antigravity\scratch\PRN_Name_P6_Title.zip",
        r"C:\Users\tvmal\.gemini\antigravity\scratch\202401040083_TejasMali_P6_StudentRecordsAPI.zip"
    ]

    # Patterns / directories to exclude
    exclude_dirs = {'node_modules', '.git', '__pycache__', 'coverage', '.nyc_output'}
    exclude_files = {'.env', '.env.local', '.env.production', 'Thumbs.db', '.DS_Store'}

    # Collect files
    files_to_zip = []
    for root, dirs, files in os.walk(base_dir):
        # Filter out directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f in exclude_files:
                continue
            if f.endswith('.zip'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, base_dir)
            files_to_zip.append((full_path, rel_path))

    for zip_path in output_zips:
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
            for full_path, rel_path in files_to_zip:
                z.write(full_path, arcname=rel_path)
        print(f"Created ZIP: {zip_path} ({len(files_to_zip)} files, {os.path.getsize(zip_path)} bytes)")

if __name__ == '__main__':
    create_project_zip()
