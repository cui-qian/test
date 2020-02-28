$(function () {
    // 只要导入了layui的脚本,就可以使用layui.form
    var form = layui.form;
    var layer = layui.layer;
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
        psd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePsd: function (value) {
            // 1.通过形参,获取到确认密码框中的值
            // 2.通过jquery获取到密码框中的值
            var psd = $('.reg-box [name=password]').val();
            // 3.进行if判断
            if (value !== psd) {
                return '两次的密码不一致!'
            }
        },
        // 校验密码长度
        pwdLength: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
    })

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        // 1.阻止表单的默认提交事件
        e.preventDefault();
        // 2.发起ajax请求
        $.ajax({
            method: 'POST',
            // 必须的请求根路径拼接具体的url地址
            url: 'http://www.liulongbin.top:3007/api/reguser',
            // 指定请求的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // 注册失败
                    return layer.msg(res.message);
                }
                layer.msg('注册成功,请登录');
                // 主动切换到登录的界面
                $('#link-login').click();
            }
        })
    });

    // 监听登录表单的提交事件
    $('#form-login').on('submit', function (e) {
        // 1.阻止表单的默认提交事件
        e.preventDefault();
        // 2.发起ajax请求
        $.ajax({
            method: 'POST',
            // 必须的请求根路径拼接具体的url地址
            url: 'http://www.liulongbin.top:3007/api/login',
            // 指定请求的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // 注册失败
                    return layer.msg('登录失败');
                }
                // 切换到后台index.html
                // 将服务器返回的token保存到本地存储
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})