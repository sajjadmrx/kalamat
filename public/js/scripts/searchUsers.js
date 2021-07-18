$('document').ready(function () {

    $('#searchUsers').keyup(async function (e) {
        try {
            var value = e.currentTarget.value;
            clearChilds()
            if (!value) return;
            const result = await fetch(`/api/getusers?username=${value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await result.json();

            if (!data.success)
                throw new Error(data.message);




            data.users.forEach(function (user) {
                var html = `<div class="list-item"><a href="/@${user.username}" class="item-author text-color" data-abc="true">
                <div><img src="${user.profile.images}" class="rounded-circle" height="42" alt="" loading="lazy" /></div>
                <div class="flex"> ${user.username}
                  <div class="item-except text-muted text-sm h-1x">${user.profile.bio || user.name}</div>
                </div>
                <div class="no-wrap">
                  <div class="item-date text-muted text-sm d-none d-md-block">13/12 18</div>
                </div>
                </a>
              </div>
`;
                document.getElementById("resultSearch").innerHTML += html;
            })
        } catch (error) {
            console.log(error);
        }




    });

});

function clearChilds() {
    $("#resultSearch").empty();
}