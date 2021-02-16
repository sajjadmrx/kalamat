$(function(){
    $("#toggle-link").click(function(e) {
        e.preventDefault();
        $("#profileCol").toggleClass("hidden");
        if($("#profileCol").hasClass('hidden')){
            
            $("#contentCol").removeClass('col-md-9');
            $("#contentCol").addClass('col-md-12 fade in');
            $(this).html('Show Menu <i class="fa fa-arrow-right"></i>');
        }else {
            $("#contentCol").removeClass('col-md-12');
            $("#contentCol").addClass('col-md-9');
            $(this).html('<i class="fa fa-arrow-left"></i> Hide Menu');
        }
    });
    $('.tip').tooltip();
});
                                    