<?php
setlocale(LC_ALL, "ru_RU.UTF-8");
error_reporting(E_ALL ^ E_NOTICE);

require "classes/DataBase.class.php";
$dbSettings = array(
  'db_host' => 'localhost',
  'db_user' => 'root', 
  'db_pass' => '',
  'db_name' => 'tzchat'
);

if(isset($_POST["Action"]))
{
  switch($_POST["Action"])
  {
    //Создание сообщений
    case "CreMsg":
    {
      if(isset($_POST["UN"]) && isset($_POST["UM"]) && isset($_POST["UT"]))
      {
        $inpUserName = htmlspecialchars($_POST["UN"]);
        $inpUserEmail = htmlspecialchars($_POST["UM"]);
        $inpText = ltrim(htmlspecialchars($_POST["UT"]));
        
        $responseJSON = array();
        $isFullValid = true;
        
        //Валидация ФИО
        $fioPattern = '/^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/u'; //Паттерн для ФИО взят из открытых источников. Как говорится зачем изобретать изобретенный велосипед
        if(preg_match($fioPattern, $inpUserName)) {
          array_push($responseJSON, "OK");
        } else {
          array_push($responseJSON, "Error: Invalid FIO");
          $isFullValid = false;
        }
        
        //Валидация почты
        $emailPattern = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/u';
        if(preg_match($emailPattern, $inpUserEmail)) {
          array_push($responseJSON, "OK");
        } else {
          array_push($responseJSON, "Error: Invalid Email");
          $isFullValid = false;
        }
        
        //Валидация текста
        if(strlen($inpText)>0 && strlen($inpText)<=2000)
        {
          array_push($responseJSON, "OK");
        } else {
          if(strlen($inpText)<=0)
          {
            array_push($responseJSON, "Error: MSG0");
          } else {
            array_push($responseJSON, "Error: MSGTOOBIG");
          }
          $isFullValid = false;
        }
        
        //После успешных проверок создаем сообщение в БД
        if($isFullValid)
        {
          try
          {
            DataBase::init($dbSettings);
            DataBase::query("INSERT INTO usermessages (fio, email, content) VALUES ('".$inpUserName."', '".$inpUserEmail."', '".$inpText."')");
          }
          catch(Exception $e)
          {
            array_push($responseJSON, "Error: Server error!");
          }
        }
        echo json_encode($responseJSON);
      } else {
        echo "Nothing";
      }
      break;
    }
    default: echo "Nothing";
  }
} else {
  echo "Nothing";
}
?>