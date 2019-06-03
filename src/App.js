import React from 'react';
import Sharingan from './SharinganComponent/SharinganIndex'
// import DialogPanel from './SharinganComponent/DialogPanel'
import './App.css';

window.actionRecord = []

class App extends React.Component {

  constructor(props) {
    super(props)
    this.Sharingan = new Sharingan()
  }

  // componentDidMount() {
  //   this.Sharingan.startSharingan()
  // }

  taskList() {
    // this.Sharingan.taskRun()
  }

  test(data) {
    console.log(data)
  }


  render() {
    return (
      <div className="main">
        <Sharingan />
        <div className="mouse m-1"></div>
        <div className="mouse m-2"></div>
        <div className="mouse m-3"></div>
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
