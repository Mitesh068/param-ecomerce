import { Routes, Route } from 'react-router-dom'
import MainLayout from '../Layouts/MainLayout'
import ProfilePage from '../Pages/Accounts/Account'
import OrderDetailsPage from '../Pages/Accounts/OrderDetails'
import ContactUs from '../Pages/Contact/Contactus'
import CartPage from '../Pages/Cart/Cart'
import Checkout from '../Pages/CheckOut/Checkout'
import Wishlist from '../Pages/Wishlist/Wishlist'
import Blogs from '../Pages/Blogs/Blogs'
import BlogDetails from '../Pages/Blogs/BlogDetails'
import About from '../Pages/About/About'
import Login from '../Authentication/Login'
import SignUp from '../Authentication/SignUp'
import ProductsPage from '../Pages/ProductsPage/ProductsCategoryPage'
import ProductDetails from '../Pages/ProductsPage/ProductDetails'
import Home from '../Compoonant/Home'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Pages WITHOUT navbar and footer */}
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />

      {/* Pages WITH navbar and footer */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        <Route path='/about' element={<About />} />
        <Route path='/account-setting' element={<ProfilePage />} />
        <Route path='/order-details/:id' element={<OrderDetailsPage />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blog-details/:id' element={<BlogDetails />} />

        {/* cart */}
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/wishlist' element={<Wishlist />} />
      </Route>
    </Routes>
  )
}
