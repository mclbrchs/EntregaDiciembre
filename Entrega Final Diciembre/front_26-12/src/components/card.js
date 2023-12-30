import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import classes from "./card.module.css";
import "font-awesome/css/font-awesome.min.css";

export const Card = ({ dataCard }, { filter }) => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const octRq = new Octokit({
    auth: "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",
  });

  const fetchData = async () => {
    var data;
    try {
      const resp = await fetch("http://localhost:3000/api/users-details?id=" + dataCard.login).then(x => x.json());
      //const resp = await octRq.request("GET /users/{username}", {
      //  headers: {
      //    "X-GitHub-Api-Version": "2022-11-28",
      //  },
      //  username: dataCard.login,
      //});
      data = resp;
    } catch (error) {
      console.log(error);
    }
    return data;
  };

  useEffect(() => {
    const getDataUser = async () => {
      setIsLoading(true);
      var result = await fetchData();
      setUserData(result);
      setIsLoading(false);
    };
    getDataUser();
  }, []);

  const handleProfileClick = () => {
    window.location.href = `https://github.com/${userData.login}`;
  };

  const getCard = () => {
    return (
      <div className={classes.userCardContainer}>
        <div className={classes.userCardContent}>
          <div className={classes.userCardProfilePic}>
            <img src={userData.avatar_url}></img>
          </div>
          <div className={classes.userCardDesc}>
            <div className={classes.userCardDescHeader}>
              <span
                id="githubUsername"
                style={{
                  cursor: "pointer",
                  color: "white",
                }}
                onClick={handleProfileClick}
              >
                {userData.login}
              </span>
              <span> | {userData.name} </span>
            </div>
            <div className={classes.userCardDescDesc}>{userData.bio}</div>
            <div className={classes.userCardDescFooter}>
              <span>
                <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                {userData.location}
              </span>
              <span>
                <i className="fa fa-users" aria-hidden="true"></i>{" "}
                {userData.followers}
              </span>
              <span>
                <i className="fa fa-solid fa-book" aria-hidden="true"></i>{" "}
                {userData.public_repos}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return <>{!isLoading && getCard()}</>;
};
