import {log}                    from 'src/utils';
import _                        from 'lodash';

export function getWebpageByID(req, res) {
  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');

  Webpage
    .findById(req.params.id)
    .lean()
    .exec(function (error, found) {
      if (error) {
        log.error(req.originalUrl, error);
        res(error).code(400);
      } else {
        if (!found) {
          let errorString = 'No webpage found with id ' + req.params.id;
          log.error(req.originalUrl, errorString);
          res().code(400);
        } else {
          res({data: found}).code(200);
        }
      }
    });
}

export function getWebpageByUrl(req, res) {
  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');

  Webpage
    .findOne({ url: req.query.url })
    .lean()
    .exec(function (error, found) {
      if (error) {
        log.error(req.originalUrl, error);
        res(error).code(400);
      } else {
        if (!found) {
          let errorString = 'No webpage found with url ' + req.params.url;
          log.error(req.originalUrl, errorString);
          res().code(400);
        } else {
          res({data: found}).code(200);
        }
      }
    });
}

export function getWebpagesCount(req, res) {
  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');

  Webpage
    .find({})
    .count(function (error, count) {
      if (error) {
        log.error(req.originalUrl, error);
        res(error).code(400);
      } else {
        res({
          "data": {
            "webpagesCount": count
          }
        });
      }
    });
}

export function getWebpagesWithConditions(req, res) {
  if (!req.query) {
    res({
      error: 'Incorrect parameters.'
    }).code(400);
    return;
  }

  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');

  Webpage
    .find({})
    .setOptions(req.query)
    .exec(function (error, webpages) {
      if (error) {
        log.error(req.originalUrl, error);
        res(error).code(400);
      } else {
        if (!webpages) {
          let errorString = 'No webpages found';
          log.error(req.originalUrl, errorString);
          res().code(400);
        } else {
          res({data: webpages}).code(200);
        }
      }
    });
}

export function saveWebpage(req, res) {
  let webpageToSave = req.payload;

  if (!webpageToSave || webpageToSave.content.length === 0) {
    res({ error: 'Incorrect parameters'}).code(400);
  }

  if (!webpageToSave.creationDate){
    webpageToSave.creationDate = new Date();
  }

  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');

  Webpage
    .find({_id: webpageToSave._id})
    .then((founds) => {
      if(founds.length === 0) {
        //create new
        let webpage = new Webpage(webpageToSave);
        webpage
          .save()
          .then((savedWebpage) => {
            console.log("page created with id: ", webpageToSave._id);
            res(savedWebpage.toObject()).code(200);
          });
      } else {
        //update
        Webpage
          .findOneAndUpdate({_id: webpageToSave._id}, webpageToSave, {new: true})
          .then((savedWebpage) => {
            console.log("webpage updated with id: ", webpageToSave._id);
            res(savedWebpage.toObject()).code(200);
          });
      }
    })
    .catch((error) => {
      log.error('Error saving webpage', error);
      res({error: error}).code(400);
    });
}

export function deleteWebpageByID(req, res) {
  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');
  Webpage
    .remove({
      _id: req.params.id
    })
    .exec(function (error) {
      if (error) {
        log.error(error);
        res().code(404);
      } else {
        res().code(200);
      }
    });
}

export function checkFreeUrl(req, res) {
  let Webpage = req.server.plugins['scappMongo']['mongooseConnector'].model('Webpage');
  Webpage
    .find({})
    .count(function (error, count) {
      if (error) {
        log.error(req.originalUrl, error);
        res(error).code(400);
      } else {
        res({
          "data": {
            "webpagesCount": count
          }
        });
      }
    });
}


