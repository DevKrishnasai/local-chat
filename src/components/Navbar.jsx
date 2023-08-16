import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="null" />
        <span>{currentUser.displayName}</span>
        <span>
          <button onClick={() => signOut(auth)}>logout</button>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
