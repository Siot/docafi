<?php
session_start();

$publickey = ""; //Set your public key here;
$privatekey = ""; //Set your private key here;
$recaptchalib = "libs/recaptchalib.php";

//mode=js -> specify js ajax request.

if(isset($_SESSION['CAPTCHA_VERIFY_OK']))
{
  if( isset($_GET['mode']) )
  {
    echo "true";
    
  }else{
    returnDownload();
  }
}else{
  require_once($recaptchalib);
  if(isset($_POST["recaptcha_response_field"]))
  {
    $resp = recaptcha_check_answer ($privatekey,
                                  $_SERVER["REMOTE_ADDR"],
                                  $_POST["recaptcha_challenge_field"],
                                  $_POST["recaptcha_response_field"]);

    if (!$resp->is_valid && $resp->error != "recaptcha-not-reachable")
    {
      // What happens when the CAPTCHA was entered incorrectly
      echo "The reCAPTCHA wasn't entered correctly. Try it again.";
      if(!isset($_GET['mode']))
      {
          showForm();
      }
    } else {
      // Your code here to handle a successful verification.
      $_SESSION['CAPTCHA_VERIFY_OK'] = true;
      if(isset($_GET['mode']))
      {
        echo "true";
      }else{
        returnDownload();
      }
    }   
  }else{
    if(isset($_GET['mode']))
    {
        echo $publickey;
    }else{
        showForm();
    }
  }
}


function returnDownload() 
{
   header( "Content-type: application/pdf" );
   echo file_get_contents($_REQUEST['file']);
}

function showForm(){
    echo '<html><head></head><body><form name="input" action="" method="POST" onsubmit="setTimeout(\'window.history.back(-1)\', 10000)">';
    echo recaptcha_get_html($publickey);
    echo '<input type="submit" /></form></body></html>';
}

?>
