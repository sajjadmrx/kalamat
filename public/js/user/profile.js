$('#sendMessage').on('click', async function () {
    const userID = getUserId();


    // loading 
    $('#sendMessage').html('<i class="fa fa-spinner fa-spin"></i> ارسال پیغـام');

    try {

        const result = await axios.post('/api/chats', {
            user: userID
        })
        if (result.status == 201)
            window.location.href = `/panel/chats?chatID=${result.data.chat_id}`;

        throw new Error(result.data.message);
    } catch (error) {
        $('#sendMessage').html('ارسال پیغـام');
        pp.add({
            type: 'error',
            title: 'خطـا',
            content: error.message,
        });
    }
})

function getUserId() {
    var userId = $('#userID').val();
    return userId;
}

