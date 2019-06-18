import React from 'react';
import DialogPanel from './DialogPanel';
import _ from 'lodash'

let actionRecord = []
// let intervalGroup = []
class RecordReplay extends React.Component {

    constructor(props) {
        super(props)
        this.isMouseDown = false;
        this.state = {
            step: 0,
            dialogInfo: {},
            finishedRun: true
        }
    }
    componentWillUnmount() {
        window.onmousedown = null
        window.onmouseup = null
        window.onmousemove = null
    }
    componentDidMount() {
        this.getRecordReplay()
    }
    getPosition(e) {
        e = e || window.event;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        let x = e.pageX || (e.clientX + scrollX);
        let y = e.pageY || (e.clientY + scrollY);
        return { x: x, y: y }
    }

    saveRecordReplay(listRecordReplay) {
        if (listRecordReplay) {
            localStorage.setItem('actionStore', JSON.stringify(listRecordReplay));
        } else {
            if (actionRecord.length == 0) return
            try {
                let actionStore = localStorage.getItem('actionStore')
                if (!actionStore) {
                    actionStore = '[]'
                }
                actionStore = JSON.parse(actionStore)
                actionStore.push({
                    time: actionRecord[actionRecord.length - 1].startTime,
                    name: '',
                    list: actionRecord,
                    id: new Date().getTime()
                })
                localStorage.setItem('actionStore', JSON.stringify(actionStore));
                actionRecord = []
            } catch (oException) {
                if (oException.name == 'QuotaExceededError') {
                    console.log('The local storage limit has been exceeded!');
                }
            }
        }
        this.getRecordReplay()
    }
    getRecordReplay() {
        this.setState({
            listRecordReplay: JSON.parse(localStorage.getItem('actionStore') || '[]').sort((m, n) => n.time - m.time)
        })
    }
    clearRecordReplay() {
        actionRecord = [];
        this.pauseRecordReplay();
    }
    pauseRecordReplay() {
        window.onmousedown = null;
        window.onmouseup = null;
        window.onmousemove = null;
    }
    startRecordReplay() {
        window.onmousedown = (e) => {
            let dataTime = new Date().getTime()
            if (actionRecord.length > 0) {
                let lastAction = actionRecord[actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            }

            let target = e.path.reverse().slice(4).map(n => n.id ? `#${n.id}` : (n.className ? `.${n.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, ".")}` : `${n.tagName}`))
            if (target.includes('#dialog-panel')) {
                return
            }
            this.isMouseDown = true;
            if (target.length === 0) {
                actionRecord.push({
                    startTime: dataTime,
                    target: [],
                    index: 0,
                    title: '',
                    message: '',
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'click',
                    eventType: 'mouse'
                })
            } else {
                let index = [...document.querySelector(target.join(' ')).parentNode.children].indexOf(e.path[0])
                actionRecord.push({
                    startTime: dataTime,
                    target: target,
                    index: index,
                    title: '',
                    message: '',
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'click',
                    eventType: 'mouse'
                })
            }

            this.setState({
                step: this.state.step + 1
            })
        }
        window.onmousemove = _.throttle((e) => {
            if (this.isMouseDown) {
                if (actionRecord[actionRecord.length - 1] && actionRecord[actionRecord.length - 1].type === 'click') {
                    actionRecord[actionRecord.length - 1].type = 'dragStart'
                }
                let dataTime = new Date().getTime()
                if (actionRecord.length > 0) {
                    let lastAction = actionRecord[actionRecord.length - 1]
                    lastAction.during = dataTime - lastAction.startTime
                }

                actionRecord.push({
                    startTime: dataTime,
                    target: [],
                    index: 0,
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'move',
                    eventType: 'mouse'
                })
                this.setState({
                    step: this.state.step + 1
                })

                if (this.props.getMouseActions) {
                    this.props.getMouseActions(e)
                }
            }
        }, 50, { 'trailing': true });
        window.onmouseup = (e) => {
            if (!this.isMouseDown) return;
            this.isMouseDown = false
            if (actionRecord[actionRecord.length - 1].type === 'move') {
                let dataTime = new Date().getTime()
                if (actionRecord.length > 0) {
                    let lastAction = actionRecord[actionRecord.length - 1]
                    lastAction.during = dataTime - lastAction.startTime
                }

                let lastDragIndex = _.findLastIndex(actionRecord, function (n) {
                    return n.type === 'dragStart'
                })

                if (-1 < lastDragIndex && (dataTime - actionRecord[lastDragIndex].startTime) < 1000) {
                    actionRecord.splice(lastDragIndex + 1)
                    actionRecord[actionRecord.length - 1].type = 'click'
                } else {
                    actionRecord.push({
                        startTime: dataTime,
                        target: [],
                        index: 0,
                        position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                        type: 'dragEnd',
                        eventType: 'mouse'
                    })
                }
                this.setState({
                    step: actionRecord.length
                })
            }
        }

        window.onkeydown = (e) => {
            let dataTime = new Date().getTime()
            if (actionRecord.length > 0) {
                let lastAction = actionRecord[actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            }
            let target = e.path.reverse().slice(4).map(n => n.id ? `#${n.id}` : (n.className ? `.${n.className.replace(/^\s+|\s+$/g, "").replace(/\s+/g, ".")}` : `${n.tagName}`))
            let isInput = e.path[0].tagName == 'INPUT'
            if (target.includes('#dialog-panel')) {
                return
            }
            // this.isKeyDown = true
            if (isInput) {
                let index = [...document.querySelector(target.join(' ')).parentNode.children].indexOf(e.path[0])
                actionRecord.push({
                    startTime: dataTime,
                    target: target,
                    index: index,
                    value: e.key,
                    title: '',
                    message: '',
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'input',
                    eventType: 'keyboard'

                })
            } else {
                let lastKeydownIndex = _.findLastIndex(actionRecord, function (n) { return n.keyCode == e.keyCode });
                if (lastKeydownIndex == -1 || actionRecord[lastKeydownIndex].type != 'keydown') {
                    actionRecord.push({
                        startTime: dataTime,
                        target: null,
                        index: null,
                        value: e.key,
                        keyCode: e.keyCode,
                        title: '',
                        message: '',
                        position: null,
                        type: 'keydown',
                        eventType: 'keyboard'
                    })
                }
            }
            this.setState({
                step: this.state.step + 1
            })
        }
        window.onkeyup = (e) => {
            // this.isKeyDown = false

            let dataTime = new Date().getTime()

            if (actionRecord.length > 0) {
                let lastAction = actionRecord[actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            } else {
                return
            }

            let isInput = e.path[0].tagName == 'INPUT'
            // if (target.includes('#dialog-panel')) {
            //     return
            // }
            if (isInput) {
            } else {
                let lastKeydownIndex = _.findLastIndex(actionRecord, function (n) { return n.keyCode == e.keyCode })
                if (lastKeydownIndex > -1 && actionRecord[lastKeydownIndex].type == 'keydown' && dataTime - actionRecord[lastKeydownIndex].startTime > 1000) {
                    actionRecord[lastKeydownIndex].keepTime = dataTime - actionRecord[lastKeydownIndex].startTime
                    // actionRecord.push({
                    //     startTime: dataTime,
                    //     target: null,
                    //     index: null,
                    //     value: e.key,
                    //     keyCode: e.keyCode,
                    //     title: '',
                    //     message: '',
                    //     position: null,
                    //     type: 'keyup',
                    //     eventType: 'keyboard'
                    // })
                }
            }
        }
    }

    executeRecordReplay(i, executeRecord) {
        let isFinish = false
        this.pauseRecordReplay()
        i = i ? i : 0
        if (executeRecord.length === 0) return;

        let targetRecord = executeRecord.list[i]
        let targetEle = targetRecord.target && targetRecord.target.length > 0 ? document.querySelector(targetRecord.target.join(' ')).parentNode.children[targetRecord.index] : document.querySelector(this.props.defaultTarget)
        switch (targetRecord.type) {
            case 'click':
                targetEle.click()
                break;
            case 'dragStart':
                this.fireMouseEvent('mousedown', targetEle, targetRecord.position.x, targetRecord.position.y)
                break;
            case 'move':
                this.fireMouseEvent('mousemove', targetEle, targetRecord.position.x, targetRecord.position.y)
                break;
            case 'dragEnd':
                this.fireMouseEvent('mouseup', targetEle, targetRecord.position.x, targetRecord.position.Y)
                break;
            case 'input':
                this.simulateKeyboardInputEvent(targetEle, targetRecord.value)
                break;
            case 'keydown':
                this.simulateKeyboardEvent(targetRecord)
                break;
        }
        if (executeRecord.list[i + 1]) {
            this.timeCircle = setTimeout(() => this.executeRecordReplay(i + 1, executeRecord), targetRecord.during);
        } else {
            isFinish = true;
        }



        this.setState({
            dialogInfo: {
                x: targetRecord.position ? targetRecord.position.x : 0,
                y: targetRecord.position ? targetRecord.position.y : 0,
                title: targetRecord.title,
                message: targetRecord.message
            },
            finishedRun: isFinish
        })
    }

    runRecordReplay(index) {
        if (this.state.listRecordReplay[index]) {
            this.executeRecordReplay(0, this.state.listRecordReplay[index])
        } else {
            console.warn(index + 'record is not exist')
        }
    }

    deleteRecordReplay(index) {
        let { listRecordReplay } = this.state
        listRecordReplay.splice(index, 1)
        this.saveRecordReplay(listRecordReplay)
    }

    taskList() {
        this.props.taskList()
    }

    fireMouseEvent(type, elem, centerX, centerY) {
        let evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
        elem.dispatchEvent(evt);
    };

    simulateKeyboardInputEvent(targetEle, value) {
        let inputElem = targetEle//document.querySelector("input");
        Object.getOwnPropertyDescriptor(inputElem.__proto__, "value").set.call(
            inputElem,
            inputElem.value + value
        );
        let tempEvent = new Event("input", { bubbles: true, shiftKey: true });
        inputElem.dispatchEvent(tempEvent);
    }
    runKeyboardEvent(info) {
        let element = document.querySelector(this.props.defaultTarget);
        let e = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: info.value, char: info.value, keyCode: info.keyCode, shiftKey: false });
        element.dispatchEvent(e);
    }
    simulateKeyboardEvent(info) {
        let interval = setInterval(() => { this.runKeyboardEvent(info); }, 50)
        setTimeout(() => {
            clearInterval(interval)
        }, info.keepTime)
    }

    render() {
        const { step, dialogInfo, listRecordReplay, finishedRun } = this.state
        return (
            <DialogPanel
                listRecordReplay={listRecordReplay || []}
                saveRecordReplay={(listRecordReplay) => this.saveRecordReplay(listRecordReplay)}
                clearRecordReplay={() => this.clearRecordReplay()}
                startRecordReplay={() => this.startRecordReplay()}
                pauseRecordReplay={() => this.pauseRecordReplay()}
                runRecordReplay={(index) => this.runRecordReplay(index)}
                deleteRecordReplay={(index) => this.deleteRecordReplay(index)}
                dialogInfo={dialogInfo}
                step={step}
                finishedRun={finishedRun}
            />
        )
    }
}

export default RecordReplay;
