import React, { Component } from 'react'
import './RecordReplayStyle.css'

class DialogPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            recordStatus: 'pause',
            showEdit: false,
            editIndex: -1,
            stepIndex: 0,
            middleStepRecord: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.finishedRun) {
            setTimeout(() => {
                this.setState({
                    recordStatus: 'pause'
                })
            }, 2000)
        }
    }

    componentDidMount() {
        document.querySelector("#dialog-panel-handle .record-list").addEventListener("click", (e) => {
            if (e.target && e.target.className.split(' ').indexOf("icon-edit") > -1) {
                this.editRecordReplay(e.target.parentNode.parentNode.id)
            }
            if (e.target && e.target.className.split(' ').indexOf("icon-run") > -1) {
                this.runRecordReplay(e.target.parentNode.parentNode.id)
            }
            if (e.target && e.target.className.split(' ').indexOf("icon-delete") > -1) {
                this.props.deleteRecordReplay(e.target.parentNode.parentNode.id)
            }
        });
        this.Dragging(this.getDraggingDialog).enable();
    }

    componentWillUnmount() {
        this.Dragging(this.getDraggingDialog).disable();
    }



    handleRecordReplay() {
        if (this.state.recordStatus == 'record') {
            this.props.pauseRecordReplay()
            this.setState({
                recordStatus: 'pause'
            })
        } else {
            this.props.startRecordReplay()
            this.setState({
                recordStatus: 'record'
            })
        }
    }
    // deleteRecordReplay(index){
    //     this.props.deleteRecordReplay(index)
    // }
    clearRecordReplay() {
        this.props.clearRecordReplay()
    }
    editRecordReplay(index) {
        this.setState({
            showEdit: true,
            editIndex: index,
            middleStepRecord: this.props.listRecordReplay[index].list[0]
        })
    }
    closeEditRecordReplay() {
        this.setState({
            showEdit: false
        })
    }
    saveRecordReplay() {
        this.props.saveRecordReplay()
    }

    runRecordReplay(index) {
        this.props.runRecordReplay(index)
        this.setState({
            recordStatus: 'run'
        })
    }

    formateDate(data) {
        let month = new Date(data).getMonth() * 1 + 1;
        month = month > 10 ? month : '0' + month
        let date = new Date(data).getDate() * 1;
        date = date > 10 ? date : '0' + date
        let hours = new Date(data).getHours() * 1;
        hours = hours > 10 ? hours : '0' + hours
        let minutes = new Date(data).getMinutes() * 1;
        minutes = minutes > 10 ? minutes : '0' + minutes
        return `${month}/${date} ${hours}:${minutes}`
    }

    Dragging(validateHandler) {
        let draggingObj = null;
        let diffX = 0;
        let diffY = 0;

        let mouseHandler = (e) => {
            switch (e.type) {
                case 'mousedown':
                    draggingObj = validateHandler(e);
                    if (draggingObj !== null) {
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

        let getDraggingTarget = () => {
            return document.getElementById('dialog-panel-handle')
        }

        return {
            enable: function () {
                getDraggingTarget().addEventListener('mousedown', mouseHandler);
                getDraggingTarget().addEventListener('mousemove', mouseHandler);
                getDraggingTarget().addEventListener('mouseup', mouseHandler);
            },
            disable: function () {
                getDraggingTarget().removeEventListener('mousedown', mouseHandler);
                getDraggingTarget().removeEventListener('mousemove', mouseHandler);
                getDraggingTarget().removeEventListener('mouseup', mouseHandler);
            }
        }
    }

    getDraggingDialog(e) {
        let target = e.target;
        while (target && target.className.indexOf('dialog-panel-handle') === -1) {
            target = target.offsetParent;
        }
        if (target !== null) {
            return target.offsetParent;
        } else {
            return null;
        }
    }
    getStepIndex(e) {
        this.setState({
            stepIndex: e.target.value,
            middleStepRecord: this.props.listRecordReplay[this.state.editIndex].list[e.target.value]

        })
    }

    inputChange(e) {
        let { middleStepRecord } = this.state
        middleStepRecord[e.target.id] = e.target.value

        this.setState({
            middleStepRecord
        })
    }

    saveStep() {
        let listRecordReplay = this.props.listRecordReplay//[this.state.editIndex].list[this.state.stepIndex]
        listRecordReplay[this.state.editIndex].list[this.state.stepIndex] = this.state.middleStepRecord
        this.props.saveRecordReplay(listRecordReplay)
    }


    render() {
        let panelPosition = {
            x: this.props.dialogInfo.x / document.documentElement.clientWidth > 0.5 ? '-240' : '40',
            y: this.props.dialogInfo.y / document.documentElement.clientHeight > 0.5 ? '-80' : '0'
        }
        let { showEdit, editIndex, middleStepRecord } = this.state
        const { listRecordReplay, finishedRun, dialogInfo } = this.props
        let editRecordReplay = listRecordReplay[editIndex]

        middleStepRecord['during'] = middleStepRecord['during'] || ''
        middleStepRecord['title'] = middleStepRecord['title'] || ''
        middleStepRecord['message'] = middleStepRecord['message'] || ''

        return (
            <div id="dialog-panel">
                {showEdit
                    ?
                    <div className="modal fade show" id="exampleModal" tabIndex="-1" style={{ 'display': 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Date:({this.formateDate(editRecordReplay.time)})</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.closeEditRecordReplay()}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlSelect1">Steps Select</label>
                                            <select className="form-control" id="exampleFormControlSelect1" onChange={(e) => this.getStepIndex(e)}>
                                                {
                                                    editRecordReplay.list.map((n, index) => {
                                                        return (
                                                            <option key={index}>{index + 1}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">During Time:(s)</label>
                                            <input type="number" className="form-control" id="during" value={middleStepRecord.during} onChange={(e) => this.inputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                                            <input type="text" className="form-control" id="title" placeholder="input message title" value={middleStepRecord.title} onChange={(e) => this.inputChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                                            <textarea className="form-control" id="message" placeholder="less than 30 words" value={middleStepRecord.message} onChange={(e) => this.inputChange(e)}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Delete</button>
                                    <button type="button" className="btn btn-primary" onClick={() => this.saveStep()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }


                {
                    this.state.recordStatus == 'run'
                        ?
                        <div id="dialog-panel-pointer" style={{ left: dialogInfo.x + 'px', top: dialogInfo.y + 'px' }}>
                            <div className={`sharingan-popover sharingan-popover-placement-top`} style={{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }}>
                                <div className="sharingan-popover-content">
                                    <div className="sharingan-popover-inner" role="tooltip">
                                        {
                                            (!dialogInfo.title && !dialogInfo.message) || (dialogInfo.title == '' && dialogInfo.message == '') ? null
                                                :
                                                <div>
                                                    <div className="sharingan-popover-title">{dialogInfo.title}</div>
                                                    <div className="sharingan-popover-inner-content">
                                                        <div>
                                                            {dialogInfo.message}
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div id="dialog-panel-handle" className={`dialog-panel-handle ${finishedRun && !showEdit ? '' : 'd-none'}`}>
                    <div className="dialog-panel-top">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Step</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="record-list">
                                {
                                    listRecordReplay.map((n, i) => {
                                        return (
                                            <tr className="record-item" key={i} id={i}>
                                                <th scope="row">{i + 1}</th>
                                                <td className="record-date">{this.formateDate(n.time)}</td>
                                                <td className="record-date">{n.list.length} steps</td>
                                                <td className="icon-group">
                                                    <i className="icon-item icon-edit fa fa-edit"></i>
                                                    <i className="icon-item icon-run fa fa-play"></i>
                                                    <i className="icon-item icon-delete fa fa-close"></i>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="dialog-panel-bottom">
                        <div className="clear-btn dialog-btn" onClick={() => this.clearRecordReplay()}>Clear</div>
                        <div className="status-btn dialog-btn" onClick={() => this.handleRecordReplay()} > <div className={`point-status ${this.state.recordStatus == 'record' ? 'animated infinite flash slow' : 'gray-pointer'}`}></div></div>
                        <div className="save-btn dialog-btn" onClick={() => this.saveRecordReplay()}>Save</div>
                    </div>
                </div>
            </div >
        )
    }
}

export default DialogPanel