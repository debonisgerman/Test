const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school :'';
    data.degree = !isEmpty(data.degree) ? data.degree :'';
    data.from = !isEmpty(data.from) ? data.from :'';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy :'';

    if (Validator.isEmpty(data.school)){
        errors.school = 'El estudio es obligatorio';
    }
    if (Validator.isEmpty(data.degree)){
        errors.degree = 'El título es obligatorio';
    }
    if (Validator.isEmpty(data.from)){
        errors.from = 'La fecha de inicio es obligatoria';
    }
    if (Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'El campo de estudio es obligatorio';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}