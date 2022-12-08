FROM mcr.microsoft.com/playwright:v1.17.1
WORKDIR /app

COPY . ./
RUN npm install

ENTRYPOINT ["npm","run","test"]