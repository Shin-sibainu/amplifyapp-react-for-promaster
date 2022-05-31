import logo from "./logo.svg";
import "./App.css";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Hello React with AWS</h2>
        {user ? (
          <>
            <h3>私は権限を持っています：{user.username}</h3>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <h3>権限がありません</h3>
        )}
      </header>
    </div>
  );
}

export default withAuthenticator(App);