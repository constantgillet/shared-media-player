const body = document.querySelector('body')
const videoSelectorSection = body.querySelector('.js-videoSelectorSection')
const videoPlayerSection = body.querySelector('.js-videoPlayerSection')

//Connecting to socket io
const socket = io.connect('http://localhost:8080')
console.log("connected to socket")

let videoLink

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
      //void this.element.offsetWidth
      
      //If the type is success we replace notification--error by notification--success
      if(type == 'success')
         this.element.classList.replace('notification--error', 'notification--success')
      else
         this.element.classList.replace('notification--success', 'notification--error')

      //we wait one frame
      window.requestAnimationFrame(() => 
      {
         //We add the class to display the div of the notification
         this.element.classList.add('notificationDisplay')
      })
   }
}



class VideoLinkForm 
{
   constructor(_element)
   {
      this.element = _element
      this.submitButton = this.element.querySelector('.js-submitButton')

      this.submitButton.addEventListener('click', this.validation(_element.querySelector('.js-linkInput')))
   }

   validation(_linkInput) 
   {
      return function(_event)
      {
         _event.preventDefault()

         const value = _linkInput.value
         
         //the input is empty
         if(value.length != 0)
         {  
            //We chain if the string of value contain http and // and .mp4
            if(value.substr(0, 4) == 'http' && value.includes('//') && value.substr(value.length-4, value.length-1) == '.mp4')
            {
               notification.displayNotification('success', 'Your Channel has been created')

               videoLink = value

               socket.emit('createChannel', {'videoLink': value})

               videoPlayer.video.src = value

               //Hidding videoSelectorSection
               videoSelectorSection.classList.remove('is-active')

               //Display videoPlayerSection
               videoPlayerSection.classList.add('is-active')

            }
            else 
            {
               notification.displayNotification('error', 'This is not an mp4 link')
            }
         }
         else 
         {
            notification.displayNotification('error', 'The link is empty')
         }
      }
   }
}

class VideoPlayer
{
   constructor(_element)
   {
      this.element = _element
      this.channelIdSpan = this.element.querySelector('.js-channelIdSpan')
      this.video = this.element.querySelector('.js-video')
      this.channelId = null
      this.videoUrl = null
      this.copyChannelButton = this.element.querySelector('.js-copyChannelButton')
      
      this.copyChannel()
   }

   //copy link of the channel function
   copyChannel()
   {  
      this.copyChannelButton.addEventListener('click', () => 
      {
         const sharedLink = window.location.hostname + ':' + location.port + '/video-player.html?channelId=' + this.channelId
         sharedLink.select()
         document.execCommand('copy')
      })
   }
}

//Notification object
const notification = new Notification(document.querySelector('.js-notification'))
//Video link form object
const videoLinkForm = new VideoLinkForm(document.querySelector('.js-videoLinkForm'))
//video player object
const videoPlayer = new VideoPlayer(document.querySelector('.js-videoPlayerSection'))

//If the client recieve 'SetChannelId'
socket.on('setChannelId', (data) => 
{
   alert('Le chanel est' + data.channelId)

   //We save the channel into videoPlayer.channelId
   videoPlayer.channelId = data.channelId

   //Change the displaying of the channel
   videoPlayer.channelIdSpan.innerHTML = videoPlayer.channelId
})