import React from 'react';
import { FileText } from 'lucide-react';

const StatsBar = ({ files }) => {
  const totalPages = files.reduce((sum, file) => sum + file.pages.length, 0);
  const totalSize = files.reduce((sum, file) => sum + (file.file?.size || 0), 0);
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <FileText size={16} color="var(--color-borderfocus)" />
        <span className="stat-label">Arquivos:</span>
        <span className="stat-value">{files.length}</span>
      </div>
      <div className="stat-item">
        <FileText size={16} color="var(--color-borderfocus)" />
        <span className="stat-label">Páginas:</span>
        <span className="stat-value">{totalPages}</span>
      </div>
      <div className="stat-item">
        <FileText size={16} color="var(--color-borderfocus)" />
        <span className="stat-label">Tamanho:</span>
        <span className="stat-value">{sizeInMB} MB</span>
      </div>
    </div>
  );
};

export default StatsBar;