import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Loader';
import { toast } from 'react-toastify';
import { clearProductsError, getProducts } from '../../../actions/productsActions';
import AddButton from '../../../components/Buttons/AddButton';
import FavoriteButton from '../../../components/Buttons/FavoriteButton';
import { Image } from 'react-bootstrap';
import deleteIcon from "../../../assets/delete-icon.svg";
import editIcon from "../../../assets/edit-icon.svg";
import starIcon from "../../../assets/star.svg";
import starredIcon from "../../../assets/starred.svg";
import Pagination from 'react-js-pagination';
import SearchBar from '../../../components/SearchBar';
import { addFavorite, getFavorites, removeFavorite } from '../../../actions/favoritesAction';
import { clearError } from '../../../slices/favoritesSlice';
import { deleteProduct, getProduct } from '../../../actions/productActions';
import DeleteModal from '../../../components/DeleteModal';
import RightDirectionIcon from '../../../assets/rightDirection.svg'
import MetaData from '../../Layouts/MetaData';
import { useNavigate } from 'react-router-dom';
import { clearError as productClear } from "../../../slices/productSlice";


const ProductList = () => {
  const dispatch = useDispatch();
  const { products,count,resPerPage,totalCount, error, isLoading } = useSelector((state) => state.productsState);
  const{isProductDeleted}=useSelector(state=>state.productState)
  const {favorites, error:favoriteError} = useSelector((state) => state.favoritesSate);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position:'bottom-center',
        onOpen: () => { dispatch(clearProductsError()) }
      });
    } else {
      dispatch(getProducts(keyword, page));
    }
    if(isProductDeleted)
    {
      console.log(isProductDeleted)
      toast.success('successfully deleted.', {
        position:'bottom-center',
        onOpen: () => { dispatch(productClear()) }
      });
    }
  }, [error, dispatch, page,isProductDeleted]);

  useEffect(() => {
    if (favoriteError) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => { dispatch(clearError()) }
      });
    } else {
      dispatch(getFavorites());
    }
  }, [favoriteError, dispatch]);



  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Open modal and set the selected product for deletion
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close modal without deleting anything
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDelete = async() => {
    if (selectedProduct) {
      console.log(selectedProduct)
      await dispatch(deleteProduct(selectedProduct._id))
      dispatch(getProducts(keyword));
      closeModal();
    }
  }

  const handleEdit=(id)=>{
    dispatch(getProduct(id))
    navigate(`/product/${id}/edit`,{state:{"mode":"Edit"}});
  }
  const handleFavorite=async(action,id)=>{
     // Optimistic UI update
  const updatedFavorites = action === "add" 
  ? [...favorites.favoriteProductIds, { _id: id }] 
  : favorites.favoriteProductIds.filter(item => item._id !== id);

    if(action==="add") await dispatch(addFavorite(id))
    else if (action==="remove") await dispatch(removeFavorite(id));
    dispatch(getFavorites());
  }
  const filteredProducts = showFavorites 
                            ? favorites.favoriteProductIds 
                            : products;

  const [isSearched,setIsSearched]=useState(false);

  const handleSearch=()=>{
    if(keyword!=="")
      {
        dispatch(getProducts(keyword));
        setShowFavorites(false);
        setIsSearched(true);
      }
    
   
  }

 const handleRowClick=(id)=>{
  dispatch(getProduct(id))
  navigate(`/product/${id}`);
  }

  const handleNewProduct=()=>{
    navigate('/product/add',{state:{"mode":"Add"}});
  }
  return (
    <>
      <MetaData title={'Home'}/>
      <div className="product-table-container">
        <h1>{showFavorites ? "Favorite Products" : "Products"}</h1><br />

        <div className="topSection">
          <SearchBar keyword={keyword} setKeyword={setKeyword} allProducts={products} handleSearch={handleSearch}/>
          
          <div className="addFavorites">
            <AddButton onClick={handleNewProduct}/>
            <FavoriteButton onClick={() => setShowFavorites(!showFavorites)} />
          </div>
        </div>

        {!error ? (
          isLoading ? <Loader/> :
          isSearched?
          <div className="searched-product">
            <h2>{count} results found for ‘{keyword}'</h2>
            <div className="table-container">
              <table  className="product-table" cellSpacing="0" width="100%" height="100%">
                <thead>
                  <tr>
                    <th className="th-sm"></th>
                  </tr>
                </thead>
                <tbody>
                {products && products.map((item) => (
                  <tr key={item._id} onClick={()=>handleRowClick(item._id)}>
                    <td>
                      <div className='searched-product'>
                        <div className="product-info">
                          <span className="sku">{item.SKU}</span>
                          <p className="product-name">{item.name}</p>
                          <p className='descriiption'>{item.description}</p>
                        </div>
                        <div className="product-icon">
                          <Image src={RightDirectionIcon} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                </tbody>
              </table>
              <Pagination
                activePage={page}
                onChange={setPage}
                totalItemsCount={count}
                itemsCountPerPage={resPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={'page-item'}
                linkClass={'page-link'}
              />
          </div>

          </div>
          :
          <div className="table-container">
              <table id="dtBasicExample" className="product-table" cellSpacing="0" width="100%" height="100%">
                <thead>
                  <tr>
                    <th className="th-sm">SKU</th>
                    <th className="th-sm">Image</th>
                    <th className="th-sm">Product Name</th>
                    <th className="th-sm">Price</th>
                    <th className="th-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts && filteredProducts.map((item) => (
                    <tr key={item._id} onDoubleClick={()=>handleRowClick(item._id)}>
                      <td>{item.SKU}</td>
                      <td><Image src={item.thumbnail} alt="pic" className="picture" /></td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                        <Image src={deleteIcon} alt="delete" className="action-icon" onClick={()=>openModal(item)}/>
                        <Image src={editIcon} alt="edit" className="action-icon" onClick={()=>handleEdit(item._id)} />
                        {favorites && favorites.favoriteProductIds?.some((data) => data._id === item._id) ? (
                          <Image
                            src={starredIcon}
                            alt="favorite"
                            className="action-icon"
                            onClick={() => handleFavorite("remove", item._id)}
                          />
                        ) : (
                          <Image
                            src={starIcon}
                            alt="favorite"
                            className="action-icon"
                            onClick={() => handleFavorite("add", item._id)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                activePage={page}
                onChange={setPage}
                totalItemsCount={totalCount}
                itemsCountPerPage={resPerPage}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={'page-item'}
                linkClass={'page-link'}
              />
          </div>
        ) : (
          <h2 style={{ color: "red", textAlign: 'center', padding: "100px" }}>There is no product</h2>
        )}
        <DeleteModal
        showModal={showModal}
        handleClose={closeModal}
        handleDelete={handleDelete}
      />
      </div>
    </>
  );
}

export default ProductList;
