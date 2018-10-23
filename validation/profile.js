const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : "";
    data.status = !isEmpty(data.status) ? data.status : "";
    data.skills = !isEmpty(data.skills) ? data.skills : "";

    if (!Validator.isLength(data.handle,{min: 2,max:40})){
        errors.handle = "El handle tiene que estar entre 2 y 40 caracteres";
    }

    if (Validator.isEmpty(data.handle)){
        errors.handle = "El handle es obligatorio";
    }

    if (Validator.isEmpty(data.status)){
        errors.status = "El status es obligatorio";
    }

    if (Validator.isEmpty(data.skills)){
        errors.skills = "Las skills son obligatorias";
    }

    if (!isEmpty(data.website) && !Validator.isURL(data.website)){
        errors.website = "La url no es válida";
    }

    if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)){
        errors.youtube = "La url no es válida";
    }

    if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)){
        errors.twitter = "La url no es válida";
    }

    if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)){
        errors.facebook = "La url no es válida";
    }

    if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)){
        errors.linkedin = "La url no es válida";
    }

    if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)){
        errors.instagram = "La url no es válida";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}