$(function () {
    var layer = layui.layer;
    // 1.获取剪裁区域的DOM元素
    var $image = $('#image');
    // 2.配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 3.创建剪裁区域
    $image.cropper(options);


    // 绑定上传按钮点击事件
    $('#btnChangeIamge').on('click', function () {
        $('#file').click();
    })

    $('#file').on('change', function (e) {
        // 拿到用户选择的图片
        var file = e.target.files;
        if (file.length === 0) {
            return layer.msg('请选择一个图片')
        }
        // 根据选择的文件.创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file[0]);
        // 先销毁旧的剪裁区域,再重新设置图片路径,之后再创建新的剪裁区域
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    })

    // 点击上传事件
    $('#upload').on('click', function () {
        // 将用户选择的区域转成一个头像图片
        // 1.新建一个canvas画布
        var dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/png'); //将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 上传头像到服务器
        $.post('/my/update/avatar', {
            avatar: dataUrl
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg('更换头像失败!')
            }
            layer.msg('更换头像成功!');
            // 调用父页面的渲染头像的方法
            window.parent.getUserInfo();
        })
    })
})