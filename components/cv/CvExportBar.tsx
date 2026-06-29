'use client';

import React, { useState } from 'react';
import { CvData } from '@/lib/types';
import html2canvas from 'html2canvas';

interface Props {
  cvData: CvData;
}

/**
 * Temporarily disables all CSS animations on the CV wrapper
 * so that html2canvas captures the final rendered state (not mid-animation opacity:0).
 */
function disableAnimations(el: HTMLElement): string {
  const original = el.style.cssText;
  // Force all animations off and ensure full opacity
  el.style.animation = 'none';
  el.style.opacity = '1';
  el.style.transform = 'none';
  // Also disable on all children
  el.querySelectorAll<HTMLElement>('*').forEach((child) => {
    child.style.animation = 'none';
  });
  return original;
}

function restoreAnimations(el: HTMLElement, original: string) {
  el.style.cssText = original;
  el.querySelectorAll<HTMLElement>('*').forEach((child) => {
    child.style.animation = '';
  });
}

/**
 * Inline all CSS custom property values into direct styles
 * so html2canvas (which can't resolve var()) renders them correctly.
 */
function inlineCssVars(el: HTMLElement) {
  const computed = getComputedStyle(document.documentElement);
  const primary = computed.getPropertyValue('--primary').trim() || '#1a3a5c';
  const accent = computed.getPropertyValue('--accent').trim() || '#c9a84c';
  const accent2 = computed.getPropertyValue('--accent2').trim() || accent;

  // Set fallback inline vars directly on the element so html2canvas can read them
  el.style.setProperty('--primary', primary);
  el.style.setProperty('--accent', accent);
  el.style.setProperty('--accent2', accent2);
}

export default function CvExportBar({ cvData }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'png' | 'pdf' | null>(null);

  const captureCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const element = document.getElementById('cv-render-area');
    if (!element) return null;

    // 1. Inline CSS variables for html2canvas compatibility
    const wrapper = element.querySelector('.cv-wrapper, .duo-wrapper, .elegant-wrapper, .simplex-wrapper, .vivid-wrapper, .wave-wrapper') as HTMLElement | null;
    if (wrapper) {
      inlineCssVars(wrapper);
      wrapper.classList.add('no-scale'); // Disable zoom for export
    }

    // 2. Disable animations to avoid opacity:0 captures
    const originalStyle = disableAnimations(element);

    // 3. Force a repaint
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        windowWidth: 1024,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: async (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('cv-render-area');
          if (clonedEl) {
            disableAnimations(clonedEl);
            const clonedWrapper = clonedEl.querySelector('.cv-wrapper') as HTMLElement | null;
            if (clonedWrapper) inlineCssVars(clonedWrapper);
          }

          // Wait for ALL images in the cloned document to finish loading
          const images = clonedDoc.querySelectorAll('img');
          await Promise.all(
            Array.from(images).map((img) => {
              return new Promise<void>((resolve) => {
                const finish = () => resolve();
                img.onload = finish;
                img.onerror = finish; // Don't block on broken images

                const src = img.src;
                
                // If base64, just re-assign to trigger load
                if (src.startsWith('data:')) {
                  img.src = '';
                  img.src = src;
                } 
                // If it's a cross-origin external URL, proxy it!
                else if (src.startsWith('http') && !src.startsWith(window.location.origin)) {
                  img.crossOrigin = 'anonymous';
                  img.src = `/api/proxy-image?url=${encodeURIComponent(src)}`;
                } else {
                  // Already loaded or same origin
                  if (img.complete && img.naturalWidth > 0) resolve();
                }
              });
            })
          );
        },
      });
      return canvas;
    } finally {
      restoreAnimations(element, originalStyle);
      if (wrapper) wrapper.classList.remove('no-scale');
    }
  };

  const handleExportPNG = async () => {
    try {
      setIsExporting(true);
      setExportType('png');

      const canvas = await captureCanvas();
      if (!canvas) return;

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `CV_${cvData.personal?.fullname?.replace(/\s+/g, '_') || 'MonCV'}_HD.png`;
      link.click();
    } catch (error) {
      console.error('Error exporting CV as PNG', error);
      alert('Une erreur est survenue lors de l\'export PNG.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      setExportType('pdf');

      const canvas = await captureCanvas();
      if (!canvas) return;

      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV_${cvData.personal?.fullname?.replace(/\s+/g, '_') || 'MonCV'}.pdf`);
    } catch (error) {
      console.error('Error exporting CV as PDF', error);
      alert('Une erreur est survenue lors de l\'export PDF.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-4 px-6 flex flex-wrap justify-center gap-3 z-[9999] print:hidden">
      {/* PNG Export */}
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all
                   bg-gradient-to-r from-[#1a3a5c] to-[#2d5080] text-white shadow-lg
                   hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
        onClick={handleExportPNG}
        disabled={isExporting}
      >
        {isExporting && exportType === 'png' ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-image"></i>
        )}
        Télécharger HD
      </button>

      {/* PDF Export */}
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all
                   bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] text-[#1a3a5c] shadow-lg
                   hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
        onClick={handleExportPDF}
        disabled={isExporting}
      >
        {isExporting && exportType === 'pdf' ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-file-pdf"></i>
        )}
        Exporter PDF
      </button>

      {/* Print */}
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all
                   bg-white text-[#1a3a5c] border-2 border-gray-200 shadow-sm
                   hover:border-[#c9a84c] hover:shadow-md hover:scale-105 active:scale-95"
        onClick={handlePrint}
        disabled={isExporting}
      >
        <i className="fas fa-print"></i>
        Imprimer
      </button>
    </div>
  );
}
