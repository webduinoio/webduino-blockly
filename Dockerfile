FROM mhart/alpine-node:6

WORKDIR /src
ADD . /src

ARG env=production

RUN apk update

ENV PATH /root/.yarn/bin:$PATH

RUN apk update \
  && apk add curl bash binutils tar \
  && rm -rf /var/cache/apk/* \
  && curl -o- -L https://yarnpkg.com/install.sh | sh \
  && apk del curl tar binutils

# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ git python

# If you need npm, don't use a base tag
RUN NODE_ENV=production yarn install

WORKDIR /src
RUN rm -rf .git .gitmodules

EXPOSE 8080

ENV NODE_ENV $env
CMD ["npm", "start"]
