let btn = $('.btn'),
    form = $('.signIn'),
    captcha = $('.captcha');

btn.click(function() {
    form.serialize().match();
    $.ajax({
        url: `/users/signIn?${form.serialize()}`,
        success: function(data) {
            if (data == 'captcha error') {

                var N = {};
                if (N.dialog1) {
                    return N.dialog1.show();
                }
                N.dialog1 = jqueryAlert({
                    content: '验证码错误',
                    closeTime: '2000'
                });

            } else if (data.length == 1) {
                location.href = '/admin';
            }
        }
    });
});


captcha.click(function() {
    this.src = `/captcha?${Math.random()}`;
});

