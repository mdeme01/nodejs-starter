# Node.js starter

This is a Node.js starter project, configured with TypeScript, ESLint and Express.

To use it for your projects, clone the repository for yourself, then initialize a new repository:

```bash
# Clone this repository, then remove git
git clone git@github.com:mdeme01/nodejs-starter.git <project-name>
cd <project-name>
rm -rf .git

# Create new repository
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin git@github.com:<username>/<repository-name>.git
git push -u origin main
```

## Development

Install the dependencies:

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Build

To create a production version of your app:

```bash
npm run build
```

Start the app in production:

```bash
npm start
```
