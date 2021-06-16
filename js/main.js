//Экстренная очистка сообщения на старте
function ready() {
  document.getElementById("miMessage").value = "";
}
document.addEventListener("DOMContentLoaded", ready);

//Часть скрипта, отвечающая за автообновление содержимого чата. По дефолту - раз в 5 сек.
setInterval(chatRefresher, 5000);
function chatRefresher()
{
  var chatFrame = document.getElementById("comMessagesFrame");
  var iframe = document.getElementById('comMessageForRefresh');
  iframe.style.display = "none";
  iframe.src = chatFrame.src;
  iframe.onload = function()
  {
    chatFrame.contentWindow.document.body = iframe.contentWindow.document.body;
  }
}

//Эквивалент htmlspecialchars из php, только заменяем новые линии на br (для фэйк сообщения)
function escapeHtmlButIgnoreBr(text) {
  text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
  text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
  return text;
}

//Часть скрипта, отвечающая за отправку запроса на создание сообщения
//Конечно параметры запроса видны, но скрипты можно по разному заобфусцировать или сломать мозг. В общем вы поняли
function sendMessage()
{
  var elemSendButton = document.getElementById("miSendMessageBtn");
  elemSendButton.disabled = true;
  var elemFIO = document.getElementById("miFIO");
  elemFIO.disabled = true;
  var elemEMAIL = document.getElementById("miEMAIL");
  elemEMAIL.disabled = true;
  var elemMessageText = document.getElementById("miMessage");
  elemMessageText.disabled = true;
  
  if(elemFIO==null || elemEMAIL==null || elemMessageText==null) 
  {
    return;
  }

  var xmlHRequest = new XMLHttpRequest();
  var sendFormData = new FormData();
  sendFormData.append("Action", "CreMsg");
  sendFormData.append("UN", elemFIO.value);
  sendFormData.append("UM", elemEMAIL.value);
  sendFormData.append("UT", elemMessageText.value);
  xmlHRequest.open('POST', '/denwer/php/Requests.php');
  xmlHRequest.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) 
    {
     if(this.responseText!="Nothing")
     {
      var aResponseResult = JSON.parse(this.responseText);
      if(aResponseResult[0]=="OK" && aResponseResult[1]=="OK" && aResponseResult[2]=="OK")
      {
       //Делаем фэйк сообщение
       var chatFrame = document.getElementById("comMessagesFrame");
       var elemCopy = chatFrame.contentWindow.document.getElementById("eCContainer").lastElementChild;
       var elemCopyReady = chatFrame.contentWindow.document.createElement("div");
       elemCopyReady.classList.add("OneCommentContainer");
       var fMsgInnerContent = "<img class=\"commentAvatar\"\ src=\"../img/no_avatar.png\" alt=\"Аватар пользователя\">";
       fMsgInnerContent+="<h2 class=\"commentAuthorHeader\"></h2>";
       fMsgInnerContent+="<span class=\"commentHeaderTime\"></span>";
       fMsgInnerContent+="<div class=\"commentText\"></div>";
       elemCopyReady.innerHTML = fMsgInnerContent;
       chatFrame.contentWindow.document.getElementById("eCContainer").appendChild(elemCopyReady);
       elemCopyReady.classList.add("fakeMessage");
       elemCopyReady.childNodes[1].innerHTML = elemFIO.value + " (" + elemEMAIL.value + ")";
       elemCopyReady.childNodes[2].style.display = 'none';
       elemCopyReady.childNodes[3].innerHTML = escapeHtmlButIgnoreBr(elemMessageText.value);
       elemMessageText.value = "";
       chatRefresher();
      } else {
        var strErrorMsg = "Невозможно отправить сообщение так как:";
        aResponseResult.forEach(
          function showMsgSendErrors(entry) 
          {
            if(entry=="OK")
            {
              return;
            }
            var strOneError = entry.replace("Error: ", "");
            switch(strOneError)
            {
              case "Invalid FIO":
              {
                strOneError = "- Указан неверный формат ФИО";
                if(!elemFIO.classList.contains("errRedElement")) 
                {
                  elemFIO.classList.add("errRedElement");
                }
                break;
              }
              case "Invalid Email":
              {
                strOneError = "- Указан неверный формат Email";
                if(!elemEMAIL.classList.contains("errRedElement")) 
                {
                  elemEMAIL.classList.add("errRedElement");
                }
                break;
              }
              case "MSG0":
              {
                strOneError = "- Длина сообщения равна нулю";
                if(!elemMessageText.classList.contains("errRedElement")) 
                {
                  elemMessageText.classList.add("errRedElement");
                }
                break;
              }
              case "MSGTOOBIG":
              {
                strOneError = "- Длина сообщения превышает 2000 символов";
                if(!elemMessageText.classList.contains("errRedElement")) 
                {
                  elemMessageText.classList.add("errRedElement");
                }
                break;
              }
            }
            if(strErrorMsg.length<=0)
            {
              strErrorMsg = strOneError;
            } else {
              strErrorMsg += "\n"+strOneError;
            }
          }
        );
        alert(strErrorMsg);
      }
     }
    }
    elemSendButton.disabled = false;
    elemFIO.disabled = false;
    elemEMAIL.disabled = false;
    elemMessageText.disabled = false;
  };
  xmlHRequest.send(sendFormData);
}

//Ивент изменения текста поля ФИО
function onFIOFieldChanged()
{
  var elemFIO = document.getElementById("miFIO");
  if(elemFIO.classList.contains("errRedElement")) 
  {
    elemFIO.classList.remove("errRedElement");
  }
}

//Ивент изменения текста поля Email
function onEmailFieldChanged()
{
  var elemEMAIL = document.getElementById("miEMAIL");
  if(elemEMAIL.classList.contains("errRedElement")) 
  {
    elemEMAIL.classList.remove("errRedElement");
  }
}

//Ивент изменения текста поля сообщения
function onMSGTextFieldChanged()
{
  var elemMessageText = document.getElementById("miMessage");
  if(elemMessageText.classList.contains("errRedElement")) 
  {
    elemMessageText.classList.remove("errRedElement");
  }
}