import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState(false);
  const navigate = useNavigate();

  const checkLength = (e) => {
    if (e.target.value.length > 6) {
      setCondition(true);
    } else {
      setCondition(false);
    }
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(e.target[2].value);
    if (e.target[2].value.length > 6) {
      setCondition(false);
    } else {
      setCondition(true);
    }
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0] ? e.target[3].files[0] : null;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: file
                ? downloadURL
                : "https://www.pngitem.com/pimgs/m/4-40070_user-staff-man-profile-user-account-icon-jpg.png",
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="intro">
        <h2>Local Chat</h2>
        <p>--- Made with love ---</p>
      </div>
      <div className="formWrapper">
        <span className="logo">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="username*" />
          <input required type="email" placeholder="email*" />
          <input required type="password" placeholder="password*" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
        </form>
        <p>{loading && "Uploading and compressing the image please wait..."}</p>
        <h3>{err && <span>Something went wrong</span>}</h3>
        <p>
          You do have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
