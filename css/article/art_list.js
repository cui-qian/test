$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义 art-template 中的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        // 2012-12-12 12:12:12

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义了一个补零的函数
    function padZero(num) {
        // if(num > 9) {
        //   return num
        // }
        // return '0' + num
        return num > 9 ? num : '0' + num
    }

    // 定义一个参数对象，将来发请求，获取文章列表的时候，
    // 需要通过 ajax 把这个参数对象，提交到服务器
    var q = {
        pagenum: 1, // 页码值（默认获取第1页数据）
        pagesize: 2, // 每页显示几条数据（默认2条）
        cate_id: '', // 文章的分类（表示要获取哪个分类下的文章）
        state: '' // 文章的状态（表示要获取哪种状态的文章）
    }

    initTable();
    initCate();

    // 定义一个获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 表格数据请求成功之后,渲染分页
                // 把真实的总数据条数,传递给分页插件
                renderPage(res.total);
            }
        })
    }
    // 定义一个渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pager', //容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //设置每页显示几条数据
            curr: q.pagenum, //设置让哪个页码值为高亮
            //控制分页中包含哪些控制项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //每页条数的选择项
            limits: [2, 3, 5, 10],
            // 只要页码值发生切换就会触发jump
            // 首次渲染分页的时候,会立即触发一次jump
            jump: function (obj, first) {
                // console.log(obj)
                // 1.获取到最新的页码值
                var newPage = obj.curr;
                // 2.更新参数对象中的页码值
                q.pagenum = newPage;

                // 获取最新的条目数,并且设置给q.pagesize
                q.pagesize = obj.limit;

                // 调用initTable(); 根据最新的参数,获取表格的数据
                // initTable();
                // 这个first是一个 布尔值,用来指示是否第一次渲染分页
                if (first !== true) {
                    initTable();
                }
            }
        })
    }


    // 初始化文章的分类
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败！')
                }
                // 渲染模板结构
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知 layui 重新渲染一下筛选区域的 form 表单
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 拿到表单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格数据
        initTable()
    })

    $('tbody').on('click', '.edit', function () {
        location.href = '../article/art_pub.html'
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
                        return layer.msg('删除文章失败!')
                    }
                    // 重新渲染文章分类列表
                    initTable();
                    // 删除成功后的操作
                    layer.msg('删除文章成功！');
                }
            })
            layer.close(index);
        });
    })

})