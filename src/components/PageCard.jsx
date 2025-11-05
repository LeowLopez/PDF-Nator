import React, { useRef, useEffect } from 'react';
import { RotateCw, Trash2 } from 'lucide-react';

const PageCard = ({ page, onRotate, onRemove }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (page.thumbnail && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((page.rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      };
      img.src = page.thumbnail;
    }
  }, [page.thumbnail, page.rotation]);
  
  return (
    <div className="page-card">
      <div className="page-preview">
        {page.thumbnail ? (
          <canvas ref={canvasRef} style={{ transform: `rotate(${page.rotation}deg)` }} />
        ) : (
          <div className="page-number">{page.pageNum}</div>
        )}
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