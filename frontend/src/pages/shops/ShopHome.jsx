import ProductList from "../../components/Products";

const ShopHome = () => {
    return(
      <div >
        <h1>Welcome to Shop Page</h1>
        <div  className="flex justify-center mt-5" >
        
        <ProductList/>
        </div>
      </div>
    );
  };
  
  export default ShopHome;
  