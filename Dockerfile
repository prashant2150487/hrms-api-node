FROM node:24-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package.json yarn.lock* package-lock.json* ./

# Use yarn since package.json requires yarn >=1.22.0
RUN yarn install

# Copy application source code
COPY . .

# Expose port (ensure it matches the PORT in your .env / docker-compose environment)
EXPOSE 5000

# Command to run the application in development mode
# For production, you could override this in docker-compose or use:
# CMD ["yarn", "start"]
CMD ["yarn", "dev"]
