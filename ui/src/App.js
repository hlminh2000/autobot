import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const apiRoot = "http://192.168.100.110:4000";

const withServerState = WrappedComponent =>
  class extends Component {
    fetcher = ({ endPoint }) => {
      return fetch(`${apiRoot}${endPoint}`)
        .then(result => result.json())
        .then(state => {
          console.log("state: ", state);
          this.setState(state);
          return state;
        });
    };
    componentDidMount() {
      this.fetcher({ endPoint: "/state" });
    }
    render() {
      return (
        <WrappedComponent
          {...{ serverState: this.state, fetcher: this.fetcher }}
        />
      );
    }
  };

export default compose(withServerState, withStyles(styles))(
  ({ classes, serverState, fetcher }) => (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          />
          <Typography variant="title" color="inherit" className={classes.flex}>
            Home
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <div>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div">Home Control</ListSubheader>
          }
        >
          <ListItem>
            <ListItemText primary="Living room light" />
            <Switch
              checked={serverState ? serverState.livingRoom.light.on : false}
              onChange={() => fetcher({ endPoint: "/toggle/livingRoom/light" })}
              color="primary"
            />
          </ListItem>
        </List>
      </div>
    </div>
  )
);
