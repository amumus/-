$('#bt_submit').on('click',function () {
    $.ajax({
       type:'POST',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#messageContent').val(),
        },
        success:function (responseData) {
            $('#messageContent').val('');
            console.log('1111');
            console.log(responseData.data.content.comments.length);
            renderComment(responseData.data.content.comments) ;
        }
    });
});
function renderComment(comments) {
    console.log(comments[0].username);
    for(var i=0;i<comments.length;i++){
        var html='';
        for(var i=0;i<comments.length;i++){
            html += '<div class ="messageBox">'+
                '<p><span>'+comments[i].username+'</span><span>'+comments[i].postTime+'</span></p>'+
                '<p>'+comments[i].content+'</p>'+
                '</div>';
        }

        $('.messageList').html(html);
    }
}