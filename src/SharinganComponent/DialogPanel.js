import React, { Component } from 'react'
import './SharinganStyle.css'

class DialogPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    // componentWillUnmount = () => {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }

    componentWillReceiveProps(nextProps) {
        if (this.props.status != nextProps.status) {
            this.taskRun()
        }
    }

    // taskRun(i) {
    //     i = i ? i : 0
    //     if (this.props.actionRecord.length == 0) return;
    //     document.querySelector(this.props.actionRecord[i].target.join(' ')).parentNode.children[this.props.actionRecord[i].index].click()
    //     // document.getElementById('dialog-panel').style.top = window.this.props.actionRecord[i].position.y + 'px'
    //     // document.getElementById('dialog-panel').style.left = window.this.props.actionRecord[i].position.x + 'px'
    //     // this.setState({
    //     //     dialogInfo: {
    //     //         step: i + 1,
    //     //         x: this.props.actionRecord[i].position.y + 'px',
    //     //         y: this.props.actionRecord[i].position.x + 'px'
    //     //     }
    //     // })
    //     if (this.props.actionRecord[i + 1]) {
    //         this.timeCircle = setTimeout(() => this.taskRun(i + 1), this.props.actionRecord[i].during)
    //     }
    // }

    render() {
        return (
            <div id="dialog-panel">
                <div id="dialog-panel-pointer" style={{ left: this.props.dialogInfo.x, top: this.props.dialogInfo.y }}></div>
                <div id="dialog-panel-btn">
                    <div className="dialog-panel-top">
                        <div className="dialog-panel-status"></div>
                        <div className="dialog-panel-steps">40</div>
                    </div>
                    <div className="dialog-panel-bottom">
                        <div className="start-sharingan" onClick={() => this.props.startSharingan()}>start</div>
                        <div className="run-sharingan" onClick={() => this.props.runSharingan()}>run</div>
                    </div>

                </div>
                {/* <div className="sharingan-popover sharingan-popover-placement-top" style={{ display: "none" }}>
                    <div className="sharingan-popover-content">
                        <div className="sharingan-popover-arrow"></div>
                        <div className="sharingan-popover-inner" role="tooltip">
                            <div>
                                <div className="sharingan-popover-title">Title</div>
                                <div className="sharingan-popover-inner-content">
                                    <div>
                                        <p>Content</p>
                                        <p>Content</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        )
    }
}

export default DialogPanel