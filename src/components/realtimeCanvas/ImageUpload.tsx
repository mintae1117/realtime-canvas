import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCanvasStore } from "../../store/canvasStore";
import { type CanvasImage } from "../../types/canvas";

interface ImageUploadProps {
  onImageAdded?: (image: CanvasImage) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageAdded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImage, currentUser } = useCanvasStore();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      // Option 1: Upload to Supabase Storage (requires storage bucket setup)
      // const fileExt = file.name.split('.').pop();
      // const fileName = `${uuidv4()}.${fileExt}`;
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from('canvas-images')
      //   .upload(fileName, file);

      // if (uploadError) throw uploadError;

      // const { data: { publicUrl } } = supabase.storage
      //   .from('canvas-images')
      //   .getPublicUrl(fileName);

      // Option 2: Use local Data URL (for demo purposes)
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;

        // Load image to get dimensions
        const img = new Image();
        img.onload = () => {
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          // Scale down if too large
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          const newImage: CanvasImage = {
            id: uuidv4(),
            url,
            x: 50,
            y: 50,
            width,
            height,
            rotation: 0,
            userId: currentUser?.id || "anonymous",
            timestamp: Date.now(),
          };

          addImage(newImage);
          if (onImageAdded) {
            onImageAdded(newImage);
          }
        };
        img.src = url;
      };
      reader.readAsDataURL(file);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        이미지 선택
      </button>
    </>
  );
};
