const audio = new Audio();
let songs;
let currFolder;
function convertSecondsToTimeFormat(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the output to always display two digits for minutes and seconds
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time as a string
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`/SONGS/${folder}/`)
    response = await response.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1])
        }
    }

}
function playSong(track) {
    audio.src = `/SONGS/${currFolder}/` + track
    audio.play();
    document.body.querySelector(".song-info").innerHTML = track
}
async function displayAlbums() {

    let alb = await fetch(`/SONGS/`)
    alb = await alb.text()
    let div = document.createElement("div")
    div.innerHTML = alb
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/SONGS/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/SONGS/")[1].slice(0, -1);
            let a = await fetch(`/SONGS/${folder}/info.json`)
            a = await a.json()
            document.body.querySelector(".card-container").innerHTML = document.body.querySelector(".card-container").innerHTML + `
                        <div class="card">
                        <div data-folder=${folder} class="play-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="53" height="50" viewBox="0 0 24 24">
                            <path fill="#000" d="m15 12.33l-6 4.33V8z" />
                            </div>
                            <img src="/SONGS/${folder}/cover.jpg" alt="" srcset="">
                            <p>${a.title}</p>
                        <p class="wrap">${a.description}</p>
                        
                        </div>`
        }
    }

}
async function main() {
    await displayAlbums()
    Array.from(document.body.getElementsByClassName("play-btn")).forEach(i => {
        i.addEventListener("click", async (e) => {
            audio.pause();
            document.body.querySelector(".right-footer").style.opacity = 0;
            await getSongs(e.currentTarget.dataset.folder)
            let songCard = document.body.querySelector(".song-list").getElementsByTagName("ul")[0]
            songCard.innerHTML = ""
            for (const song of songs) {
                songCard.innerHTML = songCard.innerHTML + `<li class="flex">
            <img src="ASSETS/music.svg" alt="" srcset="" class="invert">
            <div class="song-content flex">
            <h5>${song.replaceAll("%20", " ")}</h5>
        
            </div>
            <div class="play-song flex align-items justify-content">
        <h5>Play Now</h5>
        <img src="ASSETS/play-button.svg" alt="" srcset="" class="invert" width="18px">
        </div>
        </li>`
            }
            document.body.querySelector(".left").style.left = "0"

            Array.from(document.body.querySelectorAll(".song-list li")).forEach(async e => {
                e.querySelectorAll(".invert")[1].addEventListener("click", () => {
                    let songName = e.querySelector(".song-content").getElementsByTagName("h5")[0].innerText;
                    document.body.querySelector(".right-footer").style.opacity = 1;
                    document.body.querySelector(".right-footer").innerHTML = `<div class="player flex align-items">
            <div class="song-info flex align-items">
            </div>
            <div class="song-buttons flex align-items">
            <svg fill="gray" class="prev" xmlns="http://www.w3.org/2000/svg" width="26" height="26"
            viewBox="0 0 24 24">
            <path d="M17.25 4.336v15.328L9.586 12zM8.5 5v14h-2V5z" />
            </svg>
            <div class="play-audio-border">
            <svg class="pause-audio" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"/></svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="next" width="26" height="26" fill="gray"
            viewBox="0 0 24 24">
            <path d="M6.75 4.336L14.414 12L6.75 19.664zM17.5 5v14h-2V5z" />
            </svg>
            </div>
            <div class="seek-bar">
            <div class="song-current-time">
            </div>
            <div class="circle">
            </div>
            <div class="song-total-time">
            </div>
            </div>
            <div class="additional-options flex">
            <img src="ASSETS/volume.svg" alt="" srcset="" class="vol">
            <input type="range" name="vol-control" class="vol-control" value="100">
            </div>`;
                    playSong(songName)
                    document.body.querySelector(".play-audio-border").addEventListener("click", async () => {
                        if (audio.paused) {
                            audio.play()
                            document.body.querySelector(".play-audio-border").innerHTML = '<svg class="pause-audio" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"/></svg>'
                        } else {
                            audio.pause()
                            document.body.querySelector(".play-audio-border").innerHTML = '<svg class="pause-audio" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" d="M8 6l10 6l-10 6Z"></path></svg>'

                        }
                    }
                    )
                    audio.addEventListener("timeupdate", () => {
                        document.body.querySelector(".song-current-time").innerHTML = convertSecondsToTimeFormat(parseInt(audio.currentTime))
                        document.body.querySelector(".song-total-time").innerHTML = convertSecondsToTimeFormat(parseInt(audio.duration))
                        document.body.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
                    }
                    )
                    document.body.querySelector(".seek-bar").addEventListener("click", e => {
                        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
                        document.body.querySelector(".circle").style.left = percent + "%";
                        audio.currentTime = (percent * audio.duration) / 100;
                    })
                    document.body.querySelector(".prev").addEventListener("click", () => {
                        let index = songs.indexOf(audio.src.split("/")[5])
                        if (index > 0) {
                            audio.pause()
                            document.body.querySelector(".play-audio-border").innerHTML = '<svg class="pause-audio" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"/></svg>'
                            playSong(songs[index - 1].replaceAll("%20", " "));
                        }
                    }
                    )
                    document.body.querySelector(".next").addEventListener("click", () => {
                        let index = songs.indexOf(audio.src.split("/")[5])
                        if (index < songs.length - 1) {
                            audio.pause()
                            document.body.querySelector(".play-audio-border").innerHTML = '<svg class="pause-audio" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#000" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"/></svg>'
                            playSong(songs[index + 1].replaceAll("%20", " "));
                        }
                    }
                    )
                    document.body.querySelector(".vol-control").addEventListener("change", (e) => {
                        audio.volume = parseInt(e.target.value) / 100;
                        if (audio.volume == 0) {
                            document.body.querySelector(".vol").src = `ASSETS/mute.svg`
                        } else {
                            document.body.querySelector(".vol").src = `ASSETS/volume.svg`
                        }
                    }
                    )
                    document.body.querySelector(".vol").addEventListener("click", () => {
                        if (audio.volume > 0) {
                            audio.volume = 0
                            document.body.querySelector(".vol").src = `ASSETS/mute.svg`
                            document.body.querySelector(".vol-control").value = "0"
                        } else {
                            audio.volume = 1
                            document.body.querySelector(".vol").src = `ASSETS/volume.svg`
                            document.body.querySelector(".vol-control").value = "100"
                        }
                    }
                    )
                }
                )
            })
        })
    })

    document.body.querySelector(".hamburger").addEventListener("click", () => {
        document.body.querySelector(".left").style.left = "0"

    }
    )
    document.body.querySelector(".return").addEventListener("click", () => {
        document.body.querySelector(".left").style.left = "-140%"
    }
    )
}
main()
