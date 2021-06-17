Техническое задание (Реализация сообщений):
Mysql база носит наименование - tzchat. Включает в себя табицу usermessages.

Состав usermessages:
* id - Тип int, autoincrement.
* fio - Тип tinytext
* email - Тип tinytext
* content - Тип text
* publicationtime - Тип timestamp. Автоматически назначает время, при создании записи (CURRENT_TIME)

Изначально data располагалась по пути C:\Server\
В этом пути располагалась папка bin в которой был apache (httpd-2.4.48), php 8.0.7, mysql-8.0.25-winx64
Внутри data файлы сайта.