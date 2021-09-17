let chats = []
const socket = io();



socket.on('message received', newMessage => {
    console.log(newMessage)
    $('#messages').append(ReceiverDiv(newMessage))
    $('#messages').scrollTop($('#messages')[0].scrollHeight);

})

$(document).ready(function () {


    getChats();







})



$('#send').submit(async function (e) {
    e.preventDefault()
    const content = $('#input-content').val()
    if (content.length == 0 || content == '') return;


    sendMessage(content);

})




async function sendMessage(content) {
    try {
        const results = await axios.post('/api/messages', { content: content, chatID: getChatID() })
        if (results.status != 201)
            throw new Error(results.statusText)

        const isHas = document.getElementById('noting')
        if (isHas)
            $('#noting').remove()

        $('#messages').append(SenderDiv(results.data))
        $('#input-content').val('')
        $('#messages').scrollTop($('#messages')[0].scrollHeight);

        socket.emit('new message', results.data)

    } catch (error) {
        console.log(error)
    }
}

async function getChats() {
    try {
        const result = await axios.get('/api/chats')
        console.log(result.data)
        if (result.status != 200)
            throw new Error(result.statusText)
        chats = result.data.chats



        const chatID = getChatID()

        chats.forEach(chat => {
            addChat(chat)
        })

        if (chatID) {
            const chat = chats.find(chat => chat._id == chatID)
            if (!chat)
                return alert('چت یافت نشد')

            await getMessages(chat._id)
            socket.emit('join room', chat._id)
            window.history.pushState("", "", `/panel/chats?chatID=${chatID}`);
        }





    } catch (error) {
        console.log(error)
    }



}

function addChat(chat) {
    const myID = $('#myID').val()
    if (!myID) return;
    const user = chat.users.find(us => us.id != myID)

    chat.user = user
    delete chat.users

    const divChat = chatsHtml(chat)
    $('#chats').append(divChat)






    $('.openChat').click(async function (e) {
        const element = $(e.currentTarget)
        const ref = element.data('ref')
        const chat = chats.find(chat => chat._id == ref)
        if (!chat)
            return alert('چت یافت نشد')
        window.history.pushState("", "", `/panel/chats?chatID=${ref}`);

        socket.emit('join room', ref)

        getMessages(chat._id)


    })








    function chatsHtml(chat) {
        // active text-white
        const classes = `list-group-item list-group-item-action list-group-item-light rounded-0`
        let avatar;
        if (chat.user.profile.avatar.startsWith("https"))
            avatar = chat.user.profile.avatar
        else
            avatar = `https://userskalamat.s3.ir-thr-at1.arvanstorage.com/${chat.user.profile.avatar}`
        return `
    <a href='#' class="${classes} openChat" data-ref='${chat._id}' id='${chat._id}' >
                        <div class="media"><img src="${avatar}" alt="user" width="50" class="rounded-circle">
                            <div class="media-body ml-4">
                                <div class="d-flex align-items-center justify-content-between mb-1">
                                    <h6 class="mb-0">${chat.user.name}</h6><small class="small font-weight-bold">25 Dec</small>
                                </div>
                                <p class="font-italic mb-0 text-small" id='${chat._id}-latestMessage'>${chat.latestMessage?.content || ''}</p>
                            </div>
                        </div>
     </a>
    
    `}


}

function screenChat(messages, chatID) {
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
        el.classList.remove("active");
    });
    $('#' + chatID)?.addClass('active text-white')
    $('#messages').html('')

    messages.forEach(message => {
        const myID = $('#myID').val()
        if (message.sender._id == myID)
            $('#messages').append(SenderDiv(message))
        else
            $('#messages').append(ReceiverDiv(message))

    })
    if (messages.length == 0)
        $('#messages').append(`<div class="text-center" id='noting'>
                                <h5 class="text-muted">هیچ پیامی ارسال نشده است</h5>
                            </div>`)

    $('#messages').scrollTop($('#messages')[0].scrollHeight);






}

async function getMessages(chatID) {
    try {
        const results = await axios.get(`/api/chats/${chatID}/messages`)
        if (results.status != 200)
            throw new Error(results.statusText)
        screenChat(results.data.messages, chatID)
    } catch (error) {
        pp.add({
            type: 'error',
            title: 'خطـا',
            content: error.message,
        });
    }

}


function getChatID() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('chatID')
}

function SenderDiv(message) {
    return `
        
           <div class="media w-50 ml-auto mb-3" id='${message._id}'>
                <div class="media-body">
                    <div class="bg-primary rounded py-2 px-3 mb-2">
                        <p class="text-small mb-0 text-white">${message.content}</p>
                    </div>
                    <p class="small text-muted">${moment(message.createdAt).fromNow()}</p>
                </div>
            </div>
        
        `
}

function ReceiverDiv(message) {
    return `
            <div class="media w-50 mb-3" id='${message._id}' >
                <img src="${message.sender.profile.images}" alt="user"
                    width="50" class="rounded-circle">
                <div class="media-body ml-3">
                    <div class="bg-light rounded py-2 px-3 mb-2">
                        <p class="text-small mb-0 text-muted">${message.content}</p>
                    </div>
                    <p class="small text-muted">${moment(message.createdAt).fromNow()}</p>
                </div>
            </div>
        `
}
