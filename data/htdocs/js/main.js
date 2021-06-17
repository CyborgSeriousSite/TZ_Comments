//Экстренная очистка сообщения на старте
function ready() {
  document.getElementById("miMessage").value = "";
  chatRefresher();
}
document.addEventListener("DOMContentLoaded", ready);

//Часть скрипта, отвечающая за автообновление содержимого чата. По дефолту - раз в 5 сек.
setInterval(chatRefresher, 5000);
function chatRefresher()
{
  var chatFrame = document.getElementById("comMessagesFrame");
  var pageComments = '/php/Comments.php';
  var respHeaders = new Headers();
  respHeaders.append('Content-Type', 'text/html');
  fetch(pageComments,{
      method: 'get',
      headers: respHeaders
  }).then(function(response) {
    response.text().then(function(text) {
      chatFrame.innerHTML = text;
    })
  }).catch(function(error) {
    console.log(error)
  });
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
async function sendMessage()
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
  
  var aResponseResult;
  
  try 
  {
    let sendFormData = new FormData();
    sendFormData.append("Action", "CreMsg");
    sendFormData.append("UN", elemFIO.value);
    sendFormData.append("UM", elemEMAIL.value);
    sendFormData.append("UT", elemMessageText.value);

    let response = await fetch('/php/Requests.php', {
      method: 'POST',
      body: sendFormData
    });
    aResponseResult = await response.json();
    if(aResponseResult.status==null)
    {
      console.log('Успех:', JSON.stringify(aResponseResult));
      if(aResponseResult[0]=="OK" && aResponseResult[1]=="OK" && aResponseResult[2]=="OK")
      {
        //Делаем фэйк сообщение
        var elemFakeMessage = document.createElement("div");
        elemFakeMessage.classList.add("OneCommentContainer");
        elemFakeMessage.classList.add("OneCommentContainer");
        var fMsgInnerContent = "<img class=\"commentAvatar\"\ src=\"../img/no_avatar.png\" alt=\"Аватар пользователя\">";
        fMsgInnerContent+="<h2 class=\"commentAuthorHeader\"></h2>";
        fMsgInnerContent+="<span class=\"commentHeaderTime\"></span>";
        fMsgInnerContent+="<div class=\"commentText\"></div>";
        elemFakeMessage.innerHTML = fMsgInnerContent;
        document.getElementById('comMessagesFrame').appendChild(elemFakeMessage);
        elemFakeMessage.classList.add("fakeMessage");
        elemFakeMessage.childNodes[1].innerHTML = elemFIO.value + " (" + elemEMAIL.value + ")";
        elemFakeMessage.childNodes[2].style.display = 'none';
        elemFakeMessage.childNodes[3].innerHTML = escapeHtmlButIgnoreBr(elemMessageText.value);
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
  } catch (error) {
  }
  elemSendButton.disabled = false;
  elemFIO.disabled = false;
  elemEMAIL.disabled = false;
  elemMessageText.disabled = false;
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