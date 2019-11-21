//Connecting to socket io
const socket = io.connect('http://localhost:8080')

//Notification class
class Notification
{
   constructor(_element)
   {
      this.element = _element
      this.elementMessage = this.element.querySelector('.js-notificationMessage')
   }
   
   displayNotification(type, message)
   {  
      //We modify the content the message
      this.elementMessage.innerHTML = message
      this.element.classList.remove('notificationDisplay')
      
      //return undefinded to replay animation
      void this.element.offsetWidth
      
      //If the type is success we replace notification--error by notification--success
      if(type == 'success')
         this.element.classList.replace('notification--error', 'notification--success')
      else
         this.element.classList.replace('notification--success', 'notification--error')

      //We add the class to display the div of the notification
      this.element.classList.add('notificationDisplay')
   }
}

//Notification object
const notification = new Notification(document.querySelector('.js-notification'))