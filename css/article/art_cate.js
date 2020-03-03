$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initTable();

    // 初始化表格的数据
    function initTable() {
        // 渲染列表
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('请求文章列表失败!')
                };
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var addIndex = null;
    // 给添加类别按钮绑定点击事件
    $('#addCate').on('click', function () {
        addIndex = layer.open({
            title: '添加文章分类',
            type: 1,
            content: $('#tpl-add').html(),
            area: ['500px', '250px']
        });
    })

    //给确认添加按钮绑定点击事件
    //由于弹出框是js动态添加的,所以需要用到事件委托进行绑定
    $('body').on('submit', '#form-add', function (e) {
        //阻止提交的默认事件
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败!')
                }
                layer.msg('添加文章分类成功!');
                // 添加成功后重新渲染页面
                initTable();
                // 关闭弹出层
                layer.close(addIndex);
            }
        })
    })

    // 给编辑按钮绑定点击事件
    $('tbody').on('click', '.edit', function () {
        var id = $(this).attr('data-id');
        addIndex = layer.open({
            title: '修改文章分类',
            type: 1,
            content: $('#tpl-edit').html(),
            area: ['500px', '250px']
        });
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败!')
                };
                // form.val('表单',数据对象)
                form.val('form-edit', res.data);
            }
        })
    })

    // 监听编辑表单的提交事件
    $("body").on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败!')
                }
                layer.msg('更新文章分类成功!');
                // 关闭弹出层
                layer.close(addIndex);
                // 刷新列表的数据
                initTable();
            }
        })
    })

    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!')
                    }
                    // 重新渲染文章分类列表
                    initTable();
                    // 删除成功后的操作
                    layer.msg('删除文章分类成功！');
                }
            })
            layer.close(index);
        });
    })
})