import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import ATSFriendlyResume from './ResumeBuilder';
import { useParams } from 'react-router-dom';

const AppStyles = `
  body {
    background-color: #f0f2f5;
  }
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  .loading-text {
    font-size: 1.5em;
    color: #555;
    margin-top: 50px;
  }
  .download-button {
    margin-top: 30px;
    padding: 12px 25px;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .download-button:hover {
    background-color: #0056b3;
  }
  .download-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function App() {
  const {id} = useParams()
  const [resume, setResume] = useState(null); // Initialize with null for loading state
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef();

  useEffect(() => {
    async function getResume() {
      try {
        const res = await axios.get(`https://bio.vizhva.com/portfolio/${id}`);
        if (res.data && res.data.data) {
          setResume(res.data.data);
        } else {
           console.error("Invalid data structure from API");
           setResume({}); // Set to empty object to avoid breaking the resume component
        }
      } catch (error) {
        console.error("Failed to fetch resume data:", error);
        setResume({}); // Set to empty object on error
      }
    }
    getResume();
  }, []);

  const downloadResumeAsPDF = () => {
    const input = resumeRef.current;
    if (!input) {
      console.error("Resume component is not available.");
      return;
    }
    
    setIsDownloading(true);

    // Store original width to restore it later
    const originalWidth = input.style.width;
    // Set a fixed width for the capture to simulate A4 size consistently
    // This prevents the PDF from scaling with the screen size.
    input.style.width = '800px';

    html2canvas(input, { 
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      // Ensure the whole component is captured, not just the visible part
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasAspectRatio = canvas.height / canvas.width;
        const imgHeight = pdfWidth * canvasAspectRatio;
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add new pages if content is longer than one page
        while (heightLeft > 0) {
          position -= pdfHeight; // Move the image "up" on the canvas for the next page
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
        
        pdf.save(`${resume.name || 'resume'}.pdf`);
      })
      .catch(error => {
        console.error("Error generating PDF:", error);
      })
      .finally(() => {
        // IMPORTANT: Restore the original width after capture is complete or has failed
        input.style.width = originalWidth;
        setIsDownloading(false);
      });
  };

  // Show a loading message until the data is fetched
  if (!resume) {
    return <div className="loading-text">Loading Resume...</div>;
  }

  return (
    <>
      <style>{AppStyles}</style>
      <div className="app-container">
        {/* Pass the ref directly to the forwarded component */}
        <ATSFriendlyResume data={resume} reference={resumeRef} />
        <button 
          className="download-button" 
          onClick={downloadResumeAsPDF} 
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download as PDF'}
        </button>
      </div>
    </>
  );
}

export default App;
