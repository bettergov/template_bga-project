# <%=projectSlug%>

- [About](#about)
- [Dependencies](#dependencies)
- [Getting started](#getting-started)

## About

| Title       | <%=projectTitle%>                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Developer   | [Patrick Judge](pjudge@bettergov.org)                                                                                               |
| Link        | [https://projects.bettergov.org/<%=projectUrlPath%>/](https://projects.bettergov.org/<%=projectUrlPath%>/)                          |
| Archie doc  | <%if (usingGoogleDoc) {%>[<%=googleDocId%>](https://docs.google.com/document/d/<%=googleDocId%>/edit)<%} else {%>n/a<%}%>           |
| Spreadsheet | <%if (usingGoogleSheet) {%>[<%=googleSheetId%>](https://docs.google.com/spreadsheets/d/<%=googleSheetId%>/edit)<%} else {%>n/a<%}%> |

© Better Government Association <%=year%>

## Dependencies

Make sure you have the latest version of [node](https://docs.npmjs.com/getting-started/installing-node) installed on your machine as well as the [yarn](https://yarnpkg.com/en/docs/install#mac-stable) package manager.

# Getting started

1.  Clone this project and `cd` into the directory.

```bash
$ git clone https://github.com/bettergov/<%=projectSlug%>.git && cd <%=projectSlug%>
```

2.  Install dependencies.

```bash
$ yarn
```

3.  Finally, run the project.

```bash
$ yarn dev
```
