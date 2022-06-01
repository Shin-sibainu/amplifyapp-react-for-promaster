import logo from "./logo.svg";
import "./App.css";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

import awsExports from "./aws-exports";
import { useEffect, useState } from "react";
Amplify.configure(awsExports);

const initialFormState = { name: "", description: "" };

function App({ signOut, user }) {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  //メモのリストを取得
  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <h1>📝メモアプリ</h1>
      <input
        placeholder="Note name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        placeholder="Note Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <button onClick={createNote}>ノートを作成する</button>

      <div style={{ marginButton: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>ノートを削除する</button>
          </div>
        ))}
      </div>
      <button onClick={signOut} style={{ marginTop: 30 }}>
        サインアウト
      </button>
      {/* <header className="App-header">
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
      </header> */}
    </div>
  );
}

export default withAuthenticator(App);
