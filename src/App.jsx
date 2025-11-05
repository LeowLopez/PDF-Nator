import React, { useState, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { FileUp, Download, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import FileCard from './components/FileCard';
import PageCard from './components/PageCard';
import StatsBar from './components/StatsBar';
import './styles/App.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('files');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : '';
  }, [isDarkMode]);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    setIsProcessing(true);
    
    try {
      const filesWithPages = await Promise.all(
        pdfFiles.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          const pages = [];
          for (let i = 0; i < pageCount; i++) {
            pages.push({
              id: Math.random().toString(36).substr(2, 9),
              pageNum: i + 1,
              rotation: 0,
              thumbnail: null
            });
          }
          
          return {
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            arrayBuffer,
            pages
          };
        })
      );
      
      setFiles(prev => [...prev, ...filesWithPages]);
    } catch (error) {
      alert('Erro ao processar PDFs: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const rotatePageInFile = (fileId, pageId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          pages: file.pages.map(page => 
            page.id === pageId 
              ? { ...page, rotation: (page.rotation + 90) % 360 }
              : page
          )
        };
      }
      return file;
    }));
  };

  const rotateAllPages = (fileId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          pages: file.pages.map(page => ({
            ...page,
            rotation: (page.rotation + 90) % 360
          }))
        };
      }
      return file;
    }));
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const removePage = (fileId, pageId) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        const newPages = file.pages.filter(p => p.id !== pageId);
        if (newPages.length === 0) return null;
        return { ...file, pages: newPages };
      }
      return file;
    }).filter(Boolean));
  };

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    
    setFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const processPDF = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const pdfDoc = await PDFDocument.load(file.arrayBuffer);
        
        for (let i = 0; i < file.pages.length; i++) {
          const pageData = file.pages[i];
          const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [pageData.pageNum - 1]);
          
          if (pageData.rotation !== 0) {
            copiedPage.setRotation(degrees(pageData.rotation));
          }
          
          mergedPdf.addPage(copiedPage);
        }
      }
      
      const pdfBytes = await mergedPdf.save();
      downloadPDF(pdfBytes, 'merged-document.pdf');
      
      alert('PDF processado com sucesso!');
      
    } catch (error) {
      alert('Erro ao processar PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = (pdfBytes, filename) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allPages = files.flatMap(file => 
    file.pages.map(page => ({ ...page, fileName: file.name, fileId: file.id }))
  );

  return (
    <div className="app-container">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <main className="main-content">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('files')}
            className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          >
            <FileText size={16} />
            Ver por Arquivo
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`tab ${activeTab === 'pages' ? 'active' : ''}`}
          >
            <ImageIcon size={16} />
            Ver Páginas
          </button>
        </div>

        <UploadArea onFileSelect={handleFileSelect} isProcessing={isProcessing} />

        {files.length > 0 && (
          <>
            <StatsBar files={files} />
            
            <div className="files-container">
              {activeTab === 'files' ? (
                files.map((file, index) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onRotateAll={() => rotateAllPages(file.id)}
                    onRemove={() => removeFile(file.id)}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedIndex === index}
                  />
                ))
              ) : (
                <div className="pages-grid">
                  {allPages.map((page) => (
                    <PageCard
                      key={page.id}
                      page={page}
                      onRotate={() => rotatePageInFile(page.fileId, page.id)}
                      onRemove={() => removePage(page.fileId, page.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="action-bar">
              <button
                onClick={processPDF}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                <Download size={20} />
                {isProcessing ? 'Processando...' : 'Baixar PDF Único'}
              </button>
              
              <button
                onClick={() => setFiles([])}
                className="btn btn-secondary"
              >
                <Trash2 size={20} />
                Limpar Tudo
              </button>
            </div>
          </>
        )}

        {files.length === 0 && !isProcessing && (
          <div className="empty-state">
            <div className="empty-icon">
              <FileUp size={40} color="var(--color-font4light)" />
            </div>
            <div className="empty-title">Nenhum arquivo adicionado</div>
            <div className="empty-subtitle">
              Adicione PDFs para começar a editar e organizar
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;