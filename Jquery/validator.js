
function Validator(options) {
    let formMessage = options.formMessage;
    let selectorRules = {};

    // function lấy phần tử cha của input element :
    function getParent(element , selector){
        // input : input element and class '.form-group' 
        // output : div parent has class with '.form-group'
        while ( element.parent() ){
            if( element.parent().is(selector) ){
                return element.parent()
            }
            element = element.parent();
        }
    }

    // Hàm thực hiện validate
    function validateForm(rule, options) {
        let inputElement = $(`${options.form} ${rule.selector}`);
        let inputElementValue = inputElement.val();
        let errMessage;
        let parentOfSelectorHasFormGroupClass = getParent( inputElement, options.formGroup );
        let arrayAllOfTestFunction = selectorRules[rule.selector] ;
        for (let i = 0; i < arrayAllOfTestFunction.length; i++){
            errMessage = arrayAllOfTestFunction[i](inputElementValue);
            if( errMessage ) break;
        }

        if ( errMessage ){
            $(parentOfSelectorHasFormGroupClass).children(formMessage).html( errMessage );
            $(parentOfSelectorHasFormGroupClass).addClass( 'invalid');
        }else{
            $(parentOfSelectorHasFormGroupClass).children(formMessage).html('');
            $(parentOfSelectorHasFormGroupClass).removeClass( 'invalid' );
        }

        return !errMessage;
    };
    if(options.form) {
        // Xử lý submit form:
        $(options.form).on('submit', function(e){

            let isFormValid = true;
            e.preventDefault();
            options.rules.forEach(function(rule) {
                let isValid = validateForm(rule, options);
                if (!isValid){
                    isFormValid = false;
                }
            });

            if( isFormValid ){
                
                // Trường hợp xử lý submit bằng javascript
                if ( typeof options.onSubmit === 'function' ){
                    let arrayOfFormValue = $(`#form-1 [name]`);
                    let objectOfInputElement = {};
                    Array.from(arrayOfFormValue).forEach(function(value) {
                        let objkey = $(value).attr('name');
                        let objvalue = $(value).val();
                        objectOfInputElement[objkey] = objvalue;
                    });
                    options.onSubmit(objectOfInputElement);
                }
                // Trường hợp xử lý submit mặc định
                else{
                    // document.querySelector(options.form).submit();
                    $(options.form).get(0).submit();
                }
            }else{ 
                console.log('Có lỗi');
            }
        });

        // Lặp qua từng rule và xử lý ( lắng nghe sự kiện blur , input)
            options.rules.forEach(function(rule) {
           // thêm nhiều function test cho một selector
            if( !selectorRules[rule.selector] ){
                selectorRules[rule.selector] = [rule.test];
            }else{
                selectorRules[rule.selector].push(rule.test);
            }
            // Xử lý trường hợp người dùng blur khỏi input
            $(`${options.form} ${rule.selector}`).on( 'blur', function() {
                validateForm(rule , options);
            });

            // Xử lý trường hợp người dùng nhập:
            $(`${options.form} ${rule.selector}`).on('input', function() {
                $(rule.selector).parent().children(formMessage).html('');
                $(rule.selector).parent().removeClass( 'invalid' );
            })
        });
    }

}

// Thêm rule
    // Nguyên tắc: 
    // 1. Nếu có value input => không làm gì (trả ra undefined)
    // 2. Nếu ko có value input => thông báo yêu cầu nhập trường này
Validator.isRequired = function (selector, message) {

  return {
      selector,
      test(value){
          return value ? undefined : message || 'Vui lòng nhập trường này';
      }
  };
}

Validator.isEmail = function (selector, message) {
    let reGexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return {
        selector,
        test(value){
            return reGexEmail.test(value) ? undefined : message ||'Email không hợp lệ'
        }
    };
}

Validator.minLength = function (selector , min, message) {
    return {
        selector,
        test(value){
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiếu ${min} kí tự`
        }
    };
}

Validator.isConfirmed = function (selector , cb , message) {
    return {
        selector,
        test(value){
            return value === cb() ? undefined : message || `Giá trị nhập vào không chính xác`
        }
    };
}



