const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title :'';
    data.company = !isEmpty(data.company) ? data.company :'';
    data.from = !isEmpty(data.from) ? data.from :'';

    if (Validator.isEmpty(data.title)){
        errors.title = 'El trabajo es obligatorio';
    }
    if (Validator.isEmpty(data.company)){
        errors.company = 'La empresa es obligatoria';
    }
    if (Validator.isEmpty(data.from)){
        errors.from = 'La fecha de inicio es obligatoria';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}