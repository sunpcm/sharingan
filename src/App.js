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
  startTest(event) {
    //refer https://w3c.github.io/uievents/tools/key-event-viewer.html
    //1. input test
    let inputElem = document.getElementById("input");

    //2.keybord event
    // let tempKeyboardEvent = new KeyboardEvent("down", {
    //   key: "a",
    //   shiftKey: true
    // });

    Object.getOwnPropertyDescriptor(inputElem.__proto__, "value").set.call(
      inputElem,
      inputElem.value + "a"
    );
    // inputElem.dispatchEvent(tempKeyboardEvent);

    let tempEvent = new Event("input", { bubbles: true, shiftKey: true });
    inputElem.dispatchEvent(tempEvent);

    // //3. click
    // let clickElem = document.getElementById("click");

    // //3.1  "1" keypress
    // // let tempKeyboardEvent = new KeyboardEvent("down", {
    // //   key: "1"
    // // });
    // // document.dispatchEvent(tempKeyboardEvent);

    // //3.2 shift keypres
    // let clickEevent = new MouseEvent("click", {
    //   bubbles: true,
    //   shiftKey: true
    // });
    // clickElem.dispatchEvent(clickEevent);
  }

  test(e) {
    console.log(e)
  }


  render() {
    return (
      <div className="main">
        <RecordReplay defaultTarget={'.main'} />
        <div className="mouse m-1"></div>
        <div className="mouse m-2"></div>
        <div className="mouse m-3"></div>

        <div className="top-panel">
          <button className="btn test-1" onClick={() => this.test(1)}>1</button>
          <button className="btn test-1" onClick={() => this.test(2)}>2</button>
          <button className="btn test-1" onClick={() => this.test(3)}>3</button>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">@</span>
          </div>
          <input id="input" type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
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
          <button id="task-start" className="btn test-1" onClick={() => this.startTest()}>Start</button>
        </div>
      </div>
    )
  }
}

export default App;
