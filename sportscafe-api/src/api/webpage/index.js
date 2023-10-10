import _ from 'lodash';
import Joi from 'joi';
import * as handlers from './handlers';

let routes = [
  {
    method: 'GET',
    path:'/{id}',
    handler: handlers.getWebpageByID,
    config:{
      description:"Get webpage by ID",
      tags:['api'],
      validate:{
        params:{
          id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).description('Webpage Id')
        }
      }
    }
  },
  {
    method: 'GET',
    path:'/getWebpageByUrl',
    handler: handlers.getWebpageByUrl,
    config:{
      description:"Get Webpage by url",
      tags: ['api'],
      validate:{
        query:{
          url: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path:'/getWebpagesCount',
    handler: handlers.getWebpagesCount,
    config:{
      description:"Get the number of Webpages",
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path:'/getWebpagesWithConditions',
    handler: handlers.getWebpagesWithConditions,
    config:{
      description:"Get Webpages with conditions",
      tags: ['api'],
      validate:{
        query:{
          step: Joi.number().integer().default(0).min(0).description('0 assumes all articles to be counted'),
          skip: Joi.number().integer().min(0).description('Should be a non negative integer')
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/saveWebpage',
    handler: handlers.saveWebpage,
    config: {
      description: 'Either saves new webpage or modifies existing Webpage',
      tags: ['api'],
    }
  },
  {
    method:'DELETE',
    path:'/{id}',
    handler: handlers.deleteWebpageByID,
    config:{
      description:"To delete webpage by ID",
      tags:['api'],
      validate:{
        params:{
          id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).description('Webpage Id , the one to be Deleted')
        }
      }
    }
  }
];

_.map(routes, (elem) => {
  elem.version = 'v2';
});

export default routes;

