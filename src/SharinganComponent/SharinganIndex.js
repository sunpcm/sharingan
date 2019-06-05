import React from 'react';
import DialogPanel from './DialogPanel';
import _ from 'lodash'

let actionRecord = []
class Sharingan extends React.Component {

    constructor(props) {
        super(props)
        this.isDown = false;
        this.state = {
            step: 0,
            dialogInfo: {}
        }
    }

    componentWillUnmount() {
        window.onmousedown = null
    }

    getPosition(e) {
        e = e || window.event;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        let x = e.pageX || (e.clientX + scrollX);
        let y = e.pageY || (e.clientY + scrollY);
        return { x: x, y: y }
    }

    stopSharingan() {
        window.onmousedown = null
        window.onmouseup = null
        window.onmousemove = null
    }
    startSharingan() {
        window.onmousedown = (e) => {
            let dataTime = new Date().getTime()
            if (actionRecord.length > 0) {
                let lastAction = actionRecord[actionRecord.length - 1]
                lastAction.during = dataTime - lastAction.startTime
            }
            let target = e.path.reverse().slice(4).map(n => n.id ? `#${n.id}` : (n.className ? `.${n.className.replace(' ', '.')}` : `#${n.tagName}`))
            if (target.includes('#dialog-panel')) {
                return
            }
            this.isDown = true
            if (target.length == 0) {
                actionRecord.push({
                    startTime: dataTime,
                    target: [],
                    index: 0,
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'click'
                })
            } else {
                let index = [...document.querySelector(target.join(' ')).parentNode.children].indexOf(e.path[0])
                actionRecord.push({
                    startTime: dataTime,
                    target: target,
                    index: index,
                    position: { y: this.getPosition(e).y, x: this.getPosition(e).x },
                    type: 'click'
                })
            }

            this.setState({
                step: this.state.step + 1
            })
        }
        window.onmouseup = (e) => {
            if (!this.isDown) return;
            this.isDown = false
            if (actionRecord[actionRecord.length - 1].type == 'move') {
                let dataTime = new Date().getTime()
                if (actionRecord.length > 0) {
                    let lastAction = actionRecord[actionRecord.length - 1]
                    lastAction.during = dataTime - lastAction.startTime
                }

                let lastDragIndex = _.findLastIndex(actionRecord, function (n) {
                    return n.type == 'dragStart'
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
                        type: 'dragEnd'
                    })
                }
                this.setState({
                    step: actionRecord.length
                })
            }
        }
        window.onmousemove = _.throttle((e) => {
            if (this.isDown) {
                if (actionRecord[actionRecord.length - 1] && actionRecord[actionRecord.length - 1].type == 'click') {
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
                    type: 'move'
                })
                this.setState({
                    step: this.state.step + 1
                })

                if (this.props.getMouseActions) {
                    this.props.getMouseActions(e)
                }
            }
        }, 50, { 'trailing': true });
    }

    runSharingan(i) {
        this.stopSharingan()
        i = i ? i : 0
        if (actionRecord.length == 0) return;

        let targetRecord = actionRecord[i]
        let targetEle = (targetRecord.target.length > 0 && document.querySelector(targetRecord.target.join(' ')).parentNode.children[targetRecord.index]) || document.querySelector(this.props.defaultTarget)

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
        }
        if (actionRecord[i + 1]) {
            this.timeCircle = setTimeout(() => this.runSharingan(i + 1), targetRecord.during)
        }

        this.setState({
            dialogInfo: {
                // step: i + 1,
                x: targetRecord.position.x,
                y: targetRecord.position.y
            }
        })


    }

    taskList() {
        this.props.taskList()
    }

    fireMouseEvent(type, elem, centerX, centerY) {
        let evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
        elem.dispatchEvent(evt);
    };


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

    // test() {



    //     var triggerDragAndDrop = function (selectorDrag, selectorDrop) {

    //         // function for triggering mouse events
    //         var fireMouseEvent = function (type, elem, centerX, centerY) {
    //             var evt = document.createEvent('MouseEvents');
    //             evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
    //             elem.dispatchEvent(evt);
    //         };

    //         // fetch target elements
    //         var elemDrag = document.querySelector(selectorDrag);
    //         var elemDrop = document.querySelector(selectorDrop);
    //         if (!elemDrag || !elemDrop) return false;

    //         // calculate positions
    //         var pos = elemDrag.getBoundingClientRect();
    //         var center1X = Math.floor((pos.left + pos.right) / 2);
    //         var center1Y = Math.floor((pos.top + pos.bottom) / 2);
    //         pos = elemDrop.getBoundingClientRect();
    //         var center2X = Math.floor((pos.left + pos.right) / 2);
    //         var center2Y = Math.floor((pos.top + pos.bottom) / 2);

    //         // mouse over dragged element and mousedown
    //         fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    //         fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);
    //         fireMouseEvent('mouseover', elemDrag, center1X, center1Y);
    //         fireMouseEvent('mousedown', elemDrag, center1X, center1Y);

    //         // start dragging process over to drop target
    //         fireMouseEvent('dragstart', elemDrag, center1X, center1Y);
    //         fireMouseEvent('drag', elemDrag, center1X, center1Y);
    //         fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    //         fireMouseEvent('drag', elemDrag, center2X, center2Y);
    //         // fireMouseEvent('mousemove', elemDrop, center2X, center2Y);

    //         // // trigger dragging process on top of drop target
    //         // fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);
    //         // fireMouseEvent('dragenter', elemDrop, center2X, center2Y);
    //         // fireMouseEvent('mouseover', elemDrop, center2X, center2Y);
    //         // fireMouseEvent('dragover', elemDrop, center2X, center2Y);

    //         // // release dragged element on top of drop target
    //         // fireMouseEvent('drop', elemDrop, center2X, center2Y);
    //         // fireMouseEvent('dragend', elemDrag, center2X, center2Y);
    //         // fireMouseEvent('mouseup', elemDrag, center2X, center2Y);

    //         return true;
    //     };




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
