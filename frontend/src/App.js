import './App.scss';
import AddProduct from './pages/vendor/Products/AddEditProduct';
import ProductDetails from './pages/vendor/Products/ProductDetails';
import Home from './pages/vendor/Home';
import Header from './pages/Layouts/Header';
import {Route,Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
import Missing from './pages/Missing';






function App() {


  
  return (    
    <div className='App'>
      <HelmetProvider>
        <Header/>         
                       
        <Routes>
          {/*Products Routes*/} 
          <Route path='/' element={<Home/>}/>
          <Route path="product/:id" element={<ProductDetails/>}/>  
          <Route path='product/:id/edit' element={<AddProduct/>}/> 
          <Route path='product/add' element={<AddProduct/>}/> 
          {/* Missing Routes */}
          <Route path="*" element={<Missing/>}/>              
        </Routes>    
        <ToastContainer theme='dark' position={"BOTTOM_CENTER"}/>       
      </HelmetProvider>
    </div> 
            
    
 
  );
}

export default App;