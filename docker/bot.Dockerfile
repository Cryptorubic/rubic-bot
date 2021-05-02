FROM node:slim

ENV WORK_DIR /code

RUN mkdir $WORK_DIR

WORKDIR $WORK_DIR

RUN yarn global add pm2

COPY yarn.lock $WORK_DIR
COPY package.json $WORK_DIR

RUN yarn install

COPY . $WORK_DIR
