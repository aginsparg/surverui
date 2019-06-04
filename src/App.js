import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faDotCircle, faCheckSquare, faICursor, faPercent, faCheck } from '@fortawesome/free-solid-svg-icons'
import CreateSurveyPage from './createSurvey/createSurveyPage';
import { BrowserRouter as Router, Route } from "react-router-dom";
import TakeSurvey from './TakeSurvey'
import Search from "./search";
import Grid from "./grid";
import RenderAnswers from "./RenderAnswers";

class App extends React.Component {

    constructor(props) {
        super(props)
        this.initialState = {
            fetchList: [
                this.getByTitle,
                this.getByAuthor,
            ],
            surveys: [],
            render: 'Search',
            renderKey: '',
            page: "Search",
        };
        this.state = this.initialState;
    }

    componentWillMount() {
        this.fetchAllSurveys()
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.render==='Search' && prevState.render !=='Search'){
            this.fetchAllSurveys();
        }
    }

    fetchAllSurveys= () =>{

        fetch('https://ti-survey-server.herokuapp.com/api/getAllShells')
        .then((response)=>response.json()
        , (err)=>{
            console.log("There is an error connecting to the database")
            console.log(err)
        })
        .then((res)=>{
            this.setState({surveys: res})
        }
        , (err)=>{
            console.log("There was an error mapping to the json object")
            console.log(err)
        })
    }

    render() {
    library.add(faSearch, faDotCircle, faCheckSquare, faICursor, faPercent, faCheck);
        if(window.location.pathname.split("/")[1]==="takeSurvey"){
            return(
                <Router>
                    <div>
                        <Route path="/takeSurvey/:id" component={this.takeSurvey}/>
                    </div>
                </Router>
            )
        }
        else {
            return (
                <div className="surveyTable">
                <Search fetch={this.state.fetchList} createSurvey={this.renderCreateSurvey}/>
                {this.state.render==='Search' &&<Grid surveys={this.state.surveys} onClick={this.renderAnswer}/>}
                {this.state.render==='Answers' && <RenderAnswers id={this.state.renderKey} />}
                {this.state.render==='CreateSurvey' && <CreateSurveyPage resetState={this.resetState}/>}
                </div>
            );
        }
    }

    renderAnswer=(surveyID)=>{
        this.setState({renderKey:surveyID, render:'Answers'})
    }

    renderCreateSurvey=()=>{
        this.setState({render:'CreateSurvey'})
    }

    getByTitle = (title) => {
        fetch("https://ti-survey-server.herokuapp.com/api/getShellByTitle/" + title)
            .then((res) => res.json()
            , (err)=>{
                console.log("There is an error connecting to the website")
                console.log(err)
            })
            .then((res) => {
                this.setState({ surveys: res })
            }
            , (err) => {
                console.log("There was an error converting to json")
                console.log(err)
            })
    }

    resetState = () => {
        this.setState(this.initialState);
    }
    getByAuthor = (author) => {
        fetch("https://ti-survey-server.herokuapp.com/api/getShellByAuthor/" + author)
            .then((res) => res.json()
            ,(err)=>{
                console.log("There was an error connecting to the website")
                console.log(err)})
            .then((res) => {
                this.setState({ surveys: res })
            }
            , (err) => {
                console.log("There is an error converting to json")
                console.log(err)
            })
    }

    getById= (id)=> {
        fetch("https://ti-survey-server.herokuapp.com/api/getShell/" + id)
            .then((res) => res.json()
            ,(err)=>{
                console.log("There was an error connecting to the website")
                console.log(err)})
            .then((res) => {
                this.setState({ surveys: res })
            }
            , (err) => {
                console.log("There is an error converting to json")
                console.log(err)
            })
    }
//TODO: FIX KEY
    takeSurvey=({ match })=> {
        return (
            this.state.surveys.id?
            (<TakeSurvey id={match} key={match.params.id} survey={this.state.surveys}/>
        ):(<h3> Getting the Survey...{this.getById(match.params.id)}</h3>))
    }
}
export default App;
