/**
 * Copyright (c) 2018 Kinvey Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const rss = require('./rss-data');

/* This module contains the handlers for each flex data method.  Each handler:
 * 1) Makes a request to an external service via a client
 * 2) Transforms the result, if necessary
 * 3) Returns the result via the completion handler
 */

const _sendTransformedResponse = (entity, complete, modules) => {
  // Map from external data to collection data
  // Empty array to add cleaned up elements to
  const items = [];
  // We are only interested in children of the 'channel' element
  // eslint-disable-next-line prefer-destructuring
  const channel = entity.rss.channel;
  
  channel.item.forEach((element) => {
    const mappedEntity = modules.kinveyEntity.entity();
    mappedEntity.title = element.title;
    mappedEntity.description = element.description;
    mappedEntity.date = element.pubDate;
    mappedEntity.creator = element['dc:creator'];
    mappedEntity.media = [];

    // Iterates through all the elements named '<media:content>' extracting the info we care about
    element['media:content'].forEach((mediaContent) => {
      mappedEntity.media.push({
        url: mediaContent.$.url, // Parses media:content url attribute
        credit: mediaContent['media:credit']._ // Parses media:credit tag content
      });
    });
    items.push(mappedEntity);
  });

  const response = complete().setBody(items);
  return response.ok().next();
};

const _getRssData = (resource, query, complete, modules) => {
  rss.getRssData(resource, query, modules, (err, result) => {
    if (err) {
      const response = complete().setBody(err);
      
      return response.done();
    }
    // transform data if needed
    return _sendTransformedResponse(result, complete, modules);
  });
};


const getRssData = (context, complete, modules) => _getRssData('RSS', context.query.query, complete, modules);

exports.getRssData = getRssData;
