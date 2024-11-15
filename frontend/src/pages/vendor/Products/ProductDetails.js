import React, {  useState } from 'react'
import { useSelector } from 'react-redux'
import Carousel from 'react-bootstrap/Carousel'
import Figure from 'react-bootstrap/Figure'
import Loader from '../../Loader'
import { Col,Image,Row } from 'react-bootstrap'
import {  useNavigate } from 'react-router-dom'
import MetaData from '../../Layouts/MetaData'
import RightDirectionIcon from '../../../assets/rightDirection.svg'



const ProductDetails = () => {
  const{isLoading:ProductLoading,product,error}=useSelector((state)=>state.productState) 
  const[isClicked,setIsClicked]=useState(false)
  const[selectedImage,setSelectedImage]=useState(null)
  const navigate = useNavigate();

  const HandleClick=(image)=>{
      setIsClicked(true)
      setSelectedImage(image)
  }
  const handleCarouselSelect = (selectedIndex, e) => {
    if (!isClicked) {
      const selectedImage = product.images[selectedIndex].image;
      setSelectedImage(selectedImage);
    }
  };
  const handleBack=()=>{
    navigate("/")
  }
  return (
    <>
    <MetaData title={'Product'}/>
    <div className="addEditHeading">
      <h1 onClick={handleBack}>Products</h1>
      <div>
        <Image src={RightDirectionIcon} className="img"/>
        <h2>Product Detail</h2>
      </div>
    </div>

    <div className='product-detail'>
      {ProductLoading ? <Loader /> : 
        <div className='productFrame'>
          <Row className="product-row">
            {/* First Column for Thumbnails and Larger Image */}
            <Col className="thumbnail-col">
              <div className="bigImageContainer">
                <img
                  className="bigImage"
                  src={selectedImage || product.images[0]?.image}
                  alt="Big Image"
                />
              </div>

              <div className="thumbnailContainer">
                {product.images && product.images.map((image) => (
                  <img
                    key={image.image}
                    className={`thumbnail ${selectedImage === image.image ? 'selected' : ''}`}
                    src={image.image}
                    alt="Thumbnail"
                    onClick={() => HandleClick(image.image)}
                  />
                ))}
              </div>
            </Col>

            {/* Second Column for Product Details */}
            <Col className="product-details-col">
              <div>
              <h1 className="product-name">{product.name}</h1>
              <h3>Price :- <span className="product-price">{product.price}</span></h3>
              <h3 className="product-quantity">Quantity :- {product.quantity}</h3>
              <p className="product-description">Descriptio :- {product.description}</p>
              </div>
            </Col>
          </Row>
        </div>
      }
    </div>

    </>
    
  )
}

export default ProductDetails