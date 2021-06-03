<?php
class TzChat
{
  public static function getEntriesCount()
  {
    $result = DataBase::query('SELECT COUNT(*) as cnt FROM usermessages')->fetch_object()->cnt;
    return $result;
  }
  
  public static function getMessages()
  {
    $result = DataBase::query('SELECT * FROM usermessages ORDER BY publicationtime LIMIT 32');
    return $result;
  }
}
?>