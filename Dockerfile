FROM node:20-alpine

WORKDIR /app

# Copy only package.json for dependencies
COPY ./UserService/package*.json ./

RUN npm install

# Copy UserService code
COPY ./UserService . 

# Copy shared repo (baseRepository etc.)
COPY ./shared ./shared

# Copy proto files if needed
RUN mkdir -p dist/proto && cp -r src/proto/* dist/proto/ || true

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]
