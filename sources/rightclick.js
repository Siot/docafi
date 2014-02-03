var docafiBackend = "../sources/request.php?mode=js";
var docafiClickedLink;
var docafiPublicKey;

$(document).ready(function() {
    $.get( docafiBackend, function( data ) {
        if( data != "true") {
            docafiPublicKey = data;
            $("a[href$='.pdf']").each(function(){
                $(this).on( "contextmenu.docafi", docafiCaptchaBubble );
                //$(this).on("click.docafi",docafiCaptchaBubble);
            });
            
            // And then add a handler for closing the menu when the page is clicked or the menu clicked:

            // Prevent closing context menu by a click
            $('#contextMenu').on('click.docafi', function(event) {
                event.stopPropagation();
            });

            // Close context menu clicking elsewhere
            $(document).on("click.docafi", function(){
                $('#contextMenu').hide();
            });
            
            // Prevents right-click on context menu
            $('#contextMenu').on("contextmenu.docafi", function(event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
            
        }
    });
    
    

});

function docafiShowRecaptcha(element) {
    Recaptcha.create(docafiPublicKey, element, {
        theme: "red",
        callback: Recaptcha.focus_response_field});
}

function docafiValidate() {
    var challenge = Recaptcha.get_challenge();
    var response = Recaptcha.get_response();

    $.ajax({
        type: "POST",
        url: docafiBackend,
        data: {
            recaptcha_challenge_field: challenge,
            recaptcha_response_field: response
        }
    }).done(function(resp) {
            if(resp == "true") {
                $('#contextMenu').hide();
                $("a[href$='.pdf']").each(function(){
                    $(this).off(".docafi");
                });
                docafiClickedLink.trigger("contextmenu");
            } else {
                document.getElementById("message").innerHTML = resp;
                docafiShowRecaptcha('recaptcha_div');
            }
        });
    
    
    
    
    return false;
}


function docafiCaptchaBubble(event) {
    event.preventDefault();
    docafiClickedLink = $(event.target);
    var menu = $('#contextMenu');
    menu.css({
        top: event.pageY+'px',
        left: event.pageX+'px'
    });
    if (event.pageX + menu.width() >= $('body').width()) menu.css('left',Math.max(5,$('body').width()-menu.width()-10) + 'px');
    if (event.pageY + menu.height() >= $(window).height()) menu.css('top',Math.max(5,$(window).height()-menu.height() - 10) + 'px');
    docafiShowRecaptcha('recaptcha_div');
    menu.show();
}


/*
// Know id of originating element
$(document).bind("contextmenu", function(e) {
console.log(e.target.id);
});
*/

// The $('#menu').click could alternatively be handled by the <a> tags in the menu.