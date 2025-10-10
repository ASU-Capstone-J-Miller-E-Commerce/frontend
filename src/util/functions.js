import { checkAuth, getFeaturedCues } from "./requests";
import { updateUser, setCartItems, setFeaturedCues, setFeaturedCuesLoading } from "./redux/actionCreators";

export function checkUserAuth() {
    checkAuth()
        .then((response) => {
            const userData = {
                ...response.data,
                initialAuthChecked: true,
            };
            
            // Update user data in Redux
            updateUser(userData);
            
            // Update cart data in Redux if user is authenticated and cart exists
            if (userData.authenticated && userData.cart) {
                setCartItems(userData.cart.items || []);
            } else {
                setCartItems([]);
            }
        })
        .catch(error => {
            updateUser({ 
                authenticated: false, 
                initialAuthChecked: true, 
            });
            setCartItems([]);
        });
};

export function getAndCacheFeaturedCues() {
    setFeaturedCuesLoading(true);
    getFeaturedCues()
        .then((response) => {
            if (response && response.data) {
                setFeaturedCues(response.data);
            } else {
                setFeaturedCues([]);
            }
        })
        .catch((err) => {
            setFeaturedCues([]);
        });
}