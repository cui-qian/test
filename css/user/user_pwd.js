$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            var pwd = $('[name=oldPwd]').val();
            if (value === pwd) {
                // return '新旧密码不能重复!'
                console.log('错的')
            }
        },
        samePwd: function (value) {
            var pwd = $('[name=newPwd]').val();
            if (value !== pwd) {
                return '两次密码不一致!'
            }
        }
    })
    // 绑定submit事件
    $('#form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!');
                // 重置表单中的数据
                // 1.在jquery中,可以通过('#form')[0]形式将jquery对象转换成js的DOM对象
                // 2.表单原生的DOM对象提供了reset()方法,可以重置表单
                $('#form')[0].reset()
            }
        })
    })
})