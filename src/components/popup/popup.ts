import { Ipopup, Icomponent } from './../interfaces';
// import './popup.css' // 全局引用的方式
let styles = require('./popup.css').default; // 模块化。且不用写声明文件d.ts
// import styles from './popup.css'; // 模块化。这种方式需要写声明文件 d.ts


function popup(options:Ipopup) {
    return new Popup(options);
}

class Popup implements Icomponent {
    tempContainer;
    mask;
    // 本来需要将settings里的数据赋给this，以便在其他类方法中使用。
    // 但通过ts private 直接可以在类的方法中使用settings, 很方便
    constructor (private settings: Ipopup) {
        // 提供默认值
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            title: '',
            pos: 'center',
            mask: true,
            content: () => {}
        }, settings)
        this.init();
    }
    init () {
        this.template();
        this.handle();
        this.settings.mask && this.createMask();
        this.contentCallback();
    }
    template () {
        console.log('styles', styles);
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.popup;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <div class="${styles['popup-title']}">
                <h3>${this.settings.title}</h3>
                <i class="iconfont icon-guanbi"></i>
            </div>
            <div class="${styles['popup-content']}"></div>
        `;
        document.body.appendChild(this.tempContainer);
    }
    handle () {
        const popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`);
        popupClose.addEventListener('click', () => {
            document.body.removeChild(this.tempContainer);
            this.settings.mask && document.body.removeChild(this.mask);
        })
    }
    createMask () {
        this.mask = document.createElement('div');
        this.mask.className = styles.mask;
        this.mask.style.width = '100%';
        this.mask.style.height = document.body.offsetHeight + 'px';
        document.body.append(this.mask);
    }
    contentCallback () {
        const popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`);
        this.settings.content(popupContent);
    }
}
export default popup;