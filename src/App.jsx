import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'sonner';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Invoice, Dashboard, Landing, Documents, ProfileUser, SinglePreviewInvoicePage, EditPage, SignUp, Login, CardInvoice, SafetyPage, TransportPage, Gefahrdungsbeurteilung,EditSafetyForm, EditTrasnportPage, PreviewSignleLieferant, PreviewSingleGutschrift,PreviewSingleGefahrdungsbeurteilung } from './pages/IndexPages';



function App() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCompanies');
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
      children: [
        { index: true, element: <Landing /> },
        { path: '/invoices', element: <Invoice /> },
        { path: '/gutschrift', element:<SafetyPage />},
        { path: '/gefahrdungsbeurteilung', element:<CardInvoice />},
        { path: '/lieferant', element:<TransportPage />},
        { path: '/documents', element: <Documents /> },
        { path: '/profile', element: <ProfileUser /> },
        { path: '/singlepage/:id', element: <SinglePreviewInvoicePage /> },
        { path:'/singleLieferant/:id', element:<PreviewSignleLieferant/>},
        { path:'/singleGutschrift/:id', element:<PreviewSingleGutschrift />},
        {path: '/singleGefahrdungsbeurteilung/:id', element:<PreviewSingleGefahrdungsbeurteilung  />},
        { path: '/edit/:id', element: <EditPage companies={companies} /> },
        { path: '/gefahrdungsbeurteilung/:id', element: <Gefahrdungsbeurteilung companies={companies}/>},
        { path: '/gutschrift/:id',element:<EditSafetyForm companies={companies} />},
        { path: '/lieferant/:id', element:<EditTrasnportPage companies={companies} />}
      ],
    },
    {
      path: '/createnew',
      element: <SignUp />
    },
    {
      path: '/login',
      element: <Login />
    }
  ]);

  return (
    <>
      <Toaster /> {/* Place the Toaster component outside the RouterProvider */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
