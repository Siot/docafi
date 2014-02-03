<?php
    session_start();
    if ( isset( $_SESSION['CAPTCHA_VERIFY_OK'] ) ) {
        unset ($_SESSION['CAPTCHA_VERIFY_OK']);
    }
?>