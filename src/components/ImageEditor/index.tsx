import React, { useRef, useState, useEffect, useContext } from 'react';

import ImageUploader from '../ImageUploader';
import RangeSlider from '../RangeSlider';
import { ChatContext } from '@/contexts/ChatContext';
import { dataType64toFile, getBase64 } from '@/utils/images';

interface ImageEditorProps {}

const ImageEditor: React.FC<ImageEditorProps> = () => {
  const { chat } = useContext(ChatContext);
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

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
          ctx.lineWidth = brushSize; // Width of the eraser
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

  const clearCanvas = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Optionally, re-draw the original image
        const img = new Image();
        img.src = image as string;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(img, 0, 0);
      }
    }
  };

  const saveAsPNG = async () => {
    if (canvasRef.current) {
      // Get the data URL of the canvas in 'image/png' format (default)
      const mask = canvasRef.current.toDataURL('image/png');
      const maskFile = dataType64toFile(getBase64(mask), 'mask');

      await clearCanvas();
      const image = canvasRef.current.toDataURL('image/png');
      const imageFile = dataType64toFile(getBase64(image), 'image');

      const generated = await chat?.editImage(
        imageFile,
        maskFile,
        prompt,
        '512x512',
      );

      // Create an anchor element and set the href to the data URL
      const link = document.createElement('a');
      link.href = generated as string;

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
    <div className="p-1">
      <div className="flex my-2 justify-end">
        <div className="flex flex-1 flex-col p-2">
          <RangeSlider
            id="brush-size"
            label="brush size"
            value={brushSize}
            min={0}
            max={500}
            step={1}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              setBrushSize(parseInt(e.target.value));
            }}
          />
        </div>
        <button
          className="mr-2 bg-blue-500 text-white p-2 rounded-md"
          onClick={clearCanvas}
        >
          Clear
        </button>
        <button
          className="mr-2 bg-blue-500 text-white p-2 rounded-md"
          onClick={saveAsPNG}
        >
          Save as PNG
        </button>
      </div>
      <div className="flex mb-2">
        <textarea
          ref={textareaRef}
          rows={1} // Start with one visible row
          placeholder="A cat smiling"
          value={prompt}
          onChange={handleInputChange}
          className="flex-1 border rounded-md p-2 resize-none dark:text-slate-300 max-h-32 bg-slate-900 border-slate-600"
        />
      </div>
      {image ? (
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
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
