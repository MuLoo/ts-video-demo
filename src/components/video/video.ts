import { Icomponent } from "../interfaces";
const styles = require('./video.css').default;

interface Ivideo {
    url: string,
    elem: string | HTMLElement,
    width?: string,
    height?:string,
    autoplay?: boolean
}

function video (options: Ivideo) {
    return new Video(options);
}

class Video implements Icomponent {
    tempContainer: HTMLElement
    mask:HTMLElement
    constructor(private settings: Ivideo) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            autoplay: false,
        }, this.settings);
        this.init();
    }
    init() {
        this.template();
        this.handle();
    }
    template() {
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.video;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}"></div>
                    <div class="${styles['video-progress-suc']}"></div>
                    <div class="${styles['video-progress-bar']}"></div>
                </div>
                <div class="${styles['video-play']}">
                    <i class="iconfont icon-bofang"></i>
                </div>
                <div class="${styles['video-time']}">
                    <span>00:00</span> / <span>00:00</span>
                </div>
                <div class="${styles['video-full']}">
                    <i class="iconfont icon-quanpingzuidahua"></i>
                </div>
                <div class="${styles['video-volume']}">
                    <i class="iconfont icon-shengyin_shiti"></i>
                    <div class="${styles['video-volprogress']}">
                        <div class="${styles['video-volprogress-now']}"></div>
                        <div class="${styles['video-volprogress-bar']}"></div>
                    </div>
                </div>
            </div>
        `;
        // 断言
        if (typeof this.settings.elem === 'object' && this.settings.elem !== null) {
            this.settings.elem.appendChild(this.tempContainer);
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
        }
    }
    handle(){
        const videoContent:HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`);
        const videoControls: HTMLElement = this.tempContainer.querySelector(`.${styles['video-controls']}`);
        const videoPlay = this.tempContainer.querySelector(`.${styles['video-play']} i`);
        const videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);
        const videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`);
        const videoProgress: NodeListOf<HTMLElement> = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`);
        const videoVolProgress: NodeListOf<HTMLElement> = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`);

        let timer;
        videoContent.volume = 0.5;
        // 自动播放
        if(this.settings.autoplay) {
            timer = setInterval(playing, 1000);
            videoContent.play();
        }
        this.tempContainer.addEventListener('mouseenter', function(event: MouseEvent) {
            videoControls.style.bottom = '0';
        })
        this.tempContainer.addEventListener('mouseleave', function(event: MouseEvent) {
            videoControls.style.bottom = '-50px';
        })
        videoContent.addEventListener('canplay', () => {
            console.log('canplay');
            videoTimes[1].innerHTML= formatTime(videoContent.duration);
        });
        videoContent.addEventListener('play', () => {
            videoPlay.className = 'iconfont icon-zanting';
            timer = setInterval(() => {
                playing()
            })
        });
        videoContent.addEventListener('pause', () => {
            videoPlay.className = 'iconfont icon-bofang';
            clearInterval(timer);
        });
        videoPlay.addEventListener('click', () => {
            if(videoContent.paused) {
                videoContent.play();
            } else {
                videoContent.pause();
            }
        })
        // 控制视频进度
        videoProgress[2].addEventListener('mousedown', function (ev: MouseEvent) {
            const downX = ev.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (e: MouseEvent) => {
                let scale = (e.pageX - downX + downL + 8) / this.parentElement.offsetWidth;
                if (scale < 0) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }
                videoProgress[0].style.width = scale * 100 + '%';
                videoProgress[1].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                // 设置视频当前时间
                videoContent.currentTime = scale * videoContent.duration;
            }
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
            ev.preventDefault();
        })
        // 控制音量
        videoVolProgress[1].addEventListener('mousedown', function (ev: MouseEvent) {
            let downX = ev.pageX;
            const downL = this.offsetLeft;
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentElement.offsetWidth;
                if (scale < 0) scale = 0;
                else if (scale > 1) scale = 1;
                videoVolProgress[0].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                videoContent.volume = scale;
            }
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }

        })
        function playing () {
            const scale = videoContent.currentTime / videoContent.duration;
            const scaleSuc = videoContent.buffered.end(0) / videoContent.duration;

            videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
            videoProgress[0].style.width = scale * 100 + '%';
            videoProgress[1].style.width = scaleSuc * 100 + '%';
            videoProgress[2].style.left = scale * 100 + '%';
        }
        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen();
        });
    }

}


function formatTime (num: number): string {
    const number = Math.round(num);
    const min = Math.floor(number / 60);
    const sec = number % 60;
    return setZero(min) + ':' + setZero(sec);
}
function setZero (number: number): string {
    if(number < 10 && number >= 0) return `0${number}`
    return `${number}`
}

export default video;
