<?php
  //Сессия
  session_name('tz_test_commenting');
  session_start();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="../css/commentsarea.css" />
  </head>
  <body>
    <div id="eCContainer">
      <?php 
        //Вот тут у нас настраивается переменная для получения доступа к базе данных, то есть конфигурация БД
        //Пока что стандартный root без пароля. 
        //Для безопасности хорошо было бы создать собственного пользователя, дать ему пароль и ему назначить привелегии по доступу к базе данных (настройки вплоть по количеству запросов доступных в час
        $dbSettings = array(
          'db_host' => 'localhost',
          'db_user' => 'root', 
          'db_pass' => '',
          'db_name' => 'tzchat'
        );
        
        //Выводим ошибочки
        error_reporting(E_ALL ^ E_NOTICE);
        
        //Подключаем наш класс базы данных!
        require "classes/DataBase.class.php";
        //Подключаем класс комментов. Включает в себя функции-запросы.
        require "classes/TzChat.class.php";
        
        //Функция для отрисовки комментариев
        function createMessagePost($entryMessage)
        {
          echo "<div class=\"OneCommentContainer\">";
          echo "<img class=\"commentAvatar\"\ src=\"../img/no_avatar.png\" alt=\"Аватар пользователя\">";
          echo "<h2 class=\"commentAuthorHeader\">".$entryMessage[1]." (".$entryMessage[2].")</h2>";
          echo "<span class=\"commentHeaderTime\">".date("d.m.Y H:i:s",strtotime($entryMessage[4]))."</span>";
          echo "<div class=\"commentText\">".nl2br($entryMessage[3])."</div>";
          echo "</div>";
        }
        
        //Да начнется процесс формирования списка сообщений :)
        try
        {
          // Соединение с базой данных
          DataBase::init($dbSettings);
          $responseResult = TzChat::getEntriesCount();
          if($responseResult>0)
          {
            $arrMessages = TzChat::getMessages();
            while ($eMessage = $arrMessages->fetch_row()) 
            {
              createMessagePost($eMessage);
            }
          }
        }
        catch(Exception $e)
        {
          die(json_encode(array('error' => $e->getMessage())));
        }
      ?>
    </div>
  </body>
</html>