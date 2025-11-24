# React + Vite

Hello All, ive been playing with web native offering a littlebit. React turns out to have been a good starting point for a framework. Im not very good but I do want to
share an important finding that caused a LOT of grey hairs. I use github and deploy the web apps from repo pages, like many people. But something that works on my local PC doesnt mean it will deploy properly. some important things to do if following the same steps i did for deployment, vite.config.js should have a
base: "/your-repo-name-here/" like ;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
plugins: [react()],
base: "/task-manager/" //<---IMPORTANT
});

Also if your like me, i dont like multiple branches from each repo (im not at that level yet). so i deploy from docs, ill explain.
once your happy with your project on your pc, build it.
CLI: npm run build
mv dist docs //<--this will move the build into a folder named docs>
should look something like this...(im using this project as an example if you havnt noticed)

task-manager/
docs/
index.html
assets/
<hashed vite files>
src/
vite.config.js
package.json
...

the files in assets will be a css and a js thats is something like,
docs/assets/index-somehash.js
docs/assets/index-somehash.css

ok your build is ready for deployment. now just gotta make sure githup deploys the build.
Go to your Repo, Go to:
Settings then Pages
And make sure it says:
Source: main (or what ever your working branch name is)
Branch: main
Folder: /docs

click save and wait, you can view the progress of the deployment in the actions tab of the repo. helpful hint, if your deployment keeps getting queued and taking 3+ miniutes, go back to your local source fule and just update something like the README with anything. commit the change, the queue will be forced to finish.
anyway, thank you for visiting my portfolio and even more so for reading the README, YOU ROCK!!!!
