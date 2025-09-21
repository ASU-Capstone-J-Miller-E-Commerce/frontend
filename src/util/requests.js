import $ from 'jquery';
import { receiveResponse} from './notifications';
import { setCartItems } from './redux/actionCreators';
import { isValidElement } from 'react';


export function _ajax(settings = {}) {
    // Add base URL
    settings.url = `http://localhost:5000${settings.url}`;

    // Special handling for FormData (file uploads)
    if (settings.data instanceof FormData) {
        settings.processData = false; // Don't process FormData
        settings.contentType = false; // Let browser set content type with boundaries
    } else {
        // Default JSON handling for regular requests
        settings.contentType = settings.contentType !== undefined ? settings.contentType : "application/json";
        settings.dataType = "json";
        if (settings.data) {
            settings.data = JSON.stringify(settings.data);
        }
    }

    // Always add credentials
    settings.xhrFields = {
        withCredentials: true,
    };

    return $.ajax(settings)
        .then((res) => {
            const response = JSON.parse(res);

            if (Array.isArray(response.errors)) {
                return Promise.reject(response);
            }

            return response;
        })
        .catch((err) => {
            const response = err.responseJSON ? JSON.parse(err.responseJSON) : err;
            receiveResponse(response);

            return Promise.reject(response);
        });
}

// test backend call
export function test() {
    return _ajax({
        url: "/products",
        method: "GET",
    });
}

/*==============================================================
# Cart
==============================================================*/
export function getCart() {
    return _ajax({
        url: "/cart",
        method: "GET",
    }).then(response => {
        // Update Redux store with fresh cart data
        if (response && response.data) {
            setCartItems(response.data.items || []);
        }
        return response;
    });
}

export function addToCart(itemGuid, itemType, quantity = 1) {
    return _ajax({
        url: "/cart/add",
        method: "POST",
        data: { itemGuid, itemType, quantity }
    });
}

export function updateCartItem(itemGuid, quantity) {
    return _ajax({
        url: `/cart/update/${itemGuid}`,
        method: "PUT",
        data: { quantity }
    });
}

export function removeFromCart(itemGuid) {
    return _ajax({
        url: `/cart/remove/${itemGuid}`,
        method: "DELETE",
    });
}

export function clearCart() {
    return _ajax({
        url: "/cart/clear",
        method: "DELETE",
    });
}

export function getAllowedShippingCountries() {
    return _ajax({
        url: "/order/payment/shipping-countries",
        method: "GET"
    }).then(response => {
        if (response && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    });
}

/*==============================================================
# Collections
==============================================================*/
export function getCueCollection() {
    return _ajax({
        url: "/cues",
        method: "GET",
    });
}

export function getAccessoryCollection() {
    return _ajax({
        url: "/accessories",
        method: "GET",
    });
}

export function getMaterialCollection() {
    return _ajax({
        url: "/materials",
        method: "GET",
    });
}

export function getWoodByGuid(guid) {
    return _ajax({
        url: `/materials/wood/${guid}`,
        method: "GET",
    });
}

export function getCrystalByGuid(guid) {
    return _ajax({
        url: `/materials/crystal/${guid}`,
        method: "GET",
    });
}

export function getCueByGuid(guid) {
    return _ajax({
        url: `/cues/${guid}`,
        method: "GET",
    });
}

export function getAccessoryByGuid(guid) {
    return _ajax({
        url: `/accessories/${guid}`,
        method: "GET",
    });
}


/*==============================================================
# Users
==============================================================*/
export function login(email, password) {
    return _ajax({
        url: "/account/login",
        method: "POST",
        data: { email, password },
    });
}

export function logout() {
    return _ajax({
        url: "/account/logout",
        method: "POST",
    });
}

export function registerUser(email, password, fName, lName){
    return _ajax({
        url: "/account/register",
        method: "POST",
        data: {email, password, fName, lName}    
    });
}

export function checkAuth() {
    return _ajax({
        url: "/account/check-auth",
        method: "GET",  
    });
}


export function updateName(email, firstName, lastName) {
    return _ajax({
        url: "/user/update-name/" + email,
        method: "PUT",
        data: { 
            newFirstName: firstName, 
            newLastName: lastName 
        }
    });
}

export function generate2FA(){
    return _ajax({
        url: "/account/generate2FA",
        method: "PUT",
    })
}

export function verify2FA(code){
    return _ajax({
        url: "/account/verify2FA",
        method: "PUT",
        data: {code}
    })
}

export function verify2FALogin(token_data, code, iv){
    return _ajax({
        url: "/account/verify2FALogin",
        method: "POST",
        data: {token_data, code, iv}
    })
}

export function userChangePassword(currPw, newPw){
    return _ajax({
        url: "/user/userChangePassword",
        method: "PUT",
        data: {currPw, newPw}
    })
}

export function userToggleNotifications(){
    return _ajax({
        url: "/user/toggleNotifications",
        method: "PUT"
    })
}

export function getUserOrders() {
    return _ajax({
        url: "/user/orders",
        method: "GET"
    });
}

export function getUserOrderById(orderId) {
    return _ajax({
        url: `/user/orders/${orderId}`,
        method: "GET"
    });
}

export function contactUs(payload){
    return _ajax({
        url: "/email/contactus",
        method: "POST",
        data: payload
})
}

/*==============================================================
# Products
==============================================================*/

/*==============================================================
# Emailer
==============================================================*/
export function emailContactUs(subject, message, attachments) {
    const formData = new FormData();
    if (subject) formData.append("subject", subject);
    if (message) formData.append("message", message);

    if (attachments && attachments.length) {
        attachments.forEach((file, idx) => {
            formData.append("attachments", file); 
        });
    }

    return _ajax({
        url: "/email/contactus",
        method: "POST",
        data: formData,
    });
}

export function emailResetPassword( email ) {
    return _ajax({
        url: "/email/resetPassword",
        method: "POST",
        data: { email }
    });
}

export function emailNotification(subject, message, attachments) {
    const formData = new FormData();
    if (subject) formData.append("subject", subject);
    if (message) formData.append("message", message);

    if (attachments && attachments.length) {
        attachments.forEach((file, idx) => {
            formData.append("attachments", file); 
        });
    }

    return _ajax({
        url: "/email/notification",
        method: "POST",
        data: formData,
    });
}

export function emailAnnouncement(subject, message, attachments) {
    const formData = new FormData();
    if (subject) formData.append("subject", subject);
    if (message) formData.append("message", message);

    if (attachments && attachments.length) {
        attachments.forEach((file, idx) => {
            formData.append("attachments", file); 
        });
    }

    return _ajax({
        url: "/email/announcement",
        method: "POST",
        data: formData,
    });
}

export function emailOrderConfirm( email, userOrder  ) {
    return _ajax({
        url: "/email/orderconfirm",
        method: "POST",
        data: { email, userOrder  }
    });
}

/*==============================================================
# Admin
==============================================================*/

// admin users sections

export function getAdminUsers() {
    return _ajax({
        url: "/admin/users",
        method: "GET",
    });
}

export function getAdminOrders() {
    return _ajax({
        url: "/admin/orders",
        method: "GET",
    });
}

export function createUser(email, firstName, lastName, password) {
    return _ajax({
        url: "/admin/users",
        method: "POST",
        data: { email, firstName, lastName, password }
    });
}

export function editUser(id, email, firstName, lastName) {
    return _ajax({
        url: "/admin/users/" + id,
        method: "PUT",
        data: { 
            newEmail: email, 
            newFirstName: firstName, 
            newLastName: lastName 
        }
    });
}

export function changePassword(id, password) {
    return _ajax({
        url: "/admin/users/resetPassword/" + id,
        method: "PUT",
        data: { 
            newPassword: password 
        }
    });
}

export function deleteUser(id) {
    return _ajax({
        url: "/admin/users/" + id,
        method: "DELETE",
    });
}

export function editOrder(id, orderData) {
    return _ajax({
        url: "/admin/orders/" + id,
        method: "PATCH",
        data: orderData
    });
}

// admin accessories section

export function getAdminAccessories() {
    return _ajax({
        url: "/admin/accessories",
        method: "GET",
    });
}

export function createAccessory(accessoryNumber, name, description, price, status) {
    return _ajax({
        url: "/admin/accessories",
        method: "POST",
        data: { accessoryNumber, name, description, price, status }
    });
}

export function editAccessory(id, accessoryNumber, name, description, price, status, imageUrls) {
    return _ajax({
        url: "/admin/accessories/" + id,
        method: "PUT",
        data: { accessoryNumber, name, description, price, status, imageUrls }
    });
}

export function deleteAccessory(id) {
    return _ajax({
        url: "/admin/accessories/" + id,
        method: "DELETE",
    });
}

// admin materials sections

export function getAdminMaterials() {
    return _ajax({
        url: "/admin/materials",
        method: "GET",
    });
}

export function createWood(commonName, description, status, tier, colors, alternateName1,
    alternateName2, scientificName, brief, jankaHardness, treeHeight,
    trunkDiameter, geographicOrigin, streaksVeins, texture,
    grainPattern, metaphysicalTags) {
    return _ajax({
        url: "/admin/materials/wood",
        method: "POST",
        data: {
            commonName, description, status, tier, colors, alternateName1,
            alternateName2, scientificName, brief, jankaHardness, treeHeight,
            trunkDiameter, geographicOrigin, streaksVeins, texture,
            grainPattern, metaphysicalTags
        }
    });
}

export function editWood(id, commonName, description, status, tier, colors, alternateName1,
    alternateName2, scientificName, brief, jankaHardness, treeHeight,
    trunkDiameter, geographicOrigin, streaksVeins, texture,
    grainPattern, metaphysicalTags, imageUrls) {
    return _ajax({
        url: "/admin/materials/wood/" + id,
        method: "PUT",
        data: {
            commonName, description, status, tier, colors, alternateName1,
            alternateName2, scientificName, brief, jankaHardness, treeHeight,
            trunkDiameter, geographicOrigin, streaksVeins, texture,
            grainPattern, metaphysicalTags, imageUrls
        }
    });
}

export function deleteWood(id) {
    return _ajax({
        url: "/admin/materials/wood/" + id,
        method: "DELETE",
    });
}

// Crystal/Stone Materials

export function createCrystal(crystalName, status, tier, colors,
    crystalCategory, psychologicalCorrespondence) {
    return _ajax({
        url: "/admin/materials/crystal",
        method: "POST",
        data: {
            crystalName, status, tier, colors,
            crystalCategory, psychologicalCorrespondence
        }
    });
}

export function editCrystal(id, crystalName, status, tier, colors,
    crystalCategory, psychologicalCorrespondence, imageUrls) {
    return _ajax({
        url: "/admin/materials/crystal/" + id,
        method: "PUT",
        data: {
            crystalName, status, tier, colors,
            crystalCategory, psychologicalCorrespondence, imageUrls
        }
    });
}

export function deleteCrystal(id) {
    return _ajax({
        url: "/admin/materials/crystal/" + id,
        method: "DELETE",
    });
}

// Admin cue endpoints in your requests.js file
export function getAdminCues() {
    return _ajax({
        url: "/admin/cues",
        method: "GET",
    });
}

export function createCue(cueData) {
    return _ajax({
        url: "/admin/cues",
        method: "POST",
        data: cueData
    });
}

export function editCue(id, cueData) {
    return _ajax({
        url: "/admin/cues/" + id,
        method: "PATCH",
        data: cueData
    });
}

export function deleteCue(id) {
    return _ajax({
        url: "/admin/cues/" + id,
        method: "DELETE",
    });
}

/*==============================================================
# Images
==============================================================*/

export function uploadImage(file, folder='general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return _ajax({
        url: "/admin/image/upload",
        method: "POST",
        data: formData
    })
}

export function deleteImages(imageUrls) {
    if (!Array.isArray(imageUrls)) {
        imageUrls = [imageUrls];
    }
    
    return _ajax({
        url: "/admin/image/delete",
        method: "POST",
        data: { urls: imageUrls }
    });
}


/*==============================================================
# Payment
==============================================================*/

export function createCheckoutSession(cartItems, email, shippingCountry = null, cartTotal = 0) {
    // Extract cue GUIDs from cart items (cues are always quantity 1)
    const cueGuids = cartItems
        .filter(item => item.itemType === 'cue')
        .map(item => item.itemDetails.guid);
    
    // Extract accessory items with quantities
    const accessoryItems = cartItems
        .filter(item => item.itemType === 'accessory')
        .map(item => ({
            guid: item.itemDetails.guid,
            quantity: item.quantity
        }));
    
    return _ajax({
        url: "/order/payment/create-checkout-session",
        method: "POST",
        data: { 
            cueGuids: cueGuids,
            accessoryItems: accessoryItems,
            email: email,
            shippingCountry: shippingCountry,
            cartTotal: cartTotal
        }
    });
}

export function verifyPaymentSession(sessionId) {
    return _ajax({
        url: `/order/payment/verify-session/${sessionId}`,
        method: "GET",
    });
}

/*==============================================================
# Sitewide Search
==============================================================*/

export function searchSite(searchTerm, fullSearch = false) {
    return _ajax({
        url: `/search?query=${encodeURIComponent(searchTerm)}${fullSearch ? '&full=true' : ''}`,
        method: "GET",
    })
}
