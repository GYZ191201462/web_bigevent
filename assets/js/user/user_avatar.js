$(function () {
    var layer=layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮添加点击事件
    $('#btnChooseImage').on('click',function(e){
        $('#file').click();
    })

    // 给文件选择框绑定change事件
    $('#file').on('change',function(e){
        var filelist=e.target.files;
        if(filelist.length===0){
            return layer.msg('请选择要上传的图片！');
        }
        // 拿到用户选择的图片文件
        var file = e.target.files[0];
        // 将图片转换为路径
        var newImgURL = URL.createObjectURL(file);
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 给确定按钮绑定点击事件
    $('#btnUpload').on('click',function(e){
        var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      .toDataURL('image/png')
        // 发起ajax请求，把上传的图片文件传送到服务端
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res){
                if(res.status!==0){
                    return layer.msg('文件上传失败！');
                }
                layer.msg('文件上传成功！');
                // 调用index.js文件中的getUserInfo方法重新渲染头像
                window.parent.getUserInfo();
            }
        })
    })
})