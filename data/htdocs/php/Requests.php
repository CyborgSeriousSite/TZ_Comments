<?php
header('Content-Type: application/json');
setlocale(LC_ALL, "ru_RU.UTF-8");
error_reporting(E_ALL ^ E_NOTICE);

if(isset($_POST["Action"]))
{
  //Параметры для подключения к БД
  $db_host = "localhost";
  $db_user = "root";
  $db_pass = "";
  $db_name = "tzchat";
  
  //Класс сообщения
  class userMessage {  
    public $strFIO;
    public $strEmail;
    public $strText;
    
    function __construct($f,$e,$t) {  
      $this->strFIO = $f;  
      $this->strEmail = $e;  
      $this->strText = $t;  
    }  
  }

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
          //Подключаемся к базе данных
          try 
          {
            $db = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
            $umNewEntry = new userMessage($inpUserName,$inpUserEmail,$inpText); //Создаем переменную класс
            $dbRequest = $db->prepare("INSERT INTO usermessages (fio, email, content) values (:strFIO, :strEmail, :strText)");  
            $dbRequest->execute((array)$umNewEntry); //Исполняем запрос с параметрами созданной переменной-класса
          }
          catch(PDOException $e) 
          {
            echo '{"status":"error"}';
          }
        }
        echo json_encode($responseJSON);
      } else {
        echo '{"status":"error"}';
      }
      break;
    }
    default: echo '{"status":"error"}';
  }
} else {
  echo '{"status":"error"}';
}
?>