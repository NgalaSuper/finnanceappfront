import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import invoiceIcon from '../assets/images/invoicesIcon.svg';
import documentIcon from '../assets/images/documentsIcon.svg';
import companyIcon from '../assets/images/companyName.svg';
import dashboardIcon from '../assets/images/dashboardIcon.svg';
import gefurtIcon from '../assets/images/cardIcon.svg';
import gefahridungsbeurteilungIcon from '../assets/images/safetyIcon.svg';
import trasnportIcon from '../assets/images/transportIcon.svg';
import SignOut from './Signout';



const links = [
    {id:1, url:'/', text: 'dashboard', icon:<img src={dashboardIcon} />},
    {id:2, url:'invoices', text: 'Rechnung', icon:<img src={invoiceIcon} />},
    {id:3, url:'gutschrift', text: 'gutschrift', icon:<img src={gefurtIcon} />},
    {id:4, url:'gefahrdungsbeurteilung', text: 'Gefährdungsbeurteilung', icon:<img src={gefahridungsbeurteilungIcon} />},
    {id:5, url:'lieferant', text: 'Lieferant', icon:<img src={trasnportIcon} />},
    {id:6, url:'/documents', text: 'documents', icon:<img src={documentIcon} />},
    {id:7, url:'/profile', text: 'Mein Company', icon:<img src={companyIcon} />},

]

const SideBar = () => {
  return (
  <div className='w-52 mr-2  font-manrope border-t h-auto items-center border-borderColor flex flex-col  items-center justify-between bg-backgroundColor'>
    <div className='w-52 flex flex-col h-full items-center justify-between' style={{ boxShadow: '4px 0 12px -2px rgba(0, 0, 0, 0.1)' }}    >
    <nav className='w-full  font-manrope h-screen items-center  flex flex-col items-center bg-backgroundColor mt-2 '>
  <ul className='w-4/5 flex flex-col gap-2 '>
    {links.map((link) => {
      const { id, url, text, icon } = link;
      return (
        <li key={id} className='list-none text-[#636979] rounded-lg w-full justify-around hover:text-backgroundButton flex flex-col items-center gap-4'>
        <NavLink
          className={({ isActive }) =>
            `capitalize text-sm flex items-center  py-2 pl-2 hover:text-[#2e85c5] w-full ${
              isActive ? 'text-[#2e85c5] rounded-lg' : ''
            }`
          }
          to={url}
        >
          <span className="mr-2 fill-backgroundButton truncate">{icon}</span>
          <span className="truncate font-medium w-full hover:overflow-visible hover:whitespace-normal hover:text-ellipsis">{text}</span> {/* Apply truncate to the text */}
        </NavLink>
      </li>
      
      );
    })}
  </ul>
</nav>
<Link className='mb-8 flex flex-col items-center underline'
  to='/login'
>
  <SignOut 
    
  />
  <span>Log out</span>
  </Link>
  

</div>
</div>
  )
}

export default SideBar
