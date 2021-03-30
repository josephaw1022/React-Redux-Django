import React from "react"
import axios from "axios"
import "./App.css"
import { Row, Button, Col, CardBody, Card, CardTitle, Container } from "reactstrap"
import { connect } from "react-redux"
import { ButtonAction } from "./Redux/Actions/ButtonAction"
import { store } from "./Redux/Stores/store"
import classnames from "classnames" 
class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      Button: [],
      ActiveButton: {
        count: 0,
        id: " ",
      },
    }
    this.HandleClick = this.HandleClick.bind(this)
  }

  componentDidMount() {
    this.updateCycle()
  }

  componentDidUpdate() {
    this.updateCycle()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Row style={{ marginBottom: "100px" }}>
            <Col>
              <h1 className="text-warning"> Button Counter </h1>
              <hr className="secondary"/> 
            </Col>
          </Row>

          <Row style={{ marginBottom: "100px", marginTop: "30px" }}>
            <Col md={4}>
              <h3>Made by Joseph Whiteaker</h3>
            </Col>
            <Col md={8}>
            <Container fluid>
            <Row > 
        
            <Col>
              <h1 className="text-primary"> React </h1>
            </Col>
            <Col>
              <h1 className="text-light"> + </h1>
            </Col>
            <Col>
              <h1 className="text-danger"> Redux </h1>
            </Col>
            <Col>
              <h1 className="text-light"> + </h1>
            </Col>
            <Col>
              <h1 className="text-success"> Django </h1>
            </Col>
          
            </Row>
            </Container>
            </Col> 
       
          </Row>

          {this.renderList()}

          <div className="section"></div>
        </header>
      </div>
    )
  }

  updateCycle = () => {
    console.log(store.getState())
    console.log("store state ^ ")
    this.renderList()
    this.RefreshValue()
    this.props.ButtonProp(this.state.Button)
  }

  renderList() {
    return this.state.Button.map((item) => (
      <>
        <Row key={item.id} id="list">
          <Col style={{verticalAlign:"middle"}}>
            
            <Row>
            <Button
              color="primary"
              onClick={() => {
                this.HandleClick(item)
              }}
              className="text-dark"
              style={{ width: "100%", height:"auto" ,padding:"20px"}}
            >
              {" "}
              Increment{" "}
            </Button> 
            </Row>
            
          </Col>
          <Col style={{ width: "auto" }}>
            <Button
              color="primary"
              className="text-dark"
              onClick={() => {
                this.HandleReset(item)
              }}
              style={{ width: "100%", height:"auto" ,padding:"20px"}}
            >
              Reset{" "}
            </Button>
          </Col>
          <Col md={6}>
          <Card
            color="secondary"
            style={{ width:"200%"}}
          >
            <CardTitle style={{height:"inherit"}}>
              <h1 className="text-light">Button Count</h1>
              <hr />
            </CardTitle>
            <CardBody className="text-light" >
              <h5 >
                Item Count = {item.count} 
              </h5>
            
            </CardBody>
          </Card> 
          </Col> 
        </Row>
      
      </>
    ))
  }

  async RefreshValue() {
    this.setState({ count: this.state.count + 1 })
    const url = "http://localhost:8000/api/buttoncounts/"
    const response = await fetch(url)
    const data = await response.json()
    if (data) {
      this.setState((state) => ({ Button: data }))
      this.renderList()
    }
    this.props.ButtonProp(this.state.Button)
  }

  HandleReset(item) {
    this.setState(
      {
        ActiveButton: item,
      },
      () => {
        let tempObject = this.state.ActiveButton
        tempObject.count = 0
        this.setState({ ActiveButton: tempObject }, () => {
          axios
            .put(
              `http://localhost:8000/api/buttoncounts/${this.state.ActiveButton.id}/`,
              tempObject
            )
            .then(this.RefreshValue())
            .then(this.renderList())
        })
      }
    )
    // window.location.reload()
    this.props.ButtonProp(this.state.Button)
  }

  HandleClick(item) {
    this.setState(
      {
        count: 0,
        ActiveButton: item,
      },
      () => {
        let tempObject = this.state.ActiveButton
        tempObject.count = tempObject.count + 1
        this.setState({ ActiveButton: tempObject }, () => {
          axios.put(
            `http://localhost:8000/api/buttoncounts/${this.state.ActiveButton.id}/`,
            tempObject
          )
        })
      }
    )

    this.RefreshValue()
  }
}

function mapStateToProps(props, state) {
  return {
    DefaultValue: props.DefaultValue + " " + state.NewButton,
  }
}

const mapActionsToProps = {
  ButtonProp: ButtonAction,
}

export default connect(mapStateToProps, mapActionsToProps)(App)
