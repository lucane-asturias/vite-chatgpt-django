import { Form as VeeForm, Field as VeeField, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, min, min_value, max, max_value, email, confirmed, alpha_spaces } from '@vee-validate/rules';

export default {
  // plug-ins are objects with a method called install
  // Vue wil call the install method when we register it
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    // name of the rule + function that will perform the validation; 
    // this rules will be available to every validation form
    defineRule('required', required);
    defineRule('min', min); 
    defineRule('max', max);
    defineRule('email', email); // must have the same value as the confirmation field.
    defineRule('passwords_mismatch', confirmed);
    defineRule('alpha_spaces', alpha_spaces);

    configure({
      // validation triggers to change default behaviour: default values
      validateOnBlur: true,
      validateOnChange: true,  
      validateOnInput: false,
      validateOnModelUpdate: true, // validate when value changes internally through the v-model directive
    })
  },
}