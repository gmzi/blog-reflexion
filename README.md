# What is this?

This is an extremely simple blogging platform I made for the argentinian magazine Reflexión en Música.
It's A Next.Js blog with a password-protected dashboard where a blog owner can either upload an .md file, or write in a built in editor to create a new post. When a post is added or removed from the dashboard, an on-demand revalidation is triggered. The authentication is handled by next-auth. The front end has a dark theme I really like, it's done with the useTheme hook.
The .md to html parse is made with [remark](https://github.com/remarkjs/remark), footnotes with [remark-gfm](https://github.com/remarkjs/remark-gfm) and image captions with [remark-captions](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-captions).
To try out a basic version of the dashboard, you can visit a live demo [here](https://blog-gmzi.vercel.app).
Thanks for reading!!!

# Usage

1. Clone repo.
2. `npm install` packages.
3. Define .env variables:

   - Create an .env.local file, and replace "value" with your own values (mind "value_1" and "value_2" must match):  
      MONGODB_URI=value  
      MONGODB_DB=value  
      MONGODB_COLLECTION=value

     NEXT_PUBLIC_SAVE_TOKEN=value_1  
      SAVE_TOKEN=value_1

     UPLOAD_PASSWORD=value_2  
      LOGIN_PASSWORD=value_2  
      NEXTAUTH_SECRET=value_2  
      REVALIDATE_TOKEN=value  
      USER_TOKEN=value

     NEXT_PUBLIC_BASE_URL=http://localhost:3000/api  
      NEXTAUTH_URL=http://localhost:3000  
      BASE_URL=http://localhost:3000  
      NEXT_PUBLIC_URL=http://localhost:3000

4. Open /lib/data-template.js, add your own values and change file name to `data.js`.
5. `npm run dev` to run locally in dev mode, or `npm run build` and `npm start` to run a production build locally.
