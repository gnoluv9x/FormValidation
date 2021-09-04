Validator({
    form: "#form-1",
    formGroup: ".form-group",
    formMessage : '.form-message',
    rules: [
          Validator.isRequired("#fullname", 'Vui lòng nhập đầy đủ họ tên bạn!'),
          Validator.isRequired("#email", 'Vui lòng nhập trường này'),
          Validator.isEmail("#email"),
          Validator.isRequired("#password"),
          Validator.minLength("#password", 6),
          Validator.isRequired("#password_confirmation"),
          Validator.isConfirmed('#password_confirmation', function(){
              return $('#form-1 #password').val();
          }, 'Mật khẩu bạn nhập không trùng khớp')
    ],
    onSubmit : function(data){
        // data chứa thông tin người dùng nhập vào
        console.log(data);
    },
});