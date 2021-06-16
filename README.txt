Техническое задание (Реализация сообщений):
Mysql база носит наименование - tzchat. Включает в себя табицу usermessages.

Состав usermessages:
* id - Тип int, autoincrement.
* fio - Тип tinytext
* email - Тип tinytext
* content - Тип text
* publicationtime - Тип timestamp. Автоматически назначает время, при создании записи (CURRENT_TIME)
