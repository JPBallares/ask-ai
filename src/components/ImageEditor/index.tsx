import React, { useRef, useState, useEffect } from 'react';

import ImageUploader from '../ImageUploader';

interface ImageEditorProps {}

const ImageEditor: React.FC<ImageEditorProps> = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let lastX: number | undefined;
  let lastY: number | undefined;

  const handleImageUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };

        img.src = image;
      }
    }
  }, [image]);

  const startErasing = () => {
    setIsErasing(true);
  };

  const stopErasing = () => {
    setIsErasing(false);
    lastX = undefined;
    lastY = undefined;
  };

  const erase = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isErasing && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (lastX !== undefined && lastY !== undefined) {
          ctx.beginPath();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 20; // Width of the eraser
          ctx.lineCap = 'round';
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        lastX = x;
        lastY = y;
      }
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Optionally, re-draw the original image
        const img = new Image();
        img.onload = () => {
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(img, 0, 0);
        };
        img.src = image as string;
      }
    }
  };

  const saveAsPNG = () => {
    if (canvasRef.current) {
      // Get the data URL of the canvas in 'image/png' format (default)
      const dataURL = canvasRef.current.toDataURL('image/png');

      // Create an anchor element and set the href to the data URL
      const link = document.createElement('a');
      link.href = dataURL;

      // Set the download attribute with a default file name
      link.download = 'edited-image.png';

      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up: remove the link from the body
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <button
        className="ml-2 bg-blue-500 text-white p-2 rounded-md"
        onClick={clearCanvas}
      >
        Clear
      </button>
      <button
        className="ml-2 bg-blue-500 text-white p-2 rounded-md"
        onClick={saveAsPNG}
      >
        Save as PNG
      </button>
      {image ? (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startErasing}
          onMouseUp={stopErasing}
          onMouseOut={stopErasing}
          onMouseMove={erase}
        />
      ) : (
        <ImageUploader onChange={handleImageUpload} />
      )}
    </div>
  );
};

export default ImageEditor;
