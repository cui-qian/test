$(function () {
    var layer = layui.layer;
    // 调用这个函数获取用户的信息
    getUserInfo();
    // 退出功能
    // 1.为退出的按钮绑定点击事件
    $('#btnLogout').on('click', function () {
        // 问题:如何在点击退出按钮后,提示用户退出消息
        layer.confirm('确定退出吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 1.1清token
            localStorage.removeItem('token');
            // 1.2退出到login页面
            location.href = '/test/login.html';
            // 关闭指定弹出层
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
// 注意:一定要在入口函数之外定义这个方法
function getUserInfo() {
    // 发起ajax请求获取用户信息
    // 在请求有权限的接口时,在配置对象中指定请求头
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // 指定请求头(在baseApi中进行了配置)
        // headers: {
        //     // 通过Authorization字段,把token发送给服务器,进行身份认证
        //     Authorization: localStorage.getItem('token')
        // },
        // 成功的回调
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // 获取用户信息成功
            // 渲染用户头像和欢迎文本内容   render:渲染
            renderAvatar(res.data);
        }
    })
}
// 头像功能
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染头像
    if (user.user_pic) {
        // 渲染图片的头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本的头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }
}