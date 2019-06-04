import React, { Component } from 'react'
import './SharinganStyle.css'

class DialogPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRecord: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.status != nextProps.status) {
            this.taskRun()
        }
    }

    componentDidMount() {
        this.Dragging(this.getDraggingDialog).enable();
    }

    componentWillUnmount() {
        this.Dragging(this.getDraggingDialog).disable();
    }

    startSharingan() {
        this.props.startSharingan()
        this.setState({
            isRecord: true
        })
    }

    runSharingan() {
        this.props.runSharingan()
        this.setState({
            isRecord: false
        })
    }

    Dragging(validateHandler) {
        let draggingObj = null;
        let diffX = 0;
        let diffY = 0;

        let mouseHandler = (e) => {
            switch (e.type) {
                case 'mousedown':
                    draggingObj = validateHandler(e);
                    if (draggingObj != null) {
                        diffX = e.clientX - draggingObj.offsetLeft;
                        diffY = e.clientY - draggingObj.offsetTop;
                    }
                    break;

                case 'mousemove':
                    if (draggingObj) {
                        draggingObj.style.left = (e.clientX - diffX) + 'px';
                        draggingObj.style.top = (e.clientY - diffY) + 'px';
                    }
                    break;

                case 'mouseup':
                    draggingObj = null;
                    diffX = 0;
                    diffY = 0;
                    break;
            }
        };

        return {
            enable: function () {
                document.addEventListener('mousedown', mouseHandler);
                document.addEventListener('mousemove', mouseHandler);
                document.addEventListener('mouseup', mouseHandler);
            },
            disable: function () {
                document.removeEventListener('mousedown', mouseHandler);
                document.removeEventListener('mousemove', mouseHandler);
                document.removeEventListener('mouseup', mouseHandler);
            }
        }
    }

    getDraggingDialog(e) {
        let target = e.target;
        while (target && target.className.indexOf('dialog-panel-top') == -1) {
            target = target.offsetParent;
        }
        if (target != null) {
            return target.offsetParent;
        } else {
            return null;
        }
    }


    render() {
        // this.props.dialogInfo.x / ocument.documentElement.clientHeight
        // document.documentElement.clientWidth

        let panelPosition = {
            x: this.props.dialogInfo.x / document.documentElement.clientWidth > 0.5 ? '-240' : '40',
            y: this.props.dialogInfo.y / document.documentElement.clientHeight > 0.5 ? '-80' : '0'
        }

        return (
            <div id="dialog-panel">
                <div id="dialog-panel-pointer" style={{ left: this.props.dialogInfo.x + 'px', top: this.props.dialogInfo.y + 'px' }}>
                    <div className="sharingan-popover sharingan-popover-placement-top" style={{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }}>
                        <div className="sharingan-popover-content">
                            {/* <div className="sharingan-popover-arrow"></div> */}
                            <div className="sharingan-popover-inner" role="tooltip">
                                <div>
                                    <div className="sharingan-popover-title">Title</div>
                                    <div className="sharingan-popover-inner-content">
                                        <div>
                                            Content,Content,Content,Content,Content,Content,Content,Content
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="dialog-panel-btn">
                    <div className="dialog-panel-top">
                        <div className={`dialog-panel-status ${this.state.isRecord ? 'animated infinite flash slow' : 'gray-pointer'}`}></div>
                        <div className="dialog-panel-steps">{this.props.step}</div>
                    </div>
                    <div className="dialog-panel-bottom">
                        <div className="start-sharingan" onClick={() => this.startSharingan()}>start</div>
                        <div className="run-sharingan" onClick={() => this.runSharingan()}>run</div>
                    </div>

                </div>
            </div>
        )
    }
}

export default DialogPanel