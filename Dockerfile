FROM mcr.microsoft.com/playwright:v1.29.0-focal
WORKDIR /app

COPY . ./
RUN npm install
RUN npm run playwright

# ENTRYPOINT ["npm","run","test"]
CMD ["npm","run","test"]