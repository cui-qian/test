$(function () {
    // 只要导入了layui的脚本,就可以使用layui.form
    var form = layui.form;
    // 点击了注册的链接
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击了登录的链接
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });


    // 自定义校验规则
    form.verify({
        // 键:值
        psd: [/^[\S]{6,12}$/], //'密码必须6到12位，且不能出现空格'
        samePsd: function (value) {
            // 1.通过形参,获取到确认密码框中的值
            // 2.通过jquery获取到密码框中的值
            var psd = $('.reg-box [name=password]').val();
            // 3.进行if判断
            if (value !== psd) {
                return '两次的密码不一致!'
            }

        }
    })
})