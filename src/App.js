import React from 'react';
import RecordReplay from './RecordReplayComponent/RecordReplayIndex'
// import DialogPanel from './RecordReplayComponent/DialogPanel'
import './App.css';

window.actionRecord = []

class App extends React.Component {

  // constructor(props) {
  //   super(props)
  // }

  componentDidMount() {
    //   this.RecordReplay.startRecordReplay()
    // this.RecordReplay = new RecordReplay({callback:()=>this.test()})
  }

  test(e) {
    console.log(e)
  }

  taskList() {
    // this.RecordReplay.taskRun()
  }

  test(data) {
    console.log(data)
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
    while (target && target.className.indexOf('mouse') === -1) {
      target = target.offsetParent;
    }
    if (target != null) {
      return target.offsetParent;
    } else {
      return null;
    }
  }


  render() {
    return (
      <div className="main">
        <RecordReplay defaultTarget={'.main'} />
        <div className="mouse m-1"></div>
        <div className="mouse m-2"></div>
        <div className="mouse m-3"></div>
        <form>
          {/* <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div> */}
          {/* <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div> */}
          {/* <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button> */}
        </form>
        <div className="top-panel">
          <button className="btn test-1" onClick={() => this.test(1)}>1</button>
          <button className="btn test-1" onClick={() => this.test(2)}>2</button>
          <button className="btn test-1" onClick={() => this.test(3)}>3</button>
        </div>
        <div className="left-panel">
          <button className="btn test-1" onClick={() => this.test(4)}>1</button>
          <button className="btn test-1" onClick={() => this.test(5)}>2</button>
          <button className="btn test-1" onClick={() => this.test(6)}>3</button>
        </div>
        <div className="right-panel">
          <button className="btn test-1">1</button>
          <button className="btn test-1">2</button>
          <button className="btn test-1">3</button>
        </div>
        <div className="bottom-panel">
          <button className="btn test-1" onClick={() => this.test(7)}>1</button>
          <button className="btn test-1" onClick={() => this.test(8)}>2</button>
          <button id="task-start" className="btn test-1" onClick={() => this.taskList()}>Start</button>
        </div>
      </div>
    )
  }
}

export default App;
