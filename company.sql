CREATE TABLE company (
    id INTEGER PRIMARY KEY IDENTITY(1,1),
    name TEXT NOT NULL,
    limited_company INTEGER NOT NULL
);

CREATE TABLE year (
    id INTEGER PRIMARY KEY IDENTITY(1,1),
    company_id INTEGER,
    year INTEGER,
    revenue FLOAT,
    openinginv FLOAT,
    purchases FLOAT,
    purchasereturns FLOAT,
    carriageinwards FLOAT,
    closinginv FLOAT,
    expenses TEXT, -- Store as JSON or in a separate table
    sundryincome TEXT, -- Store as JSON or in a separate table
    financecosts FLOAT,
    tax FLOAT,
    NCA TEXT, -- Store as JSON or in a separate table
    NCL TEXT, -- Store as JSON or in a separate table
    CA TEXT, -- Store as JSON or in a separate table
    CL TEXT, -- Store as JSON or in a separate table
    ISC TEXT, -- Store as JSON or in a separate table
    CR TEXT, -- Store as JSON or in a separate table
    RR TEXT, -- Store as JSON or in a separate table
    openingcapital FLOAT,
    drawings FLOAT,
    FOREIGN KEY(company_id) REFERENCES company(id)
);
