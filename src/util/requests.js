import $ from 'jquery';
import { receiveResponse} from './notifications';


export function _ajax(settings = {}) {
    settings.url = `http://localhost:5000${settings.url}`;
    settings.contentType = "application/json"; // Set content type to JSON
    settings.dataType = "json"; // Expect JSON response
    if (settings.data) {
        settings.data = JSON.stringify(settings.data); // Send data as JSON string
    }
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
            console.log(err);
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

/*==============================================================
# Products
==============================================================*/


/*==============================================================
# Admin
==============================================================*/

// admin users sections

export function getUsers() {
    return _ajax({
        url: "/admin/users",
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

export function editUser(originalEmail, email, firstName, lastName) {
    return _ajax({
        url: "/admin/users/" + originalEmail,
        method: "PUT",
        data: { 
            newEmail: email, 
            newFirstName: firstName, 
            newLastName: lastName 
        }
    });
}

export function changePassword(email, password) {
    return _ajax({
        url: "/admin/users/resetPassword/" + email,
        method: "PUT",
        data: { 
            newPassword: password 
        }
    });
}

export function deleteUser(email) {
    return _ajax({
        url: "/admin/users/" + email,
        method: "DELETE",
    });
}

// admin accessories section

export function getAccessories() {
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

export function editAccessory(id, accessoryNumber, name, description, price, status) {
    return _ajax({
        url: "/admin/accessories/" + id,
        method: "PUT",
        data: { accessoryNumber, name, description, price, status }
    });
}

export function deleteAccessory(id) {
    return _ajax({
        url: "/admin/accessories/" + id,
        method: "DELETE",
    });
}

// admin materials sections

export function getMaterials() {
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
    grainPattern, metaphysicalTags) {
    return _ajax({
        url: "/admin/materials/wood/" + id,
        method: "PUT",
        data: {
            commonName, description, status, tier, colors, alternateName1,
            alternateName2, scientificName, brief, jankaHardness, treeHeight,
            trunkDiameter, geographicOrigin, streaksVeins, texture,
            grainPattern, metaphysicalTags
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

export function createCrystal(crystalName, description, status, tier, colors,
    crystalCategory, psychologicalCorrespondence) {
    return _ajax({
        url: "/admin/materials/crystal",
        method: "POST",
        data: {
            crystalName, description, status, tier, colors,
            crystalCategory, psychologicalCorrespondence
        }
    });
}

export function editCrystal(id, crystalName, description, status, tier, colors,
    crystalCategory, psychologicalCorrespondence) {
    return _ajax({
        url: "/admin/materials/crystal/" + id,
        method: "PUT",
        data: {
            crystalName, description, status, tier, colors,
            crystalCategory, psychologicalCorrespondence
        }
    });
}

export function deleteCrystal(id) {
    return _ajax({
        url: "/admin/materials/crystal/" + id,
        method: "DELETE",
    });
}