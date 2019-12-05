class JoinChannelForm {
    constructor(_element){
        this.element = _element
        this.submitButton = this.element.querySelector('.js-submitButton')

        this.joinChannel()
    }

    joinChannel() {
        this.submitButton.addEventListener('click', (_event) => {
            _event.preventDefault()
            document.location.href= `video-player.html?ChannelId=${ this.element.querySelector('.js-videoChannel').value }`
        })
    }
}

const joinForm = new JoinChannelForm(document.querySelector('.js-joinChannelForm'))