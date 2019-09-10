const playBtn = document.querySelector('.playBtn');
const randomBtn = document.querySelector('.randomBtn');
const stopBtn = document.querySelector('.stopBtn');
const weatherList = document.querySelectorAll('.whetherShowerContainer');
const audioList = document.querySelectorAll('audio');
const volumeRangeList = document.querySelectorAll('.weatherVolumeRange');
const totalVolume = document.querySelector('.totalVolumeRange');
const logo = document.querySelector('.logo a img');
let currentPlayingList = [];//only opacity

function togglePlayBtn(e) {
    if (this.classList.contains('fa-play')) {
        currentPlayingList.map(audio => document.querySelector(`audio[data-audio=${audio}]`)).forEach(audio => audio.pause());
        this.classList.remove('fa-play');
        this.classList.add('fa-pause');
    } else {
        currentPlayingList.map(audio => document.querySelector(`audio[data-audio=${audio}]`)).forEach(audio => audio.play());
        this.classList.remove('fa-pause');
        this.classList.add('fa-play');
    }
}

function transparentChanging(className, opacityClassName, opacityNextSibling) {
    className.style.opacity = opacityClassName;
    className.nextElementSibling.style.opacity = opacityNextSibling;
}

function playSound(e, audioPara) {
    let audio = audioPara || document.querySelector(`audio[data-audio=${this.dataset.audio}]`);
    const opacity = audio.volume <= 0.3 ? 0.3 : audio.volume;
    const togglePlay = document.querySelector('.playBtn');
    if (audio.paused) {
        if (togglePlay.classList.contains('fa-pause')) {
            if (currentPlayingList.indexOf(this.dataset.audio) == -1) {
                transparentChanging(this, opacity, 1);
                currentPlayingList.push(audio.dataset.audio);
                currentPlayingList = [...new Set(currentPlayingList)];
            } else {
                transparentChanging(this, 0.2, 0);
                const index = currentPlayingList.indexOf(audio.dataset.audio);
                currentPlayingList.splice(index, 1);
            }
        } else {
            transparentChanging(this, opacity, 1);
            currentPlayingList.push(audio.dataset.audio);
            currentPlayingList = [...new Set(currentPlayingList)];
            audio.play();
        }
    } else if (!audio.paused) {
        audio.pause();
        const index = currentPlayingList.indexOf(audio.dataset.audio);
        currentPlayingList.splice(index, 1);
        transparentChanging(this, 0.2, 0);
    }
}

function changeVolume(e) {
    const audio = document.querySelector(`audio[data-audio=${this.dataset.audio}]`);
    const weather = document.querySelector(`div[data-audio=${this.dataset.audio}].whetherShowerContainer`);
    audio.volume = this.value;
    weather.style.opacity = this.value <= 0.3 ? 0.3 : this.value;//Opacity depend on audio volume but not less than 0.2
}

function brandHover(e) {
    this.src = '../img/logo-hover.png';
}

function brandOut(e) {
    this.src = '../img/logo.png';
}

function playRandom(e) {
    let randSoundNum = Math.floor(Math.random() * Array.from(weatherList).length + 1);//Number of sound want to play
    randSoundNum = (randSoundNum / 5).toFixed(0) == 0 ? 1 : (randSoundNum / 4).toFixed(0);//Degree amount of sound for playing
    const audioArray = Array.from(audioList);
    for (let i = 0; i < randSoundNum; i++) {
        let randomSoundIndex = Math.floor(Math.random() * Array.from(audioArray).length + 1);
        let audio = audioArray.splice(randomSoundIndex, 1).pop();
        let weatherPlayer = document.querySelector(`.whetherShowerContainer[data-audio=${audio.dataset.audio}]`);
        playSound.call(weatherPlayer, audio);
    }
}

function stopAllAudio(e) {
    audioList.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.5;
    });
    weatherList.forEach(item => {
        transparentChanging(item, 0.2, 0);
    });
    volumeRangeList.forEach(item => {
        item.value = 0.5;
    })
    currentPlayingList = [];
}

function setUpAudio(audio) {
    audio.loop = true;
    audio.volume = 0.5;
}

audioList.forEach(audio => setUpAudio(audio));
playBtn.addEventListener('click', togglePlayBtn);
randomBtn.addEventListener('click', playRandom)
stopBtn.addEventListener('click', stopAllAudio)
weatherList.forEach(item => item.addEventListener('click', playSound))
volumeRangeList.forEach(item => item.addEventListener('input', changeVolume));
logo.addEventListener('mouseover', brandHover)
logo.addEventListener('mouseout', brandOut)