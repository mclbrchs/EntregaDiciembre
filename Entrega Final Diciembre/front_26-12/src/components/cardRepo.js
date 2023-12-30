import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import classes from "./cardRepo.module.css";
import "font-awesome/css/font-awesome.min.css";

export const CardRepo = ({ dataCard }, { filter }) => {
  console.log(dataCard);
  const [repoData, setRepoData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const octRq = new Octokit({
    auth: "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",
  });

  const fetchData = async () => {
    var data;
    try {
      var bodyPt ={
        query:dataCard.owner.login,
        repo:dataCard.name
      }
      //reemplazo para obtener datos de la api
      const resp = await fetch("http://localhost:3000/api/repo-details", {
        method: "POST",
        mode: "cors", 
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(bodyPt),
      }).then(x => x.json());
      //const resp = await octRq.request("GET /repos/{owner}/{repo}", {
      //  headers: {
      //    "X-GitHub-Api-Version": "2022-11-28",
      //  },
      //  owner: dataCard.owner.login,
      //  repo: dataCard.name,
      //});
      console.log("DATA REPO " + dataCard.login);
      console.log(resp);
      data = resp;
    } catch (error) {
      console.log(error);
    }
    return data;
  };

  const calculateTimeAgo = (pushedAt) => {
    const now = new Date();
    const pushedDate = new Date(pushedAt);
    const timeDifference = now - pushedDate;
    const minutesAgo = Math.floor(timeDifference / 60000);

    if (minutesAgo < 1) {
      return "hace menos de un minuto";
    } else if (minutesAgo === 1) {
      return "hace un minuto";
    } else if (minutesAgo < 60) {
      return `hace ${minutesAgo} minutos`;
    } else if (minutesAgo < 120) {
      return "hace una hora";
    } else if (minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `hace ${hoursAgo} horas`;
    } else {
      return `hace más de un día`;
    }
  };

  useEffect(() => {
    const getDataRepo = async () => {
      setIsLoading(true);
      var result = await fetchData();
      setRepoData(result);
      setIsLoading(false);
    };
    getDataRepo();
  }, []);

  const handleRepoClick = () => {
    window.location.href = `https://github.com/${repoData.full_name}`;
  };

  const getCard = () => {
    return (
      !isLoading && (
        <div className={classes.CardContainer}>
          <div className={classes.CardContent}>
            <div className={classes.CardProfilePic}>
              <img
                src={repoData != undefined ? repoData.owner.avatar_url : ""}
              ></img>
            </div>
            <div className={classes.CardDesc}>
              <div className={classes.CardDescHeader}>
                <span
                  id="githubRepo"
                  style={{
                    cursor: "pointer",
                    color: "white",
                  }}
                  onClick={handleRepoClick}
                >
                  {repoData.full_name}
                </span>
              </div>
              <div className={classes.CardDescDesc}>{repoData.description}</div>
              <div className={classes.CardDescFooter}>
                <span>{repoData.language}</span>
                <span>
                  {" "}
                  <i class="fa fa-solid fa-star"></i>{" "}
                  {repoData.stargazers_count}
                </span>
                <span>
                  {" "}
                  <i class="fa fa-solid fa-calendar"></i>{" "}
                  {calculateTimeAgo(repoData.pushed_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };
  //public repos ==> public_repos
  //name ==> name
  //location ==> location
  //following ==> following
  //followers ==> followers
  //email ==> email
  //bio ==> bio
  //avatar_url
  return <>{!isLoading && getCard()}</>;
};
