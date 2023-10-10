import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  IoMdCreate,
  IoIosImages,
  IoIosAddCircleOutline,
  // IoIosColorWand,
  // IoMdBrush,
  IoMdDocument,
  IoIosCellular,
} from "react-icons/io";

import { IconContainer, Icon, Icon2 } from "./styles/IconStyles";
import LoginMessage from "../../commmon/LoginMessage";
import { fetchPath } from "../../config";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "status3",
    };
  }

  checking = async () => {
    const token = localStorage.getItem("scappsectok");
    const url = fetchPath + "/verify";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then(async (response) => {
        await new Promise((resolve) =>
          this.setState({ status: response.status }, resolve)
        );
      });
  };

  async componentWillMount() {
    await this.checking();
  }

  render() {
    if (this.state.status === "status3") {
      return <LoginMessage>Login required.</LoginMessage>;
    }
    return (
      <IconContainer>
        <Link
          to="/articles/new"
          style={{ color: "black", textDecoration: "none", outline: "none" }}
        >
          <Icon title="Create New Article">
            <IoIosAddCircleOutline />
          </Icon>
        </Link>
        {this.state.status === "admin" ? (
          <Link
            to="/articles/editor"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
            }}
          >
            <Icon title="Articles Dashboard">
              <IoMdCreate />
            </Icon>
          </Link>
        ) : null}

        <Link
          to="/ImageEditor"
          style={{ color: "inherit", textDecoration: "none", outline: "none" }}
        >
          <Icon title="Images Dashboard">
            <IoIosImages />
          </Icon>
        </Link>
        {/* {this.state.status === "admin" ? (
          <Link
            to="/reviewArticles/new"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none"
            }}
          >
            <Icon2 title="Create new review article">
              <IoMdBrush />
            </Icon2>
          </Link>
        ) : null} */}
        {/* {this.state.status === "admin" ? (
          <Link
            to="/reviewArticles/editor"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none"
            }}
          >
            <Icon2 title="Review Articles Dashboard">
              <IoIosColorWand />
            </Icon2>
          </Link>
        ) : null} */}
        {this.state.status === "admin" ? (
          <Link
            to="/livebloglist"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
            }}
          >
            <Icon2 title="Live blog list">
              <IoIosCellular />
            </Icon2>
          </Link>
        ) : null}
        {this.state.status === "admin" ? (
          <Link
            to="/liveUpdates"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
            }}
          >
            <Icon2 title="live updates csv">
              <IoMdDocument />
            </Icon2>
          </Link>
        ) : null}
        {this.state.status === "admin" ? (
          <Link
            to="/webpages/new"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
            }}
          >
            <Icon2 title="Create New Webpage">
              <IoIosAddCircleOutline />
            </Icon2>
          </Link>
        ) : null}
        {this.state.status === "admin" ? (
          <Link
            to="/webpages/dashboard"
            style={{
              color: "inherit",
              textDecoration: "none",
              outline: "none",
            }}
          >
            <Icon2 title="Edit Webpages">
              <IoMdCreate />
            </Icon2>
          </Link>
        ) : null}
      </IconContainer>
    );
  }
}
