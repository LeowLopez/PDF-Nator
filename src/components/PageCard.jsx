import React from 'react';
import { RotateCw, Trash2 } from 'lucide-react';

const PageCard = ({ page, onRotate, onRemove, onDragStart, onDrop }) => {

  const colorFromId = (id) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const borderColor = colorFromId(page.fileId);

  return (
    <div
      className="page-card"
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        cursor: 'move',
        position: 'relative',
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
      }}>

      <div className="page-preview-container">
        <div
          className="page-preview"
          style={{
            transform: `rotate(${page.rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
        >
          <div className="page-num-label">
            {page.pageNum} / {page.totalPages}
          </div>

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