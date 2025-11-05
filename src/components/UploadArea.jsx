import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

const UploadArea = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef(null);
  
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={onFileSelect}
        style={{ display: 'none' }}
      />
      
      <div
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`upload-area ${isProcessing ? 'disabled' : ''}`}
      >
        <div className="upload-icon">
          <Plus size={40} color="var(--color-borderfocus)" />
        </div>
        <div className="upload-title">
          {isProcessing ? 'Processando...' : 'Adicionar PDFs'}
        </div>
        <div className="upload-subtitle">
          Clique ou arraste arquivos aqui
        </div>
      </div>
    </>
  );
};

export default UploadArea;