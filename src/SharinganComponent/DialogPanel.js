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
        if (this.props.status !== nextProps.status) {
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
        while (target && target.className.indexOf('dialog-panel-top') === -1) {
            target = target.offsetParent;
        }
        if (target !== null) {
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

        // return (
        //     <div id="dialog-table">
        //         <div id="accordion">
        //             <div className="card">
        //                 <div className="card-header" id="headingOne">
        //                     <h5 className="mb-0">
        //                         <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        //                             Collapsible Group Item #1
        //                         </button>
        //                     </h5>
        //                 </div>
        //                 <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
        //                     <div className="card-body">
        //                         <div className="form-group row">
        //                             <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Title</label>
        //                             <div className="col-sm-10">
        //                                 <input type="password" className="form-control" id="inputTitle" placeholder="Input the Step's Name" />
        //                             </div>
        //                         </div>
        //                         <div className="form-group row">
        //                             <label htmlFor="inputPosition" className="col-sm-2 col-form-label">Position</label>
        //                             <div className="col-sm-10 form-row align-items-center">
        //                                 <div className="col-auto">
        //                                     <label className="sr-only" htmlFor="inlineFormInputGroup">Username</label>
        //                                     <div className="input-group mb-2">
        //                                         <div className="input-group-prepend">
        //                                             <div className="input-group-text">X</div>
        //                                         </div>
        //                                         <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Position X" />
        //                                     </div>
        //                                 </div>
        //                                 <div className="col-auto">
        //                                     <label className="sr-only" htmlFor="inlineFormInputGroup">Username</label>
        //                                     <div className="input-group mb-2">
        //                                         <div className="input-group-prepend">
        //                                             <div className="input-group-text">Y</div>
        //                                         </div>
        //                                         <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Position Y" />
        //                                     </div>
        //                                 </div>
        //                             </div>


        //                             {/* </div> */}
        //                         </div>




        //                         {/* <div className="form-group row">
        //                             <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Title</label>
        //                             <div className="col-sm-10">
        //                                 <input type="password" className="form-control" id="inputTitle" placeholder="Input the Step's Name" />
        //                             </div>
        //                         </div>
        //                         <div className="form-group row">
        //                             <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Type</label>
        //                             <div className="col-sm-10">
        //                                 <input type="text" readonly className="form-control-plaintext" value="email@example.com" />
        //                             </div>
        //                         </div> */}
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="card">
        //                 <div className="card-header" id="headingTwo">
        //                     <h5 className="mb-0">
        //                         <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        //                             Collapsible Group Item #2
        //                         </button>
        //                     </h5>
        //                 </div>
        //                 <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
        //                     <div className="card-body">
        //                         Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="card">
        //                 <div className="card-header" id="headingThree">
        //                     <h5 className="mb-0">
        //                         <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        //                             Collapsible Group Item #3
        //                         </button>
        //                     </h5>
        //                 </div>
        //                 <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
        //                     <div className="card-body">
        //                         Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div >
        // )

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
                                            Content Content Content Content Content Content Content Content
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