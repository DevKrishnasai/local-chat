import React, { useContext, useState } from "react";
import debounce from "lodash/debounce";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

const Search = () => {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [err, setErr] = useState(false);
  const [load, setLoad] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const debouncedSearch = debounce(async (searchText) => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchText)
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => doc.data());
      setSearchResults(results);
      setErr(false);
    } catch (err) {
      setSearchResults([]);
      setErr(true);
    }
    setLoad(false);
  }, 300);

  const handleSearch = (searchText) => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      setLoad(false);
      return;
    }
    setLoad(true);
    debouncedSearch(searchText);
  };

  const handleSelect = async (selectedUser) => {
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }

    setSearchResults([]);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user......"
          onChange={(e) => {
            setUsername(e.target.value);
            handleSearch(e.target.value);
          }}
          value={username}
        />
        <div>
          <Navbar />
        </div>
      </div>
      {searchResults.length === 0 && !load && !err && username.length > 0 && (
        <p
          style={{
            color: "white",
            marginLeft: "12px",
            marginBottom: "8px",
            fontSize: "14px",
          }}
        >
          No users found.
        </p>
      )}

      {load && (
        <p
          style={{
            color: "white",
            marginLeft: "12px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          Loading.....
        </p>
      )}

      {searchResults.length > 0 && (
        <div className="searchResults">
          {searchResults.map((result) => (
            <div
              key={result.uid}
              className="userChat"
              onClick={() => handleSelect(result)}
            >
              <img src={result.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{result.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
