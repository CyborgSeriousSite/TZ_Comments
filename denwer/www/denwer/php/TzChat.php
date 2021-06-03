<?php
class TzChat
{
  public static function getEntriesCount()
  {
    $result = DataBase::query('SELECT count(*) as total from usermessages');
    return $result;
  }
}
?>