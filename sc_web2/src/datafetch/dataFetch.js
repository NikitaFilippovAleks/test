/*eslint no-useless-concat: 0*/
import { baseUrl, fetchPath } from "../../config";

const getArticlesWithConditions = (query) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v2/article/getArticlesWithConditions`;
    fetch(url + query, { method: "GET", mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const getTotalArticlesCount = (query) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v2/article/getArticlesCountWithConditions`;
    fetch(url + query, { method: "GET", mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const getArticleByDateAndSlug = (query) => {
  return new Promise((resolve, reject) => {
    try {
      let url = `${baseUrl}/v2/article/getArticleByDateAndSlug?${query}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(null);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllClassificationEnums = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/v1/article/getAllClassificationEnums`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};
const getAllAuthors = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/v1/article/getAuthorsAll`)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const fuzzySearchTournament = (keys) => {
  const url =
    `${baseUrl}/v2/tags/fuzzySearchTournaments?key=` +
    `${keys}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const fuzzySearchTeam = (keys) => {
  const url =
    `${baseUrl}/v2/tags/fuzzySearchTeams?key=` + `${keys}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const fuzzySearchPlayer = (keys) => {
  const url =
    `${baseUrl}/v2/tags/fuzzySearchPlayers?key=` + `${keys}`;
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const generateFeaturedImageLinks = (path) => {
  return new Promise((resolve, reject) => {
    let links = [];
    if (path.startsWith("-")) {
      links.push(
        `https://cdn-images.spcafe.in/img/es3-cfill-w800-h400` + `${path}`
      );
      links.push(
        `https://cdn-images.spcafe.in/img/es3-cfill-w600-h300` + `${path}`
      );
      links.push(`https://cdn-images.spcafe.in/img/es3-cfill-s100` + `${path}`);
      resolve(links);
    } else if (path.length > 0) {
      links.push(
        `https://cdn-images.spcafe.in/img/es3-cfill-w800-h400/` + `${path}`
      );
      links.push(
        `https://cdn-images.spcafe.in/img/es3-cfill-w600-h300/` + `${path}`
      );
      links.push(
        `https://cdn-images.spcafe.in/img/es3-cfill-s100/` + `${path}`
      );
      resolve(links);
    } else {
      reject(links);
    }
  });
};

const saveArticle = (payload) => {
  logFetchRequest(`${baseUrl}/v2/article/saveArticle`);
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/v2/article/saveArticle`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve([data._id.length > 0, data._id]);
      })
      .catch((err) => reject(err));
  });
};

const deleteArticle = (id) => {
  logFetchRequest(`${baseUrl}/v1/article/` + `${id}`);
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/v1/article/` + `${id}`;
    fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    })
      .then((response) => response)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getArticleById = (id) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v1/article/${id}`;
    logFetchRequest(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((err) => {
        reject(null);
      });
  });
};

const deleteWebpage = (id) => {
  logFetchRequest(`${baseUrl}/v2/webpage/` + `${id}`);
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/v2/webpage/` + `${id}`;
    fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    })
      .then((response) => response)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

const getTotalWebpagesCount = () => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v2/webpage/getWebpagesCount`;
    fetch(url, { method: "GET", mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const getWebpagesWithConditions = (query) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v2/webpage/getWebpagesWithConditions`;
    console.log('url _ q', url + query)
    fetch(url + query, { method: "GET", mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(null);
      });
  });
};

const addTournamentToDB = (tag) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v1/tags/createTournament`;
    logFetchRequest(url + "-" + tag);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ query: tag }),
    })
      .then((response) => console.log("response"))
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

const addTeamToDB = (tag) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v1/tags/createTeam`;
    logFetchRequest(url + "-" + tag);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ query: tag }),
    })
      .then((response) => console.log("response"))
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

const addPlayerToDB = (tag) => {
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}/v1/tags/createPlayer`;
    logFetchRequest(url + "-" + tag);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ query: tag }),
    })
      .then((response) => console.log("response"))
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};

const logFetchRequest = (reqUrl) => {
  try {
    const url = fetchPath + "/logData";
    const username = localStorage.getItem("scnameuser") || "unknown";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: username, reqUrl: reqUrl }),
    }).then((response) => console.log(response));
  } catch {
    console.log("error");
  }
};

export {
  getTotalArticlesCount,
  getArticlesWithConditions,
  getArticleByDateAndSlug,
  getAllClassificationEnums,
  getAllAuthors,
  fuzzySearchTournament,
  fuzzySearchTeam,
  fuzzySearchPlayer,
  generateFeaturedImageLinks,
  saveArticle,
  deleteArticle,
  getArticleById,
  deleteWebpage,
  getTotalWebpagesCount,
  getWebpagesWithConditions,
  addTournamentToDB,
  addTeamToDB,
  addPlayerToDB,
};
