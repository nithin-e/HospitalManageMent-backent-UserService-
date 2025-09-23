FROM node:20-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
