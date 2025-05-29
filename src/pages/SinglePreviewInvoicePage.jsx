import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PreviewInvoiceSinglePage from '../components/PreviewInvoiceSinglePage';

const SinglePreviewInvoicePage = () => {


  return (
    <div>
   
        <PreviewInvoiceSinglePage/>
    
      
    </div>
  );
};

export default SinglePreviewInvoicePage;
