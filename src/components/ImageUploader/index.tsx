import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  // Define the type for the props parameter
  onChange: (file: File) => void;
}

function ImageUploader({ onChange }: ImageUploaderProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  }, [acceptedFiles, onChange]);

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </div>
    </section>
  );
}

export default ImageUploader;
