# Biodata Website (Spring Boot + H2 + custom CSS/JS)

A personal biodata / resume site with a real backend: Spring Boot serves a REST
API backed by an H2 file database, and a hand-built HTML/CSS/JS frontend
(a "ledger/dossier" layout, not a template) reads and edits that data live.

## What's inside

- **Backend:** Spring Boot 3, Spring Data JPA, H2 (file-based, so your data
  survives restarts — stored in `./data/biodatadb.mv.db`).
- **Entities:** `Profile`, `Education`, `Skill`, `Project`.
- **REST API** at `/api/*` (see below).
- **Frontend:** plain HTML/CSS/JS in `src/main/resources/static` — no
  framework, fully custom design (navy/brass/paper palette, Fraunces +
  Libre Franklin type).
- **Inline editing:** click "Edit this page" in the sidebar to edit every
  field directly on the page and save straight to the database — no admin
  panel needed.

## Requirements

- Java 21+
- Maven 3.9+ (or use your IDE's built-in Maven)
- Internet access the first time you build, so Maven can download the
  Spring Boot dependencies.

## Run it

```bash
cd biodata-app
mvn spring-boot:run
```

Then open **http://localhost:8080**.

To inspect the database directly, open **http://localhost:8080/h2-console**
and connect with JDBC URL `jdbc:h2:file:./data/biodatadb`, user `sa`, no
password.

## Make it yours

The site loads with clearly-labeled placeholder content ("Your Name",
"University Name", etc.) seeded on first run by `DataInitializer.java`. You
have two ways to replace it:

1. **Easiest:** run the app, click **Edit this page**, click into any field
   (name, title, contact info, summary) or any education/skill/project row,
   type your real details, and save. Everything persists to the database
   immediately.
2. **Edit the seed data:** open
   `src/main/java/com/biodata/config/DataInitializer.java` and change the
   placeholder values before your first run.

## REST API

| Method | Path                     | Description                          |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/biodata`           | Everything in one call (used by the page) |
| GET/PUT| `/api/profile`           | Profile fields                        |
| GET/POST | `/api/education`       | List / add a degree                   |
| PUT/DELETE | `/api/education/{id}`  | Update / remove a degree            |
| GET/POST | `/api/skills`           | List / add a skill                    |
| PUT/DELETE | `/api/skills/{id}`     | Update / remove a skill             |
| GET/POST | `/api/projects`         | List / add a project                  |
| PUT/DELETE | `/api/projects/{id}`   | Update / remove a project           |

## Notes

This was built and reviewed without a live build environment (this sandbox
has no access to Maven Central), so give it a `mvn spring-boot:run` and let
me know if anything doesn't compile — happy to fix it fast.
