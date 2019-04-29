# NC-News

Northcoders project for making a working backend environment with postgres and using express to view it and make appropriate paths.

### Prerequisites

The dependencies required are: express, knex and postgres

```
npm i express knex pg
```

and the dev dependencies for testing are: chai, mocha, supertest

```
npm i chai mocha supertest
```

### Installing

To initially setup the sql databases run

```
npm run setup-dbs
```

then seed the database of your choice

```
npm run seed
```

or

```
npm run seed-test
```

If you want to test the seeding has been successful you can access the created databases in sql with:

```
psql

\c ncnews
```

or

```
\c ncnews_test
```

Then the databases can be accessed using sql form:

```
SELECT * FROM articles;
```

## Running the tests

The tests will first need to be seeded (see above). After seeding then run with

```
npm run test
```

## Deployment

To run the database in express write in your terminal

```
npm run start
```

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [Knex](https://github.com/tgriesser/knex) - Query builder used
- [Postgres](https://www.postgresql.org/) - Relational database used
- [Chai](https://rometools.github.io/rome/) - Used for testing
- [Mocha](https://rometools.github.io/rome/) - Used for testing
- [Supertest](https://rometools.github.io/rome/) - Used for testing

## Contributing

- Tommy Luff

## Authors

- Northcoders (initial work), Tommy Luff

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Thanks northcoders tutors!
