# Kathanika

I started this project as well as a way to make myself more familiar with the frontend side of Full Stack using NextJS, Mantine and TailwindCSS.

The backend part of this project can be found in [this repo](https://github.com/rsresta07/kathanika-blog-backend).

There may be a lot of things I have made mistake and a lot of things that I may be able to improve. I will leave it to future [Rameshwor](https://github.com/rsresta07).

## TODO

- [ ] make CommonForm for add post, edit post, and edit profile

## Documentation

The project uses NextJS a framework of react.js. Mantine has been used as pre-built react components and Tailwind for the styles.

The main parts of this project are: Admin dashboard, user profile, List of Posts, Post Page, CRUD operations, and filter based on Tags _(will be added in future)_.

The Admin dashboard can be access through `/login` same as the user profile.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file

```bash
PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Project Setup

```bash
  yarn install
```

## Run Locally

Clone the project

```bash
# development
$ yarn run start

# watch mode
$ yarn dev

# production mode
$ yarn run start:prod
```

## Reference

The UI was reference from Figma Community. [link here](https://www.figma.com/proto/r19t6yYbD7IICxLFK4tQqT/The-Blog---A-Web-Personal-Blog--Community-?node-id=614-679&starting-point-node-id=614%3A679&show-proto-sidebar=1&t=qbZKgvjOyJU2kww9-1)

## License

[MIT](https://choosealicense.com/licenses/mit/)
