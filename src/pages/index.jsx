import Layout from "./Layout.jsx";

import Home from "./Home";

import Checkout from "./Checkout";

import AdminDashboard from "./AdminDashboard";

import AdminOrders from "./AdminOrders";

import CustomerPortal from "./CustomerPortal";

import AdminCustomers from "./AdminCustomers";

import AdminSocialInbox from "./AdminSocialInbox";

import AdminOrderDetail from "./AdminOrderDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Checkout: Checkout,
    
    AdminDashboard: AdminDashboard,
    
    AdminOrders: AdminOrders,
    
    CustomerPortal: CustomerPortal,
    
    AdminCustomers: AdminCustomers,
    
    AdminSocialInbox: AdminSocialInbox,
    
    AdminOrderDetail: AdminOrderDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminOrders" element={<AdminOrders />} />
                
                <Route path="/CustomerPortal" element={<CustomerPortal />} />
                
                <Route path="/AdminCustomers" element={<AdminCustomers />} />
                
                <Route path="/AdminSocialInbox" element={<AdminSocialInbox />} />
                
                <Route path="/AdminOrderDetail" element={<AdminOrderDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}