  import React from 'react';
  import axios from 'axios'; // Don't forget to import axios
  import PrintImg from '../assets/images/PrintImg.svg'
import { API_BASE_URL } from '../data/data';



  const SaveandPrintButton = ({
    companyName,
    rechnungNr,
    dateInvoice,
    ustIdNr,
    selectedCompanyDetails,
    formDataArray,
    text = "Save and Print",
    imgSrc,
    style,
    print
 
  }) => {


    const handlePrint = () => {
      const printContents = document.getElementById('previewInvoice')?.innerHTML;
      if (!printContents) {
        console.error('Element with ID "previewInvoice" not found.');
        return;
      }
    
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        console.error('Failed to open a new window. Please check your browser settings.');
        return;
      }
    
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('\n');
          } catch (e) {
            console.error('Could not access stylesheet', styleSheet);
            return '';
          }
        })
        .join('\n');
    
      newWindow.document.write(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              body { font-family: Arial, sans-serif; }
              #previewInvoice { width: 599px; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin: 10px; padding: 20px; }
              .no-print { display: none !important; }
              ${styles}
            </style>
          </head>
          <body>
            <div class="invoice">${printContents}</div>
          </body>
        </html>
      `);
    
      newWindow.document.close();
      newWindow.focus();
    
      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 100);
    };

    

    const handlePrintAndSave = async () => {
      console.log('RechnungNr:', rechnungNr);
      const invoiceData = {
        companyName,
        dateInvoice,
        ustIdNr,
        selectedCompanyDetails,
        formDataArray,
        rechnungNr,
      };
    
      // Log the data to verify structure
      console.log("Sending invoiceData:", invoiceData);
    
      try {
        const response = await axios.post(`${API_BASE_URL}/invoicesCompany`, invoiceData);
        console.log('Invoice saved:', response.data);
        handlePrint();
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
        } else {
          console.error('Error:', error.message);
        }
      }
    };
    

    return (
      <div>
        <button
          type="button"
          onClick={handlePrintAndSave}
          className='lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:bg-[#2e85c5] hover:text-white float-right border rounded-md mr-2'
          style={style}
        >
                 {imgSrc && <img src={imgSrc} alt="Print" className="mr-2"  />}
          {text}
        </button>
      </div>
    );
  };

  export default SaveandPrintButton;
