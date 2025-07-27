#!/usr/bin/env python3
"""
Script para padronizar o tamanho das imagens de acessórios baseado em ha-5.png
"""

import os
from PIL import Image
import numpy as np

def find_content_bounds(image):
    """Encontra os limites do conteúdo não-transparente na imagem"""
    # Converte para array numpy
    img_array = np.array(image)
    
    # Se a imagem tem canal alpha, usa ele para detectar transparência
    if img_array.shape[2] == 4:
        alpha = img_array[:, :, 3]
        # Encontra pixels não-transparentes
        non_transparent = alpha > 0
    else:
        # Se não tem alpha, considera todos os pixels como conteúdo
        non_transparent = np.ones(img_array.shape[:2], dtype=bool)
    
    # Encontra os limites
    rows = np.any(non_transparent, axis=1)
    cols = np.any(non_transparent, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        return None  # Imagem completamente transparente
    
    top = np.where(rows)[0][0]
    bottom = np.where(rows)[0][-1]
    left = np.where(cols)[0][0]
    right = np.where(cols)[0][-1]
    
    return (left, top, right, bottom)

def crop_to_content(image):
    """Corta a imagem para conter apenas o conteúdo não-transparente"""
    bounds = find_content_bounds(image)
    if bounds is None:
        return image  # Retorna a imagem original se não encontrar conteúdo
    
    left, top, right, bottom = bounds
    return image.crop((left, top, right + 1, bottom + 1))

def resize_to_match_reference(image, reference_size):
    """Redimensiona a imagem para ter o mesmo tamanho da referência"""
    return image.resize(reference_size, Image.Resampling.LANCZOS)

def process_images():
    """Processa todas as imagens na pasta img/extra/"""
    
    # Caminho para as imagens
    img_dir = "public/img/extra"
    
    # Verifica se a pasta existe
    if not os.path.exists(img_dir):
        print(f"Erro: Pasta {img_dir} não encontrada!")
        return
    
    # Abre a imagem de referência (ha-5.png)
    reference_path = os.path.join(img_dir, "ha-5.png")
    if not os.path.exists(reference_path):
        print(f"Erro: Imagem de referência {reference_path} não encontrada!")
        return
    
    print("Analisando imagem de referência ha-5.png...")
    reference_img = Image.open(reference_path)
    reference_cropped = crop_to_content(reference_img)
    reference_size = reference_cropped.size
    
    print(f"Tamanho de referência: {reference_size}")
    
    # Lista todas as imagens na pasta
    image_files = [f for f in os.listdir(img_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # Remove ha-5.png da lista (já que é a referência)
    if "ha-5.png" in image_files:
        image_files.remove("ha-5.png")
    
    print(f"Processando {len(image_files)} imagens...")
    
    processed_count = 0
    for filename in image_files:
        file_path = os.path.join(img_dir, filename)
        
        try:
            # Abre a imagem
            img = Image.open(file_path)
            
            # Corta para o conteúdo
            cropped = crop_to_content(img)
            
            # Redimensiona para o tamanho da referência
            resized = resize_to_match_reference(cropped, reference_size)
            
            # Cria uma nova imagem com fundo transparente do tamanho da referência
            final_img = Image.new('RGBA', reference_size, (0, 0, 0, 0))
            
            # Centraliza a imagem redimensionada
            paste_x = (reference_size[0] - resized.size[0]) // 2
            paste_y = (reference_size[1] - resized.size[1]) // 2
            final_img.paste(resized, (paste_x, paste_y), resized)
            
            # Salva a imagem processada
            final_img.save(file_path, 'PNG')
            
            print(f"✓ Processado: {filename}")
            processed_count += 1
            
        except Exception as e:
            print(f"✗ Erro ao processar {filename}: {e}")
    
    print(f"\nProcessamento concluído! {processed_count} imagens foram atualizadas.")
    print(f"Todas as imagens agora têm o mesmo tamanho que ha-5.png: {reference_size}")

if __name__ == "__main__":
    print("=== Script de Padronização de Imagens ===")
    print("Baseado em ha-5.png")
    print()
    
    # Confirmação do usuário
    response = input("Este script irá modificar todas as imagens em public/img/extra/. Continuar? (s/n): ")
    if response.lower() in ['s', 'sim', 'y', 'yes']:
        process_images()
    else:
        print("Operação cancelada.") 