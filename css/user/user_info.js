$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 初始化用户的基本信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 获取用户信息成功后的操作
                // $('[name=username]').val(res.data.username);
                // 使用form.val 快速为指定的表单赋值
                form.val('f1', res.data);
            }
        })
    }

    // 监听重置按钮的点击事件
    $('#btnReset').on('click', function (e) {
        //   1.阻止重置的默认行为
        e.preventDefault();
        // 2.重新获取用户信息
        initUserInfo();
    })

    $('#form').on('submit', function (e) {
        //   1.阻止重置的默认行为
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!');
                }
                layer.msg('更新用户信息成功!');

                // 更新index中欢迎文本
                // 子页面调用父页面中的 getUserInfo()
                window.parent.getUserInfo();

            }
        })
    })
})