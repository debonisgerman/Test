const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!Validator.isEmail(data.email)){
        errors.email = 'El email es inválido';
    }

    if (Validator.isEmpty(data.email)){
        errors.email = 'El email es obligatorio';
    }

    if (Validator.isEmpty(data.password)){
        errors.password = 'La contraseña es obligatoria';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}