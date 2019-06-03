import React from 'react';
import DialogPanel from './DialogPanel';

let actionRecord = []
class Sharingan extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            step: 0,
            dialogInfo: {}
        }
    }

    startSharingan() {
        window.onmousedown = (e) => {
            let dataTime = new Date().getTime()
            if (actionRecord.length > 0) {
                let lastAction = actionRecord[actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            }
            let target = e.path.reverse().slice(4).map(n => n.id ? `#${n.id}` : (n.className ? `.${n.className.replace(' ', '.')}` : `#${n.tagName}`))
            if (!target || target.length == 0 || e.path[0].className == "run-sharingan") {
                return
            }
            let index = [...document.querySelector(target.join(' ')).parentNode.children].indexOf(e.path[0])
            actionRecord.push({
                startTime: dataTime,
                target: target,
                index: index,
                position: { y: e.layerY, x: e.layerX }
            })
            this.setState({
                step: this.state.step + 1
            })
        }
    }

    runSharingan(i) {
        i = i ? i : 0
        if (actionRecord.length == 0) return;
        document.querySelector(actionRecord[i].target.join(' ')).parentNode.children[actionRecord[i].index].click()
        this.setState({
            dialogInfo: {
                // step: i + 1,
                x: actionRecord[i].position.x + 'px',
                y: actionRecord[i].position.y + 'px'
            }
        })
        if (actionRecord[i + 1]) {
            this.timeCircle = setTimeout(() => this.runSharingan(i + 1), actionRecord[i].during)
        }
    }

    taskList() {
        this.props.taskList()
    }


    // getElementTop(element) {
    //     let actTop = element.offsetTop;
    //     let current = element.offsetParent;
    //     while (current !== null) {
    //         actTop += current.offsetTop;
    //         current = current.offsetParent;
    //     }
    //     return actTop;
    // }

    // getElementLeft(element) {
    //     let actLeft = element.offsetLeft;
    //     let current = element.offsetParent;
    //     while (current !== null) {
    //         actLeft += current.offsetLeft;
    //         current = current.offsetParent;
    //     }
    //     return actLeft;
    // }

    render() {
        const { step, dialogInfo } = this.state
        return (
            < DialogPanel
                startSharingan={() => this.startSharingan()}
                runSharingan={() => this.runSharingan()}
                dialogInfo={dialogInfo}
                step={step}
            />
        )
    }
}

export default Sharingan;
