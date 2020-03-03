$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor();


    // 初始化文章类别
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                // 调用模板引擎渲染结构
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui需要重新渲染下表单的结构
                form.render();
            },
        })
    }

    // 实现基本裁剪效果
    // 1.初始化图片裁剪器
    var $image = $('#image');
    // 2.裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.初始化裁剪区域
    $image.cropper(options);

    // 更换封面
    $('#chooseImg').on('click', function () {
        $('#coverFile').click();
    })

    // 为文件选择框绑定change事件
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的图片
        var fileList = e.target.files;
        if (fileList === 0) {
            return layer.msg('请选择一个图片')
        }
        // 根据用户选择的文件,创建一个对应的url地址
        var newImgUrl = URL.createObjectURL(fileList[0]);
        // 先销毁旧的剪裁区域,再重新设置图片路径,之后在创建新的剪裁区域
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    })

    // 定义文章最终的状态
    var art_state = '已发布';
    // 为存为草稿按钮,绑定点击事件
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    })

    // 为发表文章的表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.创建一个formData表单对象,参数为原生的表单DOM对象
        var fd = new FormData($(this)[0]);
        // 3.将文章的发表状态存到fd中
        fd.append('state', art_state);
        // 4.将封面区域裁剪并输出为一个图片的文件
        $image.cropper('getCroppedCanvas', { //创建一个canvas画布
            width: 400,
            height: 280
        }).toBlob(function (blob) { //将canvas画布上的内容转化为文件对象
            // 5. 得到文件后进行后续的操作
            fd.append('cover_img', blob)
            // 6.发起ajax请求
            publishArticle(fd);
        })
    })

    // 发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败!')
                }
                layer.msg('发表文章成功!');
                // 跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})