import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import GithubIcon from "@material-ui/icons/GitHub";
const About = () => {
  const visitGithub = () => {
    window.location = "https://github.com/vijaymoorthy13"
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src=""
              alt="Founder"
            />
            <Typography>Vijay</Typography>
            <Button onClick={visitGithub} color="primary">
              Visit Github
            </Button>
            <span>
              Ecommerce Website developed by vijay copyrights@ 2022.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Check My profile</Typography>
                        
            <a href="https://github.com/vijaymoorthy13" target="blank">
              <GithubIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
