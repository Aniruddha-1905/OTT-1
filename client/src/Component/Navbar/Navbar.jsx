import React, { useState, useEffect } from "react";
import logo from "./logo.ico";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import Searchbar from "./Searchbar/Searchbar";
import Auth from "../../Pages/Auth/Auth";
import axios from "axios";
import { login } from "../../action/auth";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; // Fixed import
import { setcurrentuser } from "../../action/currentuser";

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false);
  const [user, setuser] = useState(null);
  const [profile, setprofile] = useState(null);
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.currentuserreducer);

  const google_login = useGoogleLogin({
    onSuccess: (tokenResponse) => setuser(tokenResponse),
    onError: (error) => console.error("Google Login Failed", error),
    scope: "openid email profile",
  });

  useEffect(() => {
    if (user?.access_token) {
      console.log("User Token Response:", user); // Debugging
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${user.access_token}`, // Fixed template literal
          },
        })
        .then((res) => {
          console.log("User Profile:", res.data); // Debugging
          setprofile(res.data);
          dispatch(login({ email: res.data.email })); // Fixed property access
        })
        .catch((err) =>
          console.error("Error fetching user profile:", err)
        );
    }
  }, [user, dispatch]);

  const logout = () => {
    dispatch(setcurrentuser(null));
    googleLogout();
    localStorage.clear();
  };

  useEffect(() => {
    const token = currentuser?.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    const storedProfile = localStorage.getItem("Profile");
    if (storedProfile) {
      dispatch(setcurrentuser(JSON.parse(storedProfile)));
    }
  }, [currentuser?.token, dispatch]);

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggledrawer}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to="/" className="logo_div_Navbar">
            <img src={logo} alt="Multi-Media Streaming Logo" />
            <p className="logo_title_navbar">Multi-Media Streaming</p>
          </Link>
        </div>
        <Searchbar />
        <RiVideoAddLine size={22} className="vid_bell_Navbar" />
        <div className="apps_Box">
          {Array.from({ length: 9 }).map((_, index) => (
            <p key={index} className="appBox"></p>
          ))}
        </div>
        <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />
        <div className="Auth_cont_Navbar">
          {currentuser?.result ? (
            <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
              <p className="fstChar_logo_App">
                {currentuser.result.name
                  ? currentuser.result.name.charAt(0).toUpperCase()
                  : currentuser.result.email.charAt(0).toUpperCase()}
              </p>
            </div>
          ) : (
            <p className="Auth_Btn" onClick={google_login}>
              <BiUserCircle size={22} />
              <b>Sign in</b>
            </p>
          )}
        </div>
      </div>
      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}
    </>
  );
};

export default Navbar;
