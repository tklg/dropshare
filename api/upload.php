<?php

header('Content-Type: text/plain; charset=utf-8');
$target_folder = './uploads';
//print_r($_FILES);

try {
    if (
        !isset($_FILES['file']['error']) ||
        is_array($_FILES['file']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // if ($_FILES['file']['size'] > 1000000) {
    //     throw new RuntimeException('Exceeded filesize limit.');
    // }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    // echo  $finfo->file($_FILES['file']['tmp_name']);
    if (false === $ext = array_search(
        $finfo->file($_FILES['file']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'application/octet-stream',
            'mp4' => 'video/mp4',
            'webm' => 'video/webm',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }
    if (!is_dir($target_folder)) {
    	mkdir($target_folder);
    }
    if (!move_uploaded_file(
        $_FILES['file']['tmp_name'],
        sprintf($target_folder.'/%s.%s',
            sha1_file($_FILES['file']['tmp_name']),
            $ext
        )
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    echo 'ok';

} catch (RuntimeException $e) {

    echo $e->getMessage();

}