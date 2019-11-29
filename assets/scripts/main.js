const body = document.querySelector('body')
const videoSelectorSection = body.querySelector('.js-videoSelectorSection')
const videoPlayerSection = body.querySelector('.js-videoPlayerSection')
const joinChannelAlert = body.querySelector('.js-joinChannelAlert')
const alertButton = joinChannelAlert.querySelector('.js-alertButton')

const currentUrl = window.location.href
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
      this.controls = this.element.querySelector('.js-controls')
      this.currentTimeText = this.controls.querySelector('.js-currentTimeText')
      this.buttonPlayPause = this.controls.querySelector('.js-buttonPlayPause')
      this.seekBarElement = this.controls.querySelector('.js-seekBar')
      this.seekBarFillElement = this.controls.querySelector('.js-fill')

      this.copyChannel()
      this.timeUpdate()
      this.playPause()
   }

   //copy link of the channel into clipboard
   copyChannel()
   {  
      this.copyChannelButton.addEventListener('click', () => 
      {

         const sharedLink = window.location.hostname + ':' + location.port + '/video-player.html?ChannelId=' + this.channelId

         const tempInput  = document.createElement('input')

         //We create an input to copy the sahred link
         tempInput.value = sharedLink
         document.body.appendChild(tempInput)
         tempInput.select()
         document.execCommand('copy')
         document.body.removeChild(tempInput)

         notification.displayNotification('success', 'You copied the link to the clipboard')
      })
   }

   timeUpdate()
   {
      //display the current time of the video
      this.video.addEventListener('timeupdate', () => 
      {
         this.timeTextUpdate()
         this.seekBarUpdate()
      })
   }

   //update the text of the time
   timeTextUpdate()
   {
      let currentMinutes = Math.floor(this.video.currentTime / 60)
      let currentSeconds = Math.floor(this.video.currentTime - currentMinutes * 60) //On retire les minutes des secondes courantes
      // if the number if < 10 we display a 0
      currentSeconds = ('0' + Math.floor(currentSeconds)).slice(-2)
      currentMinutes = ('0' + Math.floor(currentMinutes)).slice(-2)

      this.currentTimeText.innerText = `${currentMinutes}:${currentSeconds}`
   }

   playPause()
   {
      this.buttonPlayPause.addEventListener('click', () => 
      {
         if(this.video.paused)
         {
            this.video.play()
            this.buttonPlayPause.classList.replace('buttonPlayPause--play', 'buttonPlayPause--pause')
            socket.emit('setPlayPause', { action: 'play' })
         } 
         else 
         {
            this.video.pause()
            this.buttonPlayPause.classList.replace('buttonPlayPause--pause', 'buttonPlayPause--play')
            socket.emit('setPlayPause', { action: 'pause' })
         }
      })
   }

   seekBarUpdate()
   {
      const ratio = this.video.currentTime / this.video.duration
      this.seekBarFillElement.style.transform = `scaleX(${ratio})`
   }
}

//Notification object
const notification = new Notification(document.querySelector('.js-notification'))
//Video link form object
const videoLinkForm = new VideoLinkForm(document.querySelector('.js-videoLinkForm'))
//video player object
const videoPlayer = new VideoPlayer(document.querySelector('.js-videoPlayerSection'))

//We check if the client puted a channelId into the url
if(currentUrl.includes('?ChannelId=#'))
{ 
   joinChannelAlert.classList.add('is-active')

   alertButton.addEventListener('click', () => 
   {
      const askedChannelId = currentUrl.substring(currentUrl.lastIndexOf('#'), currentUrl.length)
         
      console.log(`Trying to join the channel ${ askedChannelId }`)

      //We send the channel is to the server 
      socket.emit('joinChannel', { channelId: askedChannelId })

      joinChannelAlert.classList.remove('is-active')
   })
}

//If the client recieve 'SetChannelId'
socket.on('setChannelId', (data) => 
{
   //We save the channel into videoPlayer.channelId
   videoPlayer.channelId = data.channelId

   //Change the displaying of the channel
   videoPlayer.channelIdSpan.innerHTML = videoPlayer.channelId

   notification.displayNotification('success', 'Your channel have created a channel')
})

//If the client recieve 'SetChannelId'
socket.on('joinChannel', (data) => 
{
   videoPlayer.videoUrl = data.videoUrl
   videoPlayer.video.src = videoPlayer.videoUrl

   videoPlayer.channelId = data.channelId
   videoPlayer.channelIdSpan.innerText = videoPlayer.channelId

   //Hidding videoSelectorSection
   videoSelectorSection.classList.remove('is-active')

   //Display videoPlayerSection
   videoPlayerSection.classList.add('is-active')

   notification.displayNotification('success', 'You have joined a channel')
})

//If the client recieve 'Error'
socket.on('errorSend', (data) => 
{
   let errorMessage

   switch (data.ErrorId)
   {
      case 'channelDoesntExist':
         errorMessage = 'This channel doesn\'t exist'
   }

   notification.displayNotification('error', errorMessage)
})

//If the client recieve 'Success'
socket.on('successSend', (data) => 
{
   let succesMessage

   switch (data.SuccessId)
   {
      case 'userJoinedChannel':
         succesMessage = 'An user joined your channel'
   }

   notification.displayNotification('success', succesMessage)
})

//If the client recieve 'setPlayPause'
socket.on('setPlayPause', (data) => 
{
   if(data.action == 'play')
   {
      videoPlayer.video.play()
      videoPlayer.buttonPlayPause.classList.replace('buttonPlayPause--play', 'buttonPlayPause--pause')
   }
   else
   {
      videoPlayer.video.pause()
      videoPlayer.buttonPlayPause.classList.replace('buttonPlayPause--pause', 'buttonPlayPause--play')
   }
})