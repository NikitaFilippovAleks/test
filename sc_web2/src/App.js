import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { fetchPath } from "./config";
import asyncComponent from "./commmon/AsyncComp";
// import Navigation from "./components/navigation/Navigation";
// import Home from "./components/home/Home";
// import NotFound from "./components/notfound/404";
// import Authentication from "./components/authentication/Authentication";
// import Articles from "./components/articlesDashboard/Articles";
// import NewArticle from "./components/createArticle/NewArticle";
// import MyEditor from "./components/editArticle/Editor";
// import ImageEditor from "./components/imagesDashboard/ImageEditor";
// import EditRedirect from "./components/editRedirect/EditRedirect";
// import PreviewArticle from "./components/previewArticle/PreviewArticle";
// import LiveBlogList from "./components/livebloglist/LiveBlogList";

const AsyncNavigation = asyncComponent(() => import("./components/navigation/Navigation"));
const AsyncHome = asyncComponent(() => import("./components/home/Home"));
const AsyncNotFound = asyncComponent(() => import("./components/notfound/404"));
const AsyncAuthentication = asyncComponent(() => import("./components/authentication/Authentication"));
const AsyncArticles = asyncComponent(() => import("./components/articlesDashboard/Articles"));
const AsyncReviewArticles = asyncComponent(() => import("./components/reviewArticlesDashboard/ReviewArticles"));
const AsyncNewArticle = asyncComponent(() => import("./components/createArticle/NewArticle"));
const AsyncNewReviewArticle = asyncComponent(() => import("./components/createReviewArticle/NewReviewArticle"));
const AsyncMyEditor = asyncComponent(() => import("./components/editArticle/Editor"));
const AsyncReviewEditor = asyncComponent(() => import("./components/editReviewArticle/ReviewEditor"));
const AsyncImageEditor = asyncComponent(() => import("./components/imagesDashboard/ImageEditor"));
const AsyncEditRedirect = asyncComponent(() => import("./components/editRedirect/EditRedirect"));
const AsyncPreviewArticle = asyncComponent(() => import("./components/previewArticle/PreviewArticle"));
const AsyncLiveBlogList = asyncComponent(() => import("./components/livebloglist/LiveBlogList"));
const DataEntry = asyncComponent(() => import("./components/dataentry/DataEntry"));
const LiveBlogEdit = asyncComponent(() => import("./components/liveBlogEdit/LiveBlogEdit"));
const AsyncLiveUpdates = asyncComponent(() => import("./components/liveupdates/LiveUpdates"));

const AsyncNewWebpage = asyncComponent(() => import("./components/createWebpage/NewWebpage"));
const AsyncWebpageEditor = asyncComponent(() => import("./components/editWebpage/Editor"));
const AsyncWebpagesDashboard = asyncComponent(() => import("./components/webpagesDashboard/WebpagesDashboard"));
const AsyncPreviewWebpage = asyncComponent(() => import("./components/previewWebpage/PreviewWebpage"));


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logedin: false,
      userStatus: "status3"
    };
    this.changeLoginStatus = this.changeLoginStatus.bind(this);
  }

  async changeLoginStatus(status, userStatus) {
    if (status === false) {
      localStorage.removeItem("scappsectok");
    }
    await new Promise(resolve =>
      this.setState(
        {
          logedin: status,
          userStatus: userStatus
        },
        resolve
      )
    );
  }

  checking = async () => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("scappsectok");
      const url = fetchPath + "/verify";
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          token: token
        }
      })
        .then(res => res.json())
        .then(async response => {
          await new Promise(resolve =>
            this.setState({ logedin: response.success }, resolve)
          );
          resolve(response.status);
        })
        .catch(async err => {
          await new Promise(resolve =>
            this.setState({ logedin: false, userStatus: "status3" }, resolve)
          );
          reject("status3")
        });
    });
  };

  async componentDidMount() {
    let re = await this.checking();
    this.setState({userStatus: re});
  }

  render() {
    if (this.state.userStatus === "status3") {
      return (
        <Router>
          <div>
            <AsyncNavigation
              logedin={this.state.logedin}
              toggle={this.changeLoginStatus}
            />
            <Switch>
              <Route
                path="/"
                exact
                component={() => <AsyncHome logedin={this.state.logedin} />}
              />
              <Route
                path="/home"
                component={() => <AsyncHome logedin={this.state.logedin} />}
              />
              <Route
                path="/authenticate"
                component={() => (
                  <AsyncAuthentication
                    logedin={this.state.logedin}
                    userStatus={this.state.userStatus}
                    toggle={this.changeLoginStatus}
                  />
                )}
              />
            </Switch>
          </div>
        </Router>
      );
    }
    return (
      <Router>
        <div>
          <AsyncNavigation
            logedin={this.state.logedin}
            toggle={this.changeLoginStatus}
          />
          <Switch>
            <Route
              path="/"
              exact
              component={() => <AsyncHome logedin={this.state.logedin} />}
            />
            <Route
              path="/home"
              component={() => <AsyncHome logedin={this.state.logedin} />}
            />
            <Route
              path="/authenticate"
              component={() => (
                <AsyncAuthentication
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                  toggle={this.changeLoginStatus}
                />
              )}
            />
            <Route
              path="/articles/editor"
              component={() => (
                <AsyncArticles
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/reviewArticles/editor"
              component={() => (
                <AsyncReviewArticles
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/articles/new"
              component={() => (
                <AsyncNewArticle
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/reviewArticles/new"
              component={() => (
                <AsyncNewReviewArticle
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/editor/:id"
              component={({ match }) => (
                <AsyncMyEditor
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/reviewEditor/:id"
              component={({ match }) => (
                <AsyncReviewEditor
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/ImageEditor"
              exact
              component={({match}) => (
                <AsyncImageEditor
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/ImageEditor/:folder1"
              exact
              component={({match}) => (
                <AsyncImageEditor
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/ImageEditor/:folder1/:folder2"
              exact
              component={({match}) => (
                <AsyncImageEditor
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/LiveUpdates"
              exact
              component={({match}) => (
                <AsyncLiveUpdates
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/LiveUpdates/:folder1"
              exact
              component={({match}) => (
                <AsyncLiveUpdates
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/LiveUpdates/:folder1/:folder2"
              exact
              component={({match}) => (
                <AsyncLiveUpdates
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/edit/*/*/*/*/*/*"
              component={({ match }) => (
                <AsyncEditRedirect
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/preview/:id"
              component={({ match }) => (
                <AsyncPreviewArticle
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/livebloglist"
              component={() => (
                <AsyncLiveBlogList
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/live-blog/:id"
              exact
              component={({match}) => (
                <LiveBlogEdit
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/dataentry"
              component={() => (
                <DataEntry
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />

            <Route
              path="/webpages/new"
              component={() => (
                <AsyncNewWebpage 
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus} />
              )}
            />
            <Route
              path="/webpageEditor/:id"
              component={({ match }) => (
                <AsyncWebpageEditor
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/webpages/dashboard"
              component={() => (
                <AsyncWebpagesDashboard
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route
              path="/previewWebpage/:id"
              component={({ match }) => (
                <AsyncPreviewWebpage
                  match={match}
                  logedin={this.state.logedin}
                  userStatus={this.state.userStatus}
                />
              )}
            />
            <Route component={AsyncNotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
