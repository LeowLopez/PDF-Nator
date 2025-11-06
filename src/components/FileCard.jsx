import React from 'react';
import { GripVertical, RotateCw, Trash2 } from 'lucide-react';

const FileCard = ({ file, onRotateAll, onRemove, onDragStart, onDragOver, onDragEnd, isDragging }) => {
  const firstPage = file.pages[0];
  const hasRotation = file.pages.some(page => page.rotation !== 0);
  const commonRotation = file.pages.every(page => page.rotation === file.pages[0].rotation) 
    ? file.pages[0].rotation 
    : null;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`file-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="file-header">
        <div className="file-info">
          <GripVertical size={20} color="var(--color-font4light)" />
          
          <div className="file-thumbnail-wrapper">
            {firstPage?.thumbnail ? (
              <>
                <img 
                  src={firstPage.thumbnail} 
                  alt="Capa"
                  className="file-thumbnail"
                  style={{
                    transform: `rotate(${firstPage.rotation}deg)`
                  }}
                />
                {firstPage.rotation !== 0 && (
                  <div className="file-rotation-badge">{firstPage.rotation}°</div>
                )}
              </>
            ) : (
              <div className="file-icon">PDF</div>
            )}
          </div>
          
          <div className="file-details">
            <div className="file-name">{file.name}</div>
            <div className="file-meta">
              {file.pages.length} página(s)
              {commonRotation !== null && commonRotation !== 0 && (
                <span className="rotation-indicator"> • Rotação: {commonRotation}°</span>
              )}
            </div>
          </div>
        </div>
        <div className="file-actions">
          <button onClick={onRotateAll} className="icon-btn rotate" title="Girar todas">
            <RotateCw size={18} />
          </button>
          <button onClick={onRemove} className="icon-btn delete" title="Remover">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;