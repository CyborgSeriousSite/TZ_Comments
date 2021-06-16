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
        $db_host = "localhost";
        $db_user = "root";
        $db_pass = "";
        $db_name = "tzchat";
        
        //Выводим ошибочки
        error_reporting(E_ALL ^ E_NOTICE);
        
        //Подключаемся к базе данных
        try 
        {
          $db = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);   
        }
        catch(PDOException $e) 
        {  
          die($e->getMessage());  
        }
        
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
          //Начнем с запроса количества сообщений
          $db_query = $db->query('SELECT COUNT(*) as cnt FROM usermessages');
          $db_query->setFetchMode(PDO::FETCH_NUM);
          $entryCount = $db_query->fetch();
          if($entryCount>0)
          {
            //Запрос на имеющиеся сообщения
            $db_query = $db->query('SELECT * FROM usermessages ORDER BY publicationtime LIMIT 64');
            $db_query->setFetchMode(PDO::FETCH_NUM);
            while ($eMessage = $db_query->fetch()) 
            {
              createMessagePost($eMessage);
            }
          }
        }
        catch(PDOException $e)
        {
          die(json_encode(array('error' => $e->getMessage())));
        }
      ?>
    </div>
  </body>
</html>