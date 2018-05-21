let $loader = document.querySelector('#loader');
let $progress = document.querySelector('#loader-progress');

export class Loader {
    static update(percent) {
        let width = Loader._castPercentToWidth(percent);

        setTimeout(() => {
            $progress.style.width = width;
        }, 0);
    }

    static _castPercentToWidth(percent) {
        return (percent * Loader.WIDTH / 100) + 'px';
    }

    static show() {
        $loader.style.display = 'block';
    }

    static hide() {
        setTimeout(() => {
            $progress.style.width = 0;
            $loader.style.display = 'none';
        }, 50);
    }
}

Loader.WIDTH = 130;
