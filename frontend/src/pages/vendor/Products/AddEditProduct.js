import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import MetaData from "../../Layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct } from "../../../actions/productActions";
import RightDirectionIcon from '../../../assets/rightDirection.svg'
import { clearError } from "../../../slices/productSlice";
import axios from "axios";
import Loader from "../../Loader";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();
  const mode = location.state ? location.state.mode : ''; 
  const {id}=useParams();
  const{isProductAdded,error,product,isLoading,isProductUpdated}=useSelector(state=>state.productState)
  // Form data and error state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 0,
    price:0,
    images: [],
    thumbnailIndex: null, 
  });

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);


  useEffect(()=>{
    if(error){
      return toast.error(error,{
        position:'bottom-center',
        onOpen:()=>clearError()
      })
    }else if (isProductAdded)
    {
      setFormData({
        name: "",
        description: "",
        quantity:0,
        price:0,
        images: [],
        thumbnailIndex: null,
      });
      setPreviewImages([]);
      toast.success("product is created.", {
        position:'bottom-center',
        onOpen: () => { dispatch(clearError()) }
      })
      
    }
    else if(isProductUpdated)
    {
      toast.success("product is updated.", {
        position:'bottom-center',
        onOpen: () => { dispatch(clearError()) }
      })
      navigate("/")
    }

  },[isProductAdded,error,isProductUpdated,dispatch,navigate])

  useEffect(() => {
    const loadImagesAsFiles = async () => {
      if (mode === "Edit" && product) {
        try {
          const imageFiles = await Promise.all(
            product.images.map(async (imageUrl) => {
  
              const response = await axios.get(imageUrl.image, {
                responseType: 'blob',
                withCredentials: true, // Include credentials only if necessary
              });
  
              const blob = response.data; // Axios response contains the blob in `data`
              const filename = imageUrl.image.split('/').pop();
              return new File([blob], filename, { type: blob.type });
            })
          );
  
          // Update form data
          setFormData({
            SKU: product.SKU,
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            price: parseInt(product.price.replace('$', '')),
            images: imageFiles,
            thumbnailIndex: product.images.findIndex((data) => data.image === product.thumbnail),
          });
  
          // Update preview images
          setPreviewImages(product.images.map((data) => data.image));
        } catch (error) {
          console.error('Error loading images:', error.message);
        }
      }
    };
  
    loadImagesAsFiles();
  }, [product, mode]);
  


  


  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue=value;
      // Check if the field is 'quantity'
      if (name === 'quantity') {
        // Round the quantity value to the nearest integer
        formattedValue = Math.round(parseFloat(value)); // Round to nearest integer
        if (isNaN(formattedValue) || formattedValue < 0) {
          formattedValue = ''; // Reset if the input is invalid
        }
      }
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle image upload with a limit of 5 images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
  
      reader.onload= () => {
        // Add the base64 string to formData (you can send this to the server later)
        setFormData((prevState) => ({
          ...prevState,
          images: [...prevState.images, file], // Store the file in the state (can send it later)
        }));
  
        // Create an image preview from the data URL
        setPreviewImages((prevState) => [
          ...prevState,
          reader.result, // This is the base64-encoded image
        ]);
      };
  
      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    });
  };

  // Validate fields, ensuring that a thumbnail is selected
  const validateFields = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Price is required and should be greater than 0";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Quantity is required and should be greater than 0";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";
    if (formData.images.length > 0 && formData.thumbnailIndex === null) {
      newErrors.thumbnail = "Please select a thumbnail image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Set the thumbnail index
  const handleThumbnailSelection = (index) => {
    setFormData({ ...formData, thumbnailIndex: index });
    if (errors.thumbnail) {
      setErrors({ ...errors, thumbnail: "" });
    }
  };

  const handleImageRemove = (index,e) => {
    e.preventDefault(); 
    setPreviewImages((prevImages) => {
      // Remove the image preview at the specified index
      const updatedImages = prevImages.filter((_, i) => i !== index);
      return updatedImages;
    });

  
    setFormData((prevData) => {
      const updatedImages = prevData.images.filter((_, i) => i !== index);
  
      // Adjust thumbnail index logic
      let newThumbnailIndex = prevData.thumbnailIndex;
  
      if (updatedImages.length > 0) {
        if (prevData.thumbnailIndex === index) {
          // If the removed image was the selected thumbnail, reset to the first image (0)
          newThumbnailIndex = 0;
        } else if (prevData.thumbnailIndex > index) {
          // Decrement thumbnail index if it was after the removed image
          newThumbnailIndex = prevData.thumbnailIndex - 1;
        }
      } else {
        // No images left, so reset thumbnailIndex to null
        newThumbnailIndex = null;
      }
  
      return {
        ...prevData,
        images: updatedImages,
        thumbnailIndex: newThumbnailIndex,
      };
    });
  };
  
  

  // Add product function
  const handleAddProduct = async () => {
    if (validateFields()) {
      try {
        const newFormData = new FormData();
        newFormData.append("name", formData.name);
        newFormData.append("description", formData.description);
        newFormData.append("thumbnailIndex", formData.thumbnailIndex);
        newFormData.append("quantity", formData.quantity);
        newFormData.append("price", `$${parseFloat(formData.price).toFixed(2)}`);
        formData.images.forEach((image, index) => {
          newFormData.append("images", image);
        });
        // Check if the field is 'price'
        console.log(formData)
        if(mode==="Add")dispatch(addProduct(newFormData))
        else dispatch(updateProduct(id,newFormData))
      } catch (error) {
        toast.error("Failed to add product. Please try again.", { position: "bottom-center" });
      }
    }
  };

  const handleBack=()=>{
    navigate("/")
  }
  return (
    <>
      <MetaData title={`${mode} Product`}/>
      <div className="addEditHeading">
      <h1 onClick={handleBack}>Products</h1>
      <div>
        <Image src={RightDirectionIcon} className="img"/>
        <h2>{mode&&mode==='Add'?"Add New Product":"Edit Product"}</h2>
      </div>
      </div>
     {
      isLoading?<Loader/>:
      <Form className="add-product-form">
      <div className="form-row">
        {mode==="Edit"?
        <Form.Group controlId="SKU" className="form-group-half">
        <Form.Label>SKU</Form.Label>
        <Form.Control
          type="text"
          name="SKU"
          value={formData.SKU}
          onChange={handleChange}
          disabled={true}
          
        />
      </Form.Group>:null}
        <Form.Group controlId="name" className={mode==="Edit"?"form-group-half":"form-group-full"}>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      <div className="form-row">
        <Form.Group controlId="quantity" className="form-group-half">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            isInvalid={!!errors.quantity}
          />
          <Form.Control.Feedback type="invalid">
            {errors.quantity}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="price" className="form-group-half">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          isInvalid={!!errors.price}
        />
        <Form.Control.Feedback type="invalid">
          {errors.price}
        </Form.Control.Feedback>
      </Form.Group>
      </div>
      <Form.Group controlId="description" className="form-group-full">
        <Form.Label className="description-label">
          <div>
            Description
            <span>A small description about the product</span>
          </div>
          </Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="images" className="form-group-full">
        <Form.Label className="upload-label">
          <div>
            Product images
            <span>JPEG, PNG, SVG or GIF (Maximum file size 50MB)</span>
          </div>
          <p  className="upload" onClick={() => document.getElementById('file-upload').click()}>Add Image</p>
        </Form.Label>
        
        <Form.Control
          id="file-upload"
          type="file"
          name="images"
          onChange={handleImageUpload}
          multiple
          isInvalid={!!errors.images}
          style={{ display: "none" }}
        />
        <Form.Control.Feedback type="invalid">
          {errors.images}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="image-previews">
        {previewImages.map((src, index) => (
          <div key={index} className="preview-container">
            <img
              src={src}
              alt={`Preview ${index}`}
              className={`preview-image ${
                index === formData.thumbnailIndex ? "thumbnail" : ""
              }`}
              onClick={() => handleThumbnailSelection(index)}
            />
            <button
              className="remove-image-btn"
              onClick={(e) => handleImageRemove(index,e)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {errors.thumbnail && (
        <div className="error-message">{errors.thumbnail}</div>
      )}

      
      <div className="bottom">
        <div></div>
        <Button id="addItem" onClick={handleAddProduct} variant="primary">
          {mode==="Edit"?"Update Product":"Add Product"}
        </Button>
      </div>
    </Form>
     } 
    </>
  );
};

export default AddProduct;
