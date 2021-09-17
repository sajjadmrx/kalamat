$('.deleteSession').on('click', async (e) => {
    const value = e.target.attributes[0].value
    if (!value)
        return alert('Please select a session to delete');


    const confirm = window.confirm('Are you sure you want to delete this session?');
    if (confirm) {
        var loading = new Loading({
            direction: 'hor',
            discription: '  لطفا صبر کنید...',
            animationIn: false,
            animationOut: false,
            defaultApply: true,
            animationOriginColor: 'rgb(217, 83, 79)',
        });

        const url = `/api/sessions/${value}`;
        try {
            const result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                }
            })
            const data = await result.json();
            loading.out()
            if (!data.success)
                throw new Error(data.message);


            alert(data.message)

        } catch (error) {
            loading.out()
            pp.add({
                type: 'error',
                title: 'خطـا',
                content: error.message,
            });
        }

    }
    $('#' + value).remove();
})