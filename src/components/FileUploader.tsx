import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { uploadFile } from '../services/storage';

interface FileUploaderProps {
  bucketName: string;
  onUploadComplete: (url: string) => void;
  label: string;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  bucketName,
  onUploadComplete,
  label,
  accept = 'image/*',
  maxSizeMB = 2
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndUpload = async (file: File) => {
    setError(null);
    setFileName(file.name);

    // 1. Validate File Size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return;
    }

    // 2. Validate File Type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const matchesType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (accept !== '*' && !matchesType) {
      setError(`Invalid file type. Only ${accept} files are allowed.`);
      return;
    }

    // 3. Upload File
    setLoading(true);
    try {
      const publicUrl = await uploadFile(bucketName, file);
      onUploadComplete(publicUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload file to storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
        {label}
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-background hover:bg-muted ${
          isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

        {loading ? (
          <div className="space-y-2 py-2">
            <Icon icon="line-md:loading-twotone-loop" className="text-3xl text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Uploading: <strong>{fileName}</strong></p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Icon icon="lucide:cloud-upload" className="text-3xl text-muted-foreground mx-auto" />
            <p className="text-xs text-foreground font-medium">
              Drag and drop or <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              Max file size {maxSizeMB}MB · Types: {accept}
            </p>
          </div>
        )}
      </div>

      {/* Success filename / Error message */}
      {!loading && fileName && !error && (
        <div className="flex items-center gap-1 mt-2 text-[11px] text-primary">
          <Icon icon="lucide:check-circle" className="text-sm" />
          <span>Uploaded: <strong className="font-sans">{fileName}</strong></span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-1 mt-2 text-[11px] text-red-500">
          <Icon icon="lucide:alert-circle" className="text-sm" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
