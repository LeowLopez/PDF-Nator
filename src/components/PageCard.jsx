import React from 'react';
import { RotateCw, Trash2 } from 'lucide-react';

const PageCard = ({ page, onRotate, onRemove }) => {
  return (
    <div className="page-card">
      <div className="page-preview-container">
        <div 
          className="page-preview"
          style={{
            transform: `rotate(${page.rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {page.thumbnail ? (
            <img 
              src={page.thumbnail} 
              alt={`Página ${page.pageNum}`}
              className="page-thumbnail"
            />
          ) : (
            <div className="page-number">{page.pageNum}</div>
          )}
        </div>
      </div>
      <div className="page-filename">{page.fileName}</div>
      
      <div className="page-controls">
        <button onClick={onRotate} className="icon-btn rotate">
          <RotateCw size={16} />
        </button>
        <button onClick={onRemove} className="icon-btn delete">
          <Trash2 size={16} />
        </button>
      </div>
      
      {page.rotation !== 0 && (
        <div className="rotation-badge">{page.rotation}°</div>
      )}
    </div>
  );
};

export default PageCard;