#!/usr/bin/env python3
"""
Script para generar miniaturas PNG de certificados PDF.
Requiere: pip install pdf2image pillow
"""

import os
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image

# Definir directorios
CERT_DIR = Path(__file__).parent / 'assets'
DEGREE_CERTS = CERT_DIR / 'degree_certificates'
LINKEDIN_CERTS = CERT_DIR / 'linkedin_certificates'
THUMBNAIL_DIR = CERT_DIR / 'thumbnails'

# Crear directorio de miniaturas si no existe
THUMBNAIL_DIR.mkdir(exist_ok=True)

def generate_thumbnail(pdf_path, output_dir, max_width=250, max_height=180):
    """Genera una miniatura PNG a partir de un PDF."""
    try:
        # Convertir primera página de PDF a imagen
        images = convert_from_path(str(pdf_path), first_page=1, last_page=1, dpi=150)
        if not images:
            print(f"  ✗ No se pudo convertir: {pdf_path.name}")
            return False
        
        image = images[0]
        
        # Redimensionar manteniendo proporción
        image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Crear imagen con fondo blanco
        final_image = Image.new('RGB', (max_width, max_height), 'white')
        offset = ((max_width - image.width) // 2, (max_height - image.height) // 2)
        final_image.paste(image, offset)
        
        # Guardar
        output_path = output_dir / f"{pdf_path.stem}.png"
        final_image.save(str(output_path), 'PNG', quality=85)
        print(f"  ✓ {pdf_path.name} → {output_path.name}")
        return True
    except Exception as e:
        print(f"  ✗ Error con {pdf_path.name}: {str(e)}")
        return False

def main():
    print("Generando miniaturas de certificados...\n")
    
    total = 0
    success = 0
    
    # Procesar certificados de título
    if DEGREE_CERTS.exists():
        print("📋 Certificados de Título:")
        for pdf_file in sorted(DEGREE_CERTS.glob('*.pdf')):
            total += 1
            if generate_thumbnail(pdf_file, THUMBNAIL_DIR):
                success += 1
    
    # Procesar certificados de LinkedIn
    if LINKEDIN_CERTS.exists():
        print("\n🔗 Certificados de LinkedIn:")
        for pdf_file in sorted(LINKEDIN_CERTS.glob('*.pdf')):
            total += 1
            if generate_thumbnail(pdf_file, THUMBNAIL_DIR):
                success += 1
    
    print(f"\n✅ Resultado: {success}/{total} miniaturas generadas")
    print(f"📁 Miniaturas guardadas en: {THUMBNAIL_DIR}")

if __name__ == '__main__':
    main()
