$('#sendMessage').on('click', async function () {
    const userID = getUserId();

    try {
        const result = await axios.post('/api/chats', {
            user: userID
        })
        if (result.status == 201)
            window.location.href = `/panel/chats?chatID=${result.data.chat_id}`;

        throw new Error(result.data.message);
    } catch (error) {
        console.log(error.message);
    }
})

function getUserId() {
    var userId = $('#userID').val();
    return userId;
}

