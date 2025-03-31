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
            console.log(res);
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

/*==============================================================
# Products
==============================================================*/


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
    crystalCategory, psychologicalCorrespondence) {
    return _ajax({
        url: "/admin/materials/crystal/" + id,
        method: "PUT",
        data: {
            crystalName, status, tier, colors,
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

export function getImageUploadUrl(filename, filetype) {
    return _ajax({
        url: `/imageUpload?filename=${encodeURIComponent(filename)}&filetype=${encodeURIComponent(filetype)}`,
        method: "GET"
    });
}

export function uploadImage(file) {
    const extension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${extension}`;

    // First get the presigned URL from your backend
    return getImageUploadUrl(uniqueFilename, file.type)
        .then(response => {
            // Extract the URL from the response - it's in an array
            const uploadUrl = response.data;

            // Use XMLHttpRequest instead of fetch to handle CORS issues
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open('PUT', uploadUrl, true);
                xhr.setRequestHeader('Content-Type', file.type);

                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // Success - return the URL to the uploaded file
                        resolve(`https://jmillercustomcues.nyc3.digitaloceanspaces.com/${uniqueFilename}`);
                    } else {
                        reject(new Error('Upload failed'));
                    }
                };

                xhr.onerror = function () {
                    reject(new Error('Network error'));
                };

                xhr.send(file);
            });
        });
}