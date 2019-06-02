import React from 'react';

window.actionRecord = []

class Sharingan {

    startSharingan() {
        window.onmousedown = (e) => {
            console.log(e)
            let dataTime = new Date().getTime()
            if (window.actionRecord.length > 0) {
                let lastAction = window.actionRecord[window.actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            }
            // let target = e.path.reverse().slice(4).map(n => n.className ? `.${n.className.replace(' ', '.')}` : (n.id ? `#${n.id}` : `#${n.tagName}`))
            let target = e.path.reverse().slice(4).map(n => n.id ? `#${n.id}` : (n.className ? `.${n.className.replace(' ', '.')}` : `#${n.tagName}`))
            if (!target || target.length == 0 || e.path[0].id == "task-start") {
                return
            }
            let index = [...document.querySelector(target.join(' ')).parentNode.children].indexOf(e.path[0])
            window.actionRecord.push({
                startTime: dataTime,
                target: target,
                index: index,
                position: { y: e.layerY, x: e.layerX }
            })
        }
    }

    getElementTop(element) {
        let actTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null) {
            actTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actTop;
    }

    getElementLeft(element) {
        let actLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            actLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actLeft;
    }

    taskRun(i) {
        i = i ? i : 0
        if (window.actionRecord.length == 0) return;
        document.querySelector(window.actionRecord[i].target.join(' ')).parentNode.children[window.actionRecord[i].index].click()
        document.getElementsByClassName('m-1')[0].style.top = window.actionRecord[i].position.y + 'px'
        document.getElementsByClassName('m-1')[0].style.left = window.actionRecord[i].position.x + 'px'
        if (window.actionRecord[i + 1]) {
            setTimeout(() => this.taskRun(i + 1), window.actionRecord[i].during)
        }
    }
}

export default Sharingan;
