import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="user">
        <span>
          <Link to="/">
            <button onClick={() => signOut(auth)}>logout</button>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Navbar;
