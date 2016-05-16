FROM mhart/alpine-node:4

WORKDIR /src
ADD . /src

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python

# If you need npm, don't use a base tag
RUN npm install

EXPOSE 8080

ENV NODE_ENV production
CMD ["npm", "start"]
