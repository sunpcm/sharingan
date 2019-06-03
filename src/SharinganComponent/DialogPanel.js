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

    render() {
        return (
            <div id="dialog-panel">
                <div id="dialog-panel-pointer" style={{ left: this.props.dialogInfo.x, top: this.props.dialogInfo.y }}></div>
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