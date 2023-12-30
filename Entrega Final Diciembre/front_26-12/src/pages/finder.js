import { getDefaultNormalizer } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { Card } from "../components/card";
import { Octokit } from "octokit";
import { CardRepo } from "../components/cardRepo";
import classes from "./finder.module.css";

const Finder = ({ showHistory, setShowHistory }) => {
  const octRq = new Octokit({
    auth: "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",
  });

  const [searchHistory, setSearchHistory] = useState([]);
  //const urlGetRepo ="GET /search/repositories";
  //const urlGetUsers="GET /search/users";

  //ajustes conexion api mongodb
  const urlGetRepo = "http://localhost:3000/api/repo-info";
  const urlGetUsers = "http://localhost:3000/api/users-info";

  var cantCards = 0;
  const [data, setData] = useState([]);
  const [dataRepo, setDataRepo] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [filter, setFilter] = useState(true); //true ==> users, false ==> repos
  const [isLoading, setIsLoading] = useState(true);
  const [actualPage, setActualPage] = useState(1);
  const [cantPages, setCantPages] = useState(0);
  const cantDataPerPage = 10;

  //const apiUrl = "http://localhost:3000/api/github-data";

  const fetchData = async (page) => {
    let urlS;
    var data;
    if (filter) {
      //si es true consulto users sino repos
      urlS = urlGetUsers;
    } else {
      urlS = urlGetRepo;
    }
    try {
      //por posibles errores un try-catch
      var bodyPt = {
        query: searchWord,
        perPage: cantDataPerPage,
        page: page,
      };
      const resp = await fetch(urlS, {
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
      }).then((x) => x.json());
      console.log("RESPONSE POST GENERAL");
      console.log(resp);
      cantCards = resp.total_count;
      setCantPages(Math.ceil(cantCards / cantDataPerPage));
      data = resp.items;
    } catch (error) {
      console.log("Ocurrió un error:", error);
    }
    return data;
  };

  const getData = async (page) => {
    if (searchWord.length > 3) {
      setIsLoading(true);
      var result = await fetchData(page);
      if (filter) {
        setData(result);
      } else {
        setDataRepo(result);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (actualPage == 1) {
        await getData(1);
        setSearchHistory((prevHistory) => [
          ...prevHistory,
          { type: filter ? "Usuarios" : "Repositorios", text: searchWord },
        ]);
      } else {
        setActualPage(1);
      }
    };
    if (searchWord.length > 3) {
      fetch();
    }
  }, [searchWord, filter]);

  useEffect(() => {
    const fetch = async () => {
      await getData(actualPage);
    };
    fetch();
  }, [actualPage]);

  const checkBoxFilterEvent = (event) => {
    setFilter((current) => {
      return !current;
    });
  };

  const searchEvent = (event) => {
    if (event.target.value.length > 3) {
      setSearchWord(event.target.value);
    }
  };

  const changePageResults = (newPage) => {
    if (newPage < 1 || newPage > cantPages) {
      return;
    }
    setActualPage(newPage);
  };

  const cards = () => {
    return (
      <>
        {filter &&
          data.map((item) => (
            <Card key={item.id} dataCard={item} type={filter}></Card>
          ))}
        {!filter &&
          dataRepo.map((item) => (
            <CardRepo key={item.id} dataCard={item} type={filter}></CardRepo>
          ))}
      </>
    );
  };

  const historyComponent = () => {
    return (
      <div className={`${classes.historyContainer} historyContainer`}>
        <h2>Historial de Búsqueda</h2>
        <ul className={classes.noBulletList}>
          {searchHistory.map((item, index) => (
            <li key={index}>
              {item.type}: {item.text}
            </li>
          ))}
        </ul>
        <button onClick={() => setShowHistory(false)}>Cerrar Historial</button>
      </div>
    );
  };

  return (
    <div className={classes.finderContainer}>
      {showHistory && historyComponent()}
      <input
        className={classes.inputSearch}
        type="search"
        onChange={searchEvent}
      />
      <div className={classes.headerContainer}>
        <div>
          <span>Usuarios</span>
          <input
            type="checkbox"
            onChange={checkBoxFilterEvent}
            checked={filter}
          />
        </div>
        <div>
          <span>Repositorios</span>
          <input
            type="checkbox"
            onChange={checkBoxFilterEvent}
            checked={!filter}
          />
        </div>
      </div>
      <div>
        <button onClick={() => setShowHistory(true)}>Ver Historial</button>
      </div>
      <div className={classes.cardsContainer}>
        <div className={classes.cardsContent}>
          {!isLoading ? cards() : <div>LOADING</div>}
        </div>
      </div>

      {cantPages > 0 && (
        <div className={classes.paginatorContainer}>
          <button onClick={() => changePageResults(actualPage - 1)}>
            PREV
          </button>
          <span>
            {actualPage} de {cantPages}
          </span>
          <button onClick={() => changePageResults(actualPage + 1)}>
            NEXT
          </button>
        </div>
      )}

      {/* Mostrar el historial si showHistory es true */}
      {showHistory && historyComponent()}
    </div>
  );
};

export default Finder;
