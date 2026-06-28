
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import BookDetails from "./pages/BookDetails";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";
import EditProfile from "./pages/EditProfile";
import Checkout from "./pages/Checkout";
import ExchangePage from "./pages/ExchangePage";
import SellerProfile from "./pages/SellerProfile";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import Notification from "./pages/Notification";
// import MyBook from "./pages/myOrders";
import SellerOrders from "./pages/SellerOrders";
import MyOrders from "./pages/MyOrders";
import MyExchangeRequests from "./pages/ExchangeRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBooks from "./pages/AdminBooks";
import AdminExchanges from "./pages/AdminExchanges";
import AdminSoldBooks from "./pages/AdminSoldBooks";
import MyExchanges from "./pages/MyExchanges";
import AdminOrders from "./pages/AdminOrders";


function App() {

  return (

    <Routes>

      {/* HOME PAGE */}

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />


      </Route>


      {/* DASHBOARD PAGES */}

      <Route element={<DashboardLayout />}>

        <Route path="/books" element={<Books />} />

        <Route path="/add-book" element={<AddBook />} />

        <Route path="/book-details/:id" element={<BookDetails />} />

        <Route path="/categories" element={<Categories />}/>

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/checkout/:id" element={<Checkout />} />

        <Route path="/exchange/:id" element={<ExchangePage />} />

        <Route path="/notification" element={<Notification />} />

        <Route path="/chats" element={<Chats />} />

        <Route path="/my-orders" element={<MyOrders />} />

        <Route path="/seller-orders" element={<SellerOrders />} />

        <Route path="/my-exchangeRequests" element={<MyExchangeRequests />}/>

        <Route path="/my-exchanges" element={<MyExchanges />}/>


      </Route>


      {/* NO NAVBAR PAGES */}

      <Route path="/profile" element={<Profile />} />
      <Route path="/seller/:id" element={<SellerProfile />} />
      <Route path="/chat/:sellerId" element={<Chat />} />
      <Route path="/admin" element={<AdminDashboard />}/>
      
      <Route path="/admin/users" element={<AdminUsers />}/>

      <Route path="/admin/books" element={<AdminBooks />}/>

      <Route path="/admin/exchanges" element={<AdminExchanges />}/>

      <Route path="/admin/sold-books" element={<AdminSoldBooks />}/>

      <Route path="/admin/orders" element={<AdminOrders />}/>

    </Routes>

  );
}

export default App;

