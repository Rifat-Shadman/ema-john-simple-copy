import React, { useEffect, useState } from 'react';
// import fakeData from './../../fakeData'
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import { Link, useHistory } from 'react-router-dom';
import happyImage from '../../images/giphy.gif';

const Review = () => {
    const [cart,setCart] = useState([]) ;
    const [orderPlaced,setOrderPlaced] = useState(false);
    const history = useHistory();

    const handleProceedCheckout = () => {
        history.push('/shipment');  
    }
    const removeProduct =  (productKey) => {    
        const newCart = cart.filter(pd => pd.key !== productKey)
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(()=>{
        // cart
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        

        fetch('https://cherry-surprise-20492.herokuapp.com/productsByKeys', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))

        // const cartProducts = productKeys.map(key => {
        //     const product = fakeData.find(pd => pd.key === key)
        //     product.quantity = savedCart[key];
        //     return product;
        // });
        // setCart(cartProducts);
    },[])

    let thankyou;
    if(orderPlaced){
        thankyou = <img src={happyImage} alt=""/> 
    } 

    return (
        <div className="twin-container">
            <div className="product-container">
            {
                cart.map(pd=> <ReviewItem 
                    removeProduct = {removeProduct}
                    key={pd.key}
                    product={pd}></ReviewItem>)
            }
            {
                thankyou
            }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    
                        <button onClick={handleProceedCheckout} style={{backgroundColor:'lightgray'}} className="main-button">
                            Proceed Checkout
                        </button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;